// "A vitrine" (/lojas-virtuais): a shop on the night street, seen from the sidewalk.
// 0 vitrine (shelves fill up with products) · 1 pedido (one product is picked and goes to the counter)
// 2 pagamento e entrega (it becomes a parcel and leaves in a van) · 3 você no controle (shelf refilled, shop open).
// Amber = the business visible/open and the order; products use calm map colors (no lime, no purple).
import {
  AdditiveBlending,
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { createStage, land, lerp, raw, ROOFS, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const D = 7; // depth (x)
const W = 9; // along the street (z)
const GH = 3.2; // shop floor height
const UH = 2.8; // upper floor
const FRONT_X = -D / 2;
const STREET_X = FRONT_X - 5;
const SHELVES = [0.75, 1.5, 2.25];
const SLOTS = 8;
const HERO = { shelf: 1, slot: 2 };
const PRODUCT_COLORS = [0xe8e2d4, 0x2fb5a6, 0xe26d5a, 0x8fe3ff, 0xd9c08a, 0x5f86c9];

type Key = { r: number; h: number; ang: number; tx: number; ty: number; tz: number };
const KEYS: Key[] = [
  { r: 30, h: 14, ang: 0.5, tx: -1, ty: 2.4, tz: 0 }, // hero
  { r: 12.5, h: 3.2, ang: 0.16, tx: 0.5, ty: 1.5, tz: 0 }, // vitrine: eye level, looking into the shop
  { r: 10.5, h: 3, ang: 0.32, tx: -0.5, ty: 1.3, tz: -1.2 }, // pedido
  { r: 21, h: 7, ang: 0.36, tx: STREET_X + 1, ty: 1, tz: 3 }, // entrega: the parcel goes to the van
  { r: 27, h: 11, ang: 0.4, tx: -1, ty: 2.6, tz: 0 }, // aberta
];

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, glow, canvasTex } = ctx;

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
      const square = side === -1 && cz > -14 && cz < 20;
      if (!onLot && !square) {
        const x = side === 1 ? FRONT_X + d / 2 : STREET_X - 5 - d / 2;
        lots.push({ x, z: cz, w, d, h: 2.4 + Math.pow(R(), 1.5) * (side === 1 && Math.abs(cz) < 16 ? 2.4 : 10), tone: Math.floor(R() * TONES.length) });
      }
      z += w + 0.4 + R() * 0.5;
    }
  }
  for (let gx = 0; gx < 6; gx++)
    for (let gz = -8; gz <= 8; gz++) {
      if (R() > 0.62) continue;
      const side = R() < 0.5 ? -1 : 1;
      const x = side === 1 ? 11 + gx * 8 : STREET_X - 14 - gx * 8;
      if (side === -1 && gx < 3 && gz * 8 > -16 && gz * 8 < 34) continue;
      lots.push({ x, z: gz * 8, w: 3.6 + R() * 2.6, d: 3.6 + R() * 2.6, h: 2 + Math.pow(R(), 2) * 16, tone: Math.floor(R() * TONES.length) });
    }
  ctx.blocks(lots);
  const spots: [number, number][] = [];
  for (let z = -48; z <= 48; z += 12) {
    if (Math.abs(z) > W / 2 + 1) spots.push([FRONT_X - 1.3, z]);
    spots.push([STREET_X - 3.7, z + 6]);
  }
  ctx.lamps(spots);

  // ---------- the shop: open front, lit interior, upper floor with windows ----------
  const wallMat = new MeshLambertMaterial({ color: raw(TONES[0]) });
  const inside = new MeshLambertMaterial({ color: raw(0x141018), emissive: raw(0xffe2b8), emissiveIntensity: 0 });
  const floorMat = new MeshLambertMaterial({ color: raw(0x10141f) });
  const box = (w: number, h: number, d: number, m: MeshLambertMaterial | MeshLambertMaterial[], x: number, y: number, z: number) => {
    const mesh = new Mesh(new BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  };
  box(D, 0.08, W, floorMat, 0, 0.04, 0);
  box(0.2, GH, W, inside, D / 2 - 0.1, GH / 2, 0); // back wall, lit from inside
  for (const sz of [-1, 1]) box(D, GH, 0.2, wallMat, 0, GH / 2, sz * (W / 2 - 0.1));
  for (const pz of [-W / 2 + 0.15, W / 2 - 0.15]) box(0.3, GH, 0.3, wallMat, FRONT_X + 0.15, GH / 2, pz); // pillars

  const winTex = canvasTex(128, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = "#fff";
    for (let x = 0; x < 4; x++) g.fillRect(x * 32 + 7, 14, 18, 30);
  }, true);
  winTex.repeat.set(W / 3, 1);
  const upperFacade = new MeshLambertMaterial({ color: raw(TONES[0]), emissive: raw(0xffe2b8), emissiveMap: winTex, emissiveIntensity: 0.35 });
  const roof = new MeshLambertMaterial({ color: raw(ROOFS[1]) });
  box(D, UH, W, [wallMat, upperFacade, roof, wallMat, wallMat, wallMat], 0, GH + UH / 2, 0);

  // sign "SUA LOJA" over the door: dim at first, amber when the shop is open
  const signTex = canvasTex(512, 96, (g) => {
    g.fillStyle = "rgba(255,255,255,0.08)";
    g.fillRect(0, 0, 512, 96);
    g.fillStyle = "#fff";
    g.font = `700 46px ${ctx.monoFamily}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("SUA LOJA", 256, 50);
  });
  const DIM = raw(0x3a4866);
  const signMat = new MeshBasicMaterial({ map: signTex, color: DIM.clone(), transparent: true, depthWrite: false });
  const sign = new Mesh(new PlaneGeometry(4.2, 0.8), signMat);
  sign.rotation.y = -Math.PI / 2;
  sign.position.set(FRONT_X - 0.04, GH + 0.55, 0);
  scene.add(sign);

  // striped awning
  const awningTex = canvasTex(256, 32, (g) => {
    for (let i = 0; i < 16; i++) {
      g.fillStyle = i % 2 ? "#1b2a4a" : "#d9cdb4";
      g.fillRect(i * 16, 0, 16, 32);
    }
  });
  const awningMat = new MeshLambertMaterial({ map: awningTex, side: DoubleSide, emissive: raw(0xffe2b8), emissiveIntensity: 0 });
  const awningGeo = new PlaneGeometry(1.0, W - 0.4);
  awningGeo.rotateX(-Math.PI / 2);
  awningGeo.rotateZ(0.38); // the street edge hangs lower
  const awning = new Mesh(awningGeo, awningMat);
  awning.position.set(FRONT_X - 0.48, GH - 0.02, 0);
  scene.add(awning);

  // shelves on the back wall
  const shelfMat = new MeshLambertMaterial({ color: raw(0x3a2c1e) });
  for (const y of SHELVES) box(0.6, 0.06, W - 1.2, shelfMat, D / 2 - 0.5, y, 0);
  const slotZ = (s: number) => -((W - 1.8) / 2) + (s * (W - 1.8)) / (SLOTS - 1);
  const shelfX = D / 2 - 0.5;

  // counter near the door
  const counter = box(0.9, 1, 2.6, [wallMat, wallMat, new MeshLambertMaterial({ color: raw(0x2a2230) }), wallMat, wallMat, wallMat], FRONT_X + 1.6, 0.5, -2.2);
  const counterTop = new Vector3(counter.position.x, 1.25, counter.position.z);

  // interior light (warm white), on when the shelves fill
  const lamp = new PointLight(raw(0xffe2b8), 0, 16, 2);
  lamp.position.set(0.5, GH - 0.4, 0);
  scene.add(lamp);

  // ---------- products: one instanced draw for the shelves ----------
  const PW = 0.42;
  const prodGeo = new BoxGeometry(PW, 0.5, PW);
  prodGeo.translate(0, 0.25, 0);
  const prodMat = new MeshLambertMaterial({ color: 0xffffff, emissive: raw(0x2a2418), emissiveIntensity: 1 });
  const slots: { shelf: number; slot: number; color: number }[] = [];
  SHELVES.forEach((_, sh) => {
    for (let s = 0; s < SLOTS; s++) if (!(sh === HERO.shelf && s === HERO.slot)) slots.push({ shelf: sh, slot: s, color: PRODUCT_COLORS[Math.floor(R() * PRODUCT_COLORS.length)] });
  });
  const products = new InstancedMesh(prodGeo, prodMat, slots.length);
  slots.forEach((p, i) => products.setColorAt(i, raw(p.color)));
  scene.add(products);
  const dummy = new Object3D();

  // the picked product (amber outline when chosen) and the refill that takes its place
  const heroMat = new MeshLambertMaterial({ color: raw(PRODUCT_COLORS[2]), emissive: AMBER.clone(), emissiveIntensity: 0 });
  const hero = new Mesh(prodGeo, heroMat);
  const outlineMat = new LineBasicMaterial({ color: AMBER.clone(), transparent: true, opacity: 0 });
  const outline = new LineSegments(new EdgesGeometry(prodGeo), outlineMat);
  hero.add(outline);
  outline.scale.setScalar(1.08);
  scene.add(hero);
  const refill = new Mesh(prodGeo, new MeshLambertMaterial({ color: raw(PRODUCT_COLORS[1]), emissive: raw(0x2a2418) }));
  scene.add(refill);
  const heroHome = new Vector3(shelfX, SHELVES[HERO.shelf] + 0.03, slotZ(HERO.slot));

  // order tag above the picked product
  const tagTex = canvasTex(256, 64, (g) => {
    g.fillStyle = "#fff";
    g.font = `700 30px ${ctx.monoFamily}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("+1 NO PEDIDO", 128, 34);
  });
  const tag = new Sprite(new SpriteMaterial({ map: tagTex, color: AMBER.clone(), transparent: true, opacity: 0, depthWrite: false, depthTest: false }));
  tag.scale.set(2, 0.5, 1);
  tag.renderOrder = 10;
  scene.add(tag);

  // parcel (kraft box with tape)
  const parcelTex = canvasTex(64, 64, (g) => {
    g.fillStyle = "#b8925e";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#e8d6b0";
    g.fillRect(26, 0, 12, 64);
  });
  const parcel = new Mesh(new BoxGeometry(0.62, 0.46, 0.62), new MeshLambertMaterial({ map: parcelTex }));
  parcel.geometry.translate(0, 0.23, 0);
  scene.add(parcel);

  // payment confirmed: an amber ring on the counter
  const ringMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const ring = new Mesh(new PlaneGeometry(1, 1), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.copy(counterTop).setY(1.03);
  scene.add(ring);

  // delivery van on the street
  const van = new Group();
  const vanBody = new MeshLambertMaterial({ color: raw(0xd9dde6) });
  const vanDark = new MeshLambertMaterial({ color: raw(0x0b1120) });
  const cargo = new Mesh(new BoxGeometry(1.7, 1.5, 2.6), vanBody);
  cargo.position.set(0, 1.15, 0.5);
  const cab = new Mesh(new BoxGeometry(1.7, 1.15, 1.2), vanBody);
  cab.position.set(0, 0.97, -1.35);
  const glass = new Mesh(new PlaneGeometry(1.5, 0.5), vanDark);
  glass.rotation.y = Math.PI;
  glass.position.set(0, 1.25, -1.96);
  const wheelGeo = new CylinderGeometry(0.36, 0.36, 0.3, 14);
  wheelGeo.rotateZ(Math.PI / 2);
  for (const [wx, wz] of [[-0.8, -1.2], [0.8, -1.2], [-0.8, 1.2], [0.8, 1.2]]) {
    const w = new Mesh(wheelGeo, vanDark);
    w.position.set(wx, 0.36, wz);
    van.add(w);
  }
  const tailMat = new SpriteMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  for (const tx of [-0.6, 0.6]) {
    const t = new Sprite(tailMat);
    t.position.set(tx, 0.9, 1.85);
    t.scale.setScalar(0.9);
    van.add(t);
  }
  van.add(cargo, cab, glass);
  scene.add(van);
  const VAN_X = STREET_X + 1.75;
  const VAN_Z = 11; // parked down the street, out of the shop view

  // amber light on the sidewalk when the shop is open
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(4.4, W * 1.2, 1);
  pool.position.set(FRONT_X - 1.7, 0.04, 0);
  scene.add(pool);

  const p = new Vector3();
  const target = new Vector3();

  return {
    apply(P: number, now: number) {
      // 01 vitrine: interior lights up, products drop onto the shelves one by one
      const lit = smooth(span(P, 0.05, 0.6));
      inside.emissiveIntensity = lit * 0.22;
      lamp.intensity = lit * 26;
      slots.forEach((s, i) => {
        const t = span(P, 0.12 + i * 0.026, 0.3 + i * 0.026);
        dummy.position.set(shelfX, SHELVES[s.shelf] + 0.03 + (1 - land(t)) * 1.2, slotZ(s.slot));
        dummy.scale.setScalar(t > 0 ? 1 : 0.0001);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        products.setMatrixAt(i, dummy.matrix);
      });
      products.instanceMatrix.needsUpdate = true;
      const heroIn = span(P, 0.5, 0.7);

      // 02 pedido: the product lifts, glows amber and floats to the counter
      const pick = smooth(span(P, 1.1, 1.75));
      const lift = Math.sin(pick * Math.PI) * 1.3;
      p.lerpVectors(heroHome, counterTop, pick);
      p.y += lift + (1 - land(heroIn)) * 1.2;
      // 03 pagamento e entrega: it becomes a parcel and leaves in the van
      const pack = smooth(span(P, 2.0, 2.25));
      hero.position.copy(p);
      hero.visible = heroIn > 0 && pack < 1;
      hero.scale.setScalar(heroIn > 0 ? 1 - pack * 0.9 : 0.0001);
      hero.rotation.y = pick * Math.PI * 0.5;
      const chosen = span(P, 1.05, 1.3) * (1 - pack);
      outlineMat.opacity = chosen;
      heroMat.emissiveIntensity = chosen * 0.35;
      tag.position.set(p.x, p.y + 1.05, p.z);
      (tag.material as SpriteMaterial).opacity = smooth(span(P, 1.3, 1.6)) * (1 - span(P, 1.85, 2.0));

      ringMat.opacity = Math.sin(span(P, 2.0, 2.4) * Math.PI) * 0.9;
      ring.scale.setScalar(1 + span(P, 2.0, 2.4) * 2.4);

      const toVan = smooth(span(P, 2.3, 2.6));
      const drive = smooth(span(P, 2.6, 3.0));
      const vz = VAN_Z - drive * 46;
      p.set(lerp(counterTop.x, VAN_X, toVan), counterTop.y + Math.sin(toVan * Math.PI) * 1.6 + (1.9 - counterTop.y) * toVan, lerp(counterTop.z, VAN_Z + 0.5, toVan));
      parcel.position.copy(p);
      parcel.visible = pack > 0 && toVan < 1;
      parcel.scale.setScalar(Math.max(0.0001, pack));
      van.position.set(VAN_X, 0, vz);
      tailMat.opacity = smooth(span(P, 2.45, 2.65)) * (reduce ? 1 : 0.85 + 0.15 * Math.sin(now * 6));

      // 04 você no controle: the shelf is refilled and the shop is open (amber)
      const re = span(P, 3.1, 3.4);
      refill.visible = re > 0;
      refill.position.set(heroHome.x, heroHome.y + (1 - land(re)) * 1.2, heroHome.z);
      const open = smooth(span(P, 3.3, 3.9));
      signMat.color.copy(DIM).lerp(AMBER, open);
      awningMat.emissiveIntensity = open * 0.25;
      poolMat.opacity = open * 0.5;

      // camera: one key per step, eased between them
      const i = Math.min(KEYS.length - 2, Math.floor(P));
      const t = smooth(Math.min(1, P - i));
      const A = KEYS[i];
      const B = KEYS[i + 1];
      const ang = lerp(A.ang, B.ang, t) + (reduce ? 0 : Math.sin(now * 0.18) * 0.03);
      const r = lerp(A.r, B.r, t) * (narrow() ? 1.35 : 1);
      target.set(lerp(A.tx, B.tx, t), lerp(A.ty, B.ty, t), lerp(A.tz, B.tz, t));
      camera.position.set(target.x - Math.cos(ang) * r, lerp(A.h, B.h, t), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build, 23);
