// Shared core of the service-page scenes (/criacao-de-sites, /lojas-virtuais, /apps, /seo...).
// It owns the renderer, the night street, the neighborhood, scroll → progress, the frame loop and disposal.
// Each page only builds its own subject and says how it changes with progress P (0 = hero, N = last step done).
// Visual rules from the home: linear colors via raw(), amber = visible/open, signal blue = being found.
import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  DirectionalLight,
  FogExp2,
  Group,
  GridHelper,
  HemisphereLight,
  InstancedMesh,
  LinearSRGBColorSpace,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from "three";

export type StageRefs = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  steps: HTMLElement[];
  /** Called when the active step changes (-1 = hero), so the HTML cards can light up. */
  onStep: (i: number) => void;
};

export const raw = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 while p goes from a to b. */
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** Lands with a small bounce. */
export const land = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(1 - t, 3) * Math.cos(t * 2.2));

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TONES = [0x0c1630, 0x101c3a, 0x072428, 0x141c2e, 0x26140a, 0x221e12];
export const ROOFS = [0x101d3c, 0x16284e, 0x063c42, 0x1c2638, 0x3a1c0c, 0x34301c];
export const AMBER_HEX = "#FFB547";
export const SIGNAL_HEX = "#5B97FF";

export type Lot = { x: number; z: number; w: number; d: number; h: number; tone: number };

export type StageCtx = {
  scene: Scene;
  camera: PerspectiveCamera;
  R: () => number;
  reduce: boolean;
  mobile: boolean;
  narrow: () => boolean;
  monoFamily: string;
  AMBER: Color;
  SIGNAL: Color;
  glow: Texture;
  canvasTex: (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat?: boolean) => Texture;
  windowsTex: (seed: number, chance: number) => Texture;
  /** A street along z at x = streetX, with sidewalks on both sides. */
  street: (streetX: number) => void;
  /** Dim blocks with roofs in map colors, one instanced draw. */
  blocks: (lots: Lot[]) => void;
  /** Cool-white street lights (never amber). */
  lamps: (spots: [number, number][]) => void;
  /** Signal-blue search beam + map pin: "being found". */
  marker: (x: number, z: number) => Marker;
};

export type Marker = {
  group: Group;
  /** found: 0..1 (beam height and pin opacity). y: top of the building it stands on. */
  set: (found: number, now: number, y: number) => void;
};

export type Subject = {
  /** Apply progress P (0..steps) and place the camera. Return the screen shift on desktop (0..0.3). */
  apply: (P: number, now: number) => number;
};

