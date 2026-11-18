"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { appPlans } from "@/data/appPlans";
import { promoView, usePromoSlots } from "@/components/usePromoSlots";
import { PlanActions, PlanDetails, PlanFeatures, PlanPrice } from "./home/PlanPrimitives";
import s from "./home/HomePlans.module.css";

export function PlansApps() {
  const slots = usePromoSlots();
  const [selected, setSelected] = useState(appPlans[0].id);
  const plan = appPlans.find(item => item.id === selected) || appPlans[0];
  const Icon = plan.icon;
  return <section id="aplicacoes" className={`${s.group} ${s.apps}`} aria-labelledby="app-plans-title">
    <div className={s.groupHeader}>
      <div><p className={s.kicker}>04 / APPS & SISTEMAS</p><h3 id="app-plans-title">Menos tarefas.<br /><em>Mais possibilidades.</em></h3></div>
      <div><p>Organizar horários, acompanhar pedidos ou criar uma experiência interativa. Tudo pelo navegador, adaptado à sua rotina.</p><Link href="/apps" className={s.serviceLink}>Experimentar nossos aplicativos <ArrowUpRight size={16} /></Link></div>
    </div>
    <div className={s.appLayout}>
      <div className={s.appOptions} role="group" aria-label="Escolher solução web">{appPlans.map((option, i) => {
        const OptionIcon = option.icon;
        return <button key={option.id} type="button" className={s.appOption} aria-pressed={selected === option.id} aria-controls="app-plan-preview" onClick={() => setSelected(option.id)}>
          <span className={s.optionTop}><span>0{i + 1} / {option.category}</span><OptionIcon size={20} aria-hidden="true" /></span>
          <strong>{option.name}</strong><span className={s.optionBottom}><span>{promoView(slots, option.promoKey, option).displayPrice}</span><ChevronRight size={20} aria-hidden="true" /></span>
        </button>;
      })}</div>
      <div className={s.appPreview} id="app-plan-preview" role="region" aria-labelledby="app-plan-name">
        <p className={s.srOnly} role="status">{plan.name} selecionado. Confira as entregas e o investimento a seguir.</p>
        <div key={plan.id} className={s.appPreviewBody}>
          <div className={s.appPanelTop}><span><i /> SOLUÇÃO EM FOCO</span><span>{plan.code}</span></div>
          <div className={s.appTitle}><span className={s.appIcon}><Icon size={30} strokeWidth={1.3} aria-hidden="true" /></span><div><small>{plan.idealFor}</small><h4 id="app-plan-name">{plan.name}</h4></div></div>
          <p className={s.description}>{plan.description}</p>
          <div className={s.stack}>{plan.stack.map(item => <span key={item}>{item}</span>)}</div>
          <PlanPrice plan={plan} slots={slots} />
          <PlanFeatures features={plan.features.slice(0, 4)} /><PlanDetails plan={plan} />
          <PlanActions plan={plan} interest={plan.id === "app-03" ? "automacoes" : plan.id === "app-02" ? "aplicacao" : "aplicacao-web"} source="apps" />
        </div>
      </div>
    </div>
    <p className={s.note}>Cada solução tem um escopo próprio. Integrações, notificações automáticas e recursos extras são definidos na proposta.</p>
  </section>;
}
