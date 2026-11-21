// Kit city: one .glb with each asset once ("the kit") + public/rua/city.json with where each copy goes.
// Every asset becomes ONE InstancedMesh, so 300 trees cost the same draw call as one tree.
// Loaded only when city.json lists items, after the procedural city is already on screen.
import {
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshLambertMaterial,
  PropertyBinding,
  Quaternion,
  Vector3,
  type Material,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  type Scene,
  type Texture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

type V3 = [number, number, number];

export type CityItem = {
  /** Asset name in the kit (the Blender object name in the "kit" collection). */
  asset: string;
  /** Position in scene units (three.js axes: y is up). */
  p: V3;
  /** Rotation in radians (XYZ). Usually [0, angle, 0]. */
  r?: V3;
  /** Uniform scale or per axis. */
  s?: number | V3;
  /** Optional color multiplied over the asset, e.g. "#9fb3ff". */
  tint?: string;
};

export type CityLayout = {
  kit?: string;
  /** Turn parts of the code-drawn city off when the kit replaces them. Street, crossings and names always stay. */
  procedural?: { front?: boolean; back?: boolean; parks?: boolean; lamps?: boolean };
  items?: CityItem[];
};

const toLambert = (src: Material, cache: Map<string, MeshLambertMaterial>, textures: Texture[]) => {
  const hit = cache.get(src.uuid);
  if (hit) return hit;
  // the scene is lit like a night map with Lambert; PBR from the glb would look flat and cost more
  const s = src as MeshStandardMaterial;
  const m = new MeshLambertMaterial({
    color: s.color ? s.color.clone() : new Color(0xffffff),
    map: s.map ?? null,
    emissive: s.emissive ? s.emissive.clone() : new Color(0),
    emissiveMap: s.emissiveMap ?? null,
    emissiveIntensity: s.emissiveIntensity ?? 1,
    transparent: s.transparent,
    opacity: s.opacity,
    alphaTest: s.alphaTest,
    side: s.side,
    vertexColors: s.vertexColors,
  });
  m.userData.base = m.emissiveIntensity;
  for (const t of [s.map, s.emissiveMap]) if (t) textures.push(t);
  src.dispose();
  cache.set(src.uuid, m);
  return m;
};

/** Builds the kit city. Returns the materials that glow, so the scene can follow the story's "city" light. */
export async function buildKitCity(scene: Scene, layout: CityLayout, textures: Texture[], isDisposed: () => boolean): Promise<MeshLambertMaterial[]> {
  const items = layout.items ?? [];
  if (!items.length) return [];
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(layout.kit ?? "/rua/models/rua-kit.glb");
  if (isDisposed()) return [];

  const byAsset = new Map<string, CityItem[]>();
  for (const it of items) {
    const key = PropertyBinding.sanitizeNodeName(it.asset);
    const list = byAsset.get(key);
    if (list) list.push(it);
    else byAsset.set(key, [it]);
  }

  const cache = new Map<string, MeshLambertMaterial>();
  const glow = new Set<MeshLambertMaterial>();
  const inv = new Matrix4();
  const base = new Matrix4();
  const out = new Matrix4();
  const pos = new Vector3();
  const scl = new Vector3();
  const rot = new Quaternion();
  const eul = new Euler();
  const white = new Color(0xffffff);
  const tint = new Color();
  gltf.scene.updateMatrixWorld(true);

  for (const [name, list] of byAsset) {
    const template = gltf.scene.getObjectByName(name);
    if (!template) {
      console.warn(`[rua] asset "${name}" não existe no kit`);
      continue;
    }
    // where the template sits in the kit file does not matter: only its shape, relative to its own origin
    inv.copy(template.matrixWorld).invert();
    const parts: Mesh[] = [];
    template.traverse((o: Object3D) => { if ((o as Mesh).isMesh) parts.push(o as Mesh); });
    const tinted = list.some((it) => it.tint);
    for (const part of parts) {
      const rel = new Matrix4().multiplyMatrices(inv, part.matrixWorld);
      const mat = Array.isArray(part.material)
        ? part.material.map((x) => toLambert(x, cache, textures))
        : toLambert(part.material, cache, textures);
      for (const m of Array.isArray(mat) ? mat : [mat]) if (m.emissiveMap || m.emissive.getHex() !== 0) glow.add(m);
      const im = new InstancedMesh(part.geometry, mat, list.length);
      list.forEach((it, i) => {
        pos.fromArray(it.p);
        rot.setFromEuler(eul.set(...(it.r ?? [0, 0, 0])));
        if (Array.isArray(it.s)) scl.fromArray(it.s);
        else scl.setScalar(it.s ?? 1);
        base.compose(pos, rot, scl);
        im.setMatrixAt(i, out.multiplyMatrices(base, rel));
        if (tinted) im.setColorAt(i, it.tint ? tint.set(it.tint) : white);
      });
      im.computeBoundingSphere();
      im.name = `kit:${name}`;
      scene.add(im);
    }
  }
  return [...glow];
}
