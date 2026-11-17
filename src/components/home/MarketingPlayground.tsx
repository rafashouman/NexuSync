"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Megaphone, Workflow } from "lucide-react";
import s from "./MarketingExperience.module.css";

const goals = [
  { label: "Ser encontrado", title: "Da busca", accent: "à sua empresa.", icon: Search, path: ["PESQUISA", "SUA OFERTA", "CONTATO"], channel: "SEO E PRESENÇA LOCAL", text: "Diagnóstico e melhorias na estrutura do site, conteúdo e presença nas buscas. Prioridades e entregas definidas na proposta.", href: "seo-local" },
  { label: "Divulgar minha oferta", title: "Da descoberta", accent: "à conversa.", icon: Megaphone, path: ["ANÚNCIO", "WHATSAPP OU SITE", "ATENDIMENTO"], channel: "TRÁFEGO PAGO", text: "Campanhas no Facebook e Instagram com destinos como WhatsApp ou uma página de oferta. A verba de mídia é separada da gestão.", href: "aquisicao-local" },
  { label: "Organizar contatos", title: "Do interesse", accent: "ao próximo passo.", icon: Workflow, path: ["CONTATO", "ACOMPANHAMENTO", "RETORNO"], channel: "LEADS E AUTOMAÇÕES", text: "Organização de etapas e retornos conforme o plano. Integrações e automações passam por avaliação de compatibilidade.", href: "crescimento-integrado" },
];

export function MarketingPlayground() {
  const [selected, setSelected] = useState(0);
  const goal = goals[selected];
  const Icon = goal.icon;
  return <div className={s.playground}><div className={s.goalTabs} role="group" aria-label="Explore um objetivo de marketing">{goals.map((item, i) => <button key={item.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.label}</button>)}</div>
    <div className={s.goalPanel}><div className={s.panelTop}><span>ESCOLHA O OBJETIVO. EXPLORE O CAMINHO.</span><Icon size={20} /></div><div className={s.panelBody} aria-live="polite"><span className={s.micro}>ESTRATÉGIA / {goal.channel}</span><h2>{goal.title}<br /><em>{goal.accent}</em></h2><div className={s.diagram} aria-hidden="true"><svg viewBox="0 0 420 150" fill="none"><path d="M20 100C95 100 75 40 155 40S240 110 305 70 365 40 400 40" stroke="#3459ff" strokeWidth="1" /><path className={s.signalPath} d="M20 100C95 100 75 40 155 40S240 110 305 70 365 40 400 40" stroke="#d4ff38" strokeWidth="3" strokeLinecap="round" /><circle cx="20" cy="100" r="6" fill="#d4ff38" /><circle cx="155" cy="40" r="9" fill="#080b12" stroke="#8be7c5" /><circle cx="305" cy="70" r="6" fill="#3459ff" /><circle cx="400" cy="40" r="6" fill="#d4ff38" /></svg><span>↗</span></div><ol className={s.pathSteps}>{goal.path.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol><p>{goal.text}</p><Link href={`#marketing-${goal.href}`} className={s.panelLink}>Ver escopo e investimento<ArrowUpRight size={14} /></Link></div></div><p className={s.demoNote}>Uma visão do caminho de cada serviço. O plano parte do objetivo e da realidade do seu negócio.</p>
  </div>;
}
