"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Globe,
  Megaphone,
  MessageCircle,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
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
const ORBIT_TIME = 48;

const orbitIcons = [
  { icon: Globe, label: "Site", angle: -90 },
  { icon: Search, label: "Google", angle: -18 },
  { icon: Megaphone, label: "Anúncios", angle: 54 },
  { icon: Share2, label: "Redes sociais", angle: 126 },
  { icon: MessageCircle, label: "WhatsApp", angle: 198 },
];

const metrics = [
  { icon: Users, label: "Visitantes", width: "82%", bar: "from-violet-500 to-fuchsia-400" },
  { icon: MessageCircle, label: "Contatos", width: "64%", bar: "from-fuchsia-500 to-pink-400" },
  { icon: TrendingUp, label: "Vendas", width: "48%", bar: "from-emerald-500 to-teal-300" },
];

const LINE = "M0 118 C 40 112, 62 98, 92 92 S 142 68, 172 60 S 232 34, 300 10";

const panelLabels = ["Crescimento", "Presença digital", "Tudo integrado", "Anúncios"];

const posts = [
  "from-violet-500 to-fuchsia-400",
  "from-fuchsia-500 to-orange-300",
  "from-sky-500 to-violet-400",
  "from-emerald-400 to-teal-600",
  "from-pink-500 to-violet-500",
  "from-amber-400 to-rose-500",
];

function SocialPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 p-[2px]">
          <span className="grid h-full w-full place-items-center rounded-full bg-[#0d0a14] text-violet-200">
            <Sparkles className="h-4 w-4" />
          </span>
        </span>
        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="block h-2 w-2/3 rounded-full bg-white/70" />
          <span className="block h-1.5 w-1/2 rounded-full bg-white/25" />
        </span>
        <span className="rounded-full bg-violet-500 px-3 py-1 text-[9px] font-bold text-white">
          Seguir
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {posts.map((tone, i) => (
          <motion.span
            key={tone}
            initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            className={`rounded-lg bg-gradient-to-br ${tone} opacity-90`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-[9px] text-white/55 sm:text-[10px]">
        <Users className="h-3 w-3" />
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
          <motion.span
            className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
            initial={{ width: reduceMotion ? "75%" : 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </span>
        Comunidade
      </div>
    </div>
  );
}

const stack = [
  { icon: Globe, label: "Site profissional", tone: "bg-violet-500/20 text-violet-300" },
  { icon: Megaphone, label: "Campanhas de anúncios", tone: "bg-fuchsia-500/20 text-fuchsia-300" },
  { icon: Share2, label: "Redes sociais", tone: "bg-sky-500/20 text-sky-300" },
];

function IntegratedPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      {stack.map(({ icon: Icon, label, tone }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.18, duration: 0.45 }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
        >
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}>
            <Icon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-[10px] font-semibold text-white/85 sm:text-xs">{label}</span>
          <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-400/20 text-[9px] text-emerald-300">
            ✓
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-2 text-[10px] font-bold text-white sm:text-xs"
      >
        Mais clientes
        <TrendingUp className="h-4 w-4" />
      </motion.div>
    </div>
  );
}

const funnel = [
  { label: "Pessoas alcançadas", width: "100%", tone: "from-violet-500 to-violet-400" },
  { label: "Interessados", width: "72%", tone: "from-fuchsia-500 to-fuchsia-400" },
  { label: "Contatos", width: "46%", tone: "from-pink-500 to-rose-400" },
  { label: "Vendas", width: "28%", tone: "from-emerald-500 to-teal-300" },
];

function FunnelPanel({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:text-[10px]">
        <Search className="h-3 w-3" />
        Público certo
      </div>
      <div className="flex flex-1 flex-col items-center justify-evenly">
        {funnel.map(({ label, width, tone }, i) => (
          <motion.div
            key={label}
            initial={{ width: reduceMotion ? width : "0%" }}
            animate={{ width }}
            transition={{ delay: 0.15 + i * 0.18, duration: 0.7, ease: "easeOut" }}
            className={`flex h-7 items-center justify-center overflow-hidden whitespace-nowrap rounded-lg bg-gradient-to-r ${tone} text-[9px] font-bold text-white sm:h-9 sm:text-[11px]`}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GrowthVisual({ active }: { active: number }) {
  const reduceMotion = useReducedMotion();
  const spin = (reverse: boolean) =>
    reduceMotion
      ? undefined
      : {
          animate: { rotate: reverse ? -360 : 360 },
          transition: { duration: ORBIT_TIME, repeat: Infinity, ease: "linear" as const },
        };
  const float = (delay: number) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -10, 0] },
          transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[520px]"
    >
      <div className="absolute inset-[8%] rounded-full bg-violet-500/25 blur-[90px]" />
      <div className="absolute inset-[28%] rounded-full bg-fuchsia-500/20 blur-[70px]" />

      <div className="absolute inset-0 rounded-full border border-dashed border-violet-300/20" />
      <div className="absolute inset-[15%] rounded-full border border-white/10" />

      <motion.div className="absolute inset-0" {...spin(false)}>
        {orbitIcons.map(({ icon: Icon, label, angle }) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <div
              key={label}
              className="absolute"
              style={{
                left: `${50 + 50 * Math.cos(rad)}%`,
                top: `${50 + 50 * Math.sin(rad)}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                {...spin(true)}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-[#17111f]/90 text-violet-200 shadow-lg shadow-violet-950/40 backdrop-blur-md sm:h-14 sm:w-14"
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <div className="absolute left-1/2 top-1/2 w-[66%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#0d0a14]/90 shadow-[0_30px_90px_-30px_rgba(124,58,237,.7)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
            <span className="h-2 w-2 rounded-full bg-[#ffc14f]" />
            <span className="h-2 w-2 rounded-full bg-[#49c781]" />
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 sm:text-[9px]">
            {panelLabels[active]}
          </span>
        </div>

        <div className="relative h-[190px] sm:h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 p-3 sm:p-4"
            >
              {active === 1 && <SocialPanel reduceMotion={!!reduceMotion} />}
              {active === 2 && <IntegratedPanel reduceMotion={!!reduceMotion} />}
              {active === 3 && <FunnelPanel reduceMotion={!!reduceMotion} />}
              {active === 0 && (
                <>
          <svg viewBox="0 0 300 130" className="h-auto w-full">
            <defs>
              <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
            </defs>
            {[30, 60, 90].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,.06)" />
            ))}
            <path d={`${LINE} L300 130 L0 130 Z`} fill="url(#hero-area)" />
            <motion.path
              d={LINE}
              fill="none"
              stroke="url(#hero-line)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: reduceMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeOut", delay: 0.4 }}
            />
            <circle cx="300" cy="10" r="4.5" fill="#e879f9" />
          </svg>

          <div className="mt-3 space-y-2">
            {metrics.map(({ icon: Icon, label, width, bar }, i) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-3 w-3 shrink-0 text-white/50" />
                <span className="w-14 shrink-0 text-[9px] text-white/55 sm:text-[10px]">
                  {label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.span
                    className={`block h-full rounded-full bg-gradient-to-r ${bar}`}
                    initial={{ width: reduceMotion ? width : 0 }}
                    animate={{ width }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.8 + i * 0.2 }}
                  />
                </span>
              </div>
            ))}
          </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        {...float(0)}
        className="absolute -right-1 top-[10%] hidden items-center gap-3 rounded-2xl border border-white/15 bg-[#17111f]/90 px-4 py-3 shadow-xl shadow-violet-950/40 backdrop-blur-xl sm:flex"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-fuchsia-500/20 text-fuchsia-300">
          <Megaphone className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
        </span>
        <span className="text-left">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Campanha
          </span>
          <span className="block text-xs font-semibold text-white">Anúncio ativo</span>
        </span>
      </motion.div>

      <motion.div
        {...float(1.2)}
        className="absolute -left-2 bottom-[8%] hidden items-center gap-3 rounded-2xl border border-white/15 bg-[#17111f]/90 px-4 py-3 shadow-xl shadow-violet-950/40 backdrop-blur-xl sm:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="text-left">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
            WhatsApp
          </span>
          <span className="block text-xs font-semibold text-white">Novo orçamento</span>
        </span>
        <ArrowUpRight className="h-4 w-4 text-emerald-300" />
      </motion.div>
    </div>
  );
}

export function Hero() {
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
      className="relative isolate flex items-center overflow-hidden pb-16 pt-28 lg:min-h-[min(760px,100svh)] lg:pt-32"
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
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-violet-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]"
      />

      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-8 lg:px-16">
        <div
          className="relative z-10 min-w-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="mb-6 inline-flex max-w-full items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-violet-300/25 bg-violet-400/10 text-violet-200">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0">Marketing digital, sites e automações</span>
          </div>

          {/* Todas as versões ocupam a mesma célula: a altura é a da maior, sem salto de layout. */}
          <div className="grid">
            {copies.map((copy, index) => {
              const isActive = index === active;
              const Title = index === 0 ? "h1" : "p";
              return (
                <div
                  key={copy.title}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 flex flex-col items-start transition-all duration-700 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <Title className="max-w-3xl text-balance font-display text-[clamp(1.75rem,4.6vw,3.4rem)] font-semibold leading-[1.08] tracking-[-.04em]">
                    <span className="text-violet-gradient">{copy.title}</span>
                  </Title>
                  <h2 className="mt-4 max-w-2xl text-balance font-display text-base font-medium text-foreground/90 sm:text-lg">
                    {copy.subtitle}
                  </h2>
                  <div className="mt-4 max-w-2xl space-y-3 text-sm leading-6 text-muted-foreground">
                    {copy.paragraphs.map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                  </div>
                  {copy.highlight && (
                    <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-violet-100">
                      {copy.highlight}
                    </p>
                  )}
                  <a
                    href={copy.href}
                    tabIndex={isActive ? 0 : -1}
                    {...(copy.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group mt-7 inline-flex items-center gap-3 rounded-full bg-violet-gradient px-7 py-4 text-sm font-bold text-white shadow-violet-glow transition-transform hover:scale-[1.03]"
                  >
                    {copy.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Mensagens">
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
            <a
              href="#trabalhos"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver exemplos de sites
              <ArrowDown className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-0"
        >
          <GrowthVisual active={active} />
        </motion.div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:left-10 sm:right-10 lg:left-16 lg:right-16"
      />
    </section>
  );
}
