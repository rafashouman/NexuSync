/**
 * Rota Litoral: trajeto, hora do dia e mapeamento do scroll.
 * Módulo sem dependências (nem three): HUD e cena usam as mesmas funções sem pesar o bundle da página.
 */

export const ROUTE_LENGTH = 520;
export const TOTAL_KM = 42;

export type Stop = { id: string; km: number; t: number; label: string; period: string };

/** t = posição do carro no trajeto (0 a 1). */
export const STOPS: Stop[] = [
  { id: "partida", km: 0, t: 0, label: "Partida", period: "Amanhecer" },
  { id: "quartos", km: 10, t: 0.24, label: "Quartos", period: "Manhã" },
  { id: "passeios", km: 21, t: 0.5, label: "Passeios", period: "Tarde" },
  { id: "mesa", km: 31, t: 0.75, label: "À mesa", period: "Entardecer" },
  { id: "reserva", km: 42, t: 1, label: "Reserva", period: "Noite" },
];

type Rgb = [number, number, number];

const hex = (value: string): Rgb => [
  parseInt(value.slice(1, 3), 16) / 255,
  parseInt(value.slice(3, 5), 16) / 255,
  parseInt(value.slice(5, 7), 16) / 255,
];

const KEYS = [
  { t: 0, hour: 6.1, top: "#6aa6d6", horizon: "#f6b985", sun: "#ffcf9a", sunI: 1.5, amb: "#bcd3ec", ambG: "#caa07a", ambI: 0.75, night: 0 },
  { t: 0.24, hour: 9.4, top: "#4aa4e6", horizon: "#cde9f4", sun: "#fff1d2", sunI: 2.4, amb: "#d6ecff", ambG: "#c9b88f", ambI: 0.95, night: 0 },
  { t: 0.5, hour: 14.6, top: "#3a93da", horizon: "#f2e2b4", sun: "#ffe0a0", sunI: 2.3, amb: "#e5f0ff", ambG: "#d2b27d", ambI: 0.9, night: 0 },
  { t: 0.75, hour: 17.9, top: "#2d5f93", horizon: "#ff8a55", sun: "#ff7a45", sunI: 1.6, amb: "#e9b99d", ambG: "#6b5648", ambI: 0.7, night: 0.12 },
  { t: 0.88, hour: 19.4, top: "#1c3f72", horizon: "#d9604a", sun: "#c4573f", sunI: 0.8, amb: "#7d8fb8", ambG: "#3b3a4a", ambI: 0.55, night: 0.55 },
  { t: 1, hour: 21, top: "#06142b", horizon: "#17355e", sun: "#8fb4ff", sunI: 0.5, amb: "#3a5d96", ambG: "#101d33", ambI: 0.6, night: 1 },
].map((key) => ({
  ...key,
  top: hex(key.top),
  horizon: hex(key.horizon),
  sun: hex(key.sun),
  amb: hex(key.amb),
  ambG: hex(key.ambG),
}));

export interface SkyState {
  hour: number;
  night: number;
  sunI: number;
  ambI: number;
  top: Rgb;
  horizon: Rgb;
  sun: Rgb;
  amb: Rgb;
  ambG: Rgb;
}

export function createSky(): SkyState {
  return {
    hour: 6,
    night: 0,
    sunI: 1,
    ambI: 1,
    top: [0, 0, 0],
    horizon: [0, 0, 0],
    sun: [0, 0, 0],
    amb: [0, 0, 0],
    ambG: [0, 0, 0],
  };
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
export const smooth = (x: number) => x * x * (3 - 2 * x);

function mix(out: Rgb, a: Rgb, b: Rgb, f: number) {
  out[0] = lerp(a[0], b[0], f);
  out[1] = lerp(a[1], b[1], f);
  out[2] = lerp(a[2], b[2], f);
}

/** Cores, luz e hora do dia para uma posição do trajeto. Escreve em `out` para não gerar lixo a cada frame. */
export function skyAt(t: number, out: SkyState = createSky()): SkyState {
  const c = clamp(t);
  let i = 0;
  while (i < KEYS.length - 2 && c > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const f = smooth(clamp((c - a.t) / (b.t - a.t)));
  out.hour = lerp(a.hour, b.hour, f);
  out.night = lerp(a.night, b.night, f);
  out.sunI = lerp(a.sunI, b.sunI, f);
  out.ambI = lerp(a.ambI, b.ambI, f);
  mix(out.top, a.top, b.top, f);
  mix(out.horizon, a.horizon, b.horizon, f);
  mix(out.sun, a.sun, b.sun, f);
  mix(out.amb, a.amb, b.amb, f);
  mix(out.ambG, a.ambG, b.ambG, f);
  return out;
}

export function rgbCss(color: Rgb) {
  return `rgb(${Math.round(color[0] * 255)} ${Math.round(color[1] * 255)} ${Math.round(color[2] * 255)})`;
}

export function formatHour(hour: number) {
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Quanto o carro "está parado" em uma parada: 1 no ponto exato, 0 longe dela. */
export function dwellOf(t: number, stopIndex: number) {
  const distance = Math.abs(t - STOPS[stopIndex].t);
  return 1 - smooth(clamp((distance - 0.012) / 0.033));
}

export type ScrollKey = [scrollY: number, t: number];

/**
 * Converte a altura real de cada seção em pontos de scroll: o carro anda entre as paradas e
 * fica parado enquanto a seção ocupa o meio da tela.
 */
export function buildScrollKeys(tops: number[], heights: number[], viewport: number, maxScroll: number): ScrollKey[] {
  const keys: ScrollKey[] = [];
  tops.forEach((top, index) => {
    const center = clamp(top + heights[index] / 2 - viewport / 2, 0, maxScroll);
    const dwell = Math.min(heights[index] * 0.2, viewport * 0.3);
    keys.push([center - dwell, STOPS[index].t], [center + dwell, STOPS[index].t]);
  });
  keys.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < keys.length; i++) {
    if (keys[i][0] <= keys[i - 1][0]) keys[i][0] = keys[i - 1][0] + 0.5;
  }
  return keys;
}

export function tAtScroll(keys: ScrollKey[], y: number) {
  if (y <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (y <= keys[i][0]) {
      const [y0, t0] = keys[i - 1];
      const [y1, t1] = keys[i];
      return lerp(t0, t1, (y - y0) / (y1 - y0));
    }
  }
  return keys[keys.length - 1][1];
}
