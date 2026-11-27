/** Ad projection guided by CPA (cost per sale). Pure functions, shared by the calculator page. */

export type CpaMode = "site" | "whats";
export type CpaGoal = "verba" | "meta";
export type CpaVerdict = "lucro" | "empate" | "prejuizo";

export type CpaProduct = {
  nome: string;
  modo: CpaMode;
  obj: CpaGoal;
  /** Sale price. */
  ticket: number;
  /** Costs of each sale besides the ad: card fee, tax, delivery, material, hours. */
  custos: number;
  /** Ad budget for the period (goal "verba"). */
  verba: number;
  /** Sales wanted (goal "meta"). */
  meta: number;
  /** Cost per click (site) or per conversation (WhatsApp). */
  unit: number;
  /** Conversion (site) or closing rate (WhatsApp), in percent. */
  taxa: number;
};

export type CpaResult = {
  verba: number;
  unidades: number;
  vendas: number;
  cpa: number;
  fat: number;
  sobra: number;
  roas: number;
  /** Highest cost per sale that still breaks even: price minus costs. */
  max: number;
  /** Target cost per sale, with room for the ad to vary. */
  alvo: number;
  margem: number;
  sit: CpaVerdict;
};

/** Share of the break-even cost used as target. */
export const CPA_TARGET_SHARE = 0.65;

/** Pessimistic, likely and optimistic: multipliers for the unit cost and the rate. */
export const CPA_SCENARIOS = [
  ["Pessimista", 1.3, 0.7],
  ["Provável", 1, 1],
  ["Otimista", 0.8, 1.2],
] as const;

export function cpaProjection(p: CpaProduct, unitFactor = 1, rateFactor = 1): CpaResult {
  const unit = p.unit * unitFactor;
  const rate = (p.taxa / 100) * rateFactor;
  const margem = p.ticket - p.custos;
  let verba: number;
  let unidades: number;
  if (p.obj === "meta") {
    unidades = rate > 0 ? p.meta / rate : Infinity;
    verba = unidades * unit;
  } else {
    verba = p.verba;
    unidades = unit > 0 ? verba / unit : 0;
  }
  const vendas = Number.isFinite(unidades) ? unidades * rate : 0;
  const cpa = vendas > 0 ? verba / vendas : Infinity;
  const fat = vendas * p.ticket;
  const sobra = vendas * margem - (Number.isFinite(verba) ? verba : 0);
  const max = margem;
  const alvo = margem * CPA_TARGET_SHARE;
  const sit: CpaVerdict = margem <= 0 ? "prejuizo" : cpa <= alvo ? "lucro" : cpa <= max ? "empate" : "prejuizo";
  return { verba, unidades, vendas, cpa, fat, sobra, roas: verba > 0 && Number.isFinite(verba) ? fat / verba : 0, max, alvo, margem, sit };
}

/** Reads "1.234,56", "1234.56" or "R$ 12" typed by the visitor. */
export function parseBrNumber(value: string): number {
  let s = value.replace(/[^\d,.-]/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const formatBrl = (value: number) =>
  Number.isFinite(value) ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "sem venda";

export const formatCount = (value: number) =>
  Number.isFinite(value) ? value.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "-";
