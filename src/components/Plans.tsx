"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { sitePlans } from "@/data/sitePlans";
import { usePromoSlots } from "@/components/usePromoSlots";
import { SitePlanCard } from "./home/PlanPrimitives";
import s from "./home/HomePlans.module.css";

export function Plans({ sitesOnly = false, commerceOnly = false }: { sitesOnly?: boolean; commerceOnly?: boolean }) {
  const slots = usePromoSlots();
  return <section id="planos-sites" className={`${s.group} ${s.sites}`} aria-labelledby="site-plans-title">
    <div className={s.groupHeader}>
      <div><p className={s.kicker}>01 / SITES & LOJAS VIRTUAIS</p><h3 id="site-plans-title">Seu endereço.<br /><em>Sua próxima fase.</em></h3></div>
      <div><p>Da primeira presença digital ao seu e-commerce. Escolha a estrutura que acompanha o momento do seu negócio.</p><Link href="/criacao-de-sites" className={s.serviceLink}>Explorar criação de sites <ArrowUpRight size={16} /></Link></div>
    </div>
    <div className={s.siteGrid}>
      {(commerceOnly ? sitePlans.slice(1) : sitePlans).map(plan => <SitePlanCard key={plan.id} plan={plan} slots={slots} interest={plan.id === "03" || commerceOnly ? "loja-virtual" : plan.id === "01" ? "landing-page" : "institucional"} />)}
    </div>
    {sitesOnly && <aside className={s.custom}><p>Vai lançar uma campanha ou um evento? Conheça os hotsites sob medida.</p><Link href="/contato?interest=hotsite&source=sites#orcamento">Conversar sobre um hotsite <ArrowUpRight size={16} /></Link></aside>}
    <p className={s.note}>Projetos com escopo definido na proposta. Domínio, hospedagem e recursos adicionais são avaliados separadamente.</p>
  </section>;
}
