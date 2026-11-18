import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { promoView } from "@/components/usePromoSlots";
import type { PromoKey, PromoRemaining } from "@/lib/promo-slots";
import type { QuoteSection } from "@/lib/quote";
import { waLink } from "@/lib/site-config";
import s from "./HomePlans.module.css";

export type ProjectPlan = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  promoKey: PromoKey;
  deliveryTime: string;
  idealFor: string;
  description: string;
  highlight: boolean;
  badge?: string;
  features: string[];
  scope: string;
  buttonText: string;
  waMessage: string;
};

export function PlanFeatures({ features }: { features: string[] }) {
  return <ul className={s.features}>{features.map(feature => <li key={feature}><Check size={14} aria-hidden="true" /><span>{feature}</span></li>)}</ul>;
}

export function PlanPrice({ plan, slots }: { plan: ProjectPlan; slots: PromoRemaining | null }) {
  const promo = promoView(slots, plan.promoKey, plan);
  return <div className={s.price}>
    <small>{promo.label || "INVESTIMENTO NO PROJETO"}</small>
    <div><strong>{promo.displayPrice}</strong>{promo.originalPrice && <del>De R$ {promo.originalPrice}</del>}</div>
    <span>{plan.deliveryTime}</span>
  </div>;
}

export function PlanDetails({ plan, shown = 4 }: { plan: ProjectPlan; shown?: number }) {
  return <details className={s.details}>
    <summary>Ver todas as entregas <Plus size={15} aria-hidden="true" /></summary>
    {plan.features.length > shown && <PlanFeatures features={plan.features.slice(shown)} />}
    <p className={s.scope}>{plan.scope}</p>
  </details>;
}

export function PlanActions({ plan, interest, source }: { plan: ProjectPlan; interest: string; source: QuoteSection }) {
  return <div className={s.actions}>
    <Link href={`/contato?${new URLSearchParams({ interest, source })}#orcamento`} className={s.button}>{plan.buttonText}<ArrowUpRight size={18} aria-hidden="true" /></Link>
    <a className={s.whatsapp} href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer" data-analytics-section={source} data-analytics-interest={interest}>Conversar pelo WhatsApp <ArrowUpRight size={13} aria-hidden="true" /></a>
  </div>;
}

export function SitePlanCard({ plan, slots, interest }: { plan: ProjectPlan; slots: PromoRemaining | null; interest: string }) {
  return <article className={`${s.card} ${s.siteCard}`} data-featured={plan.highlight}>
    <div className={s.browserBar} aria-hidden="true"><span><i /><i /><i /></span><span>NEXUSYNC / WEB {plan.id}</span><ArrowUpRight size={13} /></div>
    <div className={s.cardBody}>
      <div className={s.cardTop}><span>/{plan.id}</span><span>{plan.badge || "FEITO PARA SUA PRÓXIMA FASE"}</span></div>
      <h4>{plan.name}<span aria-hidden="true">↗</span></h4>
      <p className={s.description}>{plan.description}</p>
      <PlanPrice plan={plan} slots={slots} />
      <PlanFeatures features={plan.features.slice(0, 4)} />
      <PlanDetails plan={plan} />
      <PlanActions plan={plan} interest={interest} source="sites" />
    </div>
  </article>;
}
