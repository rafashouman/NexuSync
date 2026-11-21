// "O mapa" (/seo-para-negocios-locais): the neighborhood seen from above, like a map.
// The rival already has a pin. 0 diagnóstico (a scan sweeps your building) · 1 prioridades (three tags appear)
// 2 ajustes (tags get checked, windows light up, a search arc reaches you) · 3 acompanhamento (your pin rises too).
// Signal blue = search and being found; amber = your business visible/open. No position is ever promised.
import {
  AdditiveBlending,
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  QuadraticBezierCurve3,
  RingGeometry,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector3,
  type Texture,
} from "three";
import { createStage, lerp, raw, ROOFS, smooth, span, TONES, type Lot, type StageCtx, type StageRefs } from "../stage/core";

const YOU = { x: 7.5, z: 6, d: 5, w: 4.4, h: 4 };
const RIV = { x: -7.8, z: -6, d: 5.6, w: 5, h: 6.6 };
const CROSS_Z = -22;
const SEARCHER = new Vector3(-1.6, 0.4, -36); // someone searching, down the avenue

type Key = { r: number; h: number; ang: number; tx: number; ty: number; tz: number };
const KEYS: Key[] = [
  { r: 30, h: 50, ang: 0.62, tx: 0, ty: 0, tz: 2 }, // hero: the map
  { r: 20, h: 21, ang: 0.42, tx: 5, ty: 1, tz: 4 }, // diagnóstico
  { r: 17, h: 13, ang: 0.3, tx: 6, ty: 3, tz: 5 }, // prioridades
  { r: 30, h: 44, ang: 0.05, tx: 3, ty: 0, tz: -14 }, // ajustes: from the side, the search arc runs across the frame
  { r: 32, h: 40, ang: 0.55, tx: 0, ty: 2, tz: 1 }, // acompanhamento: both pins on the map
];

