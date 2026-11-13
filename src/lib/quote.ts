import { marketingPlans } from "@/data/marketingPlans";

export const HOME_QUOTE_INTERESTS = [
  { id: "landing-page", label: "Landing page" },
  { id: "hotsite", label: "Hotsite" },
  { id: "institucional", label: "Site institucional" },
  { id: "aplicacao-web", label: "Aplicação web" },
  { id: "midias-digitais", label: "Pacote de mídias digitais" },
  { id: "loja-virtual", label: "Loja virtual ou catálogo digital" },
  { id: "automacoes", label: "Sistemas web ou automações" },
  { id: "design", label: "Identidade visual ou design" },
  { id: "nao-sei", label: "Preciso de orientação" },
] as const;

export const QUOTE_INTERESTS = [
  ...marketingPlans.map((p) => ({ id: p.id, label: p.name })),
  { id: "trafego-pago", label: "Tráfego pago" },
  { id: "redes-sociais", label: "Redes sociais" },
  { id: "leads", label: "Captação de leads" },
  { id: "site", label: "Site ou landing page" },
  ...HOME_QUOTE_INTERESTS,
  { id: "aplicacao", label: "Aplicação / Mini app" },
] as const;

export const QUOTE_GOALS = [
  { id: "marca", label: "Fortalecer a marca" },
  { id: "contatos", label: "Gerar contatos" },
  { id: "leads", label: "Organizar leads" },
  { id: "automatizar", label: "Automatizar processos" },
  { id: "site", label: "Criar um site" },
  { id: "projeto", label: "Definir a solução" },
] as const;

export const QUOTE_BUDGETS = [
  "Até R$ 1.000",
  "R$ 1.000 a R$ 2.000",
  "R$ 2.000 a R$ 5.000",
  "Acima de R$ 5.000",
] as const;

export const QUOTE_STATUSES = [
  "novo",
  "contatado",
  "proposta",
  "fechado",
  "perdido",
] as const;

export const INTEREST_EVENT = "nexusync:interest";

export const QUOTE_SECTIONS = [
  "header",
  "hero",
  "sites",
  "apps",
  "media",
  "form",
  "floating",
  "other",
] as const;

export type QuoteSection = (typeof QUOTE_SECTIONS)[number];

export function isQuoteSection(value: unknown): value is QuoteSection {
  return typeof value === "string" &&
    (QUOTE_SECTIONS as readonly string[]).includes(value);
}

// Pré-seleciona o interesse no formulário de orçamento e leva o visitante até ele.
export function selectInterest(id: string | null, source: QuoteSection = "form") {
  window.dispatchEvent(new CustomEvent(INTEREST_EVENT, { detail: { id, source } }));
  document.getElementById("orcamento")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
