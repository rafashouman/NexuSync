// "O perfil" (/redes-sociais): your building's facade becomes your profile; across the street live the people who
// already know you. 0 briefing (the profile appears) · 1 calendário (eight days are planned)
// 2 publicações e stories (posts fill in and fly across; neighbors' windows light up) · 3 relatório (bars rise, shop open).
// Warm white for the audience, amber only for your business, no reach is promised.
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  DoubleSide,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { createStage, lerp, raw, ROOFS, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const STREET_X = -9;
const B = { x: 3, z: 0, d: 6, w: 11, h: 9.5 };
const FACE = B.x - B.d / 2 - 0.04; // facade plane x (faces −x)
const PW = 8.4; // profile panel
const PH = 6.4;
const PY = 5.6;
const AUD_X = STREET_X - 6.5; // audience row across the street, windows face +x
// only on the far side (−z), so the camera (on the +z side) always sees your facade
const AUD = [{ z: -22, w: 5, h: 7.5 }, { z: -15.5, w: 5, h: 7 }, { z: -9, w: 5.4, h: 9 }, { z: -2.5, w: 5, h: 6 }];

type Key = { r: number; h: number; ang: number; tx: number; ty: number; tz: number };
const KEYS: Key[] = [
  { r: 30, h: 13, ang: 0.62, tx: -1, ty: 5, tz: 0 }, // hero
  { r: 20, h: 8, ang: 0.52, tx: 0, ty: 5.6, tz: 0 }, // briefing
  { r: 19, h: 8, ang: 0.56, tx: 0, ty: 5.6, tz: 0 }, // calendário
  { r: 27, h: 17, ang: 1.12, tx: -6, ty: 3, tz: -6 }, // publicações: both sides of the street
  { r: 30, h: 12, ang: 0.72, tx: -2, ty: 5, tz: -2 }, // relatório
];

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, glow, canvasTex } = ctx;

  // ---------- street and neighborhood (the audience row is built by hand below) ----------
  ctx.street(STREET_X);
  const lots: Lot[] = [];
  for (const side of [-1, 1]) {
    let z = -70;
    while (z < 70) {
      const w = 3.4 + R() * 2.8;
      const cz = z + w / 2;
      const d = 4 + R() * 3;
      const busy = side === 1 ? Math.abs(cz) < B.w / 2 + w / 2 + 0.6 : cz > -26 && cz < 22;
      if (!busy) {
        const x = side === 1 ? STREET_X + 5.5 + d / 2 : STREET_X - 5 - d / 2;
        lots.push({ x, z: cz, w, d, h: 2.4 + Math.pow(R(), 1.5) * 9, tone: Math.floor(R() * TONES.length) });
      }
      z += w + 0.4 + R() * 0.5;
    }
  }
  for (let gx = 0; gx < 6; gx++)
    for (let gz = -8; gz <= 8; gz++) {
      if (R() > 0.6) continue;
      const side = R() < 0.5 ? -1 : 1;
      const x = side === 1 ? 13 + gx * 8 : STREET_X - 18 - gx * 8;
      lots.push({ x, z: gz * 8, w: 3.6 + R() * 2.6, d: 3.6 + R() * 2.6, h: 2 + Math.pow(R(), 2) * 16, tone: Math.floor(R() * TONES.length) });
    }
  ctx.blocks(lots);
  const spots: [number, number][] = [];
  for (let z = -48; z <= 48; z += 12) {
    if (Math.abs(z) > B.w / 2 + 1) spots.push([STREET_X + 3.7, z]);
    spots.push([STREET_X - 3.7, z + 6]);
  }
  ctx.lamps(spots);

  // ---------- your building with the profile on its facade ----------
  const roof = new MeshLambertMaterial({ color: raw(ROOFS[1]) });
  const wall = new MeshLambertMaterial({ color: raw(TONES[0]) });
  const bGeo = new BoxGeometry(B.d, B.h, B.w);
  bGeo.translate(0, B.h / 2, 0);
  const building = new Mesh(bGeo, [wall, wall, roof, roof, wall, wall]);
  building.position.set(B.x, 0, B.z);
  scene.add(building);

  const profileTex = canvasTex(512, 390, (g) => {
    g.fillStyle = "#0d1630";
    g.fillRect(0, 0, 512, 390);
    g.fillStyle = "#1c2a4e";
    g.beginPath();
    g.arc(62, 62, 38, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#ffb547";
    g.lineWidth = 5;
    g.stroke();
    g.fillStyle = "#cfd9ff";
    g.font = `700 30px ${ctx.monoFamily}`;
    g.textBaseline = "middle";
    g.fillText("@seunegocio", 120, 46);
    g.fillStyle = "rgba(207,217,255,0.45)";
    g.fillRect(120, 72, 230, 10);
    g.fillRect(120, 92, 170, 10);
  });
  const panelMat = new MeshBasicMaterial({ map: profileTex, transparent: true, opacity: 0 });
  const panel = new Mesh(new PlaneGeometry(PW, PH), panelMat);
  panel.rotation.y = -Math.PI / 2;
  panel.position.set(FACE, PY, 0);
  scene.add(panel);

  // calendar / feed tiles: 8 posts (2 carousels), stories rings above them
  const NT = 8;
  const tiles = new InstancedMesh(new BoxGeometry(0.08, 1, 1), new MeshLambertMaterial({ color: 0xffffff, emissive: raw(0x1a1a22) }), NT);
  scene.add(tiles);
  const POST = [0xe26d5a, 0x2fb5a6, 0xd9c08a, 0x8fe3ff, 0x5f86c9, 0xe8e2d4, 0x2fb5a6, 0xe26d5a];
  const carousel = (i: number) => i === 2 || i === 5;
  const slot = (i: number) => new Vector3(FACE - 0.08, PY - 0.55 - Math.floor(i / 4) * 1.75, -PW / 2 + 1.15 + (i % 4) * 2.05);
  const rings = new InstancedMesh(new TorusGeometry(0.42, 0.07, 10, 32), new MeshBasicMaterial({ color: AMBER.clone(), transparent: true, opacity: 0 }), 4);
  scene.add(rings);

  // report bars next to the profile
  const bars = new InstancedMesh(new BoxGeometry(0.6, 1, 0.6), new MeshLambertMaterial({ color: raw(0xcfd9ff), emissive: raw(0x2a3a6a) }), 4);
  const barH = [1.1, 1.7, 1.4, 2.3];
  scene.add(bars);

  // shop at street level (amber when everything is running)
  const shopMat = new MeshLambertMaterial({ color: raw(0x0a1120), emissive: AMBER.clone(), emissiveIntensity: 0 });
  const shop = new Mesh(new PlaneGeometry(B.w * 0.8, 1.6), shopMat);
  shop.rotation.y = -Math.PI / 2;
  shop.position.set(FACE, 1, 0);
  scene.add(shop);
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(4, B.w, 1);
  pool.position.set(FACE - 2, 0.04, 0);
  scene.add(pool);

  // ---------- the audience across the street: windows that light up warm ----------
  const audLots: Lot[] = AUD.map((a) => ({ x: AUD_X, z: a.z, w: a.w, d: 5, h: a.h, tone: Math.floor(R() * TONES.length) }));
  ctx.blocks(audLots);
  const winSpots: Vector3[] = [];
  AUD.forEach((a) => {
    for (let y = 1.6; y < a.h - 0.8; y += 1.5)
      for (let k = -1; k <= 1; k++) if (R() < 0.7) winSpots.push(new Vector3(AUD_X + 2.53, y, a.z + k * (a.w / 3.2)));
  });
  const winMat = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide });
  const wins = new InstancedMesh(new PlaneGeometry(0.7, 0.9), winMat, winSpots.length);
  scene.add(wins);
  const order = winSpots.map((_, i) => i).sort(() => R() - 0.5);
  const lightAt = new Float32Array(winSpots.length);
  order.forEach((idx, k) => { lightAt[idx] = k / winSpots.length; });

  // posts flying across the street
  const NF = 12;
  const flyers = new InstancedMesh(new PlaneGeometry(0.7, 0.7), new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide, transparent: true, opacity: 0.95 }), NF);
  scene.add(flyers);
  const flyTo = Array.from({ length: NF }, (_, i) => winSpots[order[Math.floor((i / NF) * winSpots.length)]]);

  const dummy = new Object3D();
  const v = new Vector3();
  const col = new Color();
  const DARKWIN = raw(0x0b1224);
  const WARM = raw(0xffe2b8);
  const target = new Vector3();

  return {
    apply(P: number, now: number) {
      // 01 briefing: the profile appears on the facade
      panelMat.opacity = smooth(span(P, 0.1, 0.7));

      // 02 calendário: eight day tiles appear (carousels wider); 03: they fill with color
      const plan = span(P, 1.05, 1.75);
      const fill = span(P, 2.0, 2.5);
      for (let i = 0; i < NT; i++) {
        const t = smooth(span(plan, i * 0.08, 0.4 + i * 0.08));
        const f = smooth(span(fill, i * 0.08, 0.3 + i * 0.08));
        v.copy(slot(i));
        dummy.position.copy(v);
        dummy.position.x -= (1 - t) * 1.5;
        dummy.rotation.set(0, 0, 0);
        const slide = carousel(i) && f > 0 && !reduce ? Math.sin(now * 1.5 + i) * 0.06 : 0;
        dummy.position.z += slide;
        dummy.scale.set(1, Math.max(0.0001, 1.45 * t), Math.max(0.0001, (carousel(i) ? 1.9 : 1.6) * t));
        dummy.updateMatrix();
        tiles.setMatrixAt(i, dummy.matrix);
        col.copy(raw(0x1c2a4e)).lerp(raw(POST[i]), f);
        tiles.setColorAt(i, col);
      }
      tiles.instanceMatrix.needsUpdate = true;
      tiles.instanceColor!.needsUpdate = true;

      // stories rings
      const st = smooth(span(P, 2.2, 2.5));
      (rings.material as MeshBasicMaterial).opacity = st;
      for (let i = 0; i < 4; i++) {
        dummy.position.set(FACE - 0.1, PY + 1.95, -1.2 + i * 1.15);
        dummy.rotation.set(0, Math.PI / 2, reduce ? 0 : now * 0.8 + i);
        dummy.scale.setScalar(st > 0 ? 1 + (reduce ? 0 : Math.sin(now * 2 + i) * 0.05) : 0.0001);
        dummy.updateMatrix();
        rings.setMatrixAt(i, dummy.matrix);
      }
      rings.instanceMatrix.needsUpdate = true;

      // posts fly across; the audience's windows light up warm as they arrive
      const fly = span(P, 2.3, 3.0);
      for (let i = 0; i < NF; i++) {
        const t = smooth(span(fly, i * 0.04, 0.45 + i * 0.04));
        v.copy(slot(i % NT));
        dummy.position.lerpVectors(v, flyTo[i], t);
        dummy.position.y += Math.sin(t * Math.PI) * 4;
        dummy.rotation.set(t * 3 + i, Math.PI / 2 + t * 2, 0);
        dummy.scale.setScalar(t > 0.02 && t < 0.98 ? 1 : 0.0001);
        dummy.updateMatrix();
        flyers.setMatrixAt(i, dummy.matrix);
        flyers.setColorAt(i, raw(POST[i % NT]));
      }
      flyers.instanceMatrix.needsUpdate = true;
      flyers.instanceColor!.needsUpdate = true;
      const seen = span(P, 2.45, 3.2);
      for (let i = 0; i < winSpots.length; i++) {
        const on = smooth(span(seen, lightAt[i] * 0.85, lightAt[i] * 0.85 + 0.15));
        dummy.position.copy(winSpots[i]);
        dummy.rotation.set(0, Math.PI / 2, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        wins.setMatrixAt(i, dummy.matrix);
        wins.setColorAt(i, col.copy(DARKWIN).lerp(WARM, on));
      }
      wins.instanceMatrix.needsUpdate = true;
      wins.instanceColor!.needsUpdate = true;

      // 04 relatório: bars rise, the shop opens
      const rep = span(P, 3.05, 3.6);
      for (let i = 0; i < 4; i++) {
        const h = Math.max(0.0001, barH[i] * smooth(span(rep, i * 0.12, 0.5 + i * 0.12)));
        dummy.position.set(FACE - 0.6, PY + PH / 2 + 0.25 + h / 2, -1.5 + i * 1);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        bars.setMatrixAt(i, dummy.matrix);
      }
      bars.instanceMatrix.needsUpdate = true;
      const open = smooth(span(P, 3.2, 3.8));
      shopMat.emissiveIntensity = open * 1.05;
      poolMat.opacity = open * 0.5;

      const i = Math.min(KEYS.length - 2, Math.floor(P));
      const tt = smooth(Math.min(1, P - i));
      const A = KEYS[i];
      const Bk = KEYS[i + 1];
      const ang = lerp(A.ang, Bk.ang, tt) + (reduce ? 0 : Math.sin(now * 0.18) * 0.03);
      const r = lerp(A.r, Bk.r, tt) * (narrow() ? 1.45 : 1);
      target.set(lerp(A.tx, Bk.tx, tt), lerp(A.ty, Bk.ty, tt), lerp(A.tz, Bk.tz, tt));
      camera.position.set(target.x - Math.cos(ang) * r, lerp(A.h, Bk.h, tt), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build, 61);
