import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  FogExp2,
  GridHelper,
  Group,
  HemisphereLight,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  LinearSRGBColorSpace,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  Quaternion,
  Raycaster,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { cameraKeys, DEFAULT_KEY, LAST, METHOD, methodKey, mixKey, type CameraKey } from "./cameraKeys";
import { ATTEMPT_EVENT, PULSE_EVENT } from "../events";
import type { CityLayout } from "./kit";

export type WorldRefs = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  veilS: HTMLElement;
  veilF: HTMLElement;
  tagRival: HTMLElement;
  tagYou: HTMLElement;
  tagYouTxt: HTMLElement;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** The approved look was tuned with colors read as linear values; keep them that way. */
const raw = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box with its index reordered into two draw groups: the four facades (0) and top/bottom (1). */
function buildingBox(d: number, h: number, w: number) {
  const g = new BoxGeometry(d, h, w);
  g.translate(0, h / 2, 0);
  const src = g.index!.array;
  const out = new Uint16Array(36);
  [0, 1, 4, 5, 2, 3].forEach((face, k) => { for (let j = 0; j < 6; j++) out[k * 6 + j] = src[face * 6 + j]; });
  g.setIndex(new BufferAttribute(out, 1));
  g.clearGroups();
  g.addGroup(0, 24, 0);
  g.addGroup(24, 12, 1);
  return g;
}

type Building = {
  mesh: Mesh;
  i: number;
  side: number;
  cx: number;
  cz: number;
  w: number;
  d: number;
  h: number;
  facade: MeshLambertMaterial;
  shop: number;
  base: number;
  lift: number;
  hover: number;
  level: number;
};

type AttemptSign = { mesh: Mesh<PlaneGeometry, MeshBasicMaterial>; canvas: HTMLCanvasElement; tex: CanvasTexture; text: string; t0: number };

const ATTEMPT_LABELS = ["INSTAGRAM", "PERFIL NO GOOGLE", "CONSTRUTOR", "SITE POR IA", "CARTÃO DE VISITA", "WHATSAPP"];

// ---------- map palette (linear hex, like the rest of the scene; no lime, no purple) ----------
/** Facade + roof pairs: navy, blue, teal, slate, brick, sand. Roofs read as the "map" from above. */
const BLOCK_TONES: { facade: number; roof: number }[] = [
  { facade: 0x0c1630, roof: 0x101d3c },
  { facade: 0x101c3a, roof: 0x16284e },
  { facade: 0x072428, roof: 0x063c42 },
  { facade: 0x141c2e, roof: 0x1c2638 },
  { facade: 0x26140a, roof: 0x3a1c0c },
  { facade: 0x221e12, roof: 0x34301c },
];
/** Window glow tints: cool white, cyan, warm white. */
const WINDOW_TINTS = [0x9fb3ff, 0x8fe3ff, 0xffe2b8];
const PARK = 0x0a3218;
const TREE = [0x0b3a22, 0x0a3030, 0x123a1c];
const PLAZA = 0x302818;
/** Cross streets (z). Kept away from the visitor's building (z 4) and the rival (z -6). */
const CROSS = [-72, -40, 24, 56];
const CROSS_HALF = 3;
/** Street names painted on the ground, like a map. */
const STREET_NAMES: { text: string; x: number; z: number; along: boolean }[] = [
  { text: "AV. CENTRAL", x: -1.6, z: 38, along: true },
  { text: "AV. CENTRAL", x: 1.6, z: -52, along: true },
  { text: "RUA DO COMÉRCIO", x: 26, z: 24, along: false },
  { text: "RUA DAS FLORES", x: -30, z: -40, along: false },
];
const NUMERIC_KEYS = ["shift", "shiftY", "city", "rival", "you", "beam", "scan", "grow", "veilS", "veilF", "tagR", "tagY", "signs"] as const;

