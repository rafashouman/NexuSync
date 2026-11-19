import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
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
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
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

type Building = {
  mesh: Mesh;
  side: number;
  cx: number;
  cz: number;
  w: number;
  d: number;
  h: number;
  facade: MeshStandardMaterial;
  front: Mesh<PlaneGeometry, MeshBasicMaterial>;
  sign: Mesh<PlaneGeometry, MeshBasicMaterial>;
  pool: Mesh<PlaneGeometry, MeshBasicMaterial>;
  shop: number;
  base: number;
  lift: number;
  hover: number;
};

type AttemptSign = { mesh: Mesh<PlaneGeometry, MeshBasicMaterial>; canvas: HTMLCanvasElement; tex: CanvasTexture; text: string; t0: number };

const ATTEMPT_LABELS = ["INSTAGRAM", "GOOGLE MEU NEGÓCIO", "WIX / HOSTINGER", "SITE POR IA", "CARTÃO IMPRESSO", "GRUPO DE WHATSAPP"];

export function createWorld(refs: WorldRefs): (() => void) | null {
  const { root, canvas, veilS, veilF, tagRival, tagYou, tagYouTxt } = refs;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const narrow = () => window.innerWidth < 860;
  const R = rng(7);
  let W = window.innerWidth;
  let H = window.innerHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow() ? 1.5 : 1.75));
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

  scene.add(new HemisphereLight(raw(0x3a56a8), raw(0x03050b), 0.7 * Math.PI));
  const moon = new DirectionalLight(raw(0xa4b8ff), 0.42 * Math.PI);
  moon.position.set(-30, 50, 20);
  scene.add(moon);

  const textures: Texture[] = [];
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
  const glow = radial();
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

  // ground, grid, street
  const ground = new Mesh(new PlaneGeometry(600, 600), new MeshStandardMaterial({ color: raw(0x070d1b), roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const grid = new GridHelper(600, 150, raw(0x1b2c5a), raw(0x111c3a));
  (grid.material as Material).transparent = true;
  (grid.material as Material).opacity = 0.5;
  grid.position.y = 0.005;
  scene.add(grid);
  const street = new Mesh(new PlaneGeometry(7, 600), new MeshStandardMaterial({ color: raw(0x04070e), roughness: 0.95 }));
  street.rotation.x = -Math.PI / 2;
  street.position.y = 0.02;
  scene.add(street);
  for (const sx of [-4.25, 4.25]) {
    const sw = new Mesh(new PlaneGeometry(1.5, 600), new MeshStandardMaterial({ color: raw(0x0c1427), roughness: 1 }));
    sw.rotation.x = -Math.PI / 2;
    sw.position.set(sx, 0.03, 0);
    scene.add(sw);
  }
  const dashGeo = new PlaneGeometry(0.14, 1.8);
  const dashMat = new MeshBasicMaterial({ color: raw(0x2a3858) });
  for (let z = -150; z < 150; z += 4.5) {
    const d = new Mesh(dashGeo, dashMat);
    d.rotation.x = -Math.PI / 2;
    d.position.set(0, 0.04, z);
    scene.add(d);
  }

  // street lights: cool white, never amber (amber means "a business is visible")
  const poleGeo = new CylinderGeometry(0.05, 0.07, 4.2, 6);
  const poleMat = new MeshStandardMaterial({ color: raw(0x1a2340), roughness: 0.8 });
  const poolGeo = new PlaneGeometry(5, 5);
  const lampMat = new SpriteMaterial({ map: glow, color: raw(0xcfd9ff), transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false });
  const lampPoolMat = new MeshBasicMaterial({ map: glow, color: raw(0x56669a), transparent: true, opacity: 0.3, blending: AdditiveBlending, depthWrite: false });
  for (let z = -96; z <= 96; z += 12)
    for (const sx of [-4.1, 4.1]) {
      const zz = z + (sx > 0 ? 6 : 0);
      const p = new Mesh(poleGeo, poleMat);
      p.position.set(sx, 2.1, zz);
      scene.add(p);
      const s = new Sprite(lampMat);
      s.scale.set(1.6, 1.6, 1);
      s.position.set(sx, 4.25, zz);
      scene.add(s);
      const pool = new Mesh(poolGeo, lampPoolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(sx * 0.72, 0.05, zz);
      scene.add(pool);
    }

  // front-row buildings
  const blds: Building[] = [];
  const roofMat = new MeshStandardMaterial({ color: raw(0x0e1830), roughness: 0.9 });
  const texV = [0, 1, 2, 3, 4, 5].map((i) => winTex(11 + i));
  const NAVYS = [0x0c1630, 0x101c3a, 0x0e1934, 0x132042];
  function addBuilding(side: number, cz: number, w: number, d: number, h: number, shop: number, base: number) {
    const cx = side * (5 + d / 2);
    const geo = new BoxGeometry(d, h, w);
    geo.translate(0, h / 2, 0);
    const tex = texV[Math.floor(R() * texV.length)].clone();
    tex.needsUpdate = true;
    tex.repeat.set(Math.max(1, w / 3.2), Math.max(1, h / 3.6));
    textures.push(tex);
    const facade = new MeshStandardMaterial({ color: raw(NAVYS[Math.floor(R() * NAVYS.length)]), roughness: 0.85, emissive: raw(0x9fb3ff), emissiveMap: tex, emissiveIntensity: 0 });
    const mesh = new Mesh(geo, [facade, facade, roofMat, roofMat, facade, facade]);
    mesh.position.set(cx, 0, cz);
    scene.add(mesh);
    const front = new Mesh(new PlaneGeometry(w * 0.78, 1.5), new MeshBasicMaterial({ color: DARK.clone() }));
    front.position.set(side * 4.97, 0.95, cz);
    front.rotation.y = (-side * Math.PI) / 2;
    scene.add(front);
    const sign = new Mesh(new PlaneGeometry(w * 0.5, 0.22), new MeshBasicMaterial({ color: DARK.clone() }));
    sign.position.set(side * 4.96, 2.0, cz);
    sign.rotation.y = front.rotation.y;
    scene.add(sign);
    const pool = new Mesh(new PlaneGeometry(3.6, w * 1.15), new MeshBasicMaterial({ map: glow, color: AMBER, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(side * 3.2, 0.06, cz);
    scene.add(pool);
    const b: Building = { mesh, side, cx, cz, w, d, h, facade, front, sign, pool, shop, base, lift: 0, hover: 0 };
    mesh.userData.b = b;
    blds.push(b);
    return b;
  }
  const span = narrow() ? 64 : 96;
  const specs: { side: number; cz: number; w: number; d: number; h: number; shop: number; base: number }[] = [];
  for (const side of [-1, 1]) {
    let z = -span;
    while (z < span) {
      const w = 3 + R() * 2.6;
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
  specs.filter((s) => !overlaps(s, YOU) && !overlaps(s, RIV)).forEach((s) => addBuilding(s.side, s.cz, s.w, s.d, s.h, s.shop, s.base));
  const you = addBuilding(1, 4, 4.4, 5, 3.4, 0, 0.04);
  const rival = addBuilding(-1, -6, 5, 5.6, 6.6, 1, 0.7);
  const meshes = blds.map((b) => b.mesh);

  // back city blocks
  const backN = narrow() ? 150 : 320;
  const bGeo = new BoxGeometry(1, 1, 1);
  bGeo.translate(0, 0.5, 0);
  const bTex = winTex(99);
  bTex.repeat.set(2, 3);
  const backMat = new MeshStandardMaterial({ color: raw(0x0b142b), roughness: 0.9, emissive: raw(0x9fb3ff), emissiveMap: bTex, emissiveIntensity: 0.2 });
  const back = new InstancedMesh(bGeo, backMat, backN);
  const m4 = new Matrix4();
  const q = new Quaternion();
  const sc = new Vector3();
  const ps = new Vector3();
  for (let n = 0; n < backN; n++) {
    const x = (R() < 0.5 ? -1 : 1) * (16 + R() * 70);
    const z = (R() * 2 - 1) * 110;
    ps.set(Math.round(x / 8) * 8, 0, Math.round(z / 8) * 8);
    sc.set(3 + R() * 5, 2 + Math.pow(R(), 2) * 16, 3 + R() * 5);
    m4.compose(ps, q, sc);
    back.setMatrixAt(n, m4);
  }
  scene.add(back);

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
        "uniform vec3 uColor; uniform float uI; uniform float uT; varying vec2 vUv; void main(){ float a = pow(1.0 - vUv.y, 2.4) * uI; a *= 0.72 + 0.28 * sin(uT * 3.0 - vUv.y * 22.0); gl_FragColor = vec4(uColor, a * 0.6); }",
    });
  const beamGeo = new CylinderGeometry(0.45, 1.05, 38, 32, 1, true);
  beamGeo.translate(0, 19, 0);
  const makePin = () => {
    const g = new Group();
    const mat = new MeshStandardMaterial({ color: raw(0x5b97ff), emissive: raw(0x5b97ff), emissiveIntensity: 0.9, roughness: 0.35 });
    const head = new Mesh(new SphereGeometry(0.7, 28, 18), mat);
    head.position.y = 1.5;
    const tip = new Mesh(new ConeGeometry(0.6, 1.4, 28), mat);
    tip.rotation.x = Math.PI;
    tip.position.y = 0.55;
    const halo = new Sprite(new SpriteMaterial({ map: glow, color: raw(0x5b97ff), transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false }));
    halo.scale.set(4, 4, 1);
    halo.position.y = 1.4;
    g.add(head, tip, halo);
    return g;
  };
  const rBeam = new Mesh(beamGeo, beamMat());
  rBeam.position.set(rival.cx, rival.h, rival.cz);
  scene.add(rBeam);
  const rPin = makePin();
  rPin.position.set(rival.cx, rival.h + 0.6, rival.cz);
  scene.add(rPin);
  const yBeam = new Mesh(beamGeo, beamMat());
  yBeam.position.set(you.cx, you.h, you.cz);
  scene.add(yBeam);
  const yPin = makePin();
  yPin.position.set(you.cx, you.h + 0.6, you.cz);
  yPin.scale.setScalar(0.001);
  scene.add(yPin);

  // diagnosis: scan lines on the visitor's building and a comparison arc to the rival
  const clip = new Plane(new Vector3(0, -1, 0), 0);
  const edges = new LineSegments(new EdgesGeometry(you.mesh.geometry), new LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0, clippingPlanes: [clip] }));
  you.mesh.add(edges);
  const ring = new LineSegments(new EdgesGeometry(new PlaneGeometry(you.d + 0.8, you.w + 0.8)), new LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0 }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(you.cx, 0, you.cz);
  scene.add(ring);
  const curve = new QuadraticBezierCurve3(new Vector3(you.cx, you.h + 0.2, you.cz), new Vector3(0, 14, -1), new Vector3(rival.cx, rival.h + 0.2, rival.cz));
  const arc = new Line(new BufferGeometry().setFromPoints(curve.getPoints(60)), new LineDashedMaterial({ color: SIGNAL, dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0 }));
  arc.computeLineDistances();
  scene.add(arc);

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
  const signs: AttemptSign[] = ATTEMPT_LABELS.map((text, i) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    drawLabel(c, text);
    const tex = new CanvasTexture(c);
    tex.anisotropy = 4;
    textures.push(tex);
    const mesh = new Mesh(new PlaneGeometry(3.6, 0.9), new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, color: SIGNDIM.clone() }));
    const u = (i % 2 ? 2.15 : -2.15) + ((i % 3) - 1) * 0.25;
    const v = 2.2 - Math.floor(i / 2) * 2.2;
    mesh.position.copy(cT).addScaledVector(fwd, -3.5 + (i % 3) * 0.6).addScaledVector(rgt, u).addScaledVector(upv, v);
    scene.add(mesh);
    return { mesh, canvas: c, tex, text, t0: -99 };
  });
  let disposed = false;
  document.fonts?.ready.then(() => {
    if (disposed) return;
    signs.forEach((s) => { drawLabel(s.canvas, s.text); s.tex.needsUpdate = true; });
  });

  // ---------- story: scroll → camera key ----------
  const secs = Array.from(root.querySelectorAll<HTMLElement>("[data-key]"));
  const track = root.querySelector<HTMLElement>("#rua-track");
  let marks: { s: number; e: number }[] = [];
  let methodP = 0;
  function measure() {
    const vh = window.innerHeight;
    marks = secs.map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const s = top - vh * 0.3;
      let e = top + el.offsetHeight - vh * 0.7;
      if (e < s) e = s;
      return { s, e };
    });
  }
  function stateAt(y: number) {
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
  }
  const keyAt = (i: number) => (i === METHOD ? methodKey(methodP) : cameraKeys[i] ?? DEFAULT_KEY);

  // ---------- input ----------
  const mouse = { x: 0, y: 0, sx: 0, sy: 0, ndc: new Vector2(), has: false };
  const drag = { on: false, yaw: 0, lx: 0 };
  let pulse = 0;
  const onMove = (e: PointerEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.ndc.set(mouse.x, -mouse.y);
    mouse.has = true;
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
    if (signs[i]) signs[i].t0 = performance.now() / 1000;
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
  let last = performance.now() / 1000;
  let frameN = 0;
  let hovered: Building | null = null;
  let youLabelOn: boolean | null = null;
  let raf = 0;

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

  function frame(ms: number) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const now = ms / 1000;
    const dt = Math.min(0.05, now - last);
    last = now;
    frameN++;

    if (track) {
      const r = track.getBoundingClientRect();
      methodP = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    }
    const st = stateAt(window.scrollY);
    const A = keyAt(st.i);
    const K = st.t > 0 && st.i < LAST ? mixKey(A, st.i + 1 === METHOD ? methodKey(0) : keyAt(st.i + 1), st.t) : A;
    const k = first ? 1 : 1 - Math.exp(-dt * 4.2);
    first = false;
    cur.pos = cur.pos.map((p, j) => lerp(p, K.pos[j], k)) as CameraKey["pos"];
    cur.tgt = cur.tgt.map((p, j) => lerp(p, K.tgt[j], k)) as CameraKey["tgt"];
    for (const key of ["shift", "shiftY", "city", "rival", "you", "beam", "scan", "grow", "veilS", "veilF", "tagR", "tagY", "signs"] as const) {
      cur[key] = lerp(cur[key], K[key], k);
    }
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

    // hover: passing the mouse over a storefront lights it
    if (fine && mouse.has && frameN % 2 === 0) {
      ray.setFromCamera(mouse.ndc, camera);
      const hit = ray.intersectObjects(meshes, false)[0];
      hovered = hit ? (hit.object.userData.b as Building) : null;
    }

    const city = cur.city;
    for (const b of blds) {
      b.hover = lerp(b.hover, b === hovered ? 1 : 0, 1 - Math.exp(-dt * 8));
      b.lift = b.hover * 0.35;
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
      b.front.material.color.copy(tmp.copy(DARK).lerp(AMBER, level));
      b.sign.material.color.copy(tmp.copy(DARK).lerp(AMBER, level * 0.75));
      b.pool.material.opacity = level * 0.6;
      b.mesh.position.y = b.lift;
      b.front.position.y = 0.95 + b.lift;
      b.sign.position.y = 2 + b.lift;
    }
    backMat.emissiveIntensity = 0.06 + city * 0.38;

    // the visitor's building: grows, gets scanned, then lights up with its own beam
    const gS = 1 + 0.7 * cur.grow;
    const yH = you.h * gS;
    you.mesh.scale.y = gS;
    clip.constant = cur.scan * yH + you.lift + 0.001;
    (edges.material as LineBasicMaterial).opacity = cur.scan > 0.002 ? 0.95 * (1 - cur.you * 0.7) : 0;
    const ringMat = ring.material as LineBasicMaterial;
    ringMat.opacity = lerp(ringMat.opacity, cur.scan > 0.01 && cur.scan < 0.99 ? 1 : 0, 0.2);
    ring.position.y = cur.scan * yH + you.lift;
    (arc.material as LineDashedMaterial).opacity = Math.sin(Math.PI * clamp(cur.scan)) * 0.9;
    const bt = cur.beam;
    const back1 = 1.70158;
    const eb = bt <= 0 ? 0 : 1 + (back1 + 1) * Math.pow(bt - 1, 3) + back1 * Math.pow(bt - 1, 2);
    yPin.scale.setScalar(Math.max(0.001, eb));
    yPin.position.y = yH + 0.6 + you.lift + Math.sin(now * 2) * 0.18;
    yPin.rotation.y = now * 0.8;
    yBeam.position.y = yH + you.lift;
    (yBeam.material as ShaderMaterial).uniforms.uI.value = bt;
    (yBeam.material as ShaderMaterial).uniforms.uT.value = now;
    (rBeam.material as ShaderMaterial).uniforms.uI.value = clamp(cur.rival * 0.85 + pulse * 0.6);
    (rBeam.material as ShaderMaterial).uniforms.uT.value = now;
    rPin.position.y = rival.h + 0.6 + rival.lift + Math.sin(now * 2 + 1) * 0.18;
    rPin.rotation.y = now * 0.8;
    rPin.scale.setScalar(1 + pulse * 0.35);

    // attempt signs: on for a moment, then they flicker out
    for (const s of signs) {
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
      s.mesh.visible = cur.signs > 0.01;
    }

    // veils and tags
    setOp(veilS, isN ? 0 : cur.veilS);
    setOp(veilF, isN ? Math.max(cur.veilS, cur.veilF) * 0.82 : cur.veilF);
    placeTag(tagRival, rival.cx, rival.h + 3.1, rival.cz, cur.tagR);
    const youOn = cur.beam > 0.5;
    if (youOn !== youLabelOn) {
      youLabelOn = youOn;
      tagYouTxt.textContent = youOn ? "Você · primeiro na busca" : "Você · invisível na busca";
      tagYou.dataset.on = String(youOn);
    }
    placeTag(tagYou, you.cx, yH + (youOn ? 3.1 : 1.2), you.cz, cur.tagY);

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    grabs.forEach((g) => g.removeEventListener("pointerdown", onDown));
    window.removeEventListener(PULSE_EVENT, onPulse);
    window.removeEventListener(ATTEMPT_EVENT, onAttempt);
    window.removeEventListener("resize", onResize);
    ro.disconnect();
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
