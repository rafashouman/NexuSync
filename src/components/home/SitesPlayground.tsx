"use client";

import { useState } from "react";
import { ProjectBackdrop } from "./ProjectBackdrop";
import { projectBackgrounds } from "./project-backgrounds";
import { ArrowUpRight, MousePointer2, Check } from "lucide-react";
import s from "./SitesExperience.module.css";

const formats = [
  { label: "Institucional", name: "Sua empresa.", accent: "Bem apresentada.", action: "Conhecer serviços", detail: "Apresente sua empresa, explique os serviços e transmita confiança antes da primeira conversa." },
  { label: "Landing page", name: "Uma oferta.", accent: "Um próximo passo.", action: "Quero saber mais", detail: "Concentre uma oferta e leve o visitante de uma campanha ao pedido de orçamento." },
  { label: "Hotsite", name: "Seu lançamento.", accent: "Em destaque.", action: "Quero participar", detail: "Dê uma página própria a uma campanha, evento ou lançamento. Recursos definidos no escopo." },
];

export function SitesPlayground() {
  const [selected, setSelected] = useState(0);
  const [previewContact, setPreviewContact] = useState(false);
  const format = formats[selected];
  return <div className={s.playground}>
    <div className={s.previewControls} role="group" aria-label="Escolha o formato da demonstração">
      {formats.map((item, i) => <button key={item.label} aria-pressed={selected === i} onClick={() => { setSelected(i); setPreviewContact(false); }}>{item.label}</button>)}
    </div>
    <div className={s.browser} data-format={selected}>
      <ProjectBackdrop src={projectBackgrounds.sites[selected]} />
      <div className={s.browserTop}><span aria-hidden="true">● ● ●</span><span>sua-marca.com.br</span><ArrowUpRight size={12} /></div>
      <div className={s.previewNav}><b>sua marca<span>®</span></b><small>UMA NOVA PRESENÇA DIGITAL</small></div>
      <div className={s.previewBody}>
        <span className={s.previewKicker}>FEITO PARA O SEU PRÓXIMO OBJETIVO</span>
        <h2>{format.name}<br /><em>{format.accent}</em></h2>
        <div className={s.previewShape} aria-hidden="true"><svg viewBox="0 0 200 200"><path d="M100 5 120 65 177 30 145 85 200 100 145 120 177 175 120 142 100 200 80 142 23 175 55 120 0 100 55 85 23 30 80 65Z" fill="currentColor" /></svg></div>
        <button className={s.previewAction} onClick={() => setPreviewContact(!previewContact)} aria-expanded={previewContact} aria-controls="preview-response">{format.action} <ArrowUpRight size={16} /></button>
        <div id="preview-response" className={s.previewResponse} aria-live="polite">{previewContact ? <><Check size={14} /> Do interesse ao contato. Esse é o caminho.</> : "Uma demonstração. A identidade do seu site será sua."}</div>
      </div>
      <div className={s.previewFlow}><span>01 / Conhecer</span><i /><span>02 / Entender</span><i /><span>03 / Conversar ↗</span></div>
    </div>
    <div className={s.previewCaption}><MousePointer2 size={14} /><p aria-live="polite">{format.detail}</p></div>
  </div>;
}
