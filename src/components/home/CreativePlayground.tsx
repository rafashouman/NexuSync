"use client";

import { useState } from "react";
import { ExperienceVisual } from "./ExperienceVisual";
import Link from "next/link";
import { ArrowUpRight, Check, Play, Pause, RotateCcw } from "lucide-react";
import s from "./CreativeExperience.module.css";

export function AppPlayground() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState(false);
  const [period, setPeriod] = useState<"24H" | "7D">("24H");
  return <div className={s.appDemo}>
    <div className={s.demoTabs} role="group" aria-label="Demonstração de aplicativos">{["Agenda", "Pedidos", "Indicadores"].map((label, i) => <button key={label} aria-pressed={tab === i} onClick={() => setTab(i)}>{label}</button>)}</div>
    <div className={s.demoPanel}><div className={s.demoBar}><span><i /> SUA OPERAÇÃO, EM SINTONIA.</span><small>DEMONSTRAÇÃO</small></div>
      {tab === 0 && <div className={s.agenda}><div className={s.deckCopy}><span className={s.micro}>CHRONOS / ESTÚDIO NAVALHA & FIO</span><h2>Seu horário,<br /><em>sem complicação.</em></h2><p>Escolha um horário para testar o fluxo de agendamento.</p><div className={s.serviceLine}><span>Corte de cabelo</span><b>45 min</b></div></div><div className={s.deckAction}><small className={s.micro}>HORÁRIOS DISPONÍVEIS</small><div className={s.timeSlots}>{["09:00", "10:30", "14:00", "15:30"].map(value => <button key={value} aria-pressed={time === value} onClick={() => { setTime(value); setConfirmed(false); }}>{value}</button>)}</div><div className={s.demoStatus} aria-live="polite">{time ? <><span><Check size={15} /> {time} · {confirmed ? "Confirmado pela empresa" : "Solicitação recebida"}</span><button onClick={() => setConfirmed(!confirmed)}>{confirmed ? "Voltar à solicitação" : "Simular confirmação"}<ArrowUpRight size={13} /></button></> : <span>O cliente solicita. Sua empresa confirma.</span>}</div></div></div>}
      {tab === 1 && <div className={s.agenda}><div className={s.deckCopy}><span className={s.micro}>PAINEL / PEDIDOS</span><h2>Cada pedido.<br /><em>No lugar certo.</em></h2></div><div className={s.deckAction}><div className={s.orderRow}><span>Pedido #024<br /><small>Cliente demonstrativo</small></span><b>{order ? "Concluído" : "Em preparo"}</b></div><div className={s.orderRow}><span>Pedido #025<br /><small>Cliente demonstrativo</small></span><b>Recebido</b></div><button className={s.demoButton} onClick={() => setOrder(!order)}>{order ? "Reiniciar demonstração" : "Concluir pedido #024"}{order ? <RotateCcw size={14} /> : <Check size={14} />}</button></div></div>}
      {tab === 2 && <div className={s.agenda}><div className={s.deckCopy}><span className={s.micro}>PULSEMETRICS / DADOS FICTÍCIOS</span><h2>Clareza para<br /><em>o próximo passo.</em></h2><p>Compare períodos e acompanhe os indicadores de uma campanha demonstrativa.</p><div className={s.periodControls} role="group" aria-label="Período dos indicadores">{(["24H", "7D"] as const).map(value => <button key={value} aria-pressed={period === value} onClick={() => setPeriod(value)}>{value}</button>)}</div></div><div className={s.deckAction}><div className={s.demoStats} aria-live="polite"><span><b>{period === "24H" ? "R$ 14.890" : "R$ 98.450"}</b>Receita</span><span><b>{period === "24H" ? "5,8x" : "6,2x"}</b>ROAS</span><span><b>{period === "24H" ? "142" : "964"}</b>Leads</span></div><div className={s.demoChart} aria-label="Gráfico ilustrativo de atividade">{[25, 44, 37, 67, 51, 85, 75, 95].map((value, i) => <i key={i} style={{ height: `${value}%`, animationDelay: `${i * -.2}s` }} />)}</div></div></div>}
    </div><p className={s.demoNote}>Experimente o fluxo. Os dados são fictícios e nenhuma solicitação é enviada. {tab !== 1 && <Link href={tab === 0 ? "/chronos" : "/pulsemetrics"}>Abrir demonstração completa ↗</Link>}</p>
  </div>;
}

export function DesignPlayground() {
  const [palette, setPalette] = useState(0);
  const [paused, setPaused] = useState(false);
  return <div className={s.designDemo}>
    <div className={s.designCanvas} data-palette={palette} data-paused={paused}>
      <ExperienceVisual kind="design" variation={palette} />
    </div>
    <div className={s.designControls}><div className={s.designModes} role="group" aria-label="Aplicação da identidade">{["Identidade", "Peças digitais", "Interface"].map((label, i) => <button key={label} aria-pressed={palette === i} onClick={() => setPalette(i)}>{label}</button>)}</div><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? "Ativar movimento" : "Pausar movimento"}</button></div><p className={s.demoNote} aria-live="polite">{["Identidade visual", "Peça de divulgação", "Interface de agendamento"][palette]}: exploração inspirada no projeto Bela Juba. Escolha uma aplicação e controle o movimento.</p>
  </div>;
}
