// Kit city: one .glb with each asset once ("the kit") + public/rua/city.json with where each copy goes.
// Every asset becomes ONE InstancedMesh, so 300 trees cost the same draw call as one tree.
// Loaded only when city.json lists items, after the procedural city is already on screen.
import {
  Box3,
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
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
  procedural?: {
    front?: boolean;
    back?: boolean;
    parks?: boolean;
    lamps?: boolean;
    /** false: the kit brings the poles. Code poles leave when the kit loads; their glow moves under the kit lamp. */
    poles?: boolean;
    /** Back-city lots inside |x| <= x and z[0] <= z <= z[1] belong to the kit. Code boxes hold the place until it loads. */
    kitArea?: { x: number; z: [number, number] };
    /** Stretch of the avenue (z) whose front row belongs to the kit. Yours and the competitor's building stay. */
    frontArea?: { z: [number, number] };
  };
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

/** A kit building that touches the avenue: the story lights its storefront and the pointer can raise it. */
export type KitShop = {
  side: -1 | 1;
  /** Center on the ground, depth (x), width (z) and height, in scene units. */
  x: number;
  z: number;
  d: number;
  w: number;
  h: number;
  light: (color: Color) => void;
  raise: (y: number) => void;
};

export type KitCity = {
  /** Materials that glow, so the scene can follow the story's "city" light. */
  glow: MeshLambertMaterial[];
  shops: KitShop[];
};

/** Buildings closer to the avenue than this, whose asset has a "<asset>_vitrine" piece in the kit, are shops. */
const FRONT_X = 13;

const itemMatrix = (it: CityItem, lift: number, out: Matrix4) => {
  const scale = Array.isArray(it.s) ? new Vector3(...it.s) : new Vector3().setScalar(it.s ?? 1);
  const turn = new Quaternion().setFromEuler(new Euler(...(it.r ?? [0, 0, 0])));
  return out.compose(new Vector3(it.p[0], it.p[1] + lift, it.p[2]), turn, scale);
};

const meshesOf = (node: Object3D) => {
  const parts: Mesh[] = [];
  node.traverse((o: Object3D) => { if ((o as Mesh).isMesh) parts.push(o as Mesh); });
  return parts;
};

/** Builds the kit city: one InstancedMesh per asset, plus the storefronts of the buildings along the avenue. */
export async function buildKitCity(scene: Scene, layout: CityLayout, textures: Texture[], isDisposed: () => boolean): Promise<KitCity> {
  const items = layout.items ?? [];
  if (!items.length) return { glow: [], shops: [] };
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(layout.kit ?? "/rua/models/rua-kit.glb");
  if (isDisposed()) return { glow: [], shops: [] };

  const byAsset = new Map<string, CityItem[]>();
  for (const it of items) {
    const key = PropertyBinding.sanitizeNodeName(it.asset);
    const list = byAsset.get(key);
    if (list) list.push(it);
    else byAsset.set(key, [it]);
  }

  const cache = new Map<string, MeshLambertMaterial>();
  const glow = new Set<MeshLambertMaterial>();
  const base = new Matrix4();
  const out = new Matrix4();
  const white = new Color(0xffffff);
  const tint = new Color();
  const shops: KitShop[] = [];
  const shopMat = new MeshBasicMaterial({ color: 0xffffff });
  gltf.scene.updateMatrixWorld(true);

  for (const [name, list] of byAsset) {
    const template = gltf.scene.getObjectByName(name);
    if (!template) {
      console.warn(`[rua] asset "${name}" não existe no kit`);
      continue;
    }
    const tinted = list.some((it) => it.tint);
    const built: { im: InstancedMesh; rel: Matrix4 }[] = [];
    for (const part of meshesOf(template)) {
      // exportar_rua.py exports every piece at the origin, so the node matrix only holds the compression's
      // scale and offset (KHR_mesh_quantization). It must be applied, never cancelled.
      const rel = part.matrixWorld;
      const mat = Array.isArray(part.material)
        ? part.material.map((x) => toLambert(x, cache, textures))
        : toLambert(part.material, cache, textures);
      for (const m of Array.isArray(mat) ? mat : [mat]) if (m.emissiveMap || m.emissive.getHex() !== 0) glow.add(m);
      const im = new InstancedMesh(part.geometry, mat, list.length);
      list.forEach((it, i) => {
        im.setMatrixAt(i, out.multiplyMatrices(itemMatrix(it, 0, base), rel));
        if (tinted) im.setColorAt(i, it.tint ? tint.set(it.tint) : white);
      });
      im.computeBoundingSphere();
      im.name = `kit:${name}`;
      scene.add(im);
      built.push({ im, rel });
    }

    // storefronts: a thin copy of the ground-floor glass, drawn unlit so the story can paint it per building
    const front = list.map((it, i) => ({ it, i })).filter(({ it }) => Math.abs(it.p[0]) < FRONT_X);
    const overlay = gltf.scene.getObjectByName(`${name}_vitrine`);
    const glass = overlay ? meshesOf(overlay)[0] : undefined;
    if (!glass || !front.length) continue;
    const windows = new InstancedMesh(glass.geometry, shopMat, front.length);
    front.forEach(({ it, i }, j) => {
      windows.setMatrixAt(j, out.multiplyMatrices(itemMatrix(it, 0, base), glass.matrixWorld));
      windows.setColorAt(j, tint.setRGB(0, 0, 0));
      const box = new Box3();
      for (const { im, rel } of built) {
        im.geometry.computeBoundingBox();
        box.union(im.geometry.boundingBox!.clone().applyMatrix4(out.multiplyMatrices(base, rel)));
      }
      const size = box.getSize(new Vector3());
      shops.push({
        side: it.p[0] < 0 ? -1 : 1,
        x: (box.min.x + box.max.x) / 2,
        z: (box.min.z + box.max.z) / 2,
        d: size.x,
        w: size.z,
        h: size.y,
        light: (color) => {
          windows.setColorAt(j, color);
          windows.instanceColor!.needsUpdate = true;
        },
        raise: (y) => {
          const lifted = itemMatrix(it, y, new Matrix4());
          const m = new Matrix4();
          for (const { im, rel } of built) {
            im.setMatrixAt(i, m.multiplyMatrices(lifted, rel));
            im.instanceMatrix.needsUpdate = true;
          }
          windows.setMatrixAt(j, m.multiplyMatrices(lifted, glass.matrixWorld));
          windows.instanceMatrix.needsUpdate = true;
        },
      });
    });
    windows.computeBoundingSphere();
    windows.name = `kit:${name}_vitrine`;
    scene.add(windows);
  }
  return { glow: [...glow], shops };
}
