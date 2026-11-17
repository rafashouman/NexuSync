"use client";
import { useState } from "react";
import { CalendarDays, Check, ArrowUpRight, Users } from "lucide-react";
import c from "./ProductExperience.module.css";
export function ProductDemo({ product }: { product: "arcsync" | "visionsync" }) {
  const [step, setStep] = useState(0);
  const arc = product === "arcsync";
  const tabs = arc ? ["Planejar", "Agendar", "Acompanhar"] : ["Centralizar", "Organizar", "Retornar"];
  return <div className={c.demo}>
    <div className={c.demoBar}><span>{arc ? <CalendarDays size={17} /> : <Users size={17} />}{arc ? "ArcSync" : "VisionSync"} / VISÃO GERAL</span><i /><i /><i /></div>
    <div className={c.demoBody}><small>MENOS RUÍDO. MAIS DIREÇÃO.</small><h2>{arc ? "Conteúdo em sintonia." : "Conversas com continuidade."}</h2><p className={c.demoNotice}>Demonstração ilustrativa · dados fictícios</p>
      <div className={c.tabs} aria-label="Etapas da rotina">{tabs.map((tab, i) => <button key={tab} aria-pressed={step === i} onClick={() => setStep(i)}>{tab}</button>)}</div>
      <div className={c.demoContent} aria-live="polite">{arc ? <><div className={c.calendar}>{["SEG", "TER", "QUA", "QUI", "SEX"].map((day, i) => <div key={day}><small>{day}</small><b>{12 + i}</b><i data-active={i === step + 1} /></div>)}</div><div className={c.contentCard}><span>MARCA EXEMPLO / REDES SOCIAIS</span><strong>{["Uma ideia ganha forma.", "O próximo post tem seu horário.", "Tudo pronto para o próximo passo."][step]}</strong><p>{["Rascunho · Imagem e legenda em preparação", "Agendado · Quarta, às 14h", "Publicado · Histórico de envio disponível"][step]}</p><span className={c.status}><Check size={13} />{["Conteúdo organizado", "Calendário atualizado", "Envio acompanhado"][step]}</span></div></> : <><div className={c.pipeline}>{["Novo contato", "Em conversa", "Retorno"].map((label, i) => <div key={label} data-active={i === step}><span>0{i + 1}</span><strong>{label}</strong><i /></div>)}</div><div className={c.contentCard}><span>CONTATO DE EXEMPLO</span><strong>{["Marina · Primeiro contato", "Marina · Proposta em conversa", "Marina · Próximo retorno"][step]}</strong><p>{["Interesse em conhecer os serviços. Anotação salva no painel.", "Etapa atualizada para acompanhar o andamento do atendimento.", "Retomar a conversa na quinta. Contexto disponível para continuar."][step]}</p><span className={c.status}><Check size={13} />{["Contato centralizado", "Etapa organizada", "Próximo passo visível"][step]}</span></div></>}</div>
    </div><div className={c.demoBottom}><span>EXPERIMENTE AS ETAPAS ACIMA</span><ArrowUpRight size={17} /></div>
  </div>;
}
