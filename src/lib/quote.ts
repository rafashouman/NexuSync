import { marketingPlans } from "@/data/marketingPlans";

export const QUOTE_INTERESTS = [
  ...marketingPlans.map((p) => ({ id: p.id, label: p.name })),
  { id: "trafego-pago", label: "Tráfego pago" },
  { id: "redes-sociais", label: "Redes sociais" },
  { id: "leads", label: "Captação de leads" },
  { id: "automacoes", label: "Automações" },
  { id: "site", label: "Site ou landing page" },
  { id: "landing-page", label: "Landing page" },
  { id: "hotsite", label: "Hotsite" },
  { id: "institucional", label: "Site institucional" },
  { id: "loja-virtual", label: "Loja virtual" },
  { id: "aplicacao", label: "Aplicação / Mini app" },
  { id: "design", label: "Design" },
  { id: "nao-sei", label: "Ainda não sei" },
] as const;

export const QUOTE_GOALS = [
  { id: "marca", label: "Fortalecer a marca" },
  { id: "contatos", label: "Gerar contatos" },
  { id: "leads", label: "Organizar leads" },
  { id: "automatizar", label: "Automatizar processos" },
  { id: "site", label: "Criar um site" },
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

// Pré-seleciona o interesse no formulário de orçamento e leva o visitante até ele.
export function selectInterest(id: string) {
  window.dispatchEvent(new CustomEvent(INTEREST_EVENT, { detail: { id } }));
  document.getElementById("orcamento")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