function build(ctx: StageCtx) {
  const { scene, camera, R, reduce, narrow, AMBER, SIGNAL, glow, canvasTex } = ctx;

  // ---------- streets and the neighborhood ----------
  ctx.street(0);
  const cross = new Mesh(new PlaneGeometry(240, 6), new MeshLambertMaterial({ color: raw(0x04070e) }));
  cross.rotation.x = -Math.PI / 2;
  cross.position.set(0, 0.011, CROSS_Z);
  scene.add(cross);
  const lots: Lot[] = [];
  const free = (x: number, z: number, pad: number) =>
    Math.abs(z - CROSS_Z) < 3 + pad ||
    (Math.abs(x - YOU.x) < YOU.d / 2 + pad + 1.5 && Math.abs(z - YOU.z) < YOU.w / 2 + pad + 1.5) ||
    (Math.abs(x - RIV.x) < RIV.d / 2 + pad + 1.5 && Math.abs(z - RIV.z) < RIV.w / 2 + pad + 1.5);
  for (const side of [-1, 1]) {
    let z = -70;
    while (z < 70) {
      const w = 3.4 + R() * 2.8;
      const cz = z + w / 2;
      const d = 4 + R() * 3;
      const x = side * (5 + d / 2);
      if (!free(x, cz, w / 2)) lots.push({ x, z: cz, w, d, h: 2.4 + Math.pow(R(), 1.5) * 7, tone: Math.floor(R() * TONES.length) });
      z += w + 0.4 + R() * 0.5;
    }
  }
  for (let gx = 2; gx <= 8; gx++)
    for (let gz = -9; gz <= 9; gz++) {
      const z = gz * 8;
      if (Math.abs(z - CROSS_Z) < 7 || R() > 0.7) continue;
      for (const side of [-1, 1]) {
        if (R() < 0.25) continue;
        lots.push({ x: side * gx * 8, z, w: 3.6 + R() * 2.6, d: 3.6 + R() * 2.6, h: 2 + Math.pow(R(), 2) * 14, tone: Math.floor(R() * TONES.length) });
      }
    }
  ctx.blocks(lots);
  const spots: [number, number][] = [];
  for (let z = -48; z <= 48; z += 12) spots.push([-3.75, z], [3.75, z + 6]);
  ctx.lamps(spots);

  // ---------- the rival (already found) and your business ----------
  const win = canvasTex(128, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 128, 64);
    g.fillStyle = "#fff";
    for (let x = 0; x < 4; x++) g.fillRect(x * 32 + 7, 14, 18, 30);
  }, true);
  win.repeat.set(1.5, 2);
  const roof = new MeshLambertMaterial({ color: raw(ROOFS[1]) });
  const building = (b: typeof YOU, facade: MeshLambertMaterial) => {
    const g = new BoxGeometry(b.d, b.h, b.w);
    g.translate(0, b.h / 2, 0);
    const m = new Mesh(g, [facade, facade, roof, roof, facade, facade]);
    m.position.set(b.x, 0, b.z);
    scene.add(m);
    return m;
  };
  const rivFacade = new MeshLambertMaterial({ color: raw(TONES[0]), emissive: raw(0x9fb3ff), emissiveMap: win, emissiveIntensity: 0.6 });
  building(RIV, rivFacade);
  const youFacade = new MeshLambertMaterial({ color: raw(TONES[0]), emissive: raw(0xffe2b8), emissiveMap: win, emissiveIntensity: 0.04 });
  const you = building(YOU, youFacade);
  const shopTex = canvasTex(256, 64, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 256, 64);
    g.fillStyle = "#fff";
    g.fillRect(10, 14, 92, 44);
    g.fillRect(114, 10, 28, 54);
    g.fillRect(154, 14, 92, 44);
  });
  const shopMat = new MeshLambertMaterial({ color: raw(0x0a1120), emissive: AMBER.clone(), emissiveMap: shopTex, emissiveIntensity: 0, transparent: true });
  const shop = new Mesh(new PlaneGeometry(YOU.w * 0.9, 1.6), shopMat);
  shop.rotation.y = -Math.PI / 2;
  shop.position.set(YOU.x - YOU.d / 2 - 0.03, 0.9, YOU.z);
  scene.add(shop);
  const poolMat = new MeshBasicMaterial({ map: glow, color: AMBER.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const pool = new Mesh(new PlaneGeometry(1, 1), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.set(3.6, YOU.w * 1.3, 1);
  pool.position.set(YOU.x - YOU.d / 2 - 1.4, 0.04, YOU.z);
  scene.add(pool);

  const rivMarker = ctx.marker(RIV.x, RIV.z);
  const youMarker = ctx.marker(YOU.x, YOU.z);

  // ---------- 01 diagnóstico: edges and a scan ring ----------
  const edgeMat = new LineBasicMaterial({ color: SIGNAL.clone(), transparent: true, opacity: 0 });
  const edges = new LineSegments(new EdgesGeometry(you.geometry), edgeMat);
  edges.position.copy(you.position);
  scene.add(edges);
  const ringMat = new MeshBasicMaterial({ color: SIGNAL.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const rings = [0, 1, 2].map(() => {
    const ring = new Mesh(new RingGeometry(0.94, 1, 64), ringMat.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(YOU.x, 0.06, YOU.z);
    scene.add(ring);
    return ring;
  });

  // ---------- 02 prioridades / 03 ajustes: three tags over the building ----------
  const tagTex = (text: string, done: boolean): Texture =>
    canvasTex(512, 96, (g) => {
      g.fillStyle = "rgba(13,22,48,0.92)";
      g.fillRect(4, 4, 504, 88);
      g.strokeStyle = done ? "#ffe2b8" : "#5b97ff";
      g.lineWidth = 4;
      g.strokeRect(4, 4, 504, 88);
      g.fillStyle = done ? "#ffe2b8" : "#cfd9ff";
      g.font = `700 38px ${ctx.monoFamily}`;
      g.textBaseline = "middle";
      g.fillText(`${done ? "✓" : "•"} ${text}`, 26, 50);
    });
  const TAGS = ["TÍTULOS", "PÁGINAS", "PERFIL NO GOOGLE"];
  const tags = TAGS.map((t, i) => {
    const todo = new SpriteMaterial({ map: tagTex(t, false), transparent: true, opacity: 0, depthTest: false, depthWrite: false });
    const done = new SpriteMaterial({ map: tagTex(t, true), transparent: true, opacity: 0, depthTest: false, depthWrite: false });
    const a = new Sprite(todo);
    const b = new Sprite(done);
    for (const sp of [a, b]) {
      sp.scale.set(4.2, 0.79, 1);
      sp.renderOrder = 10;
      scene.add(sp);
    }
    return { a, b, todo, done, y: YOU.h + 1.4 + i * 1.05, dz: (i - 1) * 0.9 };
  });

  // ---------- 03 ajustes: someone searches, the arc reaches you ----------
  const searcherMat = new SpriteMaterial({ map: glow, color: raw(0xcfd9ff), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const searcher = new Sprite(searcherMat);
  searcher.position.copy(SEARCHER);
  searcher.scale.setScalar(2.2);
  scene.add(searcher);
  const curve = new QuadraticBezierCurve3(SEARCHER.clone(), new Vector3((SEARCHER.x + YOU.x) / 2, 12, (SEARCHER.z + YOU.z) / 2), new Vector3(YOU.x, YOU.h + 0.3, YOU.z));
  const ARC_SEGS = 90;
  const arcMat = new MeshBasicMaterial({ color: SIGNAL.clone(), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const arcGeo = new TubeGeometry(curve, ARC_SEGS, 0.14, 6, false);
  const arc = new Mesh(arcGeo, arcMat);
  scene.add(arc);

  const target = new Vector3();

  return {
    apply(P: number, now: number) {
      rivMarker.set(1, now, RIV.h);

      // 01 diagnóstico
      const diag = smooth(span(P, 0.05, 0.5)) * (1 - smooth(span(P, 2.2, 2.8)));
      edgeMat.opacity = diag * 0.9;
      rings.forEach((ring, i) => {
        const cycle = reduce ? 0.5 + i * 0.2 : ((now * 0.45 + i / 3) % 1);
        ring.scale.setScalar(2 + cycle * 7);
        (ring.material as MeshBasicMaterial).opacity = diag * (1 - cycle) * 0.8 * (1 - span(P, 1.2, 1.8));
      });

      // 02 prioridades → 03 ajustes (checked one by one)
      tags.forEach((t, i) => {
        const show = smooth(span(P, 1.05 + i * 0.15, 1.35 + i * 0.15)) * (1 - smooth(span(P, 3.3, 3.7)));
        const check = smooth(span(P, 2.05 + i * 0.2, 2.25 + i * 0.2));
        const y = t.y + (1 - show) * 1.2 + (reduce ? 0 : Math.sin(now * 1.2 + i) * 0.06);
        t.a.position.set(YOU.x - 1.2, y, YOU.z + t.dz);
        t.b.position.copy(t.a.position);
        t.todo.opacity = show * (1 - check);
        t.done.opacity = show * check;
      });
      const lit = smooth(span(P, 2.2, 2.9));
      youFacade.emissiveIntensity = 0.04 + lit * 0.7;

      const s3 = smooth(span(P, 2.3, 2.7));
      searcherMat.opacity = s3 * (0.6 + (reduce ? 0 : 0.3 * Math.sin(now * 3)));
      arcMat.opacity = s3 * 0.9;
      arcGeo.setDrawRange(0, Math.floor(ARC_SEGS * smooth(span(P, 2.4, 2.95))) * 6 * 6);

      // 04 acompanhamento: you are on the map too; the shop opens (amber)
      const found = smooth(span(P, 3.05, 3.7));
      youMarker.set(found, now, YOU.h);
      const open = smooth(span(P, 3.2, 3.8));
      shopMat.emissiveIntensity = lit * 0.15 + open * 1.1;
      poolMat.opacity = open * 0.5;

      const i = Math.min(KEYS.length - 2, Math.floor(P));
      const t = smooth(Math.min(1, P - i));
      const A = KEYS[i];
      const B = KEYS[i + 1];
      const ang = lerp(A.ang, B.ang, t) + (reduce ? 0 : Math.sin(now * 0.15) * 0.03);
      const r = lerp(A.r, B.r, t) * (narrow() ? 1.35 : 1);
      target.set(lerp(A.tx, B.tx, t), lerp(A.ty, B.ty, t), lerp(A.tz, B.tz, t));
      camera.position.set(target.x - Math.cos(ang) * r, lerp(A.h, B.h, t) * (narrow() ? 1.2 : 1), target.z + Math.sin(ang) * r);
      camera.lookAt(target);
      return 0.2;
    },
  };
}

export const createScene = (refs: StageRefs) => createStage(refs, build, 41);