export function createWorld(refs: WorldRefs): (() => void) | null {
  const { root, canvas, veilS, veilF, tagRival, tagYou, tagYouTxt } = refs;
  const narrow = () => window.innerWidth < 860;
  const mobile = narrow();
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const R = rng(7);
  let W = window.innerWidth;
  let H = window.innerHeight;
  let disposed = false;
  let raf = 0;
  const cleanups: (() => void)[] = [];
  const textures: Texture[] = [];

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.setSize(W, H, false);
  renderer.localClippingEnabled = true;

  const scene = new Scene();
  const NIGHT = raw(0x060a14);
  scene.background = NIGHT;
  scene.fog = new FogExp2(NIGHT, 0.0165);
  const camera = new PerspectiveCamera(36, W / H, 0.1, 500);

  const AMBER = new Color("#FFB547");
  const SIGNAL = new Color("#5B97FF");
  const DARK = new Color("#0A1120");
  const SIGNDIM = new Color("#3A4866");
  const tmp = new Color();
  const dummy = new Object3D();
  const place = (mesh: InstancedMesh, i: number, x: number, y: number, z: number, rx: number, ry: number, sx: number, sy: number) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(rx, ry, 0);
    dummy.scale.set(sx, sy, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  };

  const radial = () => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.3, "rgba(255,255,255,.45)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new CanvasTexture(c);
    textures.push(t);
    return t;
  };
  const winTex = (seed: number) => {
    const r = rng(seed);
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    g.fillStyle = "#000";
    g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++)
        if (r() < 0.42) {
          g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`;
          g.fillRect(x * 32 + 9, y * 32 + 8, 14, 17);
        }
    const t = new CanvasTexture(c);
    t.wrapS = t.wrapT = RepeatWrapping;
    textures.push(t);
    return t;
  };

  // Everything that depends on the built scene lives here; the build yields to the main thread between steps.
  (async () => {
    // public/rua/city.json: where the kit assets go (see docs/Rua — guia de edição.md). Tiny, fetched in parallel.
    const layoutP: Promise<CityLayout | null> = fetch("/rua/city.json")
      .then((r) => (r.ok ? (r.json() as Promise<CityLayout>) : null))
      .catch(() => null);
    const glow = radial();

    // lights, ground, grid, street
    scene.add(new HemisphereLight(raw(0x3a56a8), raw(0x03050b), 0.7 * Math.PI));
    const moon = new DirectionalLight(raw(0xa4b8ff), 0.42 * Math.PI);
    moon.position.set(-30, 50, 20);
    scene.add(moon);
    const ground = new Mesh(new PlaneGeometry(600, 600), new MeshLambertMaterial({ color: raw(0x070d1b) }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    const grid = new GridHelper(600, 150, raw(0x1b2c5a), raw(0x111c3a));
    (grid.material as Material).transparent = true;
    (grid.material as Material).opacity = 0.32;
    grid.position.y = 0.005;
    scene.add(grid);
    const street = new Mesh(new PlaneGeometry(7, 600), new MeshLambertMaterial({ color: raw(0x04070e) }));
    street.rotation.x = -Math.PI / 2;
    street.position.y = 0.02;
    scene.add(street);
    const walkMat = new MeshLambertMaterial({ color: raw(0x0c1427) });
    for (const sx of [-4.25, 4.25]) {
      const sw = new Mesh(new PlaneGeometry(1.5, 600), walkMat);
      sw.rotation.x = -Math.PI / 2;
      sw.position.set(sx, 0.03, 0);
      scene.add(sw);
    }
    const onCross = (z: number, pad = 0) => CROSS.some((c) => Math.abs(z - c) < CROSS_HALF + pad);
    const dashZ: number[] = [];
    for (let z = -150; z < 150; z += 4.5) if (!onCross(z, 1)) dashZ.push(z);
    const dashes = new InstancedMesh(new PlaneGeometry(0.14, 1.8), new MeshBasicMaterial({ color: raw(0x2a3858) }), dashZ.length);
    dashZ.forEach((z, i) => place(dashes, i, 0, 0.04, z, -Math.PI / 2, 0, 1, 1));
    scene.add(dashes);

    // cross streets with zebra crossings: the city reads as a map from above
    const crossMat = new MeshLambertMaterial({ color: raw(0x04070e) });
    for (const c of CROSS) {
      const road = new Mesh(new PlaneGeometry(240, CROSS_HALF * 2), crossMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.025, c);
      scene.add(road);
    }
    const zebraSpots: [number, number][] = [];
    for (const c of CROSS) for (const side of [-1, 1]) for (let k = -3; k <= 3; k++) zebraSpots.push([k * 0.9, c + side * (CROSS_HALF + 0.9)]);
    const zebra = new InstancedMesh(new PlaneGeometry(0.45, 1.4), new MeshBasicMaterial({ color: raw(0x3a4866) }), zebraSpots.length);
    zebraSpots.forEach(([x, z], i) => place(zebra, i, x, 0.045, z, -Math.PI / 2, 0, 1, 1));
    scene.add(zebra);

    // street names on the ground
    const nameFamily = getComputedStyle(root).getPropertyValue("--font-rua-mono").trim() || "ui-monospace, monospace";
    for (const n of STREET_NAMES) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 64;
      const g = c.getContext("2d")!;
      g.fillStyle = "rgba(170,190,240,0.75)";
      g.font = `600 34px ${nameFamily}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(n.text, 256, 34);
      const t = new CanvasTexture(c);
      t.anisotropy = 4;
      textures.push(t);
      const label = new Mesh(new PlaneGeometry(6.4, 0.8), new MeshBasicMaterial({ map: t, transparent: true, opacity: 0.55, depthWrite: false }));
      label.rotation.set(-Math.PI / 2, 0, n.along ? Math.PI / 2 : 0);
      label.position.set(n.x, 0.05, n.z);
      scene.add(label);
    }

    const layout = await layoutP;
    if (disposed) return;
    const proc = { front: true, back: true, parks: true, lamps: true, ...layout?.procedural };

    // street lights: cool white, never amber (amber means "a business is visible").
    // Kept low and at the curb so their glow never sits on top of a roof.
    const lampSpots: [number, number][] = [];
    if (proc.lamps) for (let z = -96; z <= 96; z += 12) for (const sx of [-3.75, 3.75]) {
      const zz = z + (sx > 0 ? 6 : 0);
      if (!onCross(zz, 1)) lampSpots.push([sx, zz]);
    }
    const poles = new InstancedMesh(new CylinderGeometry(0.05, 0.07, 3.4, 6), new MeshLambertMaterial({ color: raw(0x1a2340) }), lampSpots.length);
    const lampPools = new InstancedMesh(new PlaneGeometry(4.4, 4.4), new MeshBasicMaterial({ map: glow, color: raw(0x56669a), transparent: true, opacity: 0.3, blending: AdditiveBlending, depthWrite: false }), lampSpots.length);
    const lampPos: number[] = [];
    lampSpots.forEach(([sx, zz], i) => {
      place(poles, i, sx, 1.7, zz, 0, 0, 1, 1);
      place(lampPools, i, sx * 0.72, 0.05, zz, -Math.PI / 2, 0, 1, 1);
      lampPos.push(sx, 3.45, zz);
    });
    const lampGeo = new BufferGeometry();
    lampGeo.setAttribute("position", new Float32BufferAttribute(lampPos, 3));
    const lamps = new Points(lampGeo, new PointsMaterial({ map: glow, color: raw(0xcfd9ff), size: 2.6, sizeAttenuation: true, transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false }));
    scene.add(poles, lampPools, lamps);

    await yieldToMain();
    if (disposed) return;

    // front-row buildings
    const blds: Building[] = [];
    const roofMats = BLOCK_TONES.map((t) => new MeshLambertMaterial({ color: raw(t.roof) }));
    const texV = [0, 1, 2, 3, 4, 5].map((i) => winTex(11 + i));
    const span = mobile ? 64 : 96;
    const specs: { side: number; cz: number; w: number; d: number; h: number; shop: number; base: number }[] = [];
    for (const side of proc.front ? [-1, 1] : []) {
      let z = -span;
      while (z < span) {
        const w = 3 + R() * 2.6;
        // never build on a cross street: jump to the far side of it
        const hit = CROSS.find((c) => z < c + CROSS_HALF + 0.4 && z + w > c - CROSS_HALF - 0.4);
        if (hit !== undefined) { z = hit + CROSS_HALF + 0.4; continue; }
        const d = 4 + R() * 3.2;
        let h = 2.6 + Math.pow(R(), 1.6) * 9;
        const cz = z + w / 2;
        if (side === 1 && cz > 6 && cz < 24) h = Math.min(h, 3.8);
        if (side === -1 && cz > 0 && cz < 18) h = Math.min(h, 4.2);
        if (side === -1 && cz > -18 && cz < 0) h = Math.min(h, 5);
        specs.push({ side, cz, w, d, h, shop: R() < 0.34 ? 0.35 + R() * 0.45 : 0, base: R() });
        z += w + 0.35 + R() * 0.6;
        if (R() < 0.08) z += 7;
      }
    }
    const YOU = { side: 1, cz: 4, w: 4.4 };
    const RIV = { side: -1, cz: -6, w: 5 };
    const overlaps = (s: { side: number; cz: number; w: number }, t: typeof YOU) => s.side === t.side && Math.abs(s.cz - t.cz) < (s.w + t.w) / 2 + 0.3;
    const kept = specs.filter((s) => !overlaps(s, YOU) && !overlaps(s, RIV));
    kept.push({ side: 1, cz: 4, w: 4.4, d: 5, h: 3.4, shop: 0, base: 0.04 }, { side: -1, cz: -6, w: 5, d: 5.6, h: 6.6, shop: 1, base: 0.7 });
    const n = kept.length;
    // storefronts, signs and light pools: one instanced draw call each, colored per building
    const fronts = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0xffffff }), n);
    const signs = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0xffffff }), n);
    const pools = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: glow, color: 0xffffff, transparent: true, blending: AdditiveBlending, depthWrite: false }), n);
    kept.forEach((s, i) => {
      const cx = s.side * (5 + s.d / 2);
      const tex = texV[Math.floor(R() * texV.length)].clone();
      tex.needsUpdate = true;
      tex.repeat.set(Math.max(1, s.w / 3.2), Math.max(1, s.h / 3.6));
      textures.push(tex);
      // the visitor and the rival keep the original navy so the story colors (amber, signal blue) stay readable
      const special = i >= kept.length - 2;
      const tone = special ? 0 : Math.floor(R() * BLOCK_TONES.length);
      const tint = special ? WINDOW_TINTS[0] : WINDOW_TINTS[Math.floor(R() * WINDOW_TINTS.length)];
      const facade = new MeshLambertMaterial({ color: raw(BLOCK_TONES[tone].facade), emissive: raw(tint), emissiveMap: tex, emissiveIntensity: 0 });
      const mesh = new Mesh(buildingBox(s.d, s.h, s.w), [facade, roofMats[tone]]);
      mesh.position.set(cx, 0, s.cz);
      scene.add(mesh);
      place(fronts, i, s.side * 4.97, 0.95, s.cz, 0, (-s.side * Math.PI) / 2, s.w * 0.78, 1.5);
      place(signs, i, s.side * 4.96, 2.0, s.cz, 0, (-s.side * Math.PI) / 2, s.w * 0.5, 0.22);
      place(pools, i, s.side * 3.2, 0.06, s.cz, -Math.PI / 2, 0, 3.6, s.w * 1.15);
      fronts.setColorAt(i, DARK);
      signs.setColorAt(i, DARK);
      pools.setColorAt(i, tmp.setRGB(0, 0, 0));
      const b: Building = { mesh, i, side: s.side, cx, cz: s.cz, w: s.w, d: s.d, h: s.h, facade, shop: s.shop, base: s.base, lift: 0, hover: 0, level: -1 };
      mesh.userData.b = b;
      blds.push(b);
    });
    scene.add(fronts, signs, pools);
    const you = blds[n - 2];
    const rival = blds[n - 1];
    const meshes = blds.map((b) => b.mesh);

    // back city: an 8×8 grid of lots, one thing per lot (block, park or plaza), so nothing overlaps.
    // Windows only on the facades (group 0); roofs (group 1) stay plain, so no "lights on top".
    const CELL = 8;
    const maxBack = mobile ? 150 : 320;
    type Lot = { x: number; z: number };
    const lots: { block: Lot[]; park: Lot[]; plaza: Lot[] } = { block: [], park: [], plaza: [] };
    for (let gx = 2; gx <= 11; gx++) {
      for (let gz = -14; gz <= 14; gz++) {
        const z = gz * CELL;
        if (onCross(z, CELL / 2 - 0.5)) continue;
        for (const side of [-1, 1]) {
          const lot = { x: side * gx * CELL, z };
          const r = R();
          if (r < 0.6) { if (proc.back) lots.block.push(lot); }
          else if (r < 0.72) { if (proc.parks) lots.park.push(lot); }
          else if (r < 0.78) { if (proc.parks) lots.plaza.push(lot); }
        }
      }
    }
    const blockLots = lots.block.slice(0, maxBack);
    const backN = blockLots.length;
    const bTex = winTex(99);
    bTex.repeat.set(2, 3);
    const backMat = new MeshLambertMaterial({ color: 0xffffff, emissive: raw(0x9fb3ff), emissiveMap: bTex, emissiveIntensity: 0.2 });
    const backRoof = new MeshLambertMaterial({ color: 0xc8c8c8 });
    const back = new InstancedMesh(buildingBox(1, 1, 1), [backMat, backRoof], Math.max(1, backN));
    back.count = backN;
    const m4 = new Matrix4();
    const q = new Quaternion();
    const sc = new Vector3();
    const ps = new Vector3();
    blockLots.forEach((lot, k) => {
      ps.set(lot.x, 0, lot.z);
      sc.set(3.4 + R() * 3, 2 + Math.pow(R(), 2) * 16, 3.4 + R() * 3);
      m4.compose(ps, q, sc);
      back.setMatrixAt(k, m4);
      back.setColorAt(k, raw(BLOCK_TONES[Math.floor(R() * BLOCK_TONES.length)].facade));
    });
    scene.add(back);

    // parks with trees and plazas: ground tiles plus one instanced draw for all trees
    const tiles = [...lots.park.map((l) => ({ ...l, c: PARK })), ...lots.plaza.map((l) => ({ ...l, c: PLAZA }))];
    const tileMesh = new InstancedMesh(new PlaneGeometry(CELL - 1, CELL - 1), new MeshLambertMaterial({ color: 0xffffff }), Math.max(1, tiles.length));
    tiles.forEach((t, i) => {
      place(tileMesh, i, t.x, 0.012, t.z, -Math.PI / 2, 0, 1, 1);
      tileMesh.setColorAt(i, raw(t.c));
    });
    tileMesh.count = tiles.length;
    const treeSpots: [number, number, number][] = [];
    for (const p of lots.park) for (let k = 0; k < 4; k++) treeSpots.push([p.x + (R() - 0.5) * 5, p.z + (R() - 0.5) * 5, 0.5 + R() * 0.35]);
    const treeGeo = new ConeGeometry(0.9, 2.4, 7);
    treeGeo.translate(0, 1.4, 0);
    const trees = new InstancedMesh(treeGeo, new MeshLambertMaterial({ color: 0xffffff }), Math.max(1, treeSpots.length));
    treeSpots.forEach(([x, z, s], i) => {
      ps.set(x, 0, z);
      sc.setScalar(s);
      m4.compose(ps, q, sc);
      trees.setMatrixAt(i, m4);
      trees.setColorAt(i, raw(TREE[i % TREE.length]));
    });
    trees.count = treeSpots.length;
    scene.add(tileMesh, trees);

    await yieldToMain();
    if (disposed) return;

    // search beams and pins (signal blue = being found in search)
    const beamMat = () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        uniforms: { uColor: { value: raw(0x5b97ff) }, uI: { value: 0 }, uT: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "uniform vec3 uColor; uniform float uI; uniform float uT; varying vec2 vUv; void main(){ float a = pow(1.0 - vUv.y, 3.0) * uI; a *= 0.72 + 0.28 * sin(uT * 3.0 - vUv.y * 22.0); gl_FragColor = vec4(uColor, a * 0.42); }",
      });
    // slim and short: a map marker, not a searchlight
    const beamGeo = new CylinderGeometry(0.18, 0.55, 18, 24, 1, true);
    beamGeo.translate(0, 9, 0);
    const pinMat = new MeshLambertMaterial({ color: raw(0x5b97ff), emissive: raw(0x5b97ff), emissiveIntensity: 0.9 });
    const pinHalo = new SpriteMaterial({ map: glow, color: raw(0x5b97ff), transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false });
    const makePin = () => {
      const g = new Group();
      const head = new Mesh(new SphereGeometry(0.7, 24, 16), pinMat);
      head.position.y = 1.5;
      const tip = new Mesh(new ConeGeometry(0.6, 1.4, 24), pinMat);
      tip.rotation.x = Math.PI;
      tip.position.y = 0.55;
      const halo = new Sprite(pinHalo);
      halo.scale.set(2.6, 2.6, 1);
      halo.position.y = 1.4;
      g.add(head, tip, halo);
      return g;
    };
    const rBeam = new Mesh(beamGeo, beamMat());
    rBeam.position.set(rival.cx, rival.h, rival.cz);
    const PIN = 0.62;
    const rPin = makePin();
    rPin.scale.setScalar(PIN);
    rPin.position.set(rival.cx, rival.h + 0.6, rival.cz);
    const yBeam = new Mesh(beamGeo, beamMat());
    yBeam.position.set(you.cx, you.h, you.cz);
    const yPin = makePin();
    yPin.position.set(you.cx, you.h + 0.6, you.cz);
    yPin.scale.setScalar(0.001);
    scene.add(rBeam, rPin, yBeam, yPin);

    // diagnosis: scan lines on the visitor's building and a comparison arc to the rival
    const clip = new Plane(new Vector3(0, -1, 0), 0);
    const edges = new LineSegments(new EdgesGeometry(you.mesh.geometry), new LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0, clippingPlanes: [clip] }));
    you.mesh.add(edges);
    const ring = new LineSegments(new EdgesGeometry(new PlaneGeometry(you.d + 0.8, you.w + 0.8)), new LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0 }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(you.cx, 0, you.cz);
    const curve = new QuadraticBezierCurve3(new Vector3(you.cx, you.h + 0.2, you.cz), new Vector3(0, 14, -1), new Vector3(rival.cx, rival.h + 0.2, rival.cz));
    const arc = new Line(new BufferGeometry().setFromPoints(curve.getPoints(60)), new LineDashedMaterial({ color: SIGNAL, dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0 }));
    arc.computeLineDistances();
    scene.add(ring, arc);

    // the six attempts: signs that light up and go out
    const monoFamily = getComputedStyle(root).getPropertyValue("--font-rua-mono").trim() || "ui-monospace, monospace";
    const drawLabel = (c: HTMLCanvasElement, text: string) => {
      const g = c.getContext("2d")!;
      g.clearRect(0, 0, 512, 128);
      g.strokeStyle = "#fff";
      g.lineWidth = 5;
      const r = 22, x = 6, y = 6, w = 500, h = 116;
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + w, y, x + w, y + h, r);
      g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r);
      g.arcTo(x, y, x + w, y, r);
      g.closePath();
      g.stroke();
      g.fillStyle = "#fff";
      g.font = `600 40px ${monoFamily}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(text, 256, 68);
    };
    const k2 = cameraKeys[2];
    const cP = new Vector3(...k2.pos);
    const cT = new Vector3(...k2.tgt);
    const fwd = cT.clone().sub(cP).normalize();
    const rgt = fwd.clone().cross(new Vector3(0, 1, 0)).normalize();
    const upv = rgt.clone().cross(fwd).normalize();
    const attemptSigns: AttemptSign[] = ATTEMPT_LABELS.map((text, i) => {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 128;
      drawLabel(c, text);
      const tex = new CanvasTexture(c);
      tex.anisotropy = 4;
      textures.push(tex);
      const mesh = new Mesh(new PlaneGeometry(3.6, 0.9), new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, depthTest: false, color: SIGNDIM.clone() }));
      // drawn over the city (no building cuts through a sign) and kept inside the frame
      mesh.renderOrder = 10;
      const u = (i % 2 ? 1.95 : -1.95) + ((i % 3) - 1) * 0.2;
      const v = 2.2 - Math.floor(i / 2) * 2.2;
      mesh.position.copy(cT).addScaledVector(fwd, -3.5 + (i % 3) * 0.6).addScaledVector(rgt, u).addScaledVector(upv, v);
      mesh.visible = false;
      scene.add(mesh);
      return { mesh, canvas: c, tex, text, t0: -99 };
    });
    document.fonts?.ready.then(() => {
      if (disposed) return;
      attemptSigns.forEach((s) => { drawLabel(s.canvas, s.text); s.tex.needsUpdate = true; });
    });

    // ---------- story: scroll → camera key ----------
    const secs = Array.from(root.querySelectorAll<HTMLElement>("[data-key]"));
    const track = root.querySelector<HTMLElement>("#rua-track");
    let marks: { s: number; e: number }[] = [];
    let methodP = 0;
    const measure = () => {
      const vh = window.innerHeight;
      marks = secs.map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const s = top - vh * 0.3;
        let e = top + el.offsetHeight - vh * 0.7;
        if (e < s) e = s;
        return { s, e };
      });
    };
    const stateAt = (y: number) => {
      if (!marks.length || y <= marks[0].s) return { i: 0, t: 0 };
      for (let i = 0; i < marks.length; i++) {
        const m = marks[i];
        if (y < m.s) {
          const pv = marks[i - 1];
          return { i: i - 1, t: smooth(clamp((y - pv.e) / Math.max(1, m.s - pv.e))) };
        }
        if (y <= m.e) return { i, t: 0 };
      }
      return { i: marks.length - 1, t: 0 };
    };
    const keyAt = (i: number) => (i === METHOD ? methodKey(methodP) : cameraKeys[i] ?? DEFAULT_KEY);

    // ---------- input ----------
    const mouse = { x: 0, y: 0, sx: 0, sy: 0, ndc: new Vector2(), has: false, moved: false };
    const drag = { on: false, yaw: 0, lx: 0 };
    let pulse = 0;
    let lastInput = 0;
    let kitGlow: MeshLambertMaterial[] = [];
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.ndc.set(mouse.x, -mouse.y);
      mouse.has = true;
      mouse.moved = true;
      lastInput = performance.now();
      if (drag.on) { drag.yaw = clamp(drag.yaw + (e.clientX - drag.lx) * 0.006, -1.6, 1.6); drag.lx = e.clientX; }
    };
    const grabs = Array.from(root.querySelectorAll<HTMLElement>("[data-rua-grab]"));
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element;
      if (!fine || e.button !== 0 || target.closest("a,button,input,form,label,dialog,h1,h2,p,li,[data-rua-search]")) return;
      drag.on = true;
      drag.lx = e.clientX;
    };
    const onUp = () => { drag.on = false; };
    const onPulse = () => { pulse = 1; };
    const onAttempt = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (attemptSigns[i]) attemptSigns[i].t0 = performance.now() / 1000;
    };
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      measure();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    grabs.forEach((g) => g.addEventListener("pointerdown", onDown));
    window.addEventListener(PULSE_EVENT, onPulse);
    window.addEventListener(ATTEMPT_EVENT, onAttempt);
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      grabs.forEach((g) => g.removeEventListener("pointerdown", onDown));
      window.removeEventListener(PULSE_EVENT, onPulse);
      window.removeEventListener(ATTEMPT_EVENT, onAttempt);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    });
    document.fonts?.ready.then(() => { if (!disposed) measure(); });
    measure();

    // ---------- frame ----------
    const cur: CameraKey = { ...cameraKeys[0], pos: [...cameraKeys[0].pos], tgt: [...cameraKeys[0].tgt] };
    const ray = new Raycaster();
    const v = new Vector3();
    const tgt = new Vector3();
    const off = new Vector3();
    const UP = new Vector3(0, 1, 0);
    let first = true;
    let lastRender = 0;
    let lastScroll = -1;
    let hovered: Building | null = null;
    let youLabelOn: boolean | null = null;

    const setOp = (el: HTMLElement, value: number) => {
      const s = value.toFixed(3);
      if (el.dataset.op !== s) { el.dataset.op = s; el.style.opacity = s; }
    };
    const placeTag = (el: HTMLElement, x: number, y: number, z: number, vis: number) => {
      v.set(x, y, z).project(camera);
      const sx = (v.x * 0.5 + 0.5) * W;
      const sy = (-v.y * 0.5 + 0.5) * H;
      const ok = v.z < 1 && vis > 0.02 && sx > 40 && sx < W - 40 && sy > 70 && sy < H - 20;
      setOp(el, ok ? vis : 0);
      if (ok) el.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`;
    };
    const keyDistance = (K: CameraKey) => {
      let d = 0;
      for (let j = 0; j < 3; j++) d += Math.abs(cur.pos[j] - K.pos[j]) + Math.abs(cur.tgt[j] - K.tgt[j]);
      for (const key of NUMERIC_KEYS) d += Math.abs(cur[key] - K[key]) * 4;
      return d;
    };

    const frame = (ms: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const now = ms / 1000;

      if (track) {
        const r = track.getBoundingClientRect();
        methodP = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      }
      const scrolled = window.scrollY !== lastScroll;
      lastScroll = window.scrollY;
      const st = stateAt(window.scrollY);
      const A = keyAt(st.i);
      const K = st.t > 0 && st.i < LAST ? mixKey(A, st.i + 1 === METHOD ? methodKey(0) : keyAt(st.i + 1), st.t) : A;

      // Render at full rate only while something moves; ambient shimmer runs at a lower rate.
      const signsBusy = cur.signs > 0.01 && attemptSigns.some((s) => now - s.t0 < 3.5);
      const active = first || scrolled || drag.on || Math.abs(drag.yaw) > 0.002 || pulse > 0.02 || signsBusy ||
        performance.now() - lastInput < 400 || keyDistance(K) > 0.02 || blds.some((b) => b.hover > 0.01);
      const interval = active ? (mobile ? 1 / 30 : 0) : (mobile ? 1 / 15 : 1 / 30);
      if (!first && now - lastRender < interval - 0.002) return;
      const dt = Math.min(0.1, lastRender ? now - lastRender : 0.016);
      lastRender = now;

      const k = first ? 1 : 1 - Math.exp(-dt * 4.2);
      first = false;
      cur.pos = cur.pos.map((p, j) => lerp(p, K.pos[j], k)) as CameraKey["pos"];
      cur.tgt = cur.tgt.map((p, j) => lerp(p, K.tgt[j], k)) as CameraKey["tgt"];
      for (const key of NUMERIC_KEYS) cur[key] = lerp(cur[key], K[key], k);
      pulse *= Math.exp(-dt * 1.4);

      const isN = narrow();
      const edgeKey = (st.i === 0 ? 1 - st.t : 0) + (st.i === LAST ? 1 : st.i === LAST - 1 ? st.t : 0);

      // camera
      tgt.set(...cur.tgt);
      off.set(...cur.pos).sub(tgt);
      if (isN) off.multiplyScalar(1.3);
      if (!drag.on) drag.yaw *= Math.exp(-dt * 0.9);
      mouse.sx = lerp(mouse.sx, fine && !reduce ? mouse.x : 0, 1 - Math.exp(-dt * 3));
      mouse.sy = lerp(mouse.sy, fine && !reduce ? mouse.y : 0, 1 - Math.exp(-dt * 3));
      const idle = reduce ? 0 : Math.sin(now * 0.17) * 0.09 * edgeKey;
      off.applyAxisAngle(UP, mouse.sx * 0.14 + drag.yaw * edgeKey + idle);
      camera.position.copy(tgt).add(off);
      camera.position.y += -mouse.sy * 1.1;
      camera.lookAt(tgt);
      camera.setViewOffset(W, H, isN ? 0 : -cur.shift * W, isN ? -0.12 * H * edgeKey : -cur.shiftY * H, W, H);

      // hover: passing the mouse over a storefront lights it (raycast only after the pointer moved)
      if (fine && mouse.has && mouse.moved) {
        mouse.moved = false;
        ray.setFromCamera(mouse.ndc, camera);
        const hit = ray.intersectObjects(meshes, false)[0];
        hovered = hit ? (hit.object.userData.b as Building) : null;
      }

      const city = cur.city;
      let colorsDirty = false;
      let matricesDirty = false;
      for (const b of blds) {
        const hoverTarget = b === hovered ? 1 : 0;
        if (b.hover !== hoverTarget) {
          b.hover = Math.abs(b.hover - hoverTarget) < 0.005 ? hoverTarget : lerp(b.hover, hoverTarget, 1 - Math.exp(-dt * 8));
          const lift = b.hover * 0.35;
          if (lift !== b.lift) {
            b.lift = lift;
            b.mesh.position.y = lift;
            place(fronts, b.i, b.side * 4.97, 0.95 + lift, b.cz, 0, (-b.side * Math.PI) / 2, b.w * 0.78, 1.5);
            place(signs, b.i, b.side * 4.96, 2 + lift, b.cz, 0, (-b.side * Math.PI) / 2, b.w * 0.5, 0.22);
            matricesDirty = true;
          }
        }
        let level: number;
        if (b === you) {
          const dorHold = st.i === 1 && st.t === 0;
          const flick = dorHold && !reduce && Math.sin(now * 2.3) > 0.93 && Math.random() < 0.45 ? 0.28 : 0;
          level = Math.max(cur.you, flick, b.hover * 0.6);
          b.facade.emissiveIntensity = 0.05 + cur.you * 0.5;
        } else if (b === rival) {
          level = clamp(cur.rival * 0.85 + pulse * 0.4 + 0.15);
          b.facade.emissiveIntensity = 0.25 + cur.rival * 0.35;
        } else {
          level = Math.max(b.shop * clamp(city * 1.7), b.hover * 0.9);
          b.facade.emissiveIntensity = (0.12 + b.base * 0.85) * city * 0.9 + b.hover * 0.25;
        }
        if (Math.abs(level - b.level) > 0.002) {
          b.level = level;
          fronts.setColorAt(b.i, tmp.copy(DARK).lerp(AMBER, level));
          signs.setColorAt(b.i, tmp.copy(DARK).lerp(AMBER, level * 0.75));
          pools.setColorAt(b.i, tmp.copy(AMBER).multiplyScalar(level * 0.6));
          colorsDirty = true;
        }
      }
      if (colorsDirty) {
        fronts.instanceColor!.needsUpdate = true;
        signs.instanceColor!.needsUpdate = true;
        pools.instanceColor!.needsUpdate = true;
      }
      if (matricesDirty) {
        fronts.instanceMatrix.needsUpdate = true;
        signs.instanceMatrix.needsUpdate = true;
      }
      backMat.emissiveIntensity = 0.06 + city * 0.38;
      for (const m of kitGlow) m.emissiveIntensity = m.userData.base * (0.3 + city * 1.4);

      // the visitor's building: grows, gets scanned, then lights up with its own beam
      const gS = 1 + 0.7 * cur.grow;
      const yH = you.h * gS;
      you.mesh.scale.y = gS;
      clip.constant = cur.scan * yH + you.lift + 0.001;
      (edges.material as LineBasicMaterial).opacity = cur.scan > 0.002 ? 0.95 * (1 - cur.you * 0.7) : 0;
      edges.visible = cur.scan > 0.002;
      const ringMat = ring.material as LineBasicMaterial;
      ringMat.opacity = lerp(ringMat.opacity, cur.scan > 0.01 && cur.scan < 0.99 ? 1 : 0, 0.2);
      ring.visible = ringMat.opacity > 0.01;
      ring.position.y = cur.scan * yH + you.lift;
      const arcOp = Math.sin(Math.PI * clamp(cur.scan)) * 0.9;
      (arc.material as LineDashedMaterial).opacity = arcOp;
      arc.visible = arcOp > 0.01;
      const bt = cur.beam;
      const back1 = 1.70158;
      const eb = bt <= 0 ? 0 : 1 + (back1 + 1) * Math.pow(bt - 1, 3) + back1 * Math.pow(bt - 1, 2);
      yPin.visible = eb > 0.01;
      yPin.scale.setScalar(Math.max(0.001, eb * PIN));
      yPin.position.y = yH + 0.35 + you.lift + Math.sin(now * 2) * 0.18;
      yPin.rotation.y = now * 0.8;
      yBeam.visible = bt > 0.01;
      yBeam.position.y = yH + you.lift;
      (yBeam.material as ShaderMaterial).uniforms.uI.value = bt;
      (yBeam.material as ShaderMaterial).uniforms.uT.value = now;
      (rBeam.material as ShaderMaterial).uniforms.uI.value = clamp(cur.rival * 0.85 + pulse * 0.6);
      (rBeam.material as ShaderMaterial).uniforms.uT.value = now;
      rPin.position.y = rival.h + 0.35 + rival.lift + Math.sin(now * 2 + 1) * 0.18;
      rPin.rotation.y = now * 0.8;
      rPin.scale.setScalar(PIN * (1 + pulse * 0.35));

      // attempt signs: on for a moment, then they flicker out
      const showSigns = cur.signs > 0.01;
      for (const s of attemptSigns) {
        s.mesh.visible = showSigns;
        if (!showSigns) continue;
        const age = now - s.t0;
        let lvl = 0.12;
        if (age < 0.9) lvl = 1;
        else if (age < 3.5) {
          lvl = Math.max(0.12, Math.exp(-(age - 0.9) * 1.9));
          if (age < 1.8 && Math.random() < 0.3) lvl *= 0.25;
        }
        s.mesh.quaternion.copy(camera.quaternion);
        s.mesh.material.color.copy(tmp.copy(SIGNDIM).lerp(AMBER, lvl));
        s.mesh.material.opacity = cur.signs * (0.4 + 0.6 * lvl);
      }

      // veils and tags
      setOp(veilS, isN ? 0 : cur.veilS);
      setOp(veilF, isN ? Math.max(cur.veilS, cur.veilF) * 0.82 : cur.veilF);
      placeTag(tagRival, rival.cx, rival.h + 3.1, rival.cz, cur.tagR);
      const youOn = cur.beam > 0.5;
      if (youOn !== youLabelOn) {
        youLabelOn = youOn;
        tagYouTxt.textContent = youOn ? "Aberto · seu negócio" : "Fechado · seu negócio";
        tagYou.dataset.on = String(youOn);
      }
      placeTag(tagYou, you.cx, yH + (youOn ? 3.1 : 1.2), you.cz, cur.tagY);

      renderer.render(scene, camera);
    };

    // Compile shaders without blocking, then start drawing.
    camera.position.set(...cameraKeys[0].pos);
    camera.lookAt(...cameraKeys[0].tgt);
    if (renderer.extensions.has("KHR_parallel_shader_compile")) {
      try { await renderer.compileAsync(scene, camera); } catch { /* compiled on first render instead */ }
    }
    if (disposed) return;
    raf = requestAnimationFrame(frame);

    // kit city: loaded after the first frames, only when city.json lists items; the three.js loader stays out of the main bundle
    if (layout?.items?.length) {
      import("./kit")
        .then(({ buildKitCity }) => buildKitCity(scene, layout, textures, () => disposed))
        .then((g) => { kitGlow = g; lastInput = performance.now(); })
        .catch((err) => console.warn("[rua] kit não carregou; a cidade desenhada por código continua", err));
    }
  })();

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    scene.traverse((obj) => {
      const o = obj as Mesh;
      if (o.geometry) geometries.add(o.geometry);
      const m = o.material;
      if (Array.isArray(m)) m.forEach((x) => materials.add(x));
      else if (m) materials.add(m as Material);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
