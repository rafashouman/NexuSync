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
  const [step, setStep] = useState(0);
  const goal = goals[selected];
  const Icon = goal.icon;
  const scenes = [
    [
      { eyebrow: "BUSCA LOCAL", title: "arquitetura em porto alegre", body: "Ateliê Vão · Arquitetura", detail: "Projetos residenciais e interiores. Conheça nosso trabalho." },
      { eyebrow: "PÁGINA DA EMPRESA", title: "Espaços para viver melhor.", body: "Projetos que começam pela forma de viver.", detail: "Portfólio · serviços · contato" },
      { eyebrow: "CONTATO", title: "Vamos conversar?", body: "Conte sobre seu espaço e suas ideias.", detail: "O atendimento continua no canal escolhido." },
    ],
    [
      { eyebrow: "ANÚNCIO ILUSTRATIVO", title: "Seu espaço, seu jeito.", body: "Conheça os projetos do Ateliê Vão.", detail: "Uma oferta apresentada ao público certo." },
      { eyebrow: "PÁGINA DE OFERTA", title: "Um projeto começa aqui.", body: "Entenda o serviço e conheça o portfólio.", detail: "Informação clara antes do contato." },
      { eyebrow: "ATENDIMENTO", title: "Oi! Quero saber mais.", body: "O interesse chega ao canal combinado.", detail: "A equipe segue a conversa com o cliente." },
    ],
    [
      { eyebrow: "NOVO CONTATO", title: "Pedido de informações", body: "Interesse em um projeto residencial.", detail: "Dados demonstrativos · nenhum envio real." },
      { eyebrow: "ACOMPANHAMENTO", title: "Próximo passo: retornar", body: "Contato organizado na etapa de atendimento.", detail: "Acompanhe o que ainda precisa de resposta." },
      { eyebrow: "RETORNO", title: "Conversa em andamento", body: "A equipe dá continuidade ao atendimento.", detail: "Cada oportunidade com um caminho definido." },
    ],
  ];
  const scene = scenes[selected][step];
  return <div className={s.playground}><div className={s.goalTabs} role="group" aria-label="Explore um objetivo de marketing">{goals.map((item, i) => <button key={item.label} aria-pressed={selected === i} onClick={() => { setSelected(i); setStep(0); }}>{item.label}</button>)}</div>
    <div className={s.goalPanel}><div className={s.panelTop}><span>UMA JORNADA, TRÊS MOMENTOS / SIMULAÇÃO</span><Icon size={20} /></div><div className={s.panelBody}><span className={s.micro}>ESTRATÉGIA / {goal.channel}</span><h2>{goal.title}<br /><em>{goal.accent}</em></h2><div className={s.journey} aria-live="polite"><div className={s.journeyBar}><span>0{step + 1} / {scene.eyebrow}</span><span>DEMONSTRAÇÃO</span></div><div className={s.journeyContent} key={`${selected}-${step}`}><small>{goal.path[step]}</small><strong>{scene.title}</strong><b>{scene.body}</b><p>{scene.detail}</p></div><button onClick={() => setStep((step + 1) % 3)}>{step === 2 ? "Recomeçar jornada" : "Ver próximo passo"}<ArrowUpRight size={14} /></button></div><ol className={s.pathSteps}>{goal.path.map((item, i) => <li key={item} data-active={step === i}><span>0{i + 1}</span>{item}</li>)}</ol><p>{goal.text}</p><Link href={`#marketing-${goal.href}`} className={s.panelLink}>Ver escopo e investimento<ArrowUpRight size={14} /></Link></div></div><p className={s.demoNote}>Uma visão do caminho de cada serviço. O plano parte do objetivo e da realidade do seu negócio.</p>
  </div>;
}
