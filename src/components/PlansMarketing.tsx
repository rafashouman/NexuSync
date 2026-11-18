"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { marketingMicrocopy, marketingPlans } from "@/data/marketingPlans";
import { publicPriceCents } from "@/lib/public-pricing";
import { waLink } from "@/lib/site-config";
import { MarketingPlanLink } from "./home/MarketingPlanLink";
import { PlanFeatures } from "./home/PlanPrimitives";
import s from "./home/HomePlans.module.css";

const channels = ["SOCIAL MEDIA", "SEO & PRESENÇA LOCAL", "TRÁFEGO PAGO", "ESTRATÉGIA INTEGRADA"];
const chartPaths = ["M0 45 22 38 44 41 66 20 88 26 112 5", "M0 48 22 48 44 35 66 35 88 16 112 16", "M0 45 22 35 44 40 66 13 88 22 112 3", "M0 46 22 40 44 25 66 30 88 10 112 0"];

export function PlansMarketing() {
  return <section id="planos-marketing" className={`${s.group} ${s.marketing}`} aria-labelledby="marketing-plans-title">
    <div className={s.groupHeader}>
      <div><p className={s.kicker}>02 / TRÁFEGO, SEO & SOCIAL MEDIA</p><h3 id="marketing-plans-title">Presença com direção.<br /><em>Conexões que avançam.</em></h3></div>
      <div><p>Conteúdo, buscas e anúncios com um objetivo claro. Combine os canais que fazem sentido para sua empresa.</p><Link href="/marketing" className={s.serviceLink}>Conhecer nossa estratégia <ArrowUpRight size={16} /></Link></div>
    </div>
    <div className={s.marketingGrid}>{marketingPlans.map((plan, i) => <article key={plan.id} className={`${s.card} ${s.marketingCard}`} data-featured={plan.highlight}>
      <div className={s.campaignTop}><span><i /> {channels[i]}</span><span>0{i + 1}</span></div>
      <div className={s.campaignHeading}><h4>{plan.name}</h4><svg viewBox="0 0 120 58" fill="none" aria-hidden="true"><path d="M0 12H120M0 32H120M0 52H120" stroke="currentColor" opacity=".15" /><path d={chartPaths[i]} stroke="currentColor" strokeWidth="2" /></svg></div>
      <p className={s.description}>{plan.description}</p>
      <div className={s.price}><small>{plan.badge || "GESTÃO MENSAL"}</small><div><strong>{publicPriceCents(plan.monthlyPriceCents)}</strong>{plan.monthlyPriceCents !== null && plan.monthlyPriceCents <= 90000 && <span>/mês</span>}</div><span>{plan.setupPriceCents === null || plan.setupPriceCents > 90000 ? "Implantação sob consulta" : `+ ${publicPriceCents(plan.setupPriceCents)} de implantação única`}</span></div>
      <PlanFeatures features={plan.features.slice(0, 3)} />
      <details className={s.details}><summary>Ver entregas e limites <Plus size={15} aria-hidden="true" /></summary><PlanFeatures features={plan.features.slice(3)} />{plan.details.map(detail => <p key={detail}>{detail}</p>)}<strong className={s.detailLabel}>Não inclui</strong><ul className={s.exclusions}>{plan.exclusions.map(exclusion => <li key={exclusion}>{exclusion}</li>)}</ul><p>{plan.onboardingTime}</p></details>
      <div className={s.actions}><MarketingPlanLink id={plan.id} className={s.button}>{plan.buttonText}</MarketingPlanLink><a className={s.whatsapp} href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer" data-analytics-section="planos-marketing" data-analytics-interest={plan.id}>Conversar pelo WhatsApp <ArrowUpRight size={13} /></a></div>
    </article>)}</div>
    <p className={s.note}>{marketingMicrocopy}</p>
  </section>;
}
