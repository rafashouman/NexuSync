// "O tráfego" (/marketing): your shop on a busy avenue. Cars pass by all the time; ads make some of them stop.
// 0 objetivo (a target ring marks the shop) · 1 direção (two ad boards light up: search and social)
// 2 campanha no ar (visitors leave the boards and walk to your door) · 3 acompanhamento (bars rise, shop open).
import {
  AdditiveBlending,
  BoxGeometry,
  CylinderGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  RingGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { createStage, lerp, raw, ROOFS, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const STREET_X = -6;
const SHOP = { x: 2, z: 0, d: 6, w: 8, h: 4.8 };
const FRONT = SHOP.x - SHOP.d / 2 - 0.04;
const BOARDS = [
  { z: 9, label: "BUSCA" }, // both on the +z side: the right of the frame, clear of the copy
  { z: 19, label: "REDES" },
];
const BOARD_X = STREET_X - 6;
const NCARS = 14;
const NV = 14; // visitors

type Key = { r: number; h: number; ang: number; tx: number; ty: number; tz: number };
const KEYS: Key[] = [
  { r: 36, h: 18, ang: 0.5, tx: -3, ty: 2, tz: 0 }, // hero: the avenue
  { r: 18, h: 9, ang: 0.35, tx: 0, ty: 2, tz: 0 }, // objetivo: your shop
  { r: 30, h: 13, ang: 0.18, tx: -6, ty: 4, tz: 9 }, // direção: both boards
  { r: 30, h: 20, ang: 0.3, tx: -4, ty: 1, tz: 6 }, // campanha: visitors arrive
  { r: 26, h: 12, ang: 0.5, tx: -1, ty: 3, tz: 0 }, // acompanhamento
];

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, glow, canvasTex } = ctx;

  // ---------- avenue and neighborhood ----------
  ctx.street(STREET_X);
  const lots: Lot[] = [];
  for (const side of [-1, 1]) {
    let z = -70;
    while (z < 70) {
      const w = 3.4 + R() * 2.8;
      const cz = z + w / 2;
      const d = 4 + R() * 3;
      const near = side === 1 ? Math.abs(cz) < SHOP.w / 2 + w / 2 + 0.6 : cz > -22 && cz < 24;
      if (!near) {
        const x = side === 1 ? STREET_X + 5.5 + d / 2 : STREET_X - 5 - d / 2;
        lots.push({ x, z: cz, w, d, h: 2.4 + Math.pow(R(), 1.5) * (side === 1 && Math.abs(cz) < 14 ? 3 : 9), tone: Math.floor(R() * TONES.length) });
      }
      z += w + 0.4 + R() * 0.5;
    }
  }
  for (let gx = 0; gx < 6; gx++)
    for (let gz = -8; gz <= 8; gz++) {
      if (R() > 0.6) continue;
      const side = R() < 0.5 ? -1 : 1;
      const x = side === 1 ? 12 + gx * 8 : STREET_X - 16 - gx * 8;
      if (side === -1 && gx < 3 && gz * 8 > -12 && gz * 8 < 30) continue;
      lots.push({ x, z: gz * 8, w: 3.6 + R() * 2.6, d: 3.6 + R() * 2.6, h: 2 + Math.pow(R(), 2) * 16, tone: Math.floor(R() * TONES.length) });
    }
  ctx.blocks(lots);
  const spots: [number, number][] = [];
  for (let z = -48; z <= 48; z += 12) {
    if (Math.abs(z) > SHOP.w / 2 + 1) spots.push([STREET_X + 3.7, z]);
    spots.push([STREET_X - 3.7, z + 6]);
  }
  ctx.lamps(spots);

  // ---------- your shop ----------
  const roof = new MeshLambertMaterial({ color: raw(ROOFS[1]) });
  const wall = new MeshLambertMaterial({ color: raw(TONES[0]) });
  const g = new BoxGeometry(SHOP.d, SHOP.h, SHOP.w);
  g.translate(0, SHOP.h / 2, 0);
  const shop = new Mesh(g, [wall, wall, roof, roof, wall, wall]);
  shop.position.set(SHOP.x, 0, SHOP.z);
  scene.add(shop);
  const frontTex = canvasTex(256, 64, (c) => {
    c.fillStyle = "#000";
    c.fillRect(0, 0, 256, 64);
    c.fillStyle = "#fff";
    c.fillRect(10, 14, 92, 44);
    c.fillRect(114, 10, 28, 54);
    c.fillRect(154, 14, 92, 44);
  });
  const frontMat = new MeshLambertMaterial({ color: raw(0x0a1120), emissive: AMBER.clone(), emissiveMap: frontTex, emissiveIntensity: 0.1 });
  const front = new Mesh(new PlaneGeometry(SHOP.w * 0.88, 2.2), frontMat);
  front.rotation.y = -Math.PI / 2;
  front.position.set(FRONT, 1.2, SHOP.z);
  scene.add(front);
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(4, SHOP.w * 1.2, 1);
  pool.position.set(FRONT - 1.7, 0.04, SHOP.z);
  scene.add(pool);

  // target rings on the ground (the objective)
  const ringMat = new MeshBasicMaterial({ color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const rings = [0, 1, 2].map((i) => {
    const ring = new Mesh(new RingGeometry(2.6 + i * 1.6, 2.75 + i * 1.6, 64), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(SHOP.x, 0.05, SHOP.z);
    scene.add(ring);
    return ring;
  });

  // ---------- two ad boards across the avenue ----------
  const boardMats = BOARDS.map((b) => {
    const tex = canvasTex(512, 256, (c) => {
      c.fillStyle = "#0d1630";
      c.fillRect(0, 0, 512, 256);
      c.fillStyle = "#ffb547";
      c.fillRect(0, 0, 512, 10);
      c.fillStyle = "#e8ecf6";
      c.font = `700 64px ${ctx.monoFamily}`;
      c.textBaseline = "middle";
      c.fillText(b.label, 36, 96);
      c.fillStyle = "rgba(232,236,246,0.45)";
      c.fillRect(36, 150, 300, 14);
      c.fillRect(36, 178, 220, 14);
      c.fillStyle = "#ffb547";
      c.fillRect(360, 160, 120, 52);
    });
    const mat = new MeshBasicMaterial({ map: tex, color: raw(0x2a3248) });
    const board = new Mesh(new PlaneGeometry(7, 3.5), mat);
    board.rotation.y = -Math.PI / 2; // faces the passers-by on this side of the avenue (−x)
    board.position.set(BOARD_X, 6, b.z);
    const back = new Mesh(new BoxGeometry(0.3, 3.8, 7.3), new MeshLambertMaterial({ color: raw(0x0b1120) }));
    back.position.set(BOARD_X + 0.2, 6, b.z);
    const pole = new Mesh(new CylinderGeometry(0.18, 0.22, 4.2, 8), new MeshLambertMaterial({ color: raw(0x1a2340) }));
    pole.position.set(BOARD_X + 0.2, 2.1, b.z);
    scene.add(board, back, pole);
    return mat;
  });

  // ---------- traffic: cars that never stop passing ----------
  const carGeo = new BoxGeometry(1.5, 0.9, 2.6);
  carGeo.translate(0, 0.65, 0);
  const cars = new InstancedMesh(carGeo, new MeshLambertMaterial({ color: 0xffffff }), NCARS);
  const carPal = [0xd9dde6, 0x5f86c9, 0x2a3858, 0xe26d5a, 0x8a96b0];
  const carData = Array.from({ length: NCARS }, (_, i) => ({ lane: i % 2 ? 1 : -1, offset: R() * 160, speed: 7 + R() * 5 }));
  carData.forEach((_, i) => cars.setColorAt(i, raw(carPal[i % carPal.length])));
  scene.add(cars);
  const headMat = new SpriteMaterial({ map: glow, color: raw(0xcfd9ff), transparent: true, opacity: 0.6, blending: AdditiveBlending, depthWrite: false });
  const heads = carData.map(() => {
    const s = new Sprite(headMat);
    s.scale.setScalar(1.4);
    scene.add(s);
    return s;
  });

  // ---------- visitors: from the boards to your door ----------
  const visMat = new SpriteMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false });
  const visitors = Array.from({ length: NV }, (_, i) => {
    const s = new Sprite(visMat);
    s.scale.setScalar(1.1);
    scene.add(s);
    const from = BOARDS[i % 2];
    return { s, from: new Vector3(BOARD_X - 0.5, 4.2, from.z), door: new Vector3(FRONT - 0.6, 0.6, SHOP.z + (R() - 0.5) * 4), delay: R() };
  });

  // report bars on the roof
  const bars = new InstancedMesh(new BoxGeometry(0.7, 1, 0.7), new MeshLambertMaterial({ color: raw(0xcfd9ff), emissive: raw(0x2a3a6a) }), 5);
  const barH = [1, 1.6, 1.3, 2.1, 2.6];
  scene.add(bars);

  const dummy = new Object3D();
  const v = new Vector3();
  const target = new Vector3();
  const DIMB = raw(0x2a3248);
  const LIT = raw(0xffffff);

  return {
    apply(P: number, now: number) {
      // traffic (static positions with reduced motion)
      const t = reduce ? 0 : now;
      carData.forEach((c, i) => {
        const z = (((c.offset + t * c.speed) % 160) + 160) % 160 - 80;
        const zz = c.lane > 0 ? z : -z;
        dummy.position.set(STREET_X + c.lane * 1.75, 0, zz);
        dummy.rotation.set(0, c.lane > 0 ? 0 : Math.PI, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        cars.setMatrixAt(i, dummy.matrix);
        heads[i].position.set(STREET_X + c.lane * 1.75, 0.8, zz + (c.lane > 0 ? 1.4 : -1.4));
      });
      cars.instanceMatrix.needsUpdate = true;

      // 01 objetivo: target rings pulse around the shop
      const aim = smooth(span(P, 0.1, 0.6)) * (1 - smooth(span(P, 1.6, 2.1)));
      ringMat.opacity = aim * (reduce ? 0.6 : 0.45 + 0.25 * Math.sin(now * 2.5));
      rings.forEach((r, i) => r.scale.setScalar(1 + (reduce ? 0 : Math.sin(now * 1.5 - i) * 0.04)));

      // 02 direção: the boards light up one after the other
      boardMats.forEach((m, i) => m.color.copy(DIMB).lerp(LIT, smooth(span(P, 1.1 + i * 0.25, 1.5 + i * 0.25))));

      // 03 campanha: visitors walk from the boards to your door, the storefront warms up
      const flow = span(P, 2.05, 2.95);
      visitors.forEach((vis) => {
        const k = smooth(span(flow, vis.delay * 0.5, vis.delay * 0.5 + 0.5));
        v.lerpVectors(vis.from, vis.door, k);
        v.y = lerp(vis.from.y, vis.door.y, k) + Math.sin(k * Math.PI) * 2.5;
        vis.s.position.copy(v);
        vis.s.visible = k > 0.01 && k < 0.99;
      });
      const live = smooth(span(P, 2.3, 3.0));
      frontMat.emissiveIntensity = 0.1 + live * 0.6;

      // 04 acompanhamento: bars rise, the shop is fully open
      const rep = span(P, 3.05, 3.6);
      for (let i = 0; i < 5; i++) {
        const h = Math.max(0.0001, barH[i] * smooth(span(rep, i * 0.1, 0.5 + i * 0.1)));
        dummy.position.set(SHOP.x, SHOP.h + h / 2, SHOP.z - 2 + i * 1);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        bars.setMatrixAt(i, dummy.matrix);
      }
      bars.instanceMatrix.needsUpdate = true;
      const open = smooth(span(P, 3.2, 3.8));
      frontMat.emissiveIntensity += open * 0.5;
      poolMat.opacity = Math.max(live * 0.25, open * 0.5);

      const i = Math.min(KEYS.length - 2, Math.floor(P));
      const tt = smooth(Math.min(1, P - i));
      const A = KEYS[i];
      const B = KEYS[i + 1];
      const ang = lerp(A.ang, B.ang, tt) + (reduce ? 0 : Math.sin(now * 0.18) * 0.03);
      const r = lerp(A.r, B.r, tt) * (narrow() ? 1.4 : 1);
      target.set(lerp(A.tx, B.tx, tt), lerp(A.ty, B.ty, tt), lerp(A.tz, B.tz, tt));
      camera.position.set(target.x - Math.cos(ang) * r, lerp(A.h, B.h, tt), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build, 71);
