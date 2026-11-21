// "A obra" (/criacao-de-sites): one building is built floor by floor through the five steps.
// 0 alicerce (blueprint + slab) · 1 fachada (floors drop in) · 2 vitrine (windows light up)
// 3 sinal (signal-blue beam and pin: being found) · 4 porta aberta (amber storefront and sign).
import {
  AdditiveBlending,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { createStage, land, lerp, raw, ROOFS, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const W = 6; // along the street (z)
const D = 6; // depth (x)
const SLAB = 0.45;
const FH = 1.7;
const FLOORS = 4;
const TOP = SLAB + FLOORS * FH;
const FRONT_X = -D / 2; // the facade faces the street (−x)
const STREET_X = FRONT_X - 5;

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, SIGNAL, glow, canvasTex } = ctx;

  // ---------- street and neighborhood ----------
  ctx.street(STREET_X);
  const lots: Lot[] = [];
  for (const side of [-1, 1]) {
    let z = -70;
    while (z < 70) {
      const w = 3.4 + R() * 2.8;
      const cz = z + w / 2;
      const d = 4 + R() * 3;
      const onLot = side === 1 && Math.abs(cz) < W / 2 + w / 2 + 0.6;
      // across the street, in front of the camera: an open square, so nothing hides the building
      const square = side === -1 && cz > -8 && cz < 20;
      if (!onLot && !square) {
        const x = side === 1 ? FRONT_X + d / 2 : STREET_X - 5 - d / 2;
        lots.push({ x, z: cz, w, d, h: 2.4 + Math.pow(R(), 1.5) * (side === 1 && Math.abs(cz) < 16 ? 1.2 : 10), tone: Math.floor(R() * TONES.length) });
      }
      z += w + 0.4 + R() * 0.5;
    }
  }
  for (let gx = 0; gx < 6; gx++)
    for (let gz = -8; gz <= 8; gz++) {
      if (R() > 0.62) continue;
      const side = R() < 0.5 ? -1 : 1;
      const x = side === 1 ? 10 + gx * 8 : STREET_X - 14 - gx * 8;
      if (side === -1 && gx < 3 && gz * 8 > -10 && gz * 8 < 34) continue; // keep the camera's line of sight clear
      lots.push({ x, z: gz * 8, w: 3.6 + R() * 2.6, d: 3.6 + R() * 2.6, h: 2 + Math.pow(R(), 2) * 16, tone: Math.floor(R() * TONES.length) });
    }
  ctx.blocks(lots);
  const spots: [number, number][] = [];
  for (let z = -48; z <= 48; z += 12) {
    if (Math.abs(z) >= 4) spots.push([FRONT_X - 1.3, z]);
    spots.push([STREET_X - 3.7, z + 6]);
  }
  ctx.lamps(spots);

  // ---------- textures ----------
  const ownWindows = canvasTex(128, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = "#fff";
    for (let x = 0; x < 4; x++) g.fillRect(x * 32 + 7, 16, 18, 30);
  }, true);
  ownWindows.repeat.set(W / 3, 1);
  const storefront = canvasTex(256, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 256, 64);
    g.fillStyle = "#fff";
    g.fillRect(10, 14, 92, 44);
    g.fillRect(114, 10, 28, 54);
    g.fillRect(154, 14, 92, 44);
  });
  const signTex = canvasTex(512, 96, (g) => {
    g.fillStyle = "rgba(255,255,255,0.08)";
    g.fillRect(0, 0, 512, 96);
    g.fillStyle = "#fff";
    g.font = `700 44px ${ctx.monoFamily}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("SEU NEGÓCIO", 256, 50);
  });
  const fade = canvasTex(4, 128, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, "rgba(255,255,255,0)");
    gr.addColorStop(1, "rgba(255,255,255,1)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 4, 128);
  });

  // ---------- 01 alicerce ----------
  const blue = new LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0 });
  const volume = new BoxGeometry(D, TOP, W);
  volume.translate(0, TOP / 2, 0);
  const blueprint = new LineSegments(new EdgesGeometry(volume), blue);
  volume.dispose();
  const planGrid = new GridHelper(W, 6, SIGNAL, SIGNAL);
  planGrid.material = blue;
  planGrid.position.y = 0.03;
  scene.add(blueprint, planGrid);
  const slab = new Mesh(new BoxGeometry(D + 0.4, SLAB, W + 0.4), new MeshLambertMaterial({ color: raw(0x1a2440) }));
  slab.geometry.translate(0, SLAB / 2, 0);
  scene.add(slab);

  // ---------- 02 fachada / 03 vitrine ----------
  const facade = new MeshLambertMaterial({ color: raw(TONES[0]), emissive: raw(0xffe2b8), emissiveMap: ownWindows, emissiveIntensity: 0 });
  const sideMat = new MeshLambertMaterial({ color: raw(TONES[0]), emissive: raw(0xffe2b8), emissiveMap: ownWindows, emissiveIntensity: 0 });
  const roof = new MeshLambertMaterial({ color: raw(ROOFS[1]) });
  const shopMat = new MeshLambertMaterial({ color: raw(0x0a1120), emissive: AMBER.clone(), emissiveMap: storefront, emissiveIntensity: 0 });
  const floors: Mesh[] = [];
  for (let i = 0; i < FLOORS; i++) {
    const g = new BoxGeometry(D, FH - 0.08, W);
    g.translate(0, (FH - 0.08) / 2, 0);
    const m = new Mesh(g, [sideMat, i === 0 ? shopMat : facade, roof, roof, sideMat, sideMat]);
    floors.push(m);
    scene.add(m);
  }
  const signMat = new MeshBasicMaterial({ map: signTex, color: raw(0x3a4866), transparent: true, opacity: 0, depthWrite: false });
  const sign = new Mesh(new PlaneGeometry(4.6, 0.86), signMat);
  sign.rotation.y = -Math.PI / 2;
  sign.position.set(FRONT_X - 0.05, TOP + 0.62, 0);
  scene.add(sign);

  // ---------- 04 sinal (signal blue) ----------
  const beamMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    uniforms: { uColor: { value: SIGNAL.clone() }, uI: { value: 0 }, uT: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader:
      "uniform vec3 uColor; uniform float uI; uniform float uT; varying vec2 vUv; void main(){ float a = pow(1.0 - vUv.y, 3.0) * uI; a *= 0.72 + 0.28 * sin(uT * 3.0 - vUv.y * 22.0); gl_FragColor = vec4(uColor, a * 0.5); }",
  });
  const beamGeo = new CylinderGeometry(0.22, 0.7, 18, 24, 1, true);
  beamGeo.translate(0, 9, 0);
  const beam = new Mesh(beamGeo, beamMat);
  beam.position.set(0, TOP, 0);
  scene.add(beam);
  const pinMat = new MeshLambertMaterial({ color: SIGNAL.clone(), emissive: SIGNAL.clone(), emissiveIntensity: 0.9, transparent: true, opacity: 0 });
  const pin = new Group();
  const head = new Mesh(new SphereGeometry(0.7, 24, 16), pinMat);
  head.position.y = 1.4;
  const tip = new Mesh(new ConeGeometry(0.6, 1.4, 24), pinMat);
  tip.rotation.x = Math.PI;
  tip.position.y = 0.55;
  const halo = new Sprite(new SpriteMaterial({ map: glow, color: SIGNAL.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(2.6);
  halo.position.y = 1.4;
  pin.add(head, tip, halo);
  pin.scale.setScalar(0.62);
  scene.add(pin);

  // ---------- 05 porta aberta (amber) ----------
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(4.2, W * 1.2, 1);
  pool.position.set(FRONT_X - 1.6, 0.04, 0);
  const shineMat = new MeshBasicMaterial({ map: fade, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
  const shine = new Mesh(new PlaneGeometry(1, 1), shineMat);
  shine.rotation.y = -Math.PI / 2;
  shine.scale.set(W * 0.9, 2.2, 1);
  shine.position.set(FRONT_X - 0.06, 1.1, 0);
  scene.add(pool, shine);

  const DIM = raw(0x3a4866);
  const target = new Vector3();

  return {
    apply(P: number, now: number) {
      const a = span(P, 0, 1);
      blue.opacity = (0.25 + 0.6 * smooth(Math.min(1, a * 3))) * (1 - span(P, 1.6, 2.6));
      blueprint.visible = planGrid.visible = blue.opacity > 0.01;
      const sl = smooth(span(P, 0.3, 0.9));
      slab.visible = sl > 0.001;
      slab.scale.y = Math.max(0.001, sl);
      floors.forEach((f, i) => {
        const t = span(P, 1 + i * 0.22, 1.34 + i * 0.22);
        f.visible = t > 0;
        f.position.y = SLAB + i * FH + (1 - land(t)) * 7;
      });
      const lit = smooth(span(P, 2.05, 2.8));
      facade.emissiveIntensity = lit * 0.95;
      sideMat.emissiveIntensity = lit * 0.55;
      signMat.opacity = smooth(span(P, 1.8, 2.3));
      const found = smooth(span(P, 3.05, 3.8));
      beam.visible = found > 0.001;
      beam.scale.y = Math.max(0.001, found);
      beamMat.uniforms.uI.value = found;
      beamMat.uniforms.uT.value = reduce ? 0 : now;
      pinMat.opacity = found;
      halo.material.opacity = found * 0.7;
      pin.position.set(0, TOP + 1.4 + (1 - found) * 3 + (reduce ? 0 : Math.sin(now * 1.6) * 0.18), 0);
      const open = smooth(span(P, 4.05, 4.8));
      shopMat.emissiveIntensity = 0.12 * lit + open * 1.1;
      signMat.color.copy(DIM).lerp(AMBER, open);
      poolMat.opacity = open * 0.55;
      shineMat.opacity = open * 0.32;

      // camera: slow orbit from the street corner to the front door
      const k = P / 5;
      const ang = lerp(0.52, 0.3, smooth(k)) + (reduce ? 0 : Math.sin(now * 0.18) * 0.035);
      const r = lerp(31, 24, smooth(k)) * (narrow() ? 1.3 : 1);
      target.set(-0.6, lerp(2.6, 5.2, k), 0);
      camera.position.set(target.x - Math.cos(ang) * r, lerp(17, 9, smooth(k)), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build);
