"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BellRing,
  Globe,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Search,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

import { waLink } from "@/lib/site-config";

type HeroCopy = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  highlight?: string;
  cta: string;
  href: string;
  external: boolean;
};

const copies: HeroCopy[] = [
  {
    title: "Seu negócio merece mais clientes. Seu site é o primeiro passo.",
    subtitle:
      "Criamos sites que ajudam sua empresa a atrair, conquistar e converter clientes.",
    paragraphs: [
      "Não basta estar na internet. É preciso ser encontrado, despertar interesse e transformar visitantes em clientes.",
      "Criamos sites profissionais e ajudamos sua empresa a conquistar mais oportunidades através do tráfego pago, com configuração de campanhas para atrair potenciais clientes e gestão de redes sociais para fortalecer sua presença digital.",
    ],
    highlight:
      "Do desenvolvimento do site à captação de clientes, ajudamos você a construir uma presença digital preparada para gerar negócios.",
    cta: "Quero atrair mais clientes",
    href: waLink(
      "Olá! Quero atrair mais clientes para minha empresa com um site profissional e tráfego pago."
    ),
    external: true,
  },
  {
    title: "Transforme sua presença digital em novos clientes.",
    subtitle:
      "Sites profissionais, tráfego pago e redes sociais trabalhando pelo crescimento da sua empresa.",
    paragraphs: [
      "Tenha um site profissional para apresentar seu negócio, campanhas de anúncios para atrair potenciais clientes e redes sociais que fortalecem sua marca.",
      "Cuidamos de cada etapa: criamos seu site, configuramos suas campanhas e ajudamos sua empresa a manter uma presença digital estratégica.",
    ],
    highlight: "Mais visibilidade, mais oportunidades e mais chances de vender.",
    cta: "Quero impulsionar meu negócio",
    href: waLink(
      "Olá! Quero impulsionar meu negócio com site, anúncios e redes sociais."
    ),
    external: true,
  },
  {
    title: "Tudo o que sua empresa precisa para crescer no digital.",
    subtitle:
      "Site, anúncios e redes sociais trabalhando juntos para conquistar mais clientes.",
    paragraphs: [
      "Não adianta ter um site se ninguém encontra sua empresa. E não basta atrair visitantes se sua presença digital não transmite confiança.",
      "Por isso, oferecemos soluções integradas para ajudar seu negócio a crescer: criamos seu site, configuramos campanhas de tráfego pago e cuidamos das suas redes sociais.",
      "Você conta com uma estrutura digital completa para fortalecer sua marca, atrair potenciais clientes e transformar oportunidades em vendas.",
    ],
    cta: "Quero conhecer os pacotes",
    href: "#planos-marketing",
    external: false,
  },
  {
    title: "Sua empresa precisa chegar a mais clientes.",
    subtitle:
      "Anúncios estratégicos para atrair pessoas interessadas no que você oferece.",
    paragraphs: [
      "Quantos potenciais clientes poderiam conhecer sua empresa se ela alcançasse as pessoas certas?",
      "Com campanhas de tráfego pago, ajudamos seu negócio a ganhar visibilidade, atrair pessoas interessadas e gerar novas oportunidades de vendas.",
      "Configuramos suas campanhas, direcionamos seus anúncios ao público certo e também podemos cuidar das suas redes sociais e da estrutura do seu site para fortalecer seus resultados.",
    ],
    cta: "Quero atrair mais clientes",
    href: waLink(
      "Olá! Quero anúncios estratégicos para atrair pessoas interessadas no que minha empresa oferece."
    ),
    external: true,
  },
];

const ROTATE_TIME = 10000;

const insights = [
  {
    icon: MousePointerClick,
    label: "Anúncios",
    text: "Campanhas atraindo visitantes",
    tone: "bg-fuchsia-500/15 text-fuchsia-300",
  },
  {
    icon: Users,
    label: "Site",
    text: "Visitantes viram contatos",
    tone: "bg-violet-500/15 text-violet-300",
  },
  {
    icon: BellRing,
    label: "WhatsApp",
    text: "Novo pedido de orçamento",
    tone: "bg-emerald-500/15 text-emerald-300",
  },
];

const channels = [
  { icon: Globe, label: "Site profissional" },
  { icon: Search, label: "Google Ads" },
  { icon: Megaphone, label: "Meta Ads" },
  { icon: Share2, label: "Redes sociais" },
  { icon: MessageCircle, label: "WhatsApp" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setActive((prev) => (prev + 1) % copies.length),
      ROTATE_TIME
    );
    return () => clearInterval(timer);
  }, [paused, active]);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[min(820px,100svh)] items-center overflow-hidden pb-20 pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.055) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]"
      />

      <div
        className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center sm:px-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="mb-8 inline-flex max-w-full items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-violet-300/25 bg-violet-400/10 text-violet-200">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">Marketing digital, sites e automações</span>
        </div>

        {/* Todas as versões ocupam a mesma célula: a altura é a da maior, sem salto de layout. */}
        <div className="grid w-full">
          {copies.map((copy, index) => {
            const isActive = index === active;
            const Title = index === 0 ? "h1" : "p";
            return (
              <div
                key={copy.title}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 flex flex-col items-center transition-all duration-700 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <Title className="max-w-4xl text-balance font-display text-[clamp(1.75rem,5.2vw,3.5rem)] font-semibold leading-[1.1] tracking-[-.04em]">
                  <span className="text-violet-gradient">{copy.title}</span>
                </Title>
                <h2 className="mt-5 max-w-3xl text-balance font-display text-base font-medium text-foreground/90 sm:text-xl">
                  {copy.subtitle}
                </h2>
                <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {copy.paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
                {copy.highlight && (
                  <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-violet-100 sm:text-base">
                    {copy.highlight}
                  </p>
                )}
                <a
                  href={copy.href}
                  tabIndex={isActive ? 0 : -1}
                  {...(copy.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-violet-gradient px-7 py-4 text-sm font-bold text-white shadow-violet-glow transition-transform hover:scale-[1.03]"
                >
                  {copy.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Mensagens">
          {copies.map((copy, index) => (
            <button
              key={copy.title}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Mensagem ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active
                  ? "w-8 bg-violet-400"
                  : "w-3 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {insights.map((item, i) => (
            <motion.div
              key={item.label}
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.6,
              }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left shadow-xl shadow-violet-950/20 backdrop-blur-xl"
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${item.tone}`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </span>
                <span className="block text-sm font-semibold text-foreground">
                  {item.text}
                </span>
              </span>
            </motion.div>
          ))}
        </div>

        <ul
          aria-label="Canais de atuação"
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
        >
          {channels.map((channel) => (
            <li
              key={channel.label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/75"
            >
              <channel.icon className="h-3.5 w-3.5 text-violet-300" />
              {channel.label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/30">
          Ilustração dos canais e entregas do projeto
        </p>

        <a
          href="#trabalhos"
          className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Ver exemplos de sites
          <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:left-10 sm:right-10 lg:left-16 lg:right-16"
      />
    </section>
  );
}
