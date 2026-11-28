# Monta o kit noturno e um mapa inicial dentro do rua-mapa.blend, a partir dos .glb originais.
#   & "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background tools/rua-blender/rua-mapa.blend --python tools/rua-blender/montar_kit.py
#
# O que ele faz com cada modelo:
#   - junta as partes num objeto só, leva a origem para o centro da base e escala para caber num lote;
#   - vira a frente para +X (no mapa, gire 180° quem fica do lado direito da avenida);
#   - troca as cores originais pela paleta noturna da cena e acende parte das janelas (emissive);
#   - usa UM material e uma paleta de 64 px para o kit inteiro.
#
# ATENÇÃO: recria as coleções "kit" e "mapa". Se o mapa já tem trabalho seu, o script para;
# para refazer mesmo assim, acrescente no final do comando:  -- --refazer

import bpy
import bmesh
import json
import math
import os
import random
import sys
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ASSETS = os.path.join(HERE, "assets")  # modelos originais: fora de public/ para não irem ao ar
CITY = os.path.join(ROOT, "public", "rua", "city.json")

# ---------- cores (hex LINEAR, como o raw() de scene.ts) ----------
# pares fachada + telhado: mesmos BLOCK_TONES de scene.ts
TONS = {
    "marinho": (0x0C1630, 0x101D3C),
    "azul": (0x101C3A, 0x16284E),
    "petroleo": (0x072428, 0x063C42),
    "ardosia": (0x141C2E, 0x1C2638),
    "tijolo": (0x26140A, 0x3A1C0C),
    "areia": (0x221E12, 0x34301C),
}
FRISO = 0x1E2A48
CLARO = 0x2A3858
ESCURO = 0x05080F
CHAO = 0x0C1427
VIDRO_APAGADO = 0x070E20
# luz das janelas: branco frio, ciano e branco quente (WINDOW_TINTS). Nunca âmbar.
LUZES = (0x9FB3FF, 0x9FB3FF, 0x8FE3FF, 0xFFE2B8)
LUZ_JANELA = 0.30   # força da janela acesa (a cena ainda multiplica pela luz da cidade)
LUZ_VITRINE = 0.14  # vitrines grandes ficam mais fracas
LUZ_POSTE = 0.85

# ---------- peças: arquivo, escala, direção da frente no original e o papel de cada cor original ----------
# papéis: parede, parede2, friso, claro, escuro, teto, chao, vidro, vitrine, letreiro, apagar
PREDIOS = {
    "predio_1": ("city_building-1", 0.50, "+Y", "areia", "ardosia", {
        "#dfb58b": "parede", "#605a54": "friso", "#434343": "vidro", "#4e4e4e": "vidro",
        "#b1b1b1": "vitrine", "#9f5028": "claro", "#000000": "escuro"}),
    "predio_2": ("city_building-2", 0.42, "+Y", "petroleo", "azul", {
        "#30a7bf": "chao", "#70cddf": "parede", "#9580ff": "parede2", "#7a60ff": "friso",
        "#000000": "vidro", "#323040": "vidro", "#646464": "vidro", "#1c1f20": "vitrine",
        "#fafafa": "claro", "#dffaff": "claro", "#ffffff": "claro", "#a7bbbf": "claro",
        "#cecece": "claro", "#d4d4d4": "claro", "#efefef": "claro", "#f4f4f4": "claro", "#8378bf": "friso"}),
    "predio_3": ("city_building-3", 0.45, "-Y", "azul", "tijolo", {
        "#5e8896": "parede", "#934a43": "parede2", "#4e6e87": "friso", "#000000": "vidro",
        "#f44234": "escuro", "#e7e7e7": "claro", "#e7e47a": "claro"}),
    "predio_4": ("city_building-4", 0.45, "+Y", "ardosia", "marinho", {
        "#9f8164": "parede", "#9f8b78": "parede", "#9f958b": "parede", "#403a38": "parede2",
        "#181040": "vidro", "#805020": "claro", "#ffefdf": "claro", "#604e3c": "friso",
        "#dfa770": "friso", "#605448": "teto", "#605a54": "teto", "#ffeadf": "claro"}),
    "predio_5": ("city_building-5", 0.52, "-X", "tijolo", "tijolo", {
        "#ff9f40": "parede", "#000000": "vidro", "#ffffff": "claro", "#ff8000": "escuro"}),
    # o letreiro "SUPERMARKET" (#ffefdf) é removido: sobra a placa apagada
    "predio_6": ("city_building-6", 0.42, "+X", "marinho", "marinho", {
        "#ffdfbf": "parede", "#9b9b9b": "vitrine", "#909090": "vidro", "#201e1c": "escuro",
        "#ff4040": "letreiro", "#ffefdf": "apagar"}),
    "predio_7": ("city_building-7", 0.45, "+Y", "ardosia", "petroleo", {
        "#ffeadf": "parede", "#ffe4df": "claro", "#ffffff": "claro", "#df5d1c": "parede2",
        "#ff4520": "parede2", "#ff5500": "friso", "#605854": "teto", "#403028": "escuro",
        "#803020": "vidro", "#400b00": "vidro", "#000000": "escuro"}),
}
OUTRAS = {
    "arvore_1": ("city_Tree-1", 0.24, "+X"),
    "arvore_2": ("city_Tree-2", 0.34, "+X"),
    "banco": ("bench", 0.45, "-Y"),
    "poste": ("light", 0.49, "-Y"),  # a frente do poste é o braço
}
GIRO = {"+X": 0.0, "-X": math.pi, "+Y": -math.pi / 2, "-Y": math.pi / 2}  # leva a frente para +X

