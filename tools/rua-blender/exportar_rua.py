# Exporta a Rua a partir do rua-mapa.blend.
# No Blender: aba Scripting > abra este texto (já vem dentro do .blend) > Run Script (Alt+P).
#
# O que ele faz:
#   1. Coleção "kit": cada objeto é UMA peça (prédio, árvore, banco...). Vira public/rua/models/rua-kit.glb.
#   2. Coleção "mapa": as cópias (Alt+D) espalhadas pela cidade. Vira a lista "items" de public/rua/city.json.
#   3. Comprime o kit com gltf-transform (meshopt + webp), sem juntar as peças.
#
# Regras:
#   - Copie peças com Alt+D (cópia ligada), não Shift+D. É assim que o script sabe qual peça é cada cópia.
#   - Cor por cópia: propriedade personalizada "tint" no objeto (ex.: #9fb3ff). Opcional.
#   - A coleção "ref" é só referência (rua, calçadas, seu prédio, concorrente). Nunca é exportada.

import bpy
import json
import os
import re
import shutil
import subprocess
from mathutils import Matrix

COMPRIMIR = os.environ.get("RUA_SEM_COMPRIMIR") is None

blend_dir = os.path.dirname(bpy.data.filepath)
if not blend_dir:
    raise SystemExit("Salve o .blend antes de exportar (ele precisa ficar em tools/rua-blender/).")
root = os.path.abspath(os.path.join(blend_dir, "..", ".."))
public_rua = os.path.join(root, "public", "rua")
models = os.path.join(public_rua, "models")
os.makedirs(models, exist_ok=True)
raw_glb = os.path.join(blend_dir, "rua-kit-bruto.glb")
final_glb = os.path.join(models, "rua-kit.glb")
city_path = os.path.join(public_rua, "city.json")

kit = bpy.data.collections.get("kit")
mapa = bpy.data.collections.get("mapa")
if kit is None or mapa is None:
    raise SystemExit('Faltam as coleções "kit" e "mapa".')

kit_objs = [o for o in kit.all_objects if o.type == "MESH"]
by_data = {o.data.name: o.name for o in kit_objs}
kit_names = {o.name for o in kit_objs}

# Blender (Z para cima) -> three.js (Y para cima): x = x, y = z, z = -y
C = Matrix(((1, 0, 0, 0), (0, 0, 1, 0), (0, -1, 0, 0), (0, 0, 0, 1)))
Ci = C.inverted()


def r(v, n=3):
    return round(v, n) + 0.0


items = []
skipped = []
count = {}
for o in mapa.all_objects:
    if o.type != "MESH":
        continue
    asset = by_data.get(o.data.name)
    if asset is None:
        base = re.sub(r"\.\d{3}$", "", o.name)
        asset = base if base in kit_names else None
    if asset is None:
        skipped.append(o.name)
        continue
    m = C @ o.matrix_world @ Ci
    loc, rot, scl = m.decompose()
    e = rot.to_euler("XYZ")
    item = {"asset": asset, "p": [r(loc.x, 2), r(loc.y, 2), r(loc.z, 2)]}
    rr = [r(e.x), r(e.y), r(e.z)]
    if any(abs(v) > 1e-4 for v in rr):
        item["r"] = rr
    ss = [r(scl.x), r(scl.y), r(scl.z)]
    if any(abs(v - 1) > 1e-3 for v in ss):
        item["s"] = ss[0] if abs(ss[0] - ss[1]) < 1e-3 and abs(ss[0] - ss[2]) < 1e-3 else ss
    tint = o.get("tint")
    if isinstance(tint, str) and tint:
        item["tint"] = tint
    items.append(item)
    count[asset] = count.get(asset, 0) + 1

# 1) city.json: mantém "kit" e "procedural" que você já ajustou, troca só os items
layout = {"kit": "/rua/models/rua-kit.glb", "procedural": {"front": True, "back": True, "parks": True, "lamps": True}}
if os.path.exists(city_path):
    try:
        with open(city_path, encoding="utf-8") as f:
            old = json.load(f)
        layout["kit"] = old.get("kit", layout["kit"])
        layout["procedural"] = old.get("procedural", layout["procedural"])
    except Exception:
        pass
with open(city_path, "w", encoding="utf-8") as f:
    # uma cópia por linha: fácil de ler e de comparar no git
    lines = ",\n".join("  " + json.dumps(it, ensure_ascii=False) for it in items)
    f.write("{\n")
    f.write(' "kit": ' + json.dumps(layout["kit"]) + ",\n")
    f.write(' "procedural": ' + json.dumps(layout["procedural"]) + ",\n")
    f.write(' "items": [\n' + lines + ("\n" if lines else "") + " ]\n}\n")

# 2) kit: só a coleção "kit"
view_layer = bpy.context.view_layer


def find_layer(lc, name):
    if lc.collection.name == name:
        return lc
    for c in lc.children:
        hit = find_layer(c, name)
        if hit:
            return hit
    return None


kit_layer = find_layer(view_layer.layer_collection, "kit")
kit_layer.exclude = False
view_layer.active_layer_collection = kit_layer
# Cada peça vai para a origem só durante o export. Assim o transform de cada nó no .glb é o da própria
# compressão, e o kit.ts pode aplicá-lo sem herdar o lugar onde a peça está dentro do kit.
guardado = [(o, o.matrix_world.copy()) for o in kit_objs]
try:
    for o, _ in guardado:
        o.matrix_world = Matrix.Identity(4)
    view_layer.update()
    bpy.ops.export_scene.gltf(
        filepath=raw_glb,
        export_format="GLB",
        use_active_collection=True,
        use_visible=False,
        use_selection=False,
        export_apply=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )
finally:
    for o, matriz in guardado:
        o.matrix_world = matriz

# 3) compressão: texturas em WebP sem perdas (com perdas, as cores de uma paleta pequena mudam) e meshopt na
# geometria. Sem join/flatten/instance, senão as peças viram um bloco só e o código não acha pelo nome.
webp_glb = os.path.join(blend_dir, "rua-kit-webp.glb")
passos = [
    ["webp", raw_glb, webp_glb, "--lossless", "true"],
    ["optimize", webp_glb, final_glb, "--compress", "meshopt", "--texture-compress", "false",
     "--join", "false", "--flatten", "false", "--instance", "false", "--palette", "false", "--simplify", "false"],
]
ok = False
if COMPRIMIR:
    try:
        for passo in passos:
            res = subprocess.run(["npx", "--yes", "@gltf-transform/cli", *passo], cwd=root,
                                 shell=(os.name == "nt"), capture_output=True, text=True)
            ok = res.returncode == 0
            if not ok:
                print(res.stdout[-2000:], res.stderr[-2000:])
                break
    except Exception as err:
        ok = False
        print("gltf-transform falhou:", err)
    if os.path.exists(webp_glb):
        os.remove(webp_glb)
if not ok:
    shutil.copyfile(raw_glb, final_glb)
    if COMPRIMIR:
        print("AVISO: kit copiado sem compressão. O gltf-transform precisa do Node instalado e, na 1ª vez, de internet.")

kb = os.path.getsize(final_glb) / 1024
msg = [f"Rua exportada: {len(items)} cópias de {len(count)} peças · kit {kb:.0f} KB" + ("" if ok or not COMPRIMIR else " (sem compressão)")]
msg += [f"  {k}: {v}" for k, v in sorted(count.items())]
if skipped:
    msg.append(f"AVISO: {len(skipped)} objetos do mapa não são cópias (Alt+D) de uma peça do kit: " + ", ".join(skipped[:12]))
print("\n".join(msg))
