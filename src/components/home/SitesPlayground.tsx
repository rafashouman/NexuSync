"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MousePointer2, Check } from "lucide-react";
import s from "./SitesExperience.module.css";

const formats = [
  { label: "Institucional", brand: "ATELIÊ VÃO", name: "Espaços para", accent: "viver melhor.", action: "Conhecer projetos", detail: "Apresente sua empresa, explique os serviços e transmita confiança antes da primeira conversa.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
  { label: "Landing page", brand: "PULSEFIT LAB", name: "Seu ritmo.", accent: "Seu próximo passo.", action: "Conhecer o treino", detail: "Concentre uma oferta e leve o visitante de uma campanha ao pedido de orçamento.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80" },
  { label: "Hotsite", brand: "PRIME MOTORS", name: "Encontre seu", accent: "próximo destino.", action: "Consultar veículo", detail: "Dê uma página própria a uma campanha, evento ou lançamento. Recursos definidos no escopo.", image: "/images/showcase/motors-photo.jpg" },
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
      <div className={s.browserTop}><span aria-hidden="true">● ● ●</span><span>sua-marca.com.br</span><ArrowUpRight size={12} /></div>
      <div className={s.previewNav}><b>{format.brand}<span>®</span></b><small>EXEMPLO INTERATIVO</small></div>
      <div className={s.previewBody}>
        <div className={s.previewCopy}>
          <span className={s.previewKicker}>UM SITE. UM CAMINHO CLARO.</span>
          <h2>{format.name} <em>{format.accent}</em></h2>
          <p>Uma experiência pensada para apresentar, conectar e convidar à conversa.</p>
          <button className={s.previewAction} onClick={() => setPreviewContact(!previewContact)} aria-expanded={previewContact} aria-controls="preview-response">{format.action} <ArrowUpRight size={16} /></button>
        </div>
        <div className={s.previewPhoto}><Image key={format.image} src={format.image} alt="" fill unoptimized sizes="(max-width: 760px) 50vw, 24vw" /></div>
      </div>
      <div id="preview-response" className={s.previewResponse} aria-live="polite">{previewContact ? <><Check size={14} /> Do interesse ao contato. Esse é o caminho.</> : "Uma demonstração. A identidade do seu site será sua."}</div>
      <div className={s.previewFlow}><span>01 / Conhecer</span><i /><span>02 / Entender</span><i /><span>03 / Conversar ↗</span></div>
    </div>
    <div className={s.previewCaption}><MousePointer2 size={14} /><p aria-live="polite">{format.detail}</p></div>
  </div>;
}