# ---------- mapa: mesmos números de scene.ts ----------
CROSS = [-72, -40, 24, 56]
CROSS_HALF = 3
CELL = 8
AREA = {"x": 36, "z": [-68, 52]}  # lotes aqui dentro vêm do kit (procedural.kitArea)
FRENTE = {"z": [-69, 53]}  # trecho da fileira da frente que vem do kit (procedural.frontArea): entre transversais
FACHADA = 5.05  # |x| da fachada da frente: encostada na calçada
SEU = (1, 4, 4.4)      # lado, z e largura do seu prédio (YOU em scene.ts)
RIVAL = (-1, -6, 5)    # concorrente (RIV)
# altura máxima perto das câmeras, para nenhum prédio tapar a história: lado, z0, z1, altura
TETOS = ((1, 6, 24, 3.8), (-1, 0, 24, 4.2), (-1, -18, 0, 5.0))
TERREO = 2.0  # até esta altura, o vidro virado para a frente é vitrine (acende em âmbar na fileira da frente)
SEMENTE = 12

GRADE = 8   # paleta 8 x 8
PIXEL = 8   # cada cor ocupa 8 px


def B(x, y, z):
    """three.js (Y para cima) -> Blender (Z para cima)."""
    return (x, -z, y)


def lin(hexa):
    return ((hexa >> 16) / 255, ((hexa >> 8) & 255) / 255, (hexa & 255) / 255)


def srgb(c):
    return c * 12.92 if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


paleta = []  # lista de (cor, luz) lineares; o índice é a célula


