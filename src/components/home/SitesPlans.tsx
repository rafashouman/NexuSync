"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { sitePlans } from "@/data/sitePlans";
import { promoView, usePromoSlots } from "@/components/usePromoSlots";
import { waLink } from "@/lib/site-config";
import s from "./SitesExperience.module.css";

export function SitesPlans({ commerceOnly = false, className = "" }: { commerceOnly?: boolean; className?: string } = {}) {
  const slots = usePromoSlots();
  return <div className={`${s.planGrid} ${className}`}>{(commerceOnly ? sitePlans.slice(1) : sitePlans).map(plan => {
    const promo = promoView(slots, plan.promoKey, plan);
    return <article key={plan.id} className={s.plan} data-featured={plan.highlight}>
      <div className={s.planTop}><span>/{plan.id}</span><span>{plan.highlight ? "RECOMENDADO" : plan.idealFor}</span></div>
      <h3>{plan.name}</h3><p>{plan.description}</p>
      <div className={s.price}><small>{promo.label || "INVESTIMENTO NO PROJETO"}</small>{promo.originalPrice && <del>De R$ {promo.originalPrice}</del>}<strong>{promo.displayPrice}</strong><span>{plan.deliveryTime}</span></div>
      <ul>{plan.features.map(feature => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
      <p className={s.scope}>{plan.scope}</p>
      <a href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer" data-analytics-section="sites" data-analytics-interest="site" className={s.button}>{plan.buttonText}<ArrowUpRight size={18} /></a>
    </article>;
  })}</div>;
}
