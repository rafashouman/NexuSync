# Gera tools/rua-blender/rua-mapa.blend com a rua de referência nas posições exatas da cena.
# Rode uma vez (ou de novo, se mudar CROSS ou o tamanho da rua em scene.ts):
#   & "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background --factory-startup --python tools/rua-blender/criar_mapa.py
# ATENÇÃO: sobrescreve o rua-mapa.blend. Se já montou um mapa, salve uma cópia antes.

import bpy
import bmesh
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "rua-mapa.blend")

# mesmos números de src/components/rua/world/scene.ts
CROSS = [-72, -40, 24, 56]
CROSS_HALF = 3
CELL = 8


def B(x, y, z):
    """three.js (Y para cima) -> Blender (Z para cima)."""
    return (x, -z, y)


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"


def collection(name, color):
    c = bpy.data.collections.new(name)
    c.color_tag = color
    scene.collection.children.link(c)
    return c


ref = collection("ref", "COLOR_05")
kit = collection("kit", "COLOR_02")
mapa = collection("mapa", "COLOR_04")


def mat(name, rgb, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, alpha)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*rgb, 1)
        bsdf.inputs["Roughness"].default_value = 1
    return m


def box(name, coll, size, center, material=None, base=True):
    """Caixa com a origem na base (centro de baixo), que é o que o código espera."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    sx, sy, sz = size
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z = v.co.z * sz + (sz / 2 if base else 0)
    bm.to_mesh(me)
    bm.free()
    if material:
        me.materials.append(material)
    o = bpy.data.objects.new(name, me)
    o.location = center
    coll.objects.link(o)
    return o


def plane(name, coll, w, h, center, material):
    return box(name, coll, (w, h, 0.02), center, material, base=False)


def lock(o, wire=False):
    o.hide_select = True
    if wire:
        o.display_type = "WIRE"
        o.show_in_front = True


# ---------- ref: rua, calçadas, transversais, lotes, seu prédio e o concorrente ----------
asfalto = mat("ref_asfalto", (0.02, 0.025, 0.04))
calcada = mat("ref_calcada", (0.06, 0.08, 0.13))
lote = mat("ref_lote", (0.1, 0.16, 0.3), 0.35)
lock(plane("ref_avenida", ref, 7, 240, (0, 0, 0), asfalto))
for sx in (-4.25, 4.25):
    lock(plane(f"ref_calcada_{'esq' if sx < 0 else 'dir'}", ref, 1.5, 240, (sx, 0, 0.005), calcada))
for c in CROSS:
    lock(plane(f"ref_transversal_z{c}", ref, 240, CROSS_HALF * 2, B(0, 0, c), asfalto))

# faixa da fileira da frente (prédios que tocam a avenida, desenhados por código enquanto procedural.front = true)
for side in (-1, 1):
    o = plane(f"ref_fileira_frente_{'esq' if side < 0 else 'dir'}", ref, 7.2, 192, (side * 8.6, 0, 0.01), lote)
    lock(o, wire=True)

# grade de lotes da cidade do fundo (um lote = 8 × 8; o desenho tem 7 × 7 para ver a separação)
me = bpy.data.meshes.new("ref_lotes")
bm = bmesh.new()
for gx in range(2, 12):
    for gz in range(-14, 15):
        z = gz * CELL
        if any(abs(z - c) < CROSS_HALF + CELL / 2 - 0.5 for c in CROSS):
            continue
        for side in (-1, 1):
            cx, cy, _ = B(side * gx * CELL, 0, z)
            vs = [bm.verts.new((cx + dx * 3.5, cy + dy * 3.5, 0.01)) for dx, dy in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
            bm.faces.new(vs)
bm.to_mesh(me)
bm.free()
me.materials.append(lote)
lotes = bpy.data.objects.new("ref_lotes", me)
ref.objects.link(lotes)
lock(lotes, wire=True)

# seu prédio e o concorrente: ficam por código (eles acendem com a história). Não construa em cima.
you = box("ref_SEU_PREDIO", ref, (5, 4.4, 3.4), B(7.5, 0, 4), mat("ref_ambar", (1, 0.45, 0.08)))
riv = box("ref_CONCORRENTE", ref, (5.6, 5, 6.6), B(-7.8, 0, -6), mat("ref_azul", (0.1, 0.3, 1)))
for o in (you, riv):
    lock(o, wire=True)

# ---------- kit: uma peça de cada (troque pelos seus modelos, mantendo os nomes ou criando novos) ----------
kmat = mat("kit_textura_unica", (0.2, 0.25, 0.4))
verde = mat("kit_verde", (0.05, 0.25, 0.1))
KX = -170  # o kit fica longe da cidade; a posição dele não importa para o site
box("predio_exemplo", kit, (4, 4, 6), (KX, 0, 0), kmat)
box("banco_exemplo", kit, (1.6, 0.5, 0.45), (KX, 10, 0), kmat)
box("poste_exemplo", kit, (0.12, 0.12, 3.4), (KX, 16, 0), kmat)
me = bpy.data.meshes.new("arvore_exemplo")
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=7, radius1=0.9, radius2=0, depth=2.4)
for v in bm.verts:
    v.co.z += 1.2
bm.to_mesh(me)
bm.free()
me.materials.append(verde)
arv = bpy.data.objects.new("arvore_exemplo", me)
arv.location = (KX, 22, 0)
kit.objects.link(arv)


# ---------- mapa: algumas cópias ligadas (Alt+D) de exemplo ----------
def copia(nome_peca, pos_three, rot_z=0.0, escala=1.0, tint=None):
    src = bpy.data.objects[nome_peca]
    o = src.copy()  # mesma malha = cópia ligada, igual ao Alt+D
    o.location = B(*pos_three)
    o.rotation_euler = (0, 0, rot_z)
    o.scale = (escala, escala, escala)
    if tint:
        o["tint"] = tint
    mapa.objects.link(o)
    return o


for i, z in enumerate((-24, -16, 8, 16)):
    copia("predio_exemplo", (32, 0, z), escala=1 + 0.25 * (i % 3), tint=("#9fb3ff", "#ffe2b8", "#8fe3ff", "#ffffff")[i])
for k in range(6):
    copia("arvore_exemplo", (-16 + (k % 3) * 2.4, 0, 32 + (k // 3) * 2.4), escala=0.6 + 0.08 * k)
for z in (-14, 10, 14):
    copia("banco_exemplo", (-4.6, 0, z), rot_z=1.5708)

# ---------- textos de apoio dentro do .blend ----------
leia = bpy.data.texts.new("LEIA-ME")
leia.write(
    "RUA · MAPA\n\n"
    "ref   = referência travada (avenida, transversais, lotes, SEU_PREDIO e CONCORRENTE). Não é exportada.\n"
    "kit   = UMA peça de cada (prédio, árvore, banco, poste). Origem na base. Mesmo material/textura para todas.\n"
    "mapa  = cópias com Alt+D das peças do kit. Mova, gire (só em Z) e escale à vontade.\n\n"
    "Cor por cópia: Object Properties > Custom Properties > tint = #9fb3ff\n"
    "Exportar: abra o texto exportar_rua.py e clique Run Script (Alt+P).\n"
    "Depois: npm run dev e veja em localhost:3000.\n"
)
with open(os.path.join(HERE, "exportar_rua.py"), encoding="utf-8") as f:
    bpy.data.texts.new("exportar_rua.py").write(f.read())

bpy.ops.wm.save_as_mainfile(filepath=OUT)
print("rua-mapa.blend criado em", OUT)
