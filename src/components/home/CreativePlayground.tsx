"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Play, Pause, RotateCcw } from "lucide-react";
import s from "./CreativeExperience.module.css";

export function AppPlayground() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState(false);
  return <div className={s.appDemo}>
    <div className={s.demoTabs} role="group" aria-label="Demonstração de aplicativos">{["Agenda", "Pedidos", "Indicadores"].map((label, i) => <button key={label} aria-pressed={tab === i} onClick={() => setTab(i)}>{label}</button>)}</div>
    <div className={s.demoPanel}><div className={s.demoBar}><span><i /> SUA OPERAÇÃO, EM SINTONIA.</span><small>DEMONSTRAÇÃO</small></div>
      {tab === 0 && <div className={s.agenda}><span className={s.micro}>SERVIÇOS / AGENDA DE BELEZA</span><h2>Mais tempo.<br /><em>Menos mensagens.</em></h2><p>Escolha um horário para testar.</p><div className={s.timeSlots}>{["09:00", "10:30", "14:00", "15:30"].map(value => <button key={value} aria-pressed={time === value} onClick={() => { setTime(value); setConfirmed(false); }}>{value}</button>)}</div><div className={s.demoStatus} aria-live="polite">{time ? <><span><Check size={15} /> {time} · {confirmed ? "Confirmado pela empresa" : "Solicitação recebida"}</span><button onClick={() => setConfirmed(!confirmed)}>{confirmed ? "Voltar à solicitação" : "Simular confirmação"}<ArrowUpRight size={13} /></button></> : <span>O cliente solicita. Sua empresa confirma.</span>}</div></div>}
      {tab === 1 && <div className={s.agenda}><span className={s.micro}>PAINEL / PEDIDOS</span><h2>Cada pedido.<br /><em>No lugar certo.</em></h2><div className={s.orderRow}><span>Pedido #024<br /><small>Cliente demonstrativo</small></span><b>{order ? "Concluído" : "Em preparo"}</b></div><div className={s.orderRow}><span>Pedido #025<br /><small>Cliente demonstrativo</small></span><b>Recebido</b></div><button className={s.demoButton} onClick={() => setOrder(!order)}>{order ? "Reiniciar demonstração" : "Concluir pedido #024"}{order ? <RotateCcw size={14} /> : <Check size={14} />}</button></div>}
      {tab === 2 && <div className={s.agenda}><span className={s.micro}>VISÃO GERAL / DADOS FICTÍCIOS</span><h2>Clareza para<br /><em>o próximo passo.</em></h2><div className={s.demoStats}><span><b>24</b>Pedidos</span><span><b>18</b>Concluídos</span><span><b>6</b>Pendentes</span></div><div className={s.demoChart} aria-label="Gráfico ilustrativo de atividade">{[25, 44, 37, 67, 51, 85, 75, 95].map((value, i) => <i key={i} style={{ height: `${value}%`, animationDelay: `${i * -.2}s` }} />)}</div></div>}
    </div><p className={s.demoNote}>Experimente o fluxo. Os dados são fictícios e nenhuma solicitação é enviada.</p>
  </div>;
}

export function DesignPlayground() {
  const [palette, setPalette] = useState(0);
  const [paused, setPaused] = useState(false);
  return <div className={s.designDemo}>
    <div className={s.designCanvas} data-palette={palette} data-paused={paused}><span className={s.designCaption}>ESTÚDIO NEXUSYNC / EXPLORAÇÃO VISUAL</span><svg className={s.designOrbit} viewBox="0 0 300 300" fill="none" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="150" cy="150" rx={60 + i * 11} ry={115 - i * 7} stroke="currentColor" transform={`rotate(${i * 20} 150 150)`} />)}</svg><strong>sua<br /><em>marca.</em></strong><span className={s.designSticker}>FEITA PARA<br />SER LEMBRADA. <ArrowUpRight /></span><span className={s.designBottom}>IDENTIDADE × MOVIMENTO × EXPERIÊNCIA</span></div>
    <div className={s.designControls}><div role="group" aria-label="Paleta da demonstração">{["Lima e azul", "Azul e branco", "Esmeralda e lima"].map((label, i) => <button key={label} data-swatch={i} aria-label={label} aria-pressed={palette === i} onClick={() => setPalette(i)} />)}</div><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? "Ativar movimento" : "Pausar movimento"}</button></div><p className={s.demoNote}>Mude a paleta. Explore o movimento. Imagine sua identidade.</p>
  </div>;
}
