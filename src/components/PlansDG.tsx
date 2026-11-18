"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { designPlans } from "@/data/designPlans";
import { usePromoSlots } from "@/components/usePromoSlots";
import { PlanActions, PlanDetails, PlanFeatures, PlanPrice } from "./home/PlanPrimitives";
import s from "./home/HomePlans.module.css";

function DesignPrint({ index }: { index: number }) {
  return <div className={s.designPrint} data-print={index} aria-hidden="true">
    <span>N/ STUDIO</span>
    {index === 0 ? <strong>Aa<span>↗</span></strong> : index === 1 ? <svg viewBox="0 0 200 200" fill="none">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="100" cy="100" rx="80" ry="30" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${i * 22.5} 100 100)`} />)}</svg> : <div className={s.interfacePrint}><i /><i /><i /><i /></div>}
    <small>{["COR. FORMA. PRESENÇA.", "UMA MARCA. UM UNIVERSO.", "PENSADO PARA NAVEGAR."][index]}</small>
  </div>;
}

export function PlansDG() {
  const slots = usePromoSlots();
  return <section id="midias-digitais" className={`${s.group} ${s.design}`} aria-labelledby="design-plans-title">
    <div className={s.groupHeader}>
      <div><p className={s.kicker}>03 / DESIGN & IDENTIDADE</p><h3 id="design-plans-title">Reconhecível.<br /><em>Antes da primeira palavra.</em></h3></div>
      <div><p>Da peça da campanha à identidade da marca. Design para apresentar sua oferta com personalidade e clareza.</p><Link href="/design" className={s.serviceLink}>Explorar design e motion <ArrowUpRight size={16} /></Link></div>
    </div>
    <div className={s.designList}>{designPlans.map((plan, i) => <article key={plan.id} className={s.designCard} data-featured={plan.highlight}>
      <DesignPrint index={i} />
      <div className={s.designContent}><span className={s.designTag}>/{plan.id} — {plan.tag}</span><h4>{plan.name}</h4><p className={s.description}>{plan.description}</p><PlanFeatures features={plan.deliverablesSummary} /><PlanDetails plan={plan} shown={0} /></div>
      <div className={s.designInvestment}><PlanPrice plan={plan} slots={slots} /><PlanActions plan={plan} interest={i === 0 ? "midias-digitais" : "design"} source="media" /></div>
    </article>)}</div>
    <aside className={s.custom}><p>Sua marca também pode ganhar movimento. Vídeos curtos, títulos cinéticos e animações sob medida.</p><Link href="/design#motion-graphics">Conhecer motion graphics <ArrowUpRight size={16} /></Link></aside>
  </section>;
}
