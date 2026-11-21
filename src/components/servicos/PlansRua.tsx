"use client";

import { appPlans } from "@/data/appPlans";
import { designPlans } from "@/data/designPlans";
import { sitePlans } from "@/data/sitePlans";
import { promoView, usePromoSlots } from "@/components/usePromoSlots";
import { waLink } from "@/lib/site-config";
import { ArrowIcon } from "@/components/rua/icons";
import s from "./servico.module.css";

type Kind = "sites" | "commerce" | "apps" | "design";

// Data is read here (not passed from the server) because appPlans carries icon components.
const sources = {
  sites: { plans: sitePlans, section: "sites", interest: "site" },
  commerce: { plans: sitePlans.slice(1), section: "lojas", interest: "site" },
  apps: { plans: appPlans, section: "apps", interest: "aplicacao-web" },
  design: { plans: designPlans, section: "media", interest: "design" },
} as const;

/** Plans with full feature lists. Prices and promo slots come only from the data files and the slots API. */
export function PlansRua({ kind = "sites" }: { kind?: Kind }) {
  const slots = usePromoSlots();
  const { plans, section, interest } = sources[kind];
  return (
    <div className={`${s.plans} ${plans.length === 2 ? s.plans2 : ""}`}>
      {plans.map((plan) => {
        const promo = promoView(slots, plan.promoKey, plan);
        const badge = plan.highlight ? ("badge" in plan && plan.badge ? plan.badge : "Recomendado") : plan.idealFor;
        return (
          <article key={plan.id} className={s.plan} data-featured={plan.highlight}>
            <header>
              <span>/{plan.id}</span>
              <span className={plan.highlight ? s.badge : undefined}>{badge}</span>
            </header>
            <h3>{plan.name}</h3>
            <p className={s.planDesc}>{plan.description}</p>
            <div className={s.price}>
              <small>{promo.label || "Investimento no projeto"}</small>
              {promo.originalPrice && <del>De R$ {promo.originalPrice}</del>}
              <strong>{promo.displayPrice}</strong>
              <span>{plan.deliveryTime}</span>
            </div>
            <ul className={s.feats}>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <p className={s.scope}>{plan.scope}</p>
            <a className={s.planBtn} href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer"
              data-analytics-section={section} data-analytics-interest={interest}>
              <span>{plan.buttonText}</span>
              <em aria-hidden="true"><ArrowIcon /></em>
            </a>
          </article>
        );
      })}
    </div>
  );
}
