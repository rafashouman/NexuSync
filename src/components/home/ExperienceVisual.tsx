import Image from "next/image";
import { ArrowUpRight, Check, Clock3, MousePointer2, Search, ShoppingBag, Sparkles } from "lucide-react";
import s from "./ExperienceVisual.module.css";

export type ExperienceKind = "web" | "app" | "design" | "marketing" | "burger" | "fashion" | "motors" | "acai";

const photos = {
  burger: "/images/showcase/burger-photo.jpg",
  fashion: "/images/showcase/fashion-photo.jpg",
  motors: "/images/showcase/motors-photo.jpg",
  acai: "/images/dog-acai/acai.webp",
};

function ProductScene({ kind }: { kind: "burger" | "fashion" | "motors" | "acai" }) {
  const content = {
    burger: { brand: "KOBRA / FIRE", category: "CARDÁPIO DIGITAL", title: "Feito para", accent: "dar vontade.", item: "X-bacon da casa", detail: "Monte do seu jeito", action: "+ ADICIONAR", status: "PEDIDO ORGANIZADO" },
    fashion: { brand: "VORTEX / ATELIER", category: "LOJA VIRTUAL", title: "Forma pura.", accent: "Escolha sua peça.", item: "Camiseta de algodão", detail: "Coleção · básicos", action: "ADICIONAR À SACOLA", status: "PEÇA NA SACOLA" },
    motors: { brand: "PRIME / MOTORS", category: "ESTOQUE DIGITAL", title: "Seu próximo", accent: "destino.", item: "Compass Overland", detail: "Seminovo · consulte", action: "AGENDAR VISITA", status: "INTERESSE REGISTRADO" },
    acai: { brand: "DOG & AÇAÍ", category: "DELIVERY / RETIRADA", title: "Seu pedido.", accent: "Do seu jeito.", item: "Açaí com frutas", detail: "Escolha seus adicionais", action: "+ ADICIONAR", status: "PEDIDO ORGANIZADO" },
  }[kind];
  return <div className={s.productScene} data-kind={kind}>
    <div className={s.productHeader}><b>{content.brand}</b><span>{content.category}</span><ShoppingBag size={14} /></div>
    <div className={s.productLayout}>
      <div className={s.productText}><small>UMA EXPERIÊNCIA PARA EXPLORAR</small><strong>{content.title}<br /><em>{content.accent}</em></strong><span>{content.detail}</span></div>
      <div className={s.productPicture}><Image src={photos[kind]} alt="" fill sizes="(max-width: 760px) 50vw, 22vw" /></div>
    </div>
    <div className={s.productFooter}><div><small>DESTAQUE</small><b>{content.item}</b></div><span className={s.productAction}>{content.action} <ArrowUpRight size={12} /></span><span className={s.productCursor}><MousePointer2 size={15} fill="currentColor" /></span></div>
    <div className={s.productStatus}><Check size={12} /> {content.status}</div>
  </div>;
}

function WebScene() {
  return <div className={s.webScene}>
    <div className={s.windowBar}><span><i /><i /><i /></span><small>ateliê vão / arquitetura</small><ArrowUpRight size={13} /></div>
    <div className={s.webBody}><div className={s.webCopy}><small>ARQUITETURA / PORTFÓLIO</small><strong>Entre a luz.<br /><em>Fique a vida.</em></strong><span>Projetos que começam pela forma de viver.</span><b>CONHEÇA OS PROJETOS <ArrowUpRight size={12} /></b></div><div className={s.webImage}><Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" alt="" fill unoptimized sizes="(max-width: 760px) 35vw, 18vw" /></div></div>
    <div className={s.webFlow}><span>01 / DESCOBRIR</span><i /><span>02 / EXPLORAR</span><i /><span>03 / CONVERSAR</span></div>
    <span className={s.pointer}><MousePointer2 size={16} fill="currentColor" /></span>
  </div>;
}

