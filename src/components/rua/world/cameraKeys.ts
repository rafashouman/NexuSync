/** One camera framing (and scene state) per [data-key] section of the home, in page order. */
export type Vec3 = [number, number, number];
export type CameraKey = {
  pos: Vec3;
  tgt: Vec3;
  shift: number;
  shiftY: number;
  city: number;
  rival: number;
  you: number;
  beam: number;
  scan: number;
  grow: number;
  veilS: number;
  veilF: number;
  tagR: number;
  tagY: number;
  signs: number;
};

export const DEFAULT_KEY: CameraKey = {
  pos: [0, 20, 30], tgt: [0, 0, 0], shift: 0, shiftY: 0, city: 0.3, rival: 1, you: 0, beam: 0,
  scan: 0, grow: 0, veilS: 0, veilF: 0, tagR: 0, tagY: 0, signs: 0,
};

const key = (k: Partial<CameraKey>): CameraKey => ({ ...DEFAULT_KEY, ...k });
const lit = { you: 1, beam: 1, scan: 1, grow: 1 };

export const METHOD = 4;

export const cameraKeys: CameraKey[] = [
  key({ pos: [4, 21, 33], tgt: [-0.5, 1.5, -5], shift: 0.2, shiftY: -0.02, city: 0.35, rival: 1, veilS: 0.92, tagR: 1, tagY: 1 }), // 0 hero
  key({ pos: [-3, 3, 16], tgt: [6.5, 1.9, 3.6], shift: 0.22, city: 0.14, rival: 0.45, veilS: 0.96 }), // 1 dor
  key({ pos: [-8, 8, 18], tgt: [5.2, 4.2, 3.8], shift: 0.2, city: 0.2, rival: 0.5, veilS: 0.96, signs: 1 }), // 2 tentativas
  key({ pos: [4, 34, 46], tgt: [0, 0, -10], city: 0.55, rival: 1, veilF: 0.74 }), // 3 agora
  DEFAULT_KEY, // 4 método (orbit, see methodKey)
  key({ pos: [30, 22, -20], tgt: [2, 0, -2], city: 0.55, rival: 0.7, ...lit, veilF: 0.8 }), // 5 pra quem
  key({ pos: [-12, 10, 19], tgt: [6.5, 2.8, 4], shift: 0.22, city: 0.4, rival: 0.6, ...lit, veilS: 0.96 }), // 6 entregáveis
  key({ pos: [-26, 24, 8], tgt: [3, 0, -2], city: 0.6, rival: 0.55, ...lit, veilF: 0.82 }), // 7 pilares
  key({ pos: [7.5, 56, 5.2], tgt: [7.5, 0, 4], shiftY: 0.3, city: 0.65, rival: 0.55, ...lit, veilF: 0.42, tagY: 1 }), // 8 final (map)
];

export const LAST = cameraKeys.length - 1;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

/** The method section orbits the visitor's building while it is diagnosed, built, lit and found. */
export function methodKey(p: number): CameraKey {
  const a = lerp(-1.9, -0.38, smooth(p));
  const r = 15;
  const tg: [number, number, number] = [7.5, 2.6 + p * 1.4, 4];
  return key({
    pos: [tg[0] + Math.sin(a) * r, lerp(7, 12, p), tg[2] + Math.cos(a) * r],
    tgt: tg,
    shift: 0.22,
    city: 0.25 + 0.25 * p,
    rival: lerp(0.8, 0.5, p),
    scan: ramp(p, 0.02, 0.24),
    grow: smooth(ramp(p, 0.26, 0.48)),
    you: ramp(p, 0.52, 0.74),
    beam: smooth(ramp(p, 0.77, 0.95)),
    veilS: 0.96,
    tagY: ramp(p, 0.9, 1),
  });
}

export function mixKey(A: CameraKey, B: CameraKey, t: number): CameraKey {
  const out = { ...A };
  out.pos = A.pos.map((v, j) => lerp(v, B.pos[j], t)) as Vec3;
  out.tgt = A.tgt.map((v, j) => lerp(v, B.tgt[j], t)) as Vec3;
  for (const k of ["shift", "shiftY", "city", "rival", "you", "beam", "scan", "grow", "veilS", "veilF", "tagR", "tagY", "signs"] as const) {
    out[k] = lerp(A[k], B[k], t);
  }
  out.pos[1] += Math.sin(Math.PI * t) * 5;
  return out;
}
