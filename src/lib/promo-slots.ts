export const PROMO_SLOTS = {
  "sites-presence": { label: "Sites · Presence", total: 5 },
  "sites-pulse": { label: "Sites · Pulse", total: 5 },
  "sites-premium": { label: "Sites · Premium", total: 3 },
  "apps-agendamentos": { label: "Apps · Agendamentos Online", total: 5 },
  "apps-gestao": { label: "Apps · Gestão Web & Dashboards", total: 3 },
  "apps-miniapps": { label: "Apps · Mini Apps & Gamificação", total: 5 },
  "design-starter": { label: "Design · Starter", total: 5 },
  "design-profissional": { label: "Design · Profissional", total: 5 },
  "design-premium": { label: "Design · UI/UX Premium", total: 3 },
} as const;

export type PromoKey = keyof typeof PROMO_SLOTS;
export const PROMO_KEYS = Object.keys(PROMO_SLOTS) as PromoKey[];
export type PromoRemaining = Record<PromoKey, number>;

export const MAX_PROMO_SLOTS = 999;
