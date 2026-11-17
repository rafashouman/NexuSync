"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { appPlans } from "@/data/appPlans";
import { designPlans } from "@/data/designPlans";
import { promoView, usePromoSlots } from "@/components/usePromoSlots";
import { waLink } from "@/lib/site-config";
import s from "./SitesExperience.module.css";
import c from "./CreativeExperience.module.css";

export function ServiceOffers({ kind }: { kind: "apps" | "design" }) {
  const slots = usePromoSlots();
  const plans = kind === "apps" ? appPlans : designPlans;
  return <div className={s.planGrid}>{plans.map(plan => {
    const promo = promoView(slots, plan.promoKey, plan);
    return <article key={plan.id} className={`${s.plan} ${c.offer}`} data-featured={plan.highlight}>
      <div className={s.planTop}><span>/{plan.id}</span><span>{plan.idealFor}</span></div>
      <h3>{plan.name}</h3><p>{plan.description}</p>
      <div className={s.price}><small>{promo.label || "INVESTIMENTO NO PROJETO"}</small>{promo.originalPrice && <del>De R$ {promo.originalPrice}</del>}<strong>{promo.displayPrice}</strong><span>{plan.deliveryTime}</span></div>
      <ul>{plan.features.map(feature => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
      <p className={s.scope}>{plan.scope}</p><a href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer" className={s.button} data-analytics-section={kind === "apps" ? "apps" : "media"} data-analytics-interest={kind === "apps" ? "aplicacao-web" : "design"}>{plan.buttonText}<ArrowUpRight size={18} /></a>
    </article>;
  })}</div>;
}