def celula(cor, luz=(0.0, 0.0, 0.0)):
    chave = (tuple(round(v, 4) for v in cor), tuple(round(v, 4) for v in luz))
    if chave not in paleta:
        paleta.append(chave)
        if len(paleta) > GRADE * GRADE:
            raise SystemExit("Paleta cheia: aumente GRADE.")
    i = paleta.index(chave)
    return ((i % GRADE + 0.5) / GRADE, (i // GRADE + 0.5) / GRADE)


# ---------- coleções ----------
refazer = "--refazer" in sys.argv
if not os.path.isdir(ASSETS):
    raise SystemExit("Pasta de assets não encontrada: tools/rua-blender/assets")
scene = bpy.context.scene
kit = bpy.data.collections.get("kit")
mapa = bpy.data.collections.get("mapa")
if kit is None or mapa is None:
    raise SystemExit('Abra o rua-mapa.blend: faltam as coleções "kit" e "mapa".')
proprias = [o for o in mapa.all_objects if o.type == "MESH" and not o.data.name.endswith("_exemplo")]
if proprias and not refazer:
    raise SystemExit(f"O mapa já tem {len(proprias)} objetos que não são de exemplo. Para refazer do zero, rode com: -- --refazer")
for coll in (kit, mapa):
    for o in list(coll.all_objects):
        bpy.data.objects.remove(o, do_unlink=True)
bpy.data.orphans_purge(do_recursive=True)

# ---------- material único ----------
kmat = bpy.data.materials.new("kit_noite")
kmat.use_nodes = True
nt = kmat.node_tree
bsdf = nt.nodes.get("Principled BSDF")
bsdf.inputs["Roughness"].default_value = 1
bsdf.inputs["Metallic"].default_value = 0
bsdf.inputs["Emission Strength"].default_value = 1
imagens = {}
for nome, entrada, y in (("kit_paleta", "Base Color", 300), ("kit_paleta_luz", "Emission Color", -100)):
    img = bpy.data.images.new(nome, GRADE * PIXEL, GRADE * PIXEL, alpha=False)
    no = nt.nodes.new("ShaderNodeTexImage")
    no.image = img
    no.interpolation = "Closest"
    no.location = (-400, y)
    nt.links.new(no.outputs["Color"], bsdf.inputs[entrada])
    imagens[nome] = img


# ---------- leitura das cores originais ----------
def cores_das_faces(o):
    me = o.data
    uv = me.uv_layers.active.data if me.uv_layers else None
    cache, saida = {}, []
    for poly in me.polygons:
        mat = me.materials[poly.material_index]
        principled = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        link = principled.inputs["Base Color"].links
        if link and link[0].from_node.type == "TEX_IMAGE":
            img = link[0].from_node.image
            if img.name not in cache:
                cache[img.name] = (img.size[0], img.size[1], img.pixels[:])
            w, h, px = cache[img.name]
            u = sum(uv[i].uv.x for i in poly.loop_indices) / poly.loop_total
            v = sum(uv[i].uv.y for i in poly.loop_indices) / poly.loop_total
            k = ((int((v % 1) * h) % h) * w + int((u % 1) * w) % w) * 4
            saida.append(tuple(px[k:k + 3]))
        else:
            saida.append(tuple(srgb(c) for c in principled.inputs["Base Color"].default_value[:3]))
    return saida


def hexa(c):
    return "#%02x%02x%02x" % tuple(round(v * 255) for v in c)


def ilhas(me, faces):
    """Agrupa faces que se tocam (cada grupo é uma janela)."""
    pai = {i: i for i in faces}

    def raiz(i):
        while pai[i] != i:
            pai[i] = pai[pai[i]]
            i = pai[i]
        return i

    dono = {}
    for i in faces:
        for v in me.polygons[i].vertices:
            k = tuple(round(c, 3) for c in me.vertices[v].co)
            if k in dono:
                pai[raiz(i)] = raiz(dono[k])
            else:
                dono[k] = i
    grupos = {}
    for i in faces:
        grupos.setdefault(raiz(i), []).append(i)
    return sorted(grupos.values(), key=lambda g: tuple(round(c, 2) for c in me.polygons[g[0]].center))


# ---------- importação de uma peça ----------
def importar(nome, arquivo, escala, frente, pela_base=False):
    temp = bpy.data.collections.new("_import")
    scene.collection.children.link(temp)
    vl = bpy.context.view_layer
    vl.active_layer_collection = vl.layer_collection.children["_import"]
    bpy.ops.import_scene.gltf(filepath=os.path.join(ASSETS, arquivo + ".glb"))
    vl.update()
    objs = list(temp.all_objects)
    meshes = [o for o in objs if o.type == "MESH"]
    cores = {o: cores_das_faces(o) for o in meshes}
    pontos = [o.matrix_world @ v.co for o in meshes for v in o.data.vertices]
    mn = Vector([min(p[i] for p in pontos) for i in range(3)])
    mx = Vector([max(p[i] for p in pontos) for i in range(3)])
    if pela_base:  # árvore e poste: a origem é o pé do tronco/poste, não o meio da copa/braço
        pe = [p for p in pontos if p.z < mn.z + (mx.z - mn.z) * 0.04]
        centro = Vector((sum(p.x for p in pe) / len(pe), sum(p.y for p in pe) / len(pe), mn.z))
    else:
        centro = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
    ajuste = Matrix.Rotation(GIRO[frente], 4, "Z") @ Matrix.Scale(escala, 4) @ Matrix.Translation(-centro)
    for o in meshes:
        mundo = ajuste @ o.matrix_world
        o.data = o.data.copy()
        o.parent = None
        o.matrix_world = Matrix.Identity(4)
        o.data.transform(mundo)
        if mundo.determinant() < 0:
            o.data.flip_normals()
        o.data.update()
    return temp, meshes, cores


def finalizar(nome, temp, meshes, indice):
    for o in meshes:
        me = o.data
        me.materials.clear()
        me.materials.append(kmat)
        for p in me.polygons:
            p.material_index = 0
        while me.color_attributes:
            me.color_attributes.remove(me.color_attributes[0])
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    peca = meshes[0]
    for o in list(temp.all_objects):
        if o != peca:
            bpy.data.objects.remove(o, do_unlink=True)
    temp.objects.unlink(peca)
    bpy.data.collections.remove(temp)
    kit.objects.link(peca)
    peca.name = nome
    peca.data.name = nome
    # o importador de glTF deixa o objeto em quatérnio, e aí o giro em Z das cópias é ignorado
    peca.rotation_mode = "XYZ"
    peca.rotation_euler = (0, 0, 0)
    peca.location = (-170, indice * 10, 0)  # longe da cidade; a posição no kit não importa
    return peca


def pintar(me, uv_por_face):
    while me.uv_layers:
        me.uv_layers.remove(me.uv_layers[0])
    camada = me.uv_layers.new(name="UVMap")
    for p in me.polygons:
        for i in p.loop_indices:
            camada.data[i].uv = uv_por_face[p.index]


# ---------- prédios ----------
indice = 0
for nome, (arquivo, escala, frente, tom, tom2, papeis) in PREDIOS.items():
    temp, meshes, cores = importar(nome, arquivo, escala, frente)
    sorte = random.Random(nome)
    altura = max(v.co.z for o in meshes for v in o.data.vertices)
    faltando = set()
    vit_v, vit_f, tem_letreiro = [], [], False
    for o in meshes:
        me = o.data
        papel = []
        for c in cores[o]:
            h = hexa(c)
            if h not in papeis:
                faltando.add(h)
            papel.append(papeis.get(h, "parede"))
        apagar = [i for i, r in enumerate(papel) if r == "apagar"]
        if apagar:
            bm = bmesh.new()
            bm.from_mesh(me)
            bm.faces.ensure_lookup_table()
            bmesh.ops.delete(bm, geom=[bm.faces[i] for i in apagar], context="FACES")
            bm.to_mesh(me)
            bm.free()
            papel = [r for r in papel if r != "apagar"]
        uv = [None] * len(me.polygons)
        for p in me.polygons:
            r = papel[p.index]
            if r in ("vidro", "vitrine"):
                continue
            fachada, telhado = TONS[tom2 if r == "parede2" else tom]
            de_cima = p.normal.z > 0.75
            if r == "chao" or (de_cima and p.center.z < altura * 0.04):
                cor = CHAO
            elif r == "escuro":
                cor = ESCURO
            elif r == "teto" or (de_cima and r in ("parede", "parede2", "friso", "claro", "letreiro")):
                cor = telhado
            elif r in ("friso", "letreiro"):
                cor = FRISO
            elif r == "claro":
                cor = CLARO
            else:
                cor = fachada
            uv[p.index] = celula(lin(cor))
        for tipo, forca, fracao in (("vidro", LUZ_JANELA, 0.45), ("vitrine", LUZ_VITRINE, 0.6)):
            grupos = ilhas(me, [i for i, r in enumerate(papel) if r == tipo])
            if not grupos:
                continue
            acesas = set(sorte.sample(range(len(grupos)), max(1, round(len(grupos) * fracao))))
            for g, faces in enumerate(grupos):
                if g in acesas:
                    brilho = forca * sorte.choice((0.65, 0.85, 1.0))
                    tinta = lin(sorte.choice(LUZES))
                    ponto = celula(lin(VIDRO_APAGADO), tuple(v * brilho for v in tinta))
                else:
                    ponto = celula(lin(VIDRO_APAGADO))
                for i in faces:
                    uv[i] = ponto
        pintar(me, uv)
        # vitrine: cópia do vidro do térreo (e do letreiro) um pouco à frente; o site acende essa peça em âmbar
        for p in me.polygons:
            r = papel[p.index]
            terreo = r in ("vidro", "vitrine") and p.center.z < TERREO
            if p.normal.x > 0.35 and (terreo or r == "letreiro"):
                tem_letreiro = tem_letreiro or r == "letreiro"
                inicio = len(vit_v)
                vit_v.extend(me.vertices[v].co + p.normal * 0.015 for v in p.vertices)
                vit_f.append(list(range(inicio, len(vit_v))))
    if vit_f and not tem_letreiro:  # faixa de letreiro acima do vidro
        x = max(v.x for v in vit_v) + 0.04
        y0, y1 = min(v.y for v in vit_v), max(v.y for v in vit_v)
        z = max(v.z for v in vit_v) + 0.12
        meio, meia = (y0 + y1) / 2, (y1 - y0) * 0.28
        # se um friso ou moldura avança sobre a faixa (até 0,35), o letreiro vai para a frente dele
        avanco = [v.co.x for o in meshes for v in o.data.vertices
                  if abs(v.co.y - meio) <= meia and z - 0.1 <= v.co.z <= z + 0.28 and x <= v.co.x + 0.04 <= x + 0.35]
        x = max([x] + [a + 0.04 for a in avanco])
        inicio = len(vit_v)
        vit_v.extend(Vector(v) for v in ((x, meio - meia, z), (x, meio + meia, z), (x, meio + meia, z + 0.18), (x, meio - meia, z + 0.18)))
        vit_f.append(list(range(inicio, len(vit_v))))
    if not vit_f:
        raise SystemExit(f"{nome}: nenhuma face de vitrine na frente. Confira a direção da frente e os papéis.")
    if faltando:
        print(f"AVISO {nome}: cores sem papel definido (viraram parede): {sorted(faltando)}")
    finalizar(nome, temp, meshes, indice)
    vm = bpy.data.meshes.new(nome + "_vitrine")
    vm.from_pydata(vit_v, [], vit_f)
    vm.materials.append(kmat)
    pintar(vm, [celula(lin(VIDRO_APAGADO))] * len(vm.polygons))
    vo = bpy.data.objects.new(nome + "_vitrine", vm)
    vo.location = (-170, indice * 10, 0)
    kit.objects.link(vo)
    indice += 1

# ---------- árvores, banco e poste ----------
for nome, (arquivo, escala, frente) in OUTRAS.items():
    temp, meshes, cores = importar(nome, arquivo, escala, frente, pela_base=nome != "banco")
    for o in meshes:
        uv = []
        for c in cores[o]:
            r, g, b = c
            if nome.startswith("arvore"):
                if g > r * 0.85:  # folha (as duas árvores ficam nos verdes TREE da cena, sem lima)
                    clara, escura = (0x123A1C, 0x0B3A22) if nome == "arvore_1" else (0x0B3A22, 0x0A3030)
                    uv.append(celula(lin(clara if g > 0.6 else escura)))
                else:
                    uv.append(celula(lin(0x1C0E06)))
            elif nome == "banco":
                uv.append(celula(lin(0x2A1A10 if r > 0.4 else 0x140C08)))
            elif hexa(c) == "#fafafa":  # lâmpada do poste: branco frio
                uv.append(celula(lin(0x56669A), tuple(v * LUZ_POSTE for v in lin(0xCFD9FF))))
            else:
                uv.append(celula(lin(0x1A2340)))
        pintar(o.data, uv)
    finalizar(nome, temp, meshes, indice)
    indice += 1

# posição da lâmpada em relação ao pé do poste (scene.ts: KIT_LAMP_HEAD)
poste = bpy.data.objects["poste"]
luz_uv = celula(lin(0x56669A), tuple(v * LUZ_POSTE for v in lin(0xCFD9FF)))
camada = poste.data.uv_layers[0].data
cabeca = [p.center.copy() for p in poste.data.polygons if (camada[p.loop_start].uv - Vector(luz_uv)).length < 0.001]
LAMPADA = sum(cabeca, Vector()) / len(cabeca)

# ---------- chão de parque e de praça (mesmas cores PARK e PLAZA da cena) ----------
for nome, cor in (("gramado", 0x0A3218), ("praca", 0x302818)):
    me = bpy.data.meshes.new(nome)
    m = (CELL - 1) / 2
    me.from_pydata([(-m, -m, 0.012), (m, -m, 0.012), (m, m, 0.012), (-m, m, 0.012)], [], [(0, 1, 2, 3)])
    me.materials.append(kmat)
    pintar(me, [celula(lin(cor))])
    o = bpy.data.objects.new(nome, me)
    o.location = (-170, indice * 10, 0)
    kit.objects.link(o)
    indice += 1

# ---------- paleta ----------
for nome, canal in (("kit_paleta", 0), ("kit_paleta_luz", 1)):
    lado = GRADE * PIXEL
    px = [0.0, 0.0, 0.0, 1.0] * (lado * lado)
    for i, par in enumerate(paleta):
        cor = [srgb(v) for v in par[canal]]
        for y in range(PIXEL):
            for x in range(PIXEL):
                k = (((i // GRADE) * PIXEL + y) * lado + (i % GRADE) * PIXEL + x) * 4
                px[k:k + 3] = cor
    imagens[nome].pixels = px
    imagens[nome].pack()


# ---------- mapa inicial ----------
def copia(peca, x, z, giro=0.0, escala=1.0, tint=None):
    o = bpy.data.objects[peca].copy()  # mesma malha = cópia ligada, igual ao Alt+D
    o.location = B(x, 0, z)
    o.rotation_euler = (0, 0, giro)
    o.scale = (escala,) * 3
    if tint:
        o["tint"] = tint
    mapa.objects.link(o)


def na_transversal(z, folga):
    return any(abs(z - c) < CROSS_HALF + folga for c in CROSS)


s = random.Random(SEMENTE)
# perto da avenida os baixos; mais ao fundo os altos, para a cidade crescer em camadas
ELENCO = {2: ["predio_1", "predio_2", "predio_5", "predio_6", "predio_7"],
          3: ["predio_1", "predio_2", "predio_3", "predio_4", "predio_6"],
          4: ["predio_3", "predio_4", "predio_1", "predio_2", "predio_5"]}
usados = {}
for lado in (-1, 1):
    for gx in (2, 3, 4):
        for gz in range(-14, 15):
            z = gz * CELL
            if not AREA["z"][0] <= z <= AREA["z"][1] or na_transversal(z, CELL / 2 - 0.5):
                continue
            x = lado * gx * CELL
            r = s.random()
            if r < 0.68:
                vizinhos = {usados.get((lado, gx, gz - 1)), usados.get((lado, gx - 1, gz))}
                peca = s.choice([p for p in ELENCO[gx] if p not in vizinhos])
                usados[(lado, gx, gz)] = peca
                # frente voltada para a avenida
                copia(peca, x, z, 0.0 if lado < 0 else math.pi, tint=s.choice((None, None, None, "#c9d6ff", "#ffe9d6")))
            elif r < 0.86:
                copia("gramado", x, z)
                for qx, qz in ((-1.7, -1.7), (1.7, -1.5), (-1.5, 1.7), (1.8, 1.6))[:s.choice((3, 4))]:
                    copia(s.choice(("arvore_1", "arvore_2")), x + qx + s.uniform(-0.5, 0.5), z + qz + s.uniform(-0.5, 0.5),
                          s.uniform(0, math.tau), round(s.uniform(0.7, 1.0), 2))
            else:
                copia("praca", x, z)
                copia("banco", x - 2.2, z, 0.0)
                copia("banco", x + 2.2, z, math.pi)
                copia(s.choice(("arvore_1", "arvore_2")), x + s.choice((-1.8, 1.8)), z + s.choice((-2.2, 2.2)), s.uniform(0, math.tau), 0.85)

# fileira da frente: prédios encostados na calçada, fora das transversais, do seu prédio e do concorrente
def bloqueios(lado):
    faixas = [(c - CROSS_HALF - 0.4, c + CROSS_HALF + 0.4) for c in CROSS]
    faixas += [(z - w / 2 - 0.4, z + w / 2 + 0.4) for l, z, w in (SEU, RIVAL) if l == lado]
    return faixas


for lado in (-1, 1):
    z, anterior = FRENTE["z"][0], None
    while z < FRENTE["z"][1]:
        # modelos pesados só no trecho que a câmera vê de perto
        elenco = list(PREDIOS) if -48 < z < 32 else ["predio_1", "predio_5", "predio_6", "predio_7"]
        s.shuffle(elenco)
        for peca in elenco:
            if peca == anterior:
                continue
            o = bpy.data.objects[peca]
            fundo, largura, alto = o.dimensions
            escala = s.uniform(0.85, 1.0)
            limite = min([h for l, a, b, h in TETOS if l == lado and z < b and z + largura * escala > a], default=99)
            escala = min(escala, limite / alto)
            w = largura * escala
            if escala < 0.7 or z + w > FRENTE["z"][1] or any(z < b and z + w > a for a, b in bloqueios(lado)):
                continue
            frente = max(v[0] for v in o.bound_box) * escala
            copia(peca, lado * (FACHADA + frente), z + w / 2, 0.0 if lado < 0 else math.pi, round(escala, 3),
                  tint=s.choice((None, None, "#c9d6ff", "#ffe9d6")))
            z, anterior = z + w + s.uniform(0.3, 0.8), peca
            break
        else:
            z += 0.4

# postes: nas mesmas posições z do código, com a lâmpada sobre a pista
for z in range(-96, 97, 12):
    for lado in (-1, 1):
        zz = z + (6 if lado > 0 else 0)
        # sem poste em (esquerda, 12), colado na câmera da 2ª seção, nem em (direita, 6), na frente do seu prédio
        if not na_transversal(zz, 1) and (lado, zz) not in ((-1, 12), (1, 6)):
            copia("poste", lado * 3.85, zz, 0.0 if lado < 0 else math.pi)
# bancos na calçada, virados para a avenida, fora da frente do seu prédio e do concorrente
for z in (-54, -30, -18, 6, 18, 42):
    copia("banco", -4.55, z, 0.0)
for z in (-48, -24, -12, 12, 36):
    copia("banco", 4.55, z, math.pi)

# ---------- city.json: o que continua por código (o exportar_rua.py mantém isto e escreve os itens) ----------
layout = {}
if os.path.exists(CITY):
    with open(CITY, encoding="utf-8") as f:
        layout = json.load(f)
layout.setdefault("kit", "/rua/models/rua-kit.glb")
layout["procedural"] = {"front": True, "back": True, "parks": True, "lamps": True, "poles": False, "kitArea": AREA, "frontArea": FRENTE}
layout.setdefault("items", [])
with open(CITY, "w", encoding="utf-8") as f:
    json.dump(layout, f, ensure_ascii=False)

# ---------- textos dentro do .blend e salvar ----------
bpy.data.orphans_purge(do_recursive=True)
for nome in ("exportar_rua.py",):
    t = bpy.data.texts.get(nome) or bpy.data.texts.new(nome)
    t.clear()
    with open(os.path.join(HERE, nome), encoding="utf-8") as f:
        t.write(f.read())
bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)

tris = {}
for o in kit.objects:
    o.data.calc_loop_triangles()
    tris[o.name] = len(o.data.loop_triangles)
total = sum(tris[o.data.name] for o in mapa.objects)
print(f"KIT {len(kit.objects)} peças · {len(paleta)} cores · mapa {len(mapa.objects)} cópias · {total} triângulos no mapa")
for o in kit.objects:
    d = o.dimensions
    print(f"  {o.name:18} {d.x:5.2f} x {d.y:5.2f} x {d.z:5.2f}  tris {tris[o.name]:5}  cópias {sum(1 for c in mapa.objects if c.data == o.data)}")
frente = [c for c in mapa.objects if c.data.name.startswith("predio") and abs(c.location.x) < 13]
print(f"FRENTE {len(frente)} prédios · {sum(tris[c.data.name] for c in frente)} triângulos")
print(f"LAMPADA x={LAMPADA.x:.3f} y={LAMPADA.y:.3f} z={LAMPADA.z:.3f}")
