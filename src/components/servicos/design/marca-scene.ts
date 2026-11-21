// "A marca" (/design): a big billboard in a plaza on the night street.
// 0 identidade (loose shapes snap into an emblem; the palette drops in) · 1 peças (a feed grid of pieces fills the board)
// 2 interfaces (the pieces become a phone and a desktop screen) · 3 motion (everything moves; the board lights amber).
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  ConeGeometry,
  EdgesGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { createStage, lerp, raw, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const STREET_X = -10;
const BX = -1.5; // board plane x (faces the street, −x)
const BY = 7.2; // board center height
const BW = 11;
const BH = 6.6;
const PALETTE = [0xffb547, 0x2fb5a6, 0xe26d5a, 0xd9c08a, 0x8fe3ff];
const NT = 9;

type Key = { r: number; h: number; ang: number; tx: number; ty: number; tz: number };
const KEYS: Key[] = [
  { r: 32, h: 13, ang: 0.45, tx: -2, ty: 5.5, tz: 0 }, // hero
  { r: 21, h: 8.5, ang: 0.14, tx: -2, ty: 7, tz: 0 }, // identidade
  { r: 22, h: 8.5, ang: 0.2, tx: -2, ty: 7, tz: 0 }, // peças
  { r: 21, h: 8, ang: 0.1, tx: -2, ty: 7, tz: 0 }, // interfaces
  { r: 30, h: 11, ang: 0.38, tx: -2, ty: 6, tz: 0 }, // motion
];

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, glow, canvasTex } = ctx;

  // ---------- street, plaza, neighborhood ----------
  ctx.street(STREET_X);
  const lots: Lot[] = [];
  for (const side of [-1, 1]) {
    let z = -70;
    while (z < 70) {
      const w = 3.4 + R() * 2.8;
      const cz = z + w / 2;
      const d = 4 + R() * 3;
      const plaza = side === 1 && cz > -12 && cz < 12;
      const square = side === -1 && cz > -16 && cz < 18;
      if (!plaza && !square) {
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
      const x = side === 1 ? 9 + gx * 8 : STREET_X - 14 - gx * 8;
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
  const plaza = new Mesh(new PlaneGeometry(12, 24), new MeshLambertMaterial({ color: raw(0x10182c) }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(-1, 0.012, 0);
  scene.add(plaza);

  // ---------- the billboard ----------
  const frameMat = new MeshLambertMaterial({ color: raw(0x0b1120) });
  for (const z of [-BW / 2 + 1, BW / 2 - 1]) {
    const pole = new Mesh(new BoxGeometry(0.4, BY - BH / 2, 0.4), frameMat);
    pole.position.set(BX + 0.4, (BY - BH / 2) / 2, z);
    scene.add(pole);
  }
  const back = new Mesh(new BoxGeometry(0.4, BH + 0.4, BW + 0.4), frameMat);
  back.position.set(BX + 0.25, BY, 0);
  scene.add(back);
  const boardMat = new MeshBasicMaterial({ color: raw(0x0d1630) });
  const board = new Mesh(new PlaneGeometry(BW, BH), boardMat);
  board.rotation.y = -Math.PI / 2;
  board.position.set(BX, BY, 0);
  scene.add(board);
  const edgeMat = new LineBasicMaterial({ color: AMBER.clone(), transparent: true, opacity: 0 });
  const edge = new LineSegments(new EdgesGeometry(new BoxGeometry(0.05, BH + 0.3, BW + 0.3)), edgeMat);
  edge.position.set(BX - 0.05, BY, 0);
  scene.add(edge);
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(8, BW * 1.3, 1);
  pool.position.set(BX - 4, 0.04, 0);
  scene.add(pool);

  // ---------- the emblem: ring, triangle and dot ----------
  const FX = BX - 0.35; // in front of the board
  const ringMat = new MeshLambertMaterial({ color: raw(0x8fe3ff), emissive: raw(0x2a6a80), emissiveIntensity: 0.8 });
  const triMat = new MeshLambertMaterial({ color: raw(0xe26d5a), emissive: raw(0x5a2018), emissiveIntensity: 0.8 });
  const dotMat = new MeshLambertMaterial({ color: AMBER.clone(), emissive: AMBER.clone(), emissiveIntensity: 0.5 });
  const ring = new Mesh(new TorusGeometry(1.3, 0.22, 12, 48), ringMat);
  ring.rotation.y = Math.PI / 2;
  const tri = new Mesh(new ConeGeometry(0.95, 0.4, 3), triMat);
  tri.rotation.z = Math.PI / 2; // flat side faces the street
  const dot = new Mesh(new SphereGeometry(0.38, 20, 14), dotMat);
  scene.add(ring, tri, dot);
  type Pose = { p: Vector3; r: Vector3 };
  const loose: Pose[] = [ring, tri, dot].map(() => ({ p: new Vector3(-6 + R() * 6, 3 + R() * 7, -9 + R() * 18), r: new Vector3(R() * 3, R() * 3, R() * 3) }));
  const home = [new Vector3(FX, BY, 0), new Vector3(FX - 0.1, BY - 0.05, 0), new Vector3(FX - 0.3, BY + 0.55, 0.55)];

  // palette swatches below the board
  const swatches = new InstancedMesh(new BoxGeometry(0.3, 0.9, 0.9), new MeshLambertMaterial({ color: 0xffffff, emissive: raw(0x1a1a22) }), PALETTE.length);
  PALETTE.forEach((c, i) => swatches.setColorAt(i, raw(c)));
  scene.add(swatches);

  // ---------- pieces: feed grid → screens → orbit ----------
  const pieceTex = canvasTex(128, 128, (g) => {
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = "rgba(13,22,48,0.85)";
    g.beginPath();
    g.arc(64, 54, 26, 0, Math.PI * 2);
    g.fill();
    g.fillRect(24, 94, 80, 10);
    g.fillRect(36, 110, 56, 6);
  });
  const tiles = new InstancedMesh(new BoxGeometry(0.08, 1, 1), new MeshLambertMaterial({ color: 0xffffff, map: pieceTex, emissive: raw(0x202024) }), NT);
  scene.add(tiles);
  const grid: Vector3[] = [];
  const screens: { p: Vector3; s: [number, number] }[] = [];
  const orbit: Vector3[] = [];
  for (let i = 0; i < NT; i++) {
    grid.push(new Vector3(FX, BY + 2 - Math.floor(i / 3) * 2, 2.4 + (i % 3) * 2));
    // phone (left column, 4 stacked) and desktop (right, 2×2 + header)
    if (i < 4) screens.push({ p: new Vector3(FX, BY + 2.1 - i * 1.25, -3.2), s: [1.05, 1.9] });
    else if (i < 8) screens.push({ p: new Vector3(FX, BY + 1.2 - Math.floor((i - 4) / 2) * 1.9, 0.2 + ((i - 4) % 2) * 2.7), s: [1.7, 2.5] });
    else screens.push({ p: new Vector3(FX, BY + 2.55, 1.55), s: [0.5, 5.3] });
    const a = (i / NT) * Math.PI * 2;
    orbit.push(new Vector3(FX - 1.4, BY + Math.sin(a) * 2.6, Math.cos(a) * 4.2));
  }
  const phoneFrame = new LineSegments(new EdgesGeometry(new BoxGeometry(0.05, 5.6, 1.6)), new LineBasicMaterial({ color: raw(0xcfd9ff), transparent: true, opacity: 0 }));
  phoneFrame.position.set(FX, BY + 0.2, -3.2);
  const deskFrame = new LineSegments(new EdgesGeometry(new BoxGeometry(0.05, 4.6, 6)), new LineBasicMaterial({ color: raw(0xcfd9ff), transparent: true, opacity: 0 }));
  deskFrame.position.set(FX, BY + 0.6, 1.55);
  scene.add(phoneFrame, deskFrame);

  const dummy = new Object3D();
  const v = new Vector3();
  const col = new Color();
  const target = new Vector3();

  return {
    apply(P: number, now: number) {
      // 01 identidade: the shapes snap into the emblem, the board wakes up
      const snap = smooth(span(P, 0.1, 0.85));
      const wake = smooth(span(P, 0.05, 0.6));
      boardMat.color.copy(raw(0x0d1630)).multiplyScalar(0.6 + wake * 0.8);
      const toSide = smooth(span(P, 1.05, 1.4)) * (1 - smooth(span(P, 3.05, 3.4)));
      const fade = smooth(span(P, 2.0, 2.3)) * (1 - smooth(span(P, 3.05, 3.4)));
      [ring, tri, dot].forEach((m, i) => {
        v.copy(loose[i].p).lerp(home[i], snap);
        // in "peças" the emblem slides to the left of the board; in "interfaces" it hides behind the screens
        v.z += toSide * -3.6;
        v.y += toSide * 1.6;
        if (!reduce) v.y += Math.sin(now * 0.9 + i) * 0.3 * (1 - snap);
        m.position.copy(v);
        const k = 1 - snap;
        m.rotation.set(loose[i].r.x * k, (i === 0 ? Math.PI / 2 : 0) + loose[i].r.y * k, (i === 1 ? Math.PI / 2 : 0) + loose[i].r.z * k);
        m.scale.setScalar(Math.max(0.0001, (1 - toSide * 0.45) * (1 - fade)));
      });
      // 04 motion: the emblem spins and pulses in the middle of the board
      const motion = smooth(span(P, 3.1, 3.6));
      if (motion > 0) {
        ring.rotation.x = reduce ? 0 : now * 1.4 * motion;
        const pulse = reduce ? 1 : 1 + Math.sin(now * 3) * 0.08 * motion;
        ring.scale.setScalar(Math.max(0.0001, ring.scale.x * pulse));
        tri.rotation.x = reduce ? 0 : -now * 2 * motion;
        dot.position.y += reduce ? 0 : Math.sin(now * 2.4) * 0.35 * motion;
      }

      // palette drops below the board, then stays
      for (let i = 0; i < PALETTE.length; i++) {
        const t = smooth(span(P, 0.45 + i * 0.07, 0.65 + i * 0.07));
        dummy.position.set(FX, BY - BH / 2 + 0.75 + (1 - t) * 3, -2.4 + i * 1.2);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(t > 0 ? 1 : 0.0001);
        dummy.updateMatrix();
        swatches.setMatrixAt(i, dummy.matrix);
      }
      swatches.instanceMatrix.needsUpdate = true;

      // 02 peças → 03 interfaces → 04 orbit
      const show = smooth(span(P, 1.1, 1.6));
      const toScreens = smooth(span(P, 2.05, 2.6));
      const toOrbit = smooth(span(P, 3.1, 3.7));
      for (let i = 0; i < NT; i++) {
        const t = smooth(span(show, i * 0.06, 0.5 + i * 0.06));
        v.copy(grid[i]).lerp(screens[i].p, toScreens);
        const sh = lerp(1.7, screens[i].s[0], toScreens);
        const sw = lerp(1.7, screens[i].s[1], toScreens);
        const a = (i / NT) * Math.PI * 2 + (reduce ? 0 : now * 0.5);
        orbit[i].set(FX - 1.4, BY + Math.sin(a) * 2.5, Math.cos(a) * 4.4);
        v.lerp(orbit[i], toOrbit);
        dummy.position.copy(v);
        dummy.position.x -= (1 - t) * 2;
        dummy.rotation.set(0, 0, 0);
        const sc = lerp(1, 0.55, toOrbit) * t;
        dummy.scale.set(1, Math.max(0.0001, lerp(sh, 1.2, toOrbit) * sc), Math.max(0.0001, lerp(sw, 1.2, toOrbit) * sc));
        dummy.updateMatrix();
        tiles.setMatrixAt(i, dummy.matrix);
        col.copy(raw(PALETTE[i % PALETTE.length])).lerp(raw(0xe8ecf6), toScreens * (1 - toOrbit) * 0.75);
        tiles.setColorAt(i, col);
      }
      tiles.instanceMatrix.needsUpdate = true;
      tiles.instanceColor!.needsUpdate = true;
      const frames = toScreens * (1 - toOrbit);
      (phoneFrame.material as LineBasicMaterial).opacity = frames;
      (deskFrame.material as LineBasicMaterial).opacity = frames;

      // the board lights amber when the brand is out in the world
      edgeMat.opacity = motion;
      poolMat.opacity = motion * 0.45;

      const i = Math.min(KEYS.length - 2, Math.floor(P));
      const tt = smooth(Math.min(1, P - i));
      const A = KEYS[i];
      const B = KEYS[i + 1];
      const ang = lerp(A.ang, B.ang, tt) + (reduce ? 0 : Math.sin(now * 0.18) * 0.03);
      const r = lerp(A.r, B.r, tt) * (narrow() ? 1.45 : 1);
      target.set(lerp(A.tx, B.tx, tt), lerp(A.ty, B.ty, tt), lerp(A.tz, B.tz, tt));
      camera.position.set(target.x - Math.cos(ang) * r, lerp(A.h, B.h, tt), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build, 53);
