// "A rotina" (/apps): loose notes float around a business; a giant phone in the plaza organizes them.
// 0 agenda (notes snap into a calendar, booked slots light up) · 1 painel (they become kanban columns, bars rise)
// 2 campanha (a coupon wheel spins and sends amber coupons to the street) · 3 equipe (full agenda, shop open in amber).
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  Vector3,
} from "three";
import { createStage, lerp, raw, ROOFS, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const B = { x: 3, z: 5, w: 6, d: 6, h: 6.2 }; // the business building
const STREET_X = -9;
const PH = { x: -2.2, z: -4.5, w: 6.4, h: 11.6 }; // the phone, facing the street (−x)
const SX = PH.x - 0.32; // screen plane
const N = 24;

type Key = { r: number; h: number; ang: number; tx: number; ty: number; tz: number };
const KEYS: Key[] = [
  { r: 34, h: 15, ang: 0.42, tx: -1, ty: 4.5, tz: 0 }, // hero: notes everywhere
  { r: 25, h: 7.5, ang: 0.12, tx: -2, ty: 6.2, tz: -4 }, // agenda
  { r: 24, h: 7.5, ang: 0.2, tx: -2, ty: 6, tz: -4 }, // painel
  { r: 25, h: 8, ang: 0.32, tx: -4, ty: 5, tz: -3 }, // campanha
  { r: 32, h: 13, ang: 0.42, tx: -1, ty: 4.5, tz: 0 }, // equipe
];

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, glow, canvasTex } = ctx;

  // ---------- street, plaza and neighborhood ----------
  ctx.street(STREET_X);
  const lots: Lot[] = [];
  for (const side of [-1, 1]) {
    let z = -70;
    while (z < 70) {
      const w = 3.4 + R() * 2.8;
      const cz = z + w / 2;
      const d = 4 + R() * 3;
      const near = side === 1 && cz > -12 && cz < 12;
      const square = side === -1 && cz > -16 && cz < 18;
      if (!near && !square) {
        const x = side === 1 ? STREET_X + 5.5 + d / 2 : STREET_X - 5 - d / 2;
        lots.push({ x, z: cz, w, d, h: 2.4 + Math.pow(R(), 1.5) * 10, tone: Math.floor(R() * TONES.length) });
      }
      z += w + 0.4 + R() * 0.5;
    }
  }
  for (let gx = 0; gx < 6; gx++)
    for (let gz = -8; gz <= 8; gz++) {
      if (R() > 0.6) continue;
      const side = R() < 0.5 ? -1 : 1;
      const x = side === 1 ? 14 + gx * 8 : STREET_X - 14 - gx * 8;
      if (side === -1 && gx < 3 && gz * 8 > -18 && gz * 8 < 30) continue;
      lots.push({ x, z: gz * 8, w: 3.6 + R() * 2.6, d: 3.6 + R() * 2.6, h: 2 + Math.pow(R(), 2) * 16, tone: Math.floor(R() * TONES.length) });
    }
  ctx.blocks(lots);
  const spots: [number, number][] = [];
  for (let z = -48; z <= 48; z += 12) {
    if (z < -12 || z > 12) spots.push([STREET_X + 3.7, z]);
    spots.push([STREET_X - 3.7, z + 6]);
  }
  ctx.lamps(spots);
  const plaza = new Mesh(new PlaneGeometry(10, 24), new MeshLambertMaterial({ color: raw(0x10182c) }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(-0.6, 0.012, 0);
  scene.add(plaza);

  // ---------- the business (lights up amber when the team runs everything) ----------
  const win = canvasTex(128, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = "#fff";
    for (let x = 0; x < 4; x++) g.fillRect(x * 32 + 7, 14, 18, 30);
  }, true);
  win.repeat.set(2, 3);
  const facade = new MeshLambertMaterial({ color: raw(TONES[0]), emissive: raw(0xffe2b8), emissiveMap: win, emissiveIntensity: 0.25 });
  const shopTex = canvasTex(256, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 256, 64);
    g.fillStyle = "#fff";
    g.fillRect(10, 14, 92, 44);
    g.fillRect(114, 10, 28, 54);
    g.fillRect(154, 14, 92, 44);
  });
  const shop = new MeshLambertMaterial({ color: raw(0x0a1120), emissive: AMBER.clone(), emissiveMap: shopTex, emissiveIntensity: 0.08 });
  const roof = new MeshLambertMaterial({ color: raw(ROOFS[1]) });
  const bGeo = new BoxGeometry(B.d, B.h, B.w);
  bGeo.translate(0, B.h / 2, 0);
  const building = new Mesh(bGeo, [facade, facade, roof, roof, facade, facade]);
  building.position.set(B.x, 0, B.z);
  scene.add(building);
  const front = new Mesh(new PlaneGeometry(B.w * 0.9, 1.9), shop);
  front.rotation.y = -Math.PI / 2;
  front.position.set(B.x - B.d / 2 - 0.03, 1.05, B.z);
  scene.add(front);
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(4, B.w * 1.2, 1);
  pool.position.set(B.x - B.d / 2 - 1.8, 0.04, B.z);
  scene.add(pool);

  // ---------- the phone: body, screen and a soft glow on the plaza ----------
  const body = new Mesh(new BoxGeometry(0.5, PH.h, PH.w), new MeshLambertMaterial({ color: raw(0x0b1120) }));
  body.position.set(PH.x, PH.h / 2 + 0.2, PH.z);
  scene.add(body);
  const screenTex = canvasTex(256, 464, (g) => {
    g.fillStyle = "#0d1630";
    g.fillRect(0, 0, 256, 464);
    g.fillStyle = "rgba(150,176,255,0.10)";
    for (let y = 60; y < 464; y += 38) g.fillRect(14, y, 228, 1);
    g.fillStyle = "#1c2a4e";
    g.fillRect(0, 0, 256, 44);
    g.fillStyle = "#cfd9ff";
    g.font = `700 18px ${ctx.monoFamily}`;
    g.textBaseline = "middle";
    g.fillText("SUA ROTINA", 16, 23);
    g.fillStyle = "#ffb547";
    g.beginPath();
    g.arc(232, 22, 6, 0, Math.PI * 2);
    g.fill();
  });
  const screenMat = new MeshBasicMaterial({ map: screenTex, color: new Color(0.35, 0.35, 0.35) });
  const screen = new Mesh(new PlaneGeometry(PH.w - 0.5, PH.h - 0.8), screenMat);
  screen.rotation.y = -Math.PI / 2;
  screen.position.set(PH.x - 0.26, PH.h / 2 + 0.2, PH.z);
  scene.add(screen);
  const halo = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: glow, color: raw(0x5c6fa8), transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }));
  halo.rotation.x = -Math.PI / 2;
  halo.scale.set(6, 10, 1);
  halo.position.set(PH.x - 2.4, 0.03, PH.z);
  scene.add(halo);

  // ---------- notes / slots / tasks: one instanced draw, four layouts ----------
  const cardGeo = new BoxGeometry(0.06, 1, 1);
  const cardMat = new MeshLambertMaterial({ color: 0xffffff, emissive: raw(0x1a1a22), emissiveIntensity: 1 });
  const cards = new InstancedMesh(cardGeo, cardMat, N);
  scene.add(cards);
  type Pose = { p: Vector3; s: [number, number]; rx: number; ry: number };
  const chaos: Pose[] = [];
  const calendar: Pose[] = [];
  const kanban: Pose[] = [];
  for (let i = 0; i < N; i++) {
    chaos.push({ p: new Vector3(-7 + R() * 12, 2 + R() * 8, -12 + R() * 22), s: [0.7 + R() * 0.4, 0.9 + R() * 0.5], rx: (R() - 0.5) * 1.4, ry: (R() - 0.5) * 1.6 });
    const c = i % 4;
    const row = Math.floor(i / 4);
    calendar.push({ p: new Vector3(SX, 9.8 - row * 1.18, PH.z - 2.1 + c * 1.4), s: [0.95, 1.22], rx: 0, ry: 0 });
    const col = i % 3;
    const k = Math.floor(i / 3);
    kanban.push({ p: new Vector3(SX, 10 - k * 0.62, PH.z - 1.9 + col * 1.9), s: [0.5, 1.7], rx: 0, ry: 0 });
  }
  const DIM = raw(0x3a4866);
  const SLOT = raw(0x1c2a4e);
  const WARM = raw(0xffe2b8);
  const COLS = [raw(0x8fe3ff), raw(0xd9c08a), raw(0x2fb5a6)];
  const booked = (i: number) => i % 3 !== 0;

  // bars of the dashboard (step 2)
  const bars = new InstancedMesh(new BoxGeometry(0.06, 1, 0.7), new MeshLambertMaterial({ color: raw(0x5b97ff), emissive: raw(0x1d3a7a) }), 6);
  const barH = [1.4, 2.4, 1.8, 3.1, 2.6, 3.6];
  scene.add(bars);

  // coupon wheel (step 3): 8 slices, one amber
  const wheelTex = canvasTex(256, 256, (g) => {
    const cols = ["#1c2a4e", "#2fb5a6", "#1c2a4e", "#d9c08a", "#1c2a4e", "#ffb547", "#1c2a4e", "#8fe3ff"];
    for (let i = 0; i < 8; i++) {
      g.fillStyle = cols[i];
      g.beginPath();
      g.moveTo(128, 128);
      g.arc(128, 128, 126, (i * Math.PI) / 4, ((i + 1) * Math.PI) / 4);
      g.fill();
    }
    g.fillStyle = "#0d1630";
    g.beginPath();
    g.arc(128, 128, 22, 0, Math.PI * 2);
    g.fill();
  });
  const wheelMat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const wheelFace = new MeshBasicMaterial({ map: wheelTex, transparent: true, opacity: 0 });
  const wheel = new Mesh(new CylinderGeometry(2.4, 2.4, 0.12, 48), [wheelMat, wheelFace, wheelFace]);
  wheel.rotation.z = Math.PI / 2; // face the street
  wheel.position.set(SX - 0.2, 6.6, PH.z);
  scene.add(wheel);

  // coupons flying to the street (amber = the offer reaching people)
  const NC = 10;
  const coupons = new InstancedMesh(new PlaneGeometry(0.9, 0.5), new MeshBasicMaterial({ color: AMBER.clone(), transparent: true, opacity: 0.9, side: DoubleSide }), NC);
  const couponTo = Array.from({ length: NC }, () => new Vector3(STREET_X + (R() - 0.5) * 6, 0.3 + R() * 1.2, PH.z - 10 + R() * 22));
  scene.add(coupons);

  const dummy = new Object3D();
  const a = new Vector3();
  const b = new Vector3();
  const col = new Color();
  const target = new Vector3();

  return {
    apply(P: number, now: number) {
      // phone screen wakes up with the first step
      const on = smooth(span(P, 0.05, 0.6));
      screenMat.color.setScalar(0.35 + on * 0.65);

      // card layouts: chaos → calendar (0..1) → kanban (1..2) → into the screen (2..2.4) → full calendar (3..4)
      const toCal = smooth(span(P, 0.1, 0.9));
      const toKan = smooth(span(P, 1.1, 1.7));
      const hide = smooth(span(P, 2.0, 2.35)) * (1 - smooth(span(P, 3.05, 3.5)));
      const full = smooth(span(P, 3.05, 3.6));
      for (let i = 0; i < N; i++) {
        const c0 = chaos[i];
        const stagger = Math.min(1, Math.max(0, toCal * 1.6 - (i / N) * 0.6));
        const sway = reduce ? 0 : Math.sin(now * 0.7 + i) * 0.25 * (1 - stagger);
        a.copy(c0.p).lerp(calendar[i].p, stagger);
        a.y += sway;
        b.copy(a).lerp(kanban[i].p, toKan);
        b.x += hide * 0.4;
        dummy.position.copy(b);
        dummy.rotation.set(c0.rx * (1 - stagger), c0.ry * (1 - stagger), 0);
        const sh = lerp(lerp(c0.s[0], calendar[i].s[0], stagger), kanban[i].s[0], toKan);
        const sw = lerp(lerp(c0.s[1], calendar[i].s[1], stagger), kanban[i].s[1], toKan);
        const k = Math.max(0.0001, 1 - hide);
        dummy.scale.set(1, sh * k, sw * k);
        dummy.updateMatrix();
        cards.setMatrixAt(i, dummy.matrix);
        // colors: dim notes → slots (booked ones warm) → kanban columns → all booked
        const bookedNow = booked(i) && span(P, 0.5 + (i / N) * 0.4, 0.6 + (i / N) * 0.4) > 0.5;
        col.copy(DIM).lerp(bookedNow ? WARM : SLOT, stagger);
        col.lerp(COLS[i % 3], toKan);
        col.lerp(WARM, full);
        cards.setColorAt(i, col);
      }
      cards.instanceMatrix.needsUpdate = true;
      cards.instanceColor!.needsUpdate = true;

      // dashboard bars rise under the kanban
      const rise = smooth(span(P, 1.4, 1.9)) * (1 - hide);
      for (let i = 0; i < 6; i++) {
        const h = Math.max(0.0001, barH[i] * span(rise, i * 0.08, 0.6 + i * 0.08));
        dummy.position.set(SX, 1.0 + h / 2, PH.z - 2.2 + i * 0.88);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        bars.setMatrixAt(i, dummy.matrix);
      }
      bars.instanceMatrix.needsUpdate = true;

      // coupon wheel spins, then coupons fly to the street
      const wheelIn = smooth(span(P, 2.15, 2.5)) * (1 - smooth(span(P, 3.0, 3.3)));
      wheelMat.opacity = wheelIn;
      wheelFace.opacity = wheelIn;
      wheel.visible = wheelIn > 0.01;
      wheel.rotation.x = reduce ? 0.4 : span(P, 2.2, 2.75) * Math.PI * 6 + now * 0.4 * wheelIn;
      const fly = span(P, 2.6, 3.0);
      for (let i = 0; i < NC; i++) {
        const t = smooth(span(fly, i * 0.05, 0.55 + i * 0.05));
        a.set(SX - 0.4, 6.6, PH.z);
        dummy.position.lerpVectors(a, couponTo[i], t);
        dummy.position.y += Math.sin(t * Math.PI) * 3;
        dummy.rotation.set(t * 4 + i, t * 3, 0);
        dummy.scale.setScalar(t > 0 && t < 1 ? 1 : t >= 1 ? 0.8 : 0.0001);
        if (P > 3.4) dummy.scale.setScalar(0.0001);
        dummy.updateMatrix();
        coupons.setMatrixAt(i, dummy.matrix);
      }
      coupons.instanceMatrix.needsUpdate = true;

      // the team runs it: the shop opens (amber)
      const open = smooth(span(P, 3.2, 3.85));
      shop.emissiveIntensity = 0.08 + open * 1.05;
      poolMat.opacity = open * 0.5;

      const i = Math.min(KEYS.length - 2, Math.floor(P));
      const t = smooth(Math.min(1, P - i));
      const A = KEYS[i];
      const Bk = KEYS[i + 1];
      const ang = lerp(A.ang, Bk.ang, t) + (reduce ? 0 : Math.sin(now * 0.18) * 0.03);
      const r = lerp(A.r, Bk.r, t) * (narrow() ? 1.4 : 1);
      target.set(lerp(A.tx, Bk.tx, t), lerp(A.ty, Bk.ty, t), lerp(A.tz, Bk.tz, t));
      camera.position.set(target.x - Math.cos(ang) * r, lerp(A.h, Bk.h, t), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build, 31);
