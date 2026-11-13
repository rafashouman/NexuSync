"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, CalendarCheck, Check, CheckCheck, ChevronRight,
  ClipboardList, Fingerprint, HeartHandshake, LayoutTemplate, Megaphone,
  MessageCircle, MousePointer2, Palette, Rocket, Send, ShoppingBag,
  Sparkles, Target, Users, Workflow,
} from "lucide-react";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300";

function Change({ children, id }: { children: ReactNode; id: string | number }) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={id} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -5 }} transition={{ duration: reduced ? 0 : 0.18 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function SceneFrame({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div className="relative rounded-[1.75rem] border border-violet-200/15 bg-[#17131f] p-4 shadow-[0_25px_80px_-30px_#0009] sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-violet-200"><span className="h-1.5 w-1.5 rounded-full bg-violet-300" />{label}</span>
        <span className="text-[10px] text-muted-foreground">Demonstração interativa</span>
      </div>
      {children}
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-muted-foreground"><MousePointer2 size={13} className="shrink-0 text-violet-300" aria-hidden />{hint}</p>
    </div>
  );
}

const heroGoals = [
  { label: "Ser encontrado", icon: Target, title: "A atenção vira descoberta.", text: "Divulgação e uma presença que apresenta sua empresa.", color: "text-violet-200" },
  { label: "Ser reconhecido", icon: Fingerprint, title: "A sua marca deixa uma impressão.", text: "Uma identidade que conecta cada ponto de contato.", color: "text-fuchsia-200" },
  { label: "Receber contatos", icon: MessageCircle, title: "O interesse encontra uma conversa.", text: "Uma oferta clara, com um próximo passo acessível.", color: "text-emerald-200" },
  { label: "Organizar a rotina", icon: Workflow, title: "O dia ganha mais clareza.", text: "Ferramentas para acompanhar o que precisa acontecer.", color: "text-sky-200" },
] as const;

export function AboutHeroScene() {
  const [goal, setGoal] = useState(0);
  const current = heroGoals[goal];
  const Icon = current.icon;
  return (
    <div className="relative min-w-0 rounded-[2rem] border border-violet-200/15 bg-[radial-gradient(ellipse_at_50%_20%,#7c3aed22,transparent_65%)] p-5 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.15em] text-violet-200"><span>O SEU NEGÓCIO NO CENTRO</span><Sparkles size={18} /></div>
      <div className="relative mx-auto grid h-40 w-40 place-items-center rounded-full border border-violet-300/30 bg-[#20182d] shadow-[0_0_70px_#8b5cf61c] sm:h-48 sm:w-48">
        <div aria-hidden className="pointer-events-none absolute -inset-4 rounded-full border border-dashed border-violet-300/15" />
        <div className="text-center"><Fingerprint size={45} strokeWidth={1} className="mx-auto mb-3 text-violet-300" /><p className="text-xl font-bold tracking-tight">Sua essência.</p><p className="mt-1 text-xs text-violet-200/70">Nosso ponto de partida.</p></div>
      </div>
      <div className="mt-9 grid grid-cols-2 gap-2 sm:gap-3" role="group" aria-label="O que você quer melhorar?">
        {heroGoals.map(({ label, icon: GoalIcon, color }, index) => (
          <button key={label} type="button" aria-pressed={goal === index} onClick={() => setGoal(index)} className={`${focus} flex min-h-16 items-center gap-2 rounded-2xl border px-3 text-left text-[11px] transition-colors sm:gap-3 sm:px-4 sm:text-xs ${goal === index ? "border-violet-300/60 bg-violet-400/15 text-white" : "border-violet-200/10 bg-[#17131f] text-muted-foreground hover:border-violet-300/40"}`}><GoalIcon size={19} strokeWidth={1.5} className={`shrink-0 ${color}`} />{label}</button>
        ))}
      </div>
      <div className="mt-5 min-h-28 rounded-2xl border border-white/[0.06] bg-[#0e0c14]/70 p-4" aria-live="polite">
        <Change id={goal}><div className="flex items-center gap-2 text-sm font-semibold"><Icon size={16} className={`shrink-0 ${current.color}`} />{current.title}</div><p className="mt-2 text-xs leading-6 text-muted-foreground">{current.text}</p></Change>
      </div>
      <p className="mt-4 text-center text-[10px] text-muted-foreground">Toque em um objetivo e explore as possibilidades.</p>
    </div>
  );
}

const journey = ["Conhecer", "Entender", "Conversar"];

export function SiteJourney() {
  const [step, setStep] = useState(0);
  return (
    <SceneFrame label="Uma visita com direção" hint="Escolha uma etapa para percorrer essa visita.">
      <div className="mb-5 grid grid-cols-3 gap-2" role="group" aria-label="Etapas da visita ao site">
        {journey.map((label, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => setStep(index)} className={`${focus} rounded-xl border px-1 py-3 text-[11px] font-semibold transition-colors ${step === index ? "border-violet-300/50 bg-violet-300/15 text-violet-100" : "border-white/10 text-muted-foreground hover:bg-white/5"}`}><span className="mr-1 opacity-50">0{index + 1}</span>{label}</button>)}
      </div>
      <div className="overflow-hidden rounded-2xl border border-violet-200/15 bg-[#100d17]">
        <div className="flex items-center gap-1.5 border-b border-violet-200/10 px-4 py-3"><span className="h-1.5 w-1.5 rounded-full bg-[#7d678e]" /><span className="h-1.5 w-1.5 rounded-full bg-[#7d678e]" /><span className="h-1.5 w-1.5 rounded-full bg-[#7d678e]" /><span className="mx-auto pr-8 text-[9px] text-muted-foreground">suaempresa.com.br</span></div>
        <div className="min-h-[305px] p-5 sm:p-7" aria-live="polite">
          <Change id={step}>
            {step === 0 && <>
              <div className="mb-7 flex items-center justify-between text-[10px] tracking-widest text-violet-200"><span className="flex items-center gap-2"><Fingerprint size={18} /> SUA MARCA</span><span>01 / 03</span></div>
              <p className="max-w-xs text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Seu espaço.<br /><span className="text-violet-300">Do seu jeito.</span></p>
              <p className="mt-4 max-w-xs text-xs leading-6 text-muted-foreground">Ambientes pensados para quem vive neles.</p>
              <div className="mt-5 flex items-end gap-3" aria-hidden><div className="h-14 w-20 rounded-t-[2rem] bg-[#bea4ce]" /><div className="h-20 flex-1 rounded-t-[3rem] bg-[#655375]" /><div className="h-12 w-16 rounded-t-full bg-[#c7bfae]" /></div>
            </>}
            {step === 1 && <>
              <p className="text-[10px] tracking-widest text-violet-300">A OFERTA FICA CLARA</p><p className="mt-5 text-2xl font-bold leading-tight">Um projeto que<br />combina com você.</p>
              <div className="mt-6 space-y-3">{["Ambientes para a sua rotina", "Escolhas com a sua identidade", "Etapas que você acompanha"].map(text => <div key={text} className="flex items-center gap-3 rounded-xl bg-violet-300/[0.06] px-3 py-3 text-xs text-violet-100"><Check size={15} className="shrink-0 text-violet-300" />{text}</div>)}</div>
            </>}
            {step === 2 && <>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-300/10 text-emerald-200"><MessageCircle size={21} /></div><div><p className="text-sm font-semibold">Sua empresa</p><p className="mt-1 text-[10px] text-muted-foreground">Um contato ao alcance.</p></div></div>
              <div className="ml-5 mt-7 rounded-2xl rounded-br-sm bg-[#244238] p-4"><p className="text-sm leading-6 text-emerald-50">Olá! Conheci o trabalho de vocês e quero conversar sobre um projeto.</p><CheckCheck size={16} className="ml-auto mt-2 text-emerald-300" /></div>
              <p className="mt-5 text-xs leading-6 text-muted-foreground">O visitante chega com contexto para começar a conversa.</p>
            </>}
          </Change>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3"><p className="text-[10px] text-muted-foreground">Exemplo fictício · Estúdio de interiores</p><button type="button" onClick={() => setStep((step + 1) % 3)} className={`${focus} flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold text-violet-200`}>{step === 2 ? "Rever visita" : "Próxima etapa"}<ArrowRight size={15} /></button></div>
    </SceneFrame>
  );
}

const appTypes = [
  { label: "Agenda", icon: CalendarCheck, title: "Cada horário no seu lugar.", items: [{ time: "09:00", title: "Corte · Marina", note: "Confirmado" }, { time: "10:30", title: "Barba · Lucas", note: "Confirmado" }, { time: "14:00", title: "Corte + barba · Pedro", note: "A confirmar" }], foot: "A equipe sabe quem chega e quando." },
  { label: "Pedidos", icon: ShoppingBag, title: "Do pedido à entrega.", items: [{ time: "#021", title: "Pedido recebido", note: "Novo" }, { time: "#020", title: "Pedido em preparo", note: "Preparando" }, { time: "#019", title: "Pedido a caminho", note: "Em entrega" }], foot: "Cada pedido com uma próxima ação visível." },
  { label: "Atendimento", icon: Users, title: "Nenhuma conversa solta.", items: [{ time: "MA", title: "Marina pediu informações", note: "Novo contato" }, { time: "LU", title: "Lucas recebeu a proposta", note: "Em conversa" }, { time: "PE", title: "Pedro aguarda retorno", note: "Acompanhar" }], foot: "Contexto para retomar cada atendimento." },
] as const;

export function AppScenes() {
  const [active, setActive] = useState(0);
  const [organized, setOrganized] = useState(true);
  const app = appTypes[active];
  return (
    <SceneFrame label="A rotina ganha um lugar" hint="Alterne a rotina e compare as duas formas de trabalhar.">
      <div className="mb-5 flex gap-1 rounded-xl bg-black/20 p-1" role="group" aria-label="Rotina demonstrada">
        {appTypes.map(({ label, icon: Icon }, index) => <button key={label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`${focus} flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-1 text-[10px] transition-colors sm:gap-2 sm:text-xs ${active === index ? "bg-violet-300/15 text-violet-100" : "text-muted-foreground hover:bg-white/5"}`}><Icon size={15} className="shrink-0" />{label}</button>)}
      </div>
      <div className="mb-5 flex items-center justify-between gap-3"><p className="text-[10px] text-muted-foreground">Cenário ilustrativo</p><button type="button" aria-pressed={organized} onClick={() => setOrganized(!organized)} className={`${focus} inline-flex min-h-11 items-center gap-2 rounded-full border border-violet-200/20 px-3 text-[11px] text-violet-100`}><span className={`relative h-4 w-7 rounded-full ${organized ? "bg-violet-400" : "bg-white/20"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform motion-reduce:transition-none ${organized ? "translate-x-3.5" : "translate-x-0.5"}`} /></span>{organized ? "Com organização" : "Tudo espalhado"}</button></div>
      <div className="min-h-[320px] rounded-2xl border border-white/10 bg-[#100e16] p-4 sm:p-5" aria-live="polite">
        <Change id={`${active}-${organized}`}>
          {organized ? <>
            <p className="mb-5 text-lg font-semibold tracking-tight text-violet-100">{app.title}</p>
            <div className="space-y-3">{app.items.map(item => <div key={item.time} className="flex items-center gap-3 rounded-xl border border-violet-200/10 bg-white/[0.025] p-3"><span className="grid h-9 min-w-10 place-items-center rounded-lg bg-violet-300/10 text-[10px] text-violet-200">{item.time}</span><div className="min-w-0"><p className="text-xs leading-5 text-violet-50">{item.title}</p><p className="mt-1 text-[10px] text-emerald-200">{item.note}</p></div><Check size={14} className="ml-auto shrink-0 text-violet-300" /></div>)}</div>
            <p className="mt-4 text-[11px] leading-6 text-muted-foreground">{app.foot}</p>
          </> : <div className="relative flex min-h-[275px] flex-col items-center justify-center gap-4 py-5"><span className="rotate-[-7deg] rounded-xl border border-amber-100/20 bg-[#3e3525] px-4 py-4 text-xs text-amber-100">“Qual era mesmo o horário?”</span><span className="rotate-[5deg] rounded-xl border border-white/10 bg-[#27232e] px-4 py-4 text-xs text-violet-100">Uma mensagem aqui. Uma anotação ali.</span><span className="rotate-[-3deg] rounded-xl border border-rose-200/20 bg-[#3b2631] px-4 py-4 text-xs text-rose-100">“Faltou dar retorno?”</span></div>}
        </Change>
      </div>
    </SceneFrame>
  );
}

const palettes = [
  { name: "Essencial", background: "#e6def1", ink: "#38264d", accent: "#8f6eb0", detail: "#c7b6d8" },
  { name: "Natural", background: "#e3e9d9", ink: "#284235", accent: "#6c8a63", detail: "#b6c6a4" },
  { name: "Expressiva", background: "#f1ddd0", ink: "#5f2937", accent: "#bf6170", detail: "#e0aa91" },
];

export function BrandScene() {
  const [active, setActive] = useState(0);
  const palette = palettes[active];
  return (
    <SceneFrame label="Uma identidade. Muitos encontros." hint="Escolha uma direção e veja todas as peças se conectarem.">
      <div className="grid min-h-[310px] grid-cols-[1.15fr_1fr] gap-3">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 transition-colors duration-300 motion-reduce:transition-none sm:p-6" style={{ backgroundColor: palette.background, color: palette.ink }}>
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest"><Fingerprint size={18} /> SUA MARCA</div>
          <div className="py-5"><p className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.07em]">Feita para<br />ser você.</p><div aria-hidden className="mt-5 flex items-end gap-2"><div className="h-14 w-14 rounded-t-full" style={{ backgroundColor: palette.accent }} /><div className="h-20 flex-1 rounded-t-full" style={{ backgroundColor: palette.detail }} /></div></div>
          <div className="flex items-center justify-between gap-2 text-[9px]"><span>Essência em cada detalhe.</span><ArrowUpRight size={16} className="shrink-0" /></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-1 flex-col justify-between rounded-2xl p-4 transition-colors duration-300 motion-reduce:transition-none" style={{ backgroundColor: palette.ink, color: palette.background }}><Fingerprint size={30} strokeWidth={1.2} /><p className="mt-4 text-lg font-bold leading-tight tracking-tight">Reconhecer.<br />Conectar.</p><span className="mt-3 text-[9px] opacity-70">A mesma marca. Outro formato.</span></div>
          <div className="rounded-2xl p-4 transition-colors duration-300 motion-reduce:transition-none" style={{ backgroundColor: palette.detail, color: palette.ink }}><div className="flex items-center justify-between"><span className="text-3xl font-semibold tracking-tight">Aa</span><Palette size={20} /></div><p className="mt-2 text-[9px]">Cor + forma + mensagem</p></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Direção visual da marca">{palettes.map((item, index) => <button key={item.name} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`${focus} flex min-h-12 flex-wrap items-center justify-center gap-2 rounded-xl border px-1 py-2 text-[10px] transition-colors sm:text-xs ${active === index ? "border-violet-300/60 bg-violet-300/10 text-white" : "border-white/10 text-muted-foreground hover:bg-white/5"}`}><span className="h-3 w-3 rounded-full" style={{ background: item.background }} />{item.name}</button>)}</div>
      <p className="mt-3 text-center text-[10px] text-muted-foreground">Exercício visual ilustrativo · A identidade é definida com você.</p>
    </SceneFrame>
  );
}

const marketingStages = [
  { label: "Divulgação", icon: Megaphone, title: "Uma mensagem que desperta interesse.", text: "Conteúdo e anúncios conectados ao que você oferece.", eyebrow: "SUA MARCA APARECE", message: "Algo que faz sentido para mim.", icon2: Target },
  { label: "Contato", icon: MessageCircle, title: "Uma porta aberta para conversar.", text: "O interessado encontra sua oferta e sabe como falar com você.", eyebrow: "O INTERESSE VIRA CONVERSA", message: "Olá! Quero conhecer essa solução.", icon2: Send },
  { label: "Acompanhamento", icon: ClipboardList, title: "Contexto para o próximo passo.", text: "Contatos e retornos organizados para apoiar o atendimento.", eyebrow: "A CONVERSA TEM CONTINUIDADE", message: "Proposta enviada. Retorno combinado.", icon2: CheckCheck },
] as const;

export function MarketingFlow() {
  const [active, setActive] = useState(0);
  const current = marketingStages[active];
  const Icon = current.icon2;
  return (
    <SceneFrame label="Do primeiro olhar ao próximo passo" hint="Percorra o fluxo para ver como as etapas se conectam.">
      <div className="grid grid-cols-3 gap-1 sm:gap-3" role="group" aria-label="Etapas de marketing e acompanhamento">
        {marketingStages.map(({ label, icon: StageIcon }, index) => <button key={label} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`${focus} relative flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border px-1 py-3 text-[9px] transition-colors sm:text-[11px] ${active === index ? "border-violet-300/60 bg-violet-300/15 text-violet-100" : "border-white/10 bg-black/10 text-muted-foreground hover:bg-white/5"}`}><StageIcon size={24} strokeWidth={1.4} />{label}{index < 2 && <ChevronRight size={14} className="absolute -right-2.5 z-10 rounded-full bg-[#17131f] text-violet-300 sm:-right-4" />}</button>)}
      </div>
      <div className="mt-5 min-h-[270px] rounded-2xl border border-white/10 bg-[#100e16] p-5 sm:p-7" aria-live="polite">
        <Change id={active}><p className="text-[9px] tracking-[0.12em] text-violet-300">{current.eyebrow}</p><h3 className="mt-4 text-xl leading-tight tracking-tight">{current.title}</h3><p className="mt-3 text-xs leading-6 text-muted-foreground">{current.text}</p><div className={`mt-6 flex items-center gap-3 rounded-xl border p-4 ${active === 1 ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-100" : "border-violet-200/15 bg-violet-300/10 text-violet-100"}`}><Icon size={21} className="shrink-0" /><p className="text-xs leading-6">{current.message}</p></div></Change>
      </div>
      <button type="button" onClick={() => setActive((active + 1) % 3)} className={`${focus} ml-auto mt-3 flex min-h-11 items-center gap-2 text-xs font-semibold text-violet-200`}>{active === 2 ? "Rever o fluxo" : "Continuar o caminho"}<ArrowRight size={15} /></button>
    </SceneFrame>
  );
}