function AppScene() {
  return <div className={s.appScene}>
    <div className={s.appHeader}><span><Clock3 size={15} /> CHRONOS / AGENDA</span><small>DEMONSTRAÇÃO</small></div>
    <div className={s.appContent}><div><small>ESTÚDIO NAVALHA & FIO</small><strong>Um horário.<br /><em>Tudo organizado.</em></strong><p>Corte de cabelo <span>45 min</span></p><div className={s.appTimes}><span>09:00</span><span>10:30</span><span>14:00</span></div></div><div className={s.appReceipt}><span>✓</span><small>SOLICITAÇÃO</small><b>10:30</b><p>Corte de cabelo</p><strong>Aguardando confirmação</strong></div></div>
    <div className={s.appBottom}><span>01 / ESCOLHER</span><span>02 / SOLICITAR</span><span>03 / CONFIRMAR</span></div>
  </div>;
}

function DesignScene({ variation = 0 }: { variation?: number }) {
  const label = ["IDENTIDADE VISUAL", "PEÇAS DIGITAIS", "INTERFACE DIGITAL"][variation] ?? "IDENTIDADE VISUAL";
  return <div className={s.designScene}>
    <div className={s.designHeader}><span>N/ STUDIO</span><span>{label} / 01—03</span><Sparkles size={14} /></div>
    <div className={s.designWorkspace}><div className={s.designLogo} data-application={variation}>
      {variation === 0 ? <Image src="/images/port-iv/bela-juba-com-bg.jpg" alt="" fill sizes="(max-width: 760px) 35vw, 15vw" /> : variation === 1 ? <div className={s.socialPiece}><small>BELA JUBA / ESTÉTICA</small><b>Seu momento<br /><em>de cuidado.</em></b><span>CONHEÇA O ESTÚDIO ↗</span></div> : <div className={s.interfacePiece}><small>BELA JUBA / AGENDAMENTO</small><b>Escolha seu cuidado.</b><span>01 &nbsp; Serviços <Check size={11} /></span><span>02 &nbsp; Horários <ArrowUpRight size={11} /></span><strong>AGENDAR VISITA</strong></div>}
    </div><div className={s.designNotes}><small>UMA MARCA, VÁRIAS EXPRESSÕES</small><strong>{variation === 0 ? <>Uma identidade<br /><em>que permanece.</em></> : variation === 1 ? <>Uma mensagem<br /><em>que conecta.</em></> : <>Um caminho<br /><em>que faz sentido.</em></>}</strong><div><i /><i /><i /><span>PALETA / TIPOGRAFIA / APLICAÇÃO</span></div></div></div>
    <div className={s.designTimeline}><span>00:00</span><div><i /></div><span>00:06</span><b>▶</b></div>
  </div>;
}

function MarketingScene() {
  return <div className={s.marketingScene}>
    <div className={s.marketingHeader}><span><Search size={14} /> JORNADA DE DESCOBERTA</span><small>SIMULAÇÃO</small></div>
    <div className={s.marketingBody}><div className={s.searchBox}><small>01 / A BUSCA</small><div><Search size={14} /><span>arquitetura em porto alegre</span></div><article><small>RESULTADO ILUSTRATIVO</small><b>Ateliê Vão · Arquitetura</b><span>Projetos para viver melhor. Conheça nosso trabalho.</span></article></div><div className={s.contactBox}><small>02 / O PRÓXIMO PASSO</small><b>Gostou do projeto?</b><p>Vamos conversar sobre o seu espaço.</p><span>INICIAR CONVERSA <ArrowUpRight size={12} /></span></div></div>
    <div className={s.marketingProgress}><span>BUSCA</span><i /><span>SITE</span><i /><span>CONTATO</span></div>
  </div>;
}

export function ExperienceVisual({ kind, variation = 0 }: { kind: ExperienceKind; variation?: number }) {
  return <div className={s.stage} data-scene={kind} aria-hidden="true">
    {kind === "web" ? <WebScene /> : kind === "app" ? <AppScene /> : kind === "design" ? <DesignScene variation={variation} /> : kind === "marketing" ? <MarketingScene /> : <ProductScene kind={kind} />}
  </div>;
}