export function createStage(refs: StageRefs, build: (ctx: StageCtx) => Subject, seed = 11): (() => void) | null {
  const { root, canvas, steps, onStep } = refs;
  const narrow = () => window.innerWidth < 860;
  const mobile = narrow();
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const textures: Texture[] = [];
  const cleanups: (() => void)[] = [];
  let raf = 0;
  let disposed = false;
  let W = canvas.clientWidth || window.innerWidth;
  let H = canvas.clientHeight || window.innerHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.setSize(W, H, false);
  const NIGHT = raw(0x060a14);
  renderer.setClearColor(NIGHT);
  const scene = new Scene();
  scene.fog = new FogExp2(NIGHT, 0.021);
  const camera = new PerspectiveCamera(34, W / H, 0.1, 400);

  const canvasTex: StageCtx["canvasTex"] = (w, h, draw, repeat = false) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!);
    const t = new CanvasTexture(c);
    if (repeat) t.wrapS = t.wrapT = RepeatWrapping;
    textures.push(t);
    return t;
  };
  const glow = canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.3, "rgba(255,255,255,.45)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  });
  const windowsTex: StageCtx["windowsTex"] = (s, chance) => {
    const r = rng(s);
    return canvasTex(128, 128, (g) => {
      g.fillStyle = "#000";
      g.fillRect(0, 0, 128, 128);
      for (let y = 0; y < 4; y++)
        for (let x = 0; x < 4; x++)
          if (r() < chance) {
            g.fillStyle = `rgba(255,255,255,${0.35 + r() * 0.65})`;
            g.fillRect(x * 32 + 9, y * 32 + 8, 14, 17);
          }
    }, true);
  };

  // night base: sky light, moon, ground, map grid
  scene.add(new HemisphereLight(raw(0x3a56a8), raw(0x03050b), 0.75 * Math.PI));
  const moon = new DirectionalLight(raw(0xa4b8ff), 0.45 * Math.PI);
  moon.position.set(-30, 50, 24);
  scene.add(moon);
  const ground = new Mesh(new PlaneGeometry(300, 300), new MeshLambertMaterial({ color: raw(0x070d1b) }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const grid = new GridHelper(300, 75, raw(0x1b2c5a), raw(0x111c3a));
  (grid.material as Material).transparent = true;
  (grid.material as Material).opacity = 0.3;
  grid.position.y = 0.005;
  scene.add(grid);

  const m4 = new Matrix4();
  const flat = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
  const ps = new Vector3();
  const sc = new Vector3();

  const street: StageCtx["street"] = (x) => {
    const road = new Mesh(new PlaneGeometry(7, 300), new MeshLambertMaterial({ color: raw(0x04070e) }));
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.01, 0);
    scene.add(road);
    const walkMat = new MeshLambertMaterial({ color: raw(0x0c1427) });
    for (const wx of [x - 4.25, x + 4.25]) {
      const walk = new Mesh(new PlaneGeometry(1.5, 300), walkMat);
      walk.rotation.x = -Math.PI / 2;
      walk.position.set(wx, 0.015, 0);
      scene.add(walk);
    }
    const n = 40;
    const dashes = new InstancedMesh(new PlaneGeometry(0.14, 1.8), new MeshBasicMaterial({ color: raw(0x2a3858) }), n);
    for (let i = 0; i < n; i++) dashes.setMatrixAt(i, m4.compose(ps.set(x, 0.02, -78 + i * 4), flat, sc.set(1, 1, 1)));
    scene.add(dashes);
  };

  const blocks: StageCtx["blocks"] = (lots) => {
    if (!lots.length) return;
    const facade = new MeshLambertMaterial({ color: 0xffffff, emissive: raw(0x9fb3ff), emissiveMap: windowsTex(5, 0.42), emissiveIntensity: 0.22 });
    (facade.emissiveMap as Texture).repeat.set(2, 3);
    const box = new BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    // BoxGeometry groups: +x, −x, +y (roof), −y, +z, −z. Roofs never get windows.
    const roofPlain = new MeshLambertMaterial({ color: 0x000000 });
    const nb = new InstancedMesh(box, [facade, facade, roofPlain, roofPlain, facade, facade], lots.length);
    const roofs = new InstancedMesh(new PlaneGeometry(1, 1), new MeshLambertMaterial({ color: 0xffffff }), lots.length);
    const id = new Quaternion();
    lots.forEach((l, i) => {
      nb.setMatrixAt(i, m4.compose(ps.set(l.x, 0, l.z), id, sc.set(l.d, l.h, l.w)));
      nb.setColorAt(i, raw(TONES[l.tone]));
      roofs.setMatrixAt(i, m4.compose(ps.set(l.x, l.h + 0.01, l.z), flat, sc.set(l.d, l.w, 1)));
      roofs.setColorAt(i, raw(ROOFS[l.tone]));
    });
    scene.add(nb, roofs);
  };

  const lamps: StageCtx["lamps"] = (spots) => {
    const lampMat = new SpriteMaterial({ map: glow, color: raw(0xcfd9ff), transparent: true, opacity: 0.5, blending: AdditiveBlending, depthWrite: false });
    const poleGeo = new CylinderGeometry(0.05, 0.07, 3.4, 6);
    const poleMat = new MeshLambertMaterial({ color: raw(0x1a2340) });
    for (const [x, z] of spots) {
      const pole = new Mesh(poleGeo, poleMat);
      pole.position.set(x, 1.7, z);
      const lamp = new Sprite(lampMat);
      lamp.position.set(x, 3.45, z);
      lamp.scale.setScalar(1.6);
      scene.add(pole, lamp);
    }
  };

  const beamGeo = new CylinderGeometry(0.22, 0.7, 18, 24, 1, true);
  beamGeo.translate(0, 9, 0);
  const pinHead = new SphereGeometry(0.7, 24, 16);
  const pinTip = new ConeGeometry(0.6, 1.4, 24);
  const marker: StageCtx["marker"] = (x, z) => {
    const signal = new Color(SIGNAL_HEX);
    const beamMat = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
      uniforms: { uColor: { value: signal }, uI: { value: 0 }, uT: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 uColor; uniform float uI; uniform float uT; varying vec2 vUv; void main(){ float a = pow(1.0 - vUv.y, 3.0) * uI; a *= 0.72 + 0.28 * sin(uT * 3.0 - vUv.y * 22.0); gl_FragColor = vec4(uColor, a * 0.5); }",
    });
    const group = new Group();
    const beam = new Mesh(beamGeo, beamMat);
    const pinMat = new MeshLambertMaterial({ color: signal, emissive: signal, emissiveIntensity: 0.9, transparent: true, opacity: 0 });
    const pin = new Group();
    const head = new Mesh(pinHead, pinMat);
    head.position.y = 1.4;
    const tip = new Mesh(pinTip, pinMat);
    tip.rotation.x = Math.PI;
    tip.position.y = 0.55;
    const haloMat = new SpriteMaterial({ map: glow, color: signal, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const halo = new Sprite(haloMat);
    halo.scale.setScalar(2.6);
    halo.position.y = 1.4;
    pin.add(head, tip, halo);
    pin.scale.setScalar(0.62);
    group.add(beam, pin);
    group.position.set(x, 0, z);
    scene.add(group);
    return {
      group,
      set(found, now, y) {
        beam.visible = found > 0.001;
        beam.position.y = y;
        beam.scale.y = Math.max(0.001, found);
        beamMat.uniforms.uI.value = found;
        beamMat.uniforms.uT.value = reduce ? 0 : now;
        pinMat.opacity = found;
        haloMat.opacity = found * 0.7;
        pin.visible = found > 0.001;
        pin.position.y = y + 1.4 + (1 - found) * 3 + (reduce ? 0 : Math.sin(now * 1.6 + x) * 0.18);
      },
    };
  };

  const ctx: StageCtx = {
    scene,
    camera,
    R: rng(seed),
    reduce,
    mobile,
    narrow,
    monoFamily: getComputedStyle(root).getPropertyValue("--font-rua-mono").trim() || "ui-monospace, monospace",
    AMBER: new Color(AMBER_HEX),
    SIGNAL: new Color(SIGNAL_HEX),
    glow,
    canvasTex,
    windowsTex,
    street,
    blocks,
    lamps,
    marker,
  };
  const subject = build(ctx);

  // ---------- scroll → progress ----------
  let marks: number[] = [];
  const measure = () => {
    const vh = window.innerHeight;
    marks = steps.map((el) => el.getBoundingClientRect().top + window.scrollY - vh * 0.62);
    const last = steps[steps.length - 1];
    if (last) marks.push(last.getBoundingClientRect().bottom + window.scrollY - vh * 0.75);
  };
  const progressAt = (y: number) => {
    if (!marks.length || y <= marks[0]) return 0;
    for (let i = 0; i < marks.length - 1; i++) if (y < marks[i + 1]) return i + (y - marks[i]) / Math.max(1, marks[i + 1] - marks[i]);
    return steps.length;
  };

  let dirty = true;
  const onResize = () => {
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    measure();
    dirty = true;
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  cleanups.push(() => ro.disconnect());
  document.fonts?.ready.then(() => { if (!disposed) measure(); });
  measure();

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" });
  io.observe(root);
  cleanups.push(() => io.disconnect());

  // ---------- frame ----------
  let P = reduce ? steps.length : progressAt(window.scrollY);
  let lastRender = 0;
  let lastStep = -2;
  const place = (now: number) => {
    const shift = subject.apply(P, now);
    // desktop: push the subject right of the copy; phone: lift it into the upper half, above the step cards
    if (narrow()) camera.setViewOffset(W, H, 0, H * 0.2, W, H);
    else if (shift) camera.setViewOffset(W, H, -W * shift, 0, W, H);
    else camera.clearViewOffset();
  };

  const frame = (ms: number) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden || !visible) return;
    const now = ms / 1000;
    const goal = reduce ? steps.length : progressAt(window.scrollY);
    const moving = Math.abs(goal - P) > 0.0005;
    // ambient motion at a low rate; full rate only while the subject changes
    const interval = moving || dirty ? (mobile ? 1 / 30 : 0) : reduce ? Infinity : mobile ? 1 / 15 : 1 / 24;
    if (now - lastRender < interval - 0.002) return;
    const dt = Math.min(0.1, lastRender ? now - lastRender : 0.016);
    lastRender = now;
    P = moving ? lerp(P, goal, 1 - Math.exp(-dt * 5)) : goal;
    dirty = false;
    const step = P < 0.02 ? -1 : Math.min(steps.length - 1, Math.floor(P));
    if (step !== lastStep) { lastStep = step; onStep(step); }
    place(now);
    renderer.render(scene, camera);
  };

  (async () => {
    place(0);
    if (renderer.extensions.has("KHR_parallel_shader_compile")) {
      try { await renderer.compileAsync(scene, camera); } catch { /* compiled on first render instead */ }
    }
    if (disposed) return;
    raf = requestAnimationFrame(frame);
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