const work = [
  { title: "Entender o negócio", icon: MessageCircle, detail: "A conversa vem primeiro.", text: "Você conta o que faz, quem quer alcançar e o que precisa melhorar. A gente escuta antes de sugerir.", chips: ["Seu momento", "Seu público", "Seu objetivo"] },
  { title: "Propor uma solução", icon: LayoutTemplate, detail: "Um caminho que você entende.", text: "Alinhamos uma proposta com entregas, prazos e materiais necessários para começar.", chips: ["Escopo", "Etapas", "Prazos"] },
  { title: "Construir junto", icon: HeartHandshake, detail: "Você participa da criação.", text: "Apresentamos o projeto, ouvimos sua avaliação e fazemos os ajustes combinados na proposta.", chips: ["Apresentação", "Sua avaliação", "Ajustes"] },
  { title: "Acompanhar a entrega", icon: Rocket, detail: "Tudo pronto para o próximo passo.", text: "Preparamos a entrega e orientamos o uso, conforme o escopo. Você entende como seguir com o que foi construído.", chips: ["Entrega", "Orientação", "Próximos passos"] },
] as const;

export function WorkSteps() {
  const [active, setActive] = useState(0);
  const current = work[active];
  const Icon = current.icon;
  return <div>
    <ol className="grid grid-cols-2 gap-3 lg:grid-cols-4">{work.map(({ title, icon: StepIcon }, index) => <li key={title}><button type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`${focus} flex h-full min-h-28 w-full flex-col rounded-2xl border p-4 text-left transition-colors sm:p-5 ${active === index ? "border-violet-300/50 bg-violet-300/10" : "border-white/10 bg-white/[0.02] hover:border-violet-300/30"}`}><span className="mb-5 flex w-full items-center justify-between gap-2 text-violet-300"><span className="text-[10px] text-muted-foreground">0{index + 1}</span><StepIcon size={22} strokeWidth={1.5} /></span><span className="text-xs font-semibold leading-6 sm:text-sm">{title}</span></button></li>)}</ol>
    <div className="mt-4 min-h-48 rounded-2xl border border-violet-200/15 bg-[#17131f] p-6 sm:min-h-40 sm:p-8" aria-live="polite"><Change id={active}><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><div className="flex flex-1 items-start gap-4"><Icon size={30} strokeWidth={1.3} className="mt-1 shrink-0 text-violet-300" /><div><h3 className="text-lg tracking-tight">{current.detail}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{current.text}</p></div></div><div className="flex flex-wrap gap-2 sm:max-w-48">{current.chips.map(chip => <span key={chip} className="rounded-full border border-violet-200/15 bg-violet-300/5 px-3 py-2 text-[10px] text-violet-200">{chip}</span>)}</div></div></Change></div>
    <p className="mt-4 text-center text-[11px] text-muted-foreground">Selecione uma etapa para conhecer o caminho.</p>
  </div>;
}
