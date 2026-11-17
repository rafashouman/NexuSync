"use client";

import { AccentText } from "@/components/AccentText";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Layers3,
  Sparkles,
  Search,
  X,
  ZoomIn,
  MoveUpRight,
  SlidersHorizontal,
  CalendarClock,
  BarChart3,
  Cpu,
  Flame,
  MessageSquare,
  UtensilsCrossed,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GalleryHorizontal,
} from "lucide-react";
import { Reveal, CountUp } from "@/components/ui/MotionKit";
import { useFocusTrap } from "@/components/ui/useFocusTrap";
import { QuoteLink } from "@/components/QuoteLink";
import { DeviceStage } from "@/components/DeviceStage";
import { AppCatalogDirectory } from "@/components/AppCatalogDirectory";
import { ServiceSectionNav } from "@/components/ServiceSectionNav";

// =========================================================
// 1. APPS REAIS DE NEGÓCIOS (AGENDAMENTOS, DELIVERY & DASHBOARDS)
// =========================================================
const realBusinessApps = [
  {
    id: "chronos",
    title: "Chronos · Agenda de beleza",
    category: "Agendamento para barbearias e salões",
    statusBadge: "AGENDA ONLINE",
    metricsLabel: "Serviços, preços e horários do salão",
    description:
      "O cliente escolhe corte, barba ou escova, vê preço e duração e reserva um horário. O salão acompanha a ocupação do dia.",
    highlights: [
      "Escolha do serviço por preço e duração",
      "Trava automática contra agendamento duplicado",
      "Confirmação com nome, data e horário",
    ],
    tech: ["Agenda digital", "Next.js", "Painel de gestão"],
    accent: "from-turquoise/25 via-turquoise/10 to-transparent",
    borderGlow: "hover:border-turquoise/60",
    buttonLabel: "Testar Sistema de Agendamento",
    icon: CalendarClock,
  },
  {
    id: "kobra-pdv",
    href: "/templates/cardapio",
    title: "Kobra Burger PDV & Delivery KDS",
    category: "App de Pedidos, Comanda & Cozinha",
    statusBadge: "PDV + KDS EM TEMPO REAL",
    metricsLabel: "Cardápio Digital • Comanda de Mesa • Monitor KDS",
    description:
      "Sistema operacional completo para restaurantes e hamburguerias: recebe pedidos de delivery, gerencia mesas VIP e exibe fila de preparo ao vivo no monitor da cozinha (KDS).",
    highlights: [
      "Personalização de adicionais e ponto da carne",
      "Monitor KDS interativo para controle de fila da cozinha",
      "Fechamento de conta e envio estruturado no WhatsApp",
    ],
    tech: ["Next.js App Router", "KDS Kitchen Monitor", "Carrinho Dinâmico", "WhatsApp API"],
    accent: "from-champagne/25 via-champagne/10 to-transparent",
    borderGlow: "hover:border-champagne/60",
    buttonLabel: "Abrir Sistema Delivery & KDS",
    icon: UtensilsCrossed,
  },
  {
    id: "dog-e-acai",
    href: "/templates/dog-e-acai",
    title: "Dog & Açaí",
    category: "Cardápio para lancherias e açaíterias",
    statusBadge: "DELIVERY E RETIRADA",
    description: "Deixe o cliente montar o cachorro-quente, escolher os complementos do açaí e revisar o pedido pelo celular.",
    highlights: ["Adicionais doces e salgados por produto", "Combos com preço calculado na hora", "Sacola com entrega ou retirada"],
    tech: ["Cardápio digital", "Combos", "WhatsApp"],
    accent: "from-turquoise/25 via-champagne/10 to-transparent",
    borderGlow: "hover:border-turquoise/60",
    buttonLabel: "Experimentar Dog & Açaí",
    icon: UtensilsCrossed,
  },
  {
    id: "pulsemetrics",
    title: "PulseMetrics · Painel de vendas",
    category: "Vendas e resultados de campanhas",
    statusBadge: "META PIXEL & BI LIVE",
    metricsLabel: "Vendas, contatos e retorno dos anúncios",
    description:
      "Painel gerencial para acompanhamento de metas, receita recorrente, atribuição de campanhas e auditoria ao vivo de eventos disparados pelo Meta Pixel.",
    highlights: [
      "Gráficos interativos de receita, ticket médio e conversão",
      "Console de inspeção de eventos de marketing ao vivo",
      "Simulador de projeção de vendas e exportação de dados",
    ],
    tech: ["Analytics BI", "Meta Pixel SDK", "SVG Telemetry", "React 19"],
    accent: "from-turquoise/25 via-turquoise/10 to-transparent",
    borderGlow: "hover:border-turquoise/60",
    buttonLabel: "Abrir painel de vendas",
    icon: BarChart3,
  },
];

// =========================================================
// 2. MINI-APPS LÚDICOS & EXPERIÊNCIAS INTERATIVAS
// =========================================================
const playfulApps = [
  {
    id: "pulsespin",
    title: "PulseSpin · Roleta de cupons",
    category: "Gamificação para Captura de Leads",
    tag: "Cupons para campanhas",
    description:
      "Roleta promocional com física de desaceleração e liberação de cupons exclusivos para transformar visitantes indecisos em clientes no WhatsApp.",
    icon: Flame,
    accent: "from-turquoise/20 via-turquoise/5 to-transparent",
  },
  {
    id: "memory",
    title: "Memory Matrix 3D",
    category: "Desafio Interativo com Ranking Global",
    tag: "Firebase Leaderboard · 3D Flip",
    description:
      "Jogo de memória espacial com cartas 3D, cronômetro de precisão e gravação de recordes por apelido.",
    icon: Layers3,
    accent: "from-lime-400/20 via-emerald-500/5 to-transparent",
  },
  {
    id: "arknoid",
    title: "Arknoid Physics Lab",
    category: "Experimento Físico 2D no Navegador",
    tag: "HTML5 Canvas · 60 FPS",
    description:
      "Releitura vetorial de Arkanoid projetada para demonstrar colisão elástica, deflexão angular e partículas em tempo real.",
    icon: Code2,
    accent: "from-champagne/20 via-champagne/5 to-transparent",
  },
  {
    id: "images-blend",
    title: "Image Blend Studio",
    category: "Laboratório de Shaders & Direção de Arte",
    tag: "CSS Mix-Blend · Real-Time",
    description:
      "Ferramenta criativa para composição multicamada com controle de opacidade, matiz e blend modes direto no navegador.",
    icon: Sparkles,
    accent: "from-turquoise/20 via-turquoise/5 to-transparent",
  },
];

export function AppsPageContent() {
  return (
    <section className="container-luxe py-28 sm:py-36 relative">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute top-12 left-1/4 h-[450px] w-[450px] rounded-full bg-champagne/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-turquoise/10 blur-[140px]" />

      {/* =========================================================
          HERO HEADER — FOCO EM SOLUÇÕES REAIS DE NEGÓCIO
      ========================================================= */}
      <div className="relative z-10 mb-16 grid gap-8 border-b border-turquoise/40 pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.08] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
              <Cpu className="h-3.5 w-3.5 text-ice" />
              Sistemas Web, Agendamentos, Delivery & Dashboards
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              DEMONSTRAÇÕES AO VIVO
            </span>
          </div>

          <h1 className="mb-6 font-display text-4xl font-black uppercase tracking-tight text-ivory sm:text-6xl lg:leading-[1.02]">
            Sistemas web e automações{" "}
            <span className="text-brand-gradient italic">
              para organizar a rotina do seu negócio.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Teste na prática nossos sistemas de{" "}
            <strong className="text-ivory">
              agendamento online, pedidos de delivery com monitor de cozinha e
              dashboards gerenciais
            </strong>
            . Logo abaixo, explore também nossas ferramentas lúdicas de
            gamificação e o fliperama interativo.
          </p>


        {/* Atalhos Rápidos */}
        <div className="mt-7 flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="#todos-os-aplicativos"
            className="inline-flex items-center gap-2 rounded-2xl bg-champagne px-5 py-3.5 font-mono text-xs font-black uppercase tracking-wider text-abyss transition-all hover:bg-turquoise shadow-[0_0_25px_rgba(34,211,238,0.25)]"
          >
            <CalendarClock className="h-4 w-4" />
            Ver todos os aplicativos
          </a>
          <QuoteLink
            interest="aplicacao-web"
            section="apps"
            className="inline-flex items-center gap-2 rounded-2xl border border-turquoise/40 bg-ocean/65 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory transition-all hover:border-turquoise/50 hover:bg-champagne hover:text-abyss"
          >
            <MessageSquare className="h-4 w-4" />
            Orçar Meu Sistema
          </QuoteLink>
        </div>
        </div>
        <div className="min-w-0">
        <aside
          aria-hidden="true"
          className="relative overflow-hidden rounded-[2rem] border border-turquoise/40 bg-ocean p-5 shadow-[0_30px_90px_-40px_rgba(34,211,238,.5)] sm:p-7"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-turquoise/10 blur-3xl"
          />
          <div className="relative flex items-center justify-between border-b border-turquoise/40 pb-5">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice">
                Exemplo de interface
              </p>
              <p className="mt-1 text-sm text-ivory/85">Painel de operação</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-turquoise/40 bg-turquoise/10 text-ice">
              <Cpu className="h-5 w-5" />
            </span>
          </div>
          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
              <div className="flex items-center justify-between text-ivory/85">
                <span className="text-xs">Agenda de hoje</span>
                <CalendarClock className="h-4 w-4 text-ice" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-ivory">18</p>
              <p className="mt-1 text-[10px] text-ivory/85">horários organizados</p>
            </div>
            <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
              <div className="flex items-center justify-between text-ivory/85">
                <span className="text-xs">Pedidos</span>
                <UtensilsCrossed className="h-4 w-4 text-champagne" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-ivory">06</p>
              <p className="mt-1 text-[10px] text-ivory/85">em acompanhamento</p>
            </div>
          </div>
          <div className="relative mt-3 rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-ivory/80">Fluxo do dia</span>
              <span className="font-mono text-[10px] text-ice">VISÃO DEMONSTRATIVA</span>
            </div>
            <div className="flex h-14 items-end gap-2">
              {[34, 52, 43, 76, 61, 88, 69, 100, 74, 90].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-turquoise/40 to-turquoise/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </aside>
<p className="mt-3 px-1 text-[11px] leading-5 text-muted-foreground">
            As demonstrações e os dados exibidos são ilustrativos. Recursos,
            integrações e condições de cada aplicação são definidos na proposta.
          </p>
        </div>
      </div>

      <ServiceSectionNav
        contained
        items={[
          { href: "#sistemas-reais", label: "Sistemas web" },
          { href: "#apps-necessidades", label: "O que organizar" },
          { href: "#apps-formatos", label: "Soluções" },
          { href: "#apps-exemplos", label: "Exemplos" },
          { href: "#apps-processo", label: "Etapas" },
          { href: "#aplicacoes", label: "Planos" },
          { href: "#faq", label: "Dúvidas" },
        ]}
      />

      {/* =========================================================
          1º BLOCO (DESTAQUE PRINCIPAL): APPS REAIS DE USO COMERCIAL
          (AGENDAMENTOS, DELIVERY/PDV & DASHBOARDS)
      ========================================================= */}
      <div id="sistemas-reais" className="relative z-10 mb-28 scroll-mt-40 pt-10 sm:pt-14">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ice">
              {"// 01. SOLUÇÕES PRONTAS PARA EMPRESAS & SERVIÇOS"}
            </p>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-ivory sm:text-4xl"><AccentText text={"Agendamentos, Delivery & Dashboards"} /></h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
            Clique em qualquer sistema abaixo para abrir e testar o fluxo real
            de uso como cliente e como administrador.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {realBusinessApps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <motion.article
                key={app.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] border border-turquoise/40 bg-ocean/95 p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 ${app.borderGlow}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${app.accent} opacity-75 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  {/* Top Badges */}
                  <div className="mb-6 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] font-bold text-emerald-300">
                      ● {app.statusBadge}
                    </span>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-turquoise/40 bg-abyss/50 text-ivory transition-transform duration-300 group-hover:scale-110 group-hover:border-turquoise group-hover:bg-turquoise group-hover:text-abyss">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ice block mb-1">
                    {app.category}
                  </span>
                  <h3 className="mb-3 font-display text-2xl font-black uppercase tracking-tight text-ivory"><AccentText text={app.title} /></h3>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                    {app.description}
                  </p>

                  {/* Checklist de Funcionalidades de Negócio */}
                  <div className="space-y-2 mb-6 rounded-2xl border border-turquoise/40 bg-abyss/35 p-4">
                    {app.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-ivory/85"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-ice shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-turquoise/40 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {app.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-turquoise/40 bg-abyss/40 px-2.5 py-1 font-mono text-[10px] text-ivory/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                      href={app.href ?? `/${app.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ice hover:bg-champagne text-abyss px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:text-abyss"
                    >
                      <span>{app.buttonLabel}</span>
                      <MoveUpRight className="h-4 w-4" />
                    </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          2º BLOCO: MINI-APPS LÚDICOS, GAMIFICAÇÃO & SANDBOX CRIATIVO
      ========================================================= */}
      <div className="relative z-10 mb-28 border-t border-turquoise/40 pt-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ice">
              {"// 02. ENGAJAMENTO DE CAMPANHAS & EXPERIMENTOS VISUAIS"}
            </p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ivory sm:text-4xl"><AccentText text={"Jogos e experiências para suas campanhas"} /></h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-muted-foreground">
            Experimente jogos e ferramentas interativas que podem fazer parte
            de campanhas para envolver seu público e captar contatos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {playfulApps.map((item) => {
            const Icon = item.icon;

            const CardInner = (
              <>
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-65 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-turquoise/40 bg-turquoise/[0.08] text-ice transition-transform duration-300 group-hover:scale-105 group-hover:bg-turquoise group-hover:text-abyss">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-turquoise/40 bg-ocean/65 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ice">
                      {item.tag}
                    </span>
                  </div>

                  <p className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ice">
                    {item.category}
                  </p>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-ivory sm:text-3xl"><AccentText text={item.title} /></h3>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-turquoise/40 bg-ocean/65 text-ivory/85 transition-all group-hover:border-turquoise group-hover:bg-ice group-hover:text-abyss">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-turquoise/40 pt-4 text-xs font-semibold text-ice/80">
                  <span>
                    Abrir demonstração
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ivory/85 group-hover:text-ice">
                    Iniciar Experiência →
                  </span>
                </div>
              </>
            );

            return (
              <Link
                key={item.id}
                href={`/${item.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-turquoise/40 bg-ocean/85 p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-turquoise/35 sm:p-9"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="mb-12 rounded-3xl border border-turquoise/40 p-6 sm:p-8">
        <h2 className="font-display text-2xl"><AccentText text={"Conheça nosso fliperama"} /></h2>
        <p className="mt-3 text-muted-foreground">Explore os jogos completos e descubra ideias para sua campanha.</p>
        <Link href="/arcade" className="mt-5 inline-flex items-center gap-2 font-semibold text-ice">Explorar o fliperama <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
      </aside>

      <AppCatalogDirectory />

      {/* Footer Navigation Links */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-turquoise/40 pt-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/design"
            className="inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-ocean/65 px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-turquoise/30 hover:text-ice"
          >
            Explorar portfólio de design
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-ocean/65 px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-turquoise/30 hover:text-ice"
          >
            Ver templates web
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <Link
          href="/#contato"
          className="inline-flex items-center gap-2 rounded-full bg-champagne hover:bg-turquoise px-6 py-2.5 text-xs font-black uppercase tracking-wider text-abyss transition-all shadow-lg"
        >
          <span>Falar com a NexuSync</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const DESIGN_GALLERIES = [
  {
    id: "design-grafico",
    title: "Design gráfico",
    description: "Peças gráficas, materiais impressos e comunicação visual.",
    folder: "port-dg",
    works: [
      "aw-cartao.jpg",
      "bargento-aheadworks.jpg",
      "bargento-cardapio.jpg",
      "camiseta.png",
      "cartao-pink-frente-bg.jpg",
      "cartao-pink-frente.jpg",
      "cartao-pink-verso-bg.jpg",
      "cartao-pink-verso.jpg",
      "faxia-bela-juba.jpg",
      "faxia-bela-juba.png",
      "flavia-cartao-bg.jpg",
      "flavia-cartao-vs-bg.jpg",
      "flavia-cartao-vs.jpg",
      "flavia-cartao.jpg",
      "fox-banner-1-bg.jpg",
      "fox-banner-1.jpg",
      "fox-banner-2-bg.jpg",
      "fox-banner-2.jpg",
      "fox-banner-3.jpg",
      "impressao-cardapio-1.jpg",
      "impressao-cardapio-2.jpg",
      "impressao-cardapio-bg-2.jpg",
      "meu-old.jpg",
      "panfleto-paty-1.jpg",
      "panfleto-paty-2.jpg",
      "panfleto-severo-2.jpg",
      "panfleto-severo-3.jpg",
      "panfleto-severo1.jpg",
      "pink-cardapio-2.jpg",
      "tutoia-panfleto.jpg",
      "vale-diamix-pq.jpg",
      "vale-diamix.jpg",
    ],
  },
  {
    id: "web-design",
    title: "Web design",
    description:
      "Layouts, banners e materiais criados para experiências digitais.",
    folder: "port-wd",
    works: [
      "banner-promo-rheem-2.jpg",
      "banner-promo-rheem.jpg",
      "banners-ecommerce-(1).jpg",
      "banners-ecommerce-(3).jpg",
      "banners-ecommerce-(4).jpg",
      "banners-ecommerce-(5).jpg",
      "banners-ecommerce-aw.jpg",
      "bargento-capa-face.jpg",
      "bargento-divulga--1.jpg",
      "bargento-divulga-2.jpg",
      "bargento-divulga.jpg",
      "belajuba-faixa.jpg",
      "capa-face-(1).jpg",
      "capa-face-(2).jpg",
      "capa-face-(4).jpg",
      "capa-face-(5).jpg",
      "capa-face-(8).jpg",
      "capa-face-3.jpg",
      "capa-face-7.png",
      "capa-face-8.jpg",
      "divulga-google.jpg",
      "email-mkt (1).jpg",
      "email-mkt (1).png",
      "email-mkt (2).jpg",
      "email-mkt (4).jpg",
      "email-mkt-3.jpg",
      "email-mkt-5.jpg",
      "especial-face-pq.jpg",
      "especial-face.jpg",
      "especial-site-carol.png",
      "especial-site.jpg",
      "pink-avatar.jpg",
      "pink-face-(1).jpg",
      "pink-face-(2).jpg",
      "pink-face-(4).jpg",
      "pink-face-(5).jpg",
      "pink-face-(7).jpg",
      "pink-face-3.jpg",
      "pink-face-divulga-1-big.jpg",
      "pink-face-divulga-2-big.jpg",
      "pink-face-divulga-2-pq.jpg",
      "pink-face-divulga-3-big.jpg",
      "pink-face-divulga-3-pq.jpg",
      "pink-face-divulga-4-big.jpg",
      "pink-face-divulga-4-pq.jpg",
      "pink-face-divulga-5-big.jpg",
      "pink-face-divulga-5-pq.jpg",
      "pink-face-divulga-6-big.jpg",
      "pink-face-divulga-6-pq.jpg",
      "post-face (1).jpg",
      "post-face (1).png",
      "post-face (11).jpg",
      "post-face (2).jpg",
      "post-face (2).png",
      "post-face (3).jpg",
      "post-face (4).jpg",
      "post-face (5).jpg",
      "post-face (6).jpg",
      "post-face (6).png",
      "post-face-(10).jpg",
      "post-face-(11).jpg",
      "post-face-(3).jpg",
      "post-face-(5).jpg",
      "post-face-(7).jpg",
      "post-face-(8).jpg",
      "post-face-3.jpg",
      "ragina-Capa_Face.jpg",
      "regina-avatar.jpg",
      "site-carol-gd.jpg",
      "site-flavia-gd.png",
      "thumbnail_Capa_Face.jpg",
    ],
  },
];

const formatWorkTitle = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type DesignWork = { src: string; title: string; category: string; kind: string };

function WorkCard({
  work,
  onOpen,
  className = "",
}: {
  work: DesignWork;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <figure
      role="button"
      tabIndex={0}
      aria-label={`Ampliar peça: ${work.title}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group h-full cursor-pointer overflow-hidden rounded-[1.6rem] border border-turquoise/40 bg-ocean/80 transition-all duration-300 hover:-translate-y-1 hover:border-turquoise/35 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:border-turquoise/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquoise/60 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ocean">
        <NextImage
          src={work.src}
          alt={`${work.category}: ${work.title}`}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 32vw"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-abyss/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-abyss/70 px-4 py-2 text-xs font-semibold text-ivory">
            <ZoomIn className="h-3.5 w-3.5 text-ice" />
            Ampliar Peça
          </span>
        </div>
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t border-turquoise/40 px-5 py-3.5">
        <span className="truncate text-sm font-medium capitalize text-foreground/90 group-hover:text-ice">
          {work.title}
        </span>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ivory/85">
          {work.kind}
        </span>
      </figcaption>
    </figure>
  );
}

function WorksCarousel({
  works,
  onOpen,
  label,
}: {
  works: DesignWork[];
  onOpen: (index: number) => void;
  label: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, works.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "grid h-11 w-11 place-items-center rounded-full border border-turquoise/40 bg-ocean/90 text-ivory backdrop-blur transition-all hover:border-turquoise/50 hover:bg-turquoise/25 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={label}>
      <ul
        ref={trackRef}
        onScroll={update}
        tabIndex={-1}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:px-6"
      >
        {works.map((work, i) => (
          <li
            key={work.src}
            className="w-[78%] shrink-0 snap-center sm:w-[46%] lg:w-[32%]"
          >
            <WorkCard work={work} onOpen={() => onOpen(i)} />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-4">
        <div
          aria-hidden
          className="h-1 flex-1 overflow-hidden rounded-full bg-ice/10"
        >
          <div
            className="h-full rounded-full bg-brand-gradient transition-[width] duration-200"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            aria-label="Peças anteriores"
            className={arrow}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            aria-label="Próximas peças"
            className={arrow}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DesignPageHero() {
  const totalWorks = DESIGN_GALLERIES.reduce((n, g) => n + g.works.length, 0);

  return (
    <>
      <section id="design-intro" className="container-luxe scroll-mt-32 pb-14 pt-32 sm:pb-16 sm:pt-40">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
              <Sparkles className="h-3.5 w-3.5 text-ice" />
              Identidade visual · Design
            </span>
            <h1 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
              Identidade visual e design{" "}
              <span className="text-brand-gradient">para valorizar sua marca.</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Criamos identidades, peças digitais e interfaces para apresentar
              sua marca com consistência e intenção.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ivory/85">
                  Projetos no acervo
                </dt>
                <dd className="font-display text-3xl font-bold text-ivory">
                  <CountUp to={totalWorks} prefix="+" />
                </dd>
              </div>
              <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-ivory/85">
                  Categorias
                </dt>
                <dd className="font-display text-3xl font-bold text-ivory">
                  <CountUp to={DESIGN_GALLERIES.length} />
                </dd>
              </div>
            </dl>
          </div>
          <div
            aria-hidden="true"
            className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-[2rem] border border-turquoise/40 bg-ocean p-5 shadow-[0_30px_90px_-40px_rgba(212,255,56,.5)] sm:p-7"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-turquoise/15 blur-3xl" />
            <div className="relative flex items-center justify-between border-b border-turquoise/40 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient font-display text-lg font-black text-abyss">
                  N
                </span>
                <div>
                  <p className="font-semibold text-ivory">Sistema de marca</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ivory/85">Estudo visual</p>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-ice" />
            </div>
            <div className="relative py-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ice">Direção de arte</p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-ivory sm:text-5xl">
                Marca com <span className="text-brand-gradient">presença.</span>
              </p>
              <div className="mt-6 flex gap-2">
                {["#d4ff38", "#8be7c5", "#d4ff38", "#f4f4e9"].map((color) => (
                  <span
                    key={color}
                    className="h-9 flex-1 rounded-xl border border-turquoise/40"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ivory/85">Tipografia</p>
                <p className="mt-2 font-display text-xl font-bold text-ivory">Aa Bb Cc</p>
              </div>
              <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ivory/85">Aplicações</p>
                <p className="mt-2 text-sm font-semibold text-ivory">Digital · Editorial</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ServiceSectionNav
        items={[
          { href: "#conteudo-design", label: "Portfólio" },
          { href: "#design-grafico", label: "Design gráfico" },
          { href: "#web-design", label: "Web design" },
          { href: "#design-necessidades", label: "O que sua marca precisa" },
          { href: "#design-formatos", label: "Formatos e entregas" },
          { href: "#design-processo", label: "Etapas" },
          { href: "#midias-digitais", label: "Planos" },
          { href: "#faq", label: "Dúvidas" },
        ]}
      />
    </>
  );
}

export function DesignPageContent() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [lightbox, setLightbox] = useState<{
    items: DesignWork[];
    index: number;
  } | null>(null);
  const lightboxItem = lightbox ? lightbox.items[lightbox.index] : null;

  const closeLightbox = () => setLightbox(null);
  const stepLightbox = useCallback((dir: 1 | -1) => {
    setLightbox((cur) =>
      cur
        ? {
            ...cur,
            index: (cur.index + dir + cur.items.length) % cur.items.length,
          }
        : cur
    );
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, stepLightbox]);

  const lightboxTrapRef = useFocusTrap<HTMLDivElement>(
    lightbox !== null,
    closeLightbox
  );

  const visibleGalleries = DESIGN_GALLERIES.filter(
    (g) => activeTab === "all" || g.id === activeTab
  );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const totalMatches = visibleGalleries.reduce(
    (n, g) =>
      n +
      g.works.filter((f) =>
        formatWorkTitle(f).toLowerCase().includes(normalizedQuery)
      ).length,
    0
  );

  return (
    <section id="conteudo-design" className="container-luxe scroll-mt-32 pb-24 pt-16 sm:pt-20">
      <div className="mb-12 max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
          <Sparkles className="h-3.5 w-3.5 text-ice" />
          Exemplos de trabalhos
        </span>
        <h2 className="mb-5 font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl"><AccentText text={"Projetos de identidade visual e design"} /></h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Explore exemplos de design gráfico, identidade visual, banners para
          e-commerce e campanhas digitais.
        </p>
      </div>

      {/* Barra de Filtro + Busca Rápida */}
      <div className="mb-14 flex flex-col justify-between gap-4 rounded-2xl border border-turquoise/40 bg-ocean/80 p-4 backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-ivory/85">
            <SlidersHorizontal className="h-3 w-3" />
            Filtrar:
          </span>
          <button
            type="button"
            aria-pressed={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${activeTab === "all"
                ? "bg-brand-gradient text-abyss shadow-brand-glow"
                : "border border-turquoise/40 bg-ocean/65 text-muted-foreground hover:text-ivory"
              }`}
          >
            Todos (
            {DESIGN_GALLERIES[0].works.length +
              DESIGN_GALLERIES[1].works.length}
            )
          </button>
          {DESIGN_GALLERIES.map((gallery) => (
            <button
              key={gallery.id}
              type="button"
              aria-pressed={activeTab === gallery.id}
              onClick={() => setActiveTab(gallery.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${activeTab === gallery.id
                  ? "bg-brand-gradient text-abyss shadow-brand-glow"
                  : "border border-turquoise/40 bg-ocean/65 text-muted-foreground hover:text-ivory"
                }`}
            >
              {gallery.title} ({gallery.works.length})
            </button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/85" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar peça (ex: banner, cartão)..."
            aria-label="Buscar peça"
            className="w-full rounded-xl border border-turquoise/40 bg-ocean/65 py-2 pl-9 pr-9 text-xs text-ivory placeholder:text-ivory/85 focus:border-turquoise/40 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ivory/85 hover:bg-ice/10 hover:text-ivory"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {totalMatches} projetos encontrados
      </p>

      <div className="mb-8 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ivory/85">
          {totalMatches} peças
        </p>
        <div className="inline-flex rounded-xl border border-turquoise/40 bg-abyss/40 p-1">
          {(
            [
              { id: "carousel", label: "Carrossel", Icon: GalleryHorizontal },
              { id: "grid", label: "Grade", Icon: LayoutGrid },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={viewMode === id}
              onClick={() => setViewMode(id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === id
                  ? "bg-brand-gradient text-abyss shadow-brand-glow"
                  : "text-ivory/85 hover:text-ivory"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {totalMatches === 0 && (
        <div className="mb-10 rounded-2xl border border-dashed border-turquoise/40 bg-ocean/65 p-10 text-center">
          <p className="mb-1 font-display text-lg font-bold text-ivory">
            Nenhuma peça encontrada
          </p>
          <p className="mb-5 text-sm text-muted-foreground">
            Tente outro termo ou limpe a busca para ver todo o acervo.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
            className="rounded-xl bg-brand-gradient px-5 py-2 text-xs font-semibold text-abyss shadow-brand-glow"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Galerias */}
      <div className="space-y-20">
        {visibleGalleries.map((gallery) => {
          const filteredWorks = gallery.works.filter((filename) =>
            formatWorkTitle(filename).toLowerCase().includes(normalizedQuery)
          );
          if (filteredWorks.length === 0) return null;
          const works: DesignWork[] = filteredWorks.map((filename) => ({
            src: `/images/${gallery.folder}/${encodeURIComponent(filename)}`,
            title: formatWorkTitle(filename),
            category: gallery.title,
            kind: gallery.id === "design-grafico" ? "Print" : "Digital",
          }));

          return (
            <section key={gallery.id} id={gallery.id} className="scroll-mt-28">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-turquoise/40 pb-5">
                <div>
                  <h2 className="mb-1.5 font-display text-2xl font-bold sm:text-3xl"><AccentText text={gallery.title} /></h2>
                  <p className="text-sm text-muted-foreground">
                    {gallery.description}
                  </p>
                </div>
                <span className="rounded-full border border-turquoise/40 bg-ocean/65 px-3.5 py-1 font-mono text-xs text-ice">
                  {filteredWorks.length} projetos
                  {viewMode === "carousel" ? " · arraste ou use as setas" : ""}
                </span>
              </div>

              {viewMode === "carousel" ? (
                <WorksCarousel
                  label={`Carrossel: ${gallery.title}`}
                  works={works}
                  onOpen={(index) => setLightbox({ items: works, index })}
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {works.map((work, index) => (
                    <Reveal key={work.src} delay={(index % 3) * 0.06}>
                      <WorkCard
                        work={work}
                        onOpen={() => setLightbox({ items: works, index })}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Modal Lightbox para Visualização Ampliada */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/85 p-4 backdrop-blur-xl sm:p-8"
          >
            <motion.div
              ref={lightboxTrapRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${lightboxItem.category}: ${lightboxItem.title}`}
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-turquoise/40 bg-ocean shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-turquoise/40 px-6 py-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ice">
                    {lightboxItem.category}
                  </span>
                  <h3 className="font-display text-lg font-bold capitalize text-ivory"><AccentText text={lightboxItem.title} /></h3>
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="grid h-9 w-9 place-items-center rounded-full border border-turquoise/40 bg-ocean/65 text-ivory/85 transition-colors hover:bg-ice/15 hover:text-ivory"
                  aria-label="Fechar visualização"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative h-[65vh] w-full bg-ocean p-6">
                <NextImage
                  key={lightboxItem.src}
                  src={lightboxItem.src}
                  alt={lightboxItem.title}
                  fill
                  sizes="90vw"
                  className="object-contain p-4"
                />
                {lightbox && lightbox.items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepLightbox(-1)}
                      aria-label="Peça anterior"
                      className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-turquoise/40 bg-abyss/60 text-ivory backdrop-blur hover:bg-turquoise/40"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLightbox(1)}
                      aria-label="Próxima peça"
                      className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-turquoise/40 bg-abyss/60 text-ivory backdrop-blur hover:bg-turquoise/40"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <span
                      role="status"
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-turquoise/40 bg-abyss/70 px-3 py-1 font-mono text-[11px] text-ivory/80"
                    >
                      {lightbox.index + 1} / {lightbox.items.length}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function TemplatesPageContent() {
  const templates = [
    {
      number: "01",
      code: "ARCH // FITNESS-LAB",
      category: "Fitness & Biomecânica",
      title: "Academias & Alta Performance",
      brandName: "PulseFit Lab",
      description:
        "Apresente as modalidades, os horários das turmas e os planos. O visitante pode agendar uma aula experimental pelo celular.",
      href: "/templates/academias",
      theme: "from-lime-400/20 via-ocean to-petroleum",
      badgeColor: "border-lime-400/35 bg-lime-400/10 text-lime-200",
      accentText: "text-lime-300",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Acid Lime", hex: "#8be7c5" },
        { name: "Emerald Deep", hex: "#d4ff38" },
        { name: "Carbon Dark", hex: "#141f50" },
      ],
      conversionFocus: "Agendamento de aula experimental",
      modules: [
        "Calculadora de Gasto Calórico & IMC Interativa",
        "Grade Dinâmica de Modalidades por Objetivo",
        "Solicitação de aula experimental",
        "Contato sobre planos pelo WhatsApp",
      ],
      stack: ["Next.js App Router", "Framer Motion", "Tailwind CSS", "Meta Pixel"],
    },
    {
      number: "02",
      code: "ARCH // FOOD-PDV-KDS",
      category: "Gastronomia & PDV KDS",
      title: "Hamburguerias & Delivery",
      brandName: "Kobra Burger Fire",
      description:
        "Sistema gastronômico completo em tons de brasa e carmesim: cardápio digital de alta conversão, reserva de mesas VIP, comanda e monitor de cozinha (KDS).",
      href: "/templates/cardapio",
      theme: "from-champagne/25 via-ocean to-petroleum",
      badgeColor: "border-champagne/35 bg-champagne/10 text-champagne",
      accentText: "text-champagne",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Ember Orange", hex: "#bce82c" },
        { name: "Flame Amber", hex: "#bce82c" },
        { name: "Charcoal", hex: "#141f50" },
      ],
      conversionFocus: "Zero Taxa de Marketplace • Pedidos Diretos",
      modules: [
        "Cardápio Interativo com Adicionais e Ponto da Carne",
        "Monitor KDS (Kitchen Display System) em Tempo Real",
        "Reserva de Mesas VIP & Comanda Digital",
        "Disparo Estruturado do Pedido p/ WhatsApp da Loja",
      ],
      stack: ["Next.js App Router", "KDS State Engine", "Cart Context", "WhatsApp API"],
    },
    {
      number: "03",
      code: "ARCH // EDITORIAL-COMMERCE",
      category: "E-commerce & Moda",
      title: "Lojas Virtuais & Streetwear",
      brandName: "Vortex Atelier",
      description:
        "Vitrine editorial de luxo para marcas autorais e e-commerces que exigem direção de arte marcante, lookbook interativo e jornada de compra fluida.",
      href: "/templates/streetwear",
      theme: "from-turquoise/20 via-ocean to-petroleum",
      badgeColor: "border-turquoise/35 bg-turquoise/10 text-ice",
      accentText: "text-ice",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Cyber Violet", hex: "#d4ff38" },
        { name: "Fuchsia Glow", hex: "#8be7c5" },
        { name: "Obsidian", hex: "#141f50" },
      ],
      conversionFocus: "Posicionamento Premium & Aumento de Ticket Médio",
      modules: [
        "Lookbook Editorial com Filtro por Drop/Coleção",
        "Seletor Rápido de Tamanhos, Medidas e Tecidos",
        "Sacola Deslizante (Drawer Cart) com Cálculo Rápido",
        "Integração para Compra Direta ou Checkout Externo",
      ],
      stack: ["Next.js App Router", "Editorial UI", "Framer Motion", "Responsive Grid"],
    },
    {
      number: "04",
      code: "ARCH // AUTO-DEALERSHIP",
      category: "Automotivo & Seminovos",
      title: "Concessionárias & Multimarcas",
      brandName: "Prime Motors",
      description:
        "Portal automotivo em tema claro (Alabaster & Royal Blue) focado no mercado brasileiro real, com comparativo FIPE, simulador CDC e reserva no Firestore.",
      href: "/templates/carros",
      theme: "from-turquoise/25 via-ocean to-petroleum",
      badgeColor: "border-turquoise/35 bg-turquoise/10 text-ice",
      accentText: "text-ice",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Alabaster Light", hex: "#f4f4e9" },
        { name: "Royal Cobalt", hex: "#2032a6" },
        { name: "FIPE Emerald", hex: "#2a40ba" },
      ],
      conversionFocus: "Geração de Fichas de Financiamento & Visitas na Loja",
      modules: [
        "Buscador Estilo Portal com Filtro 'Abaixo da FIPE'",
        "Simulador de Financiamento CDC + Avaliação de Troca",
        "Agendamento Atômico de Visita / Vídeo Ao Vivo (Firestore)",
        "Modal de Laudo Cautelar Dekra & Opcionais de Série",
      ],
      stack: ["Next.js App Router", "Firebase Auth", "Firestore Lock", "Light UI System"],
    },
    {
      number: "05",
      code: "ARCH // 3D-ATELIER",
      category: "Arte 3D & Colecionáveis",
      title: "Impressão 3D & Miniaturas",
      brandName: "Alchemist Voxel",
      description:
        "Estúdio criativo de impressão em resina 12K e pintura de miniaturas com Raio-X de 3 estágios, receitas de tintas e calculadora de encomendas.",
      href: "/templates/miniaturas",
      theme: "from-turquoise/25 via-ocean to-petroleum",
      badgeColor: "border-turquoise/35 bg-turquoise/10 text-ice",
      accentText: "text-ice",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Resin Fuchsia", hex: "#8be7c5" },
        { name: "Pigment Pink", hex: "#8be7c5" },
        { name: "Void", hex: "#141f50" },
      ],
      conversionFocus: "Orçamentos de Encomenda & Venda de Peças Autorais",
      modules: [
        "Raio-X de 3 Estágios: Impressão, Base e Pintura",
        "Receitas de Tintas e Galeria com Lightbox",
        "Calculadora de Encomendas por Escala",
        "Busca e Filtros com Feedback em Tempo Real",
      ],
      stack: ["Next.js App Router", "Framer Motion", "Web Audio (opcional)", "Tailwind CSS"],
    },
    {
      number: "06",
      code: "ARCH // GUIDED-JOURNEY",
      category: "Bem-estar & Experiência",
      title: "Jornadas Guiadas & Leitura Interativa",
      brandName: "Oráculo Connection",
      description:
        "Fluxo em 3 etapas (monte, intenção e revelação) com barra de progresso, perguntas prontas e celebração ao desbloquear o resultado.",
      href: "/templates/connection",
      theme: "from-champagne/20 via-ocean to-petroleum",
      badgeColor: "border-champagne/35 bg-champagne/10 text-champagne",
      accentText: "text-champagne",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Amber Glow", hex: "#bce82c" },
        { name: "Parchment", hex: "#f4f4e9" },
        { name: "Midnight", hex: "#141f50" },
      ],
      conversionFocus: "Captura de Contato no Momento de Maior Engajamento",
      modules: [
        "Stepper com Progresso e Navegação por Teclado",
        "Perguntas Prontas e Contador de Caracteres",
        "Revelação com Confete e Desbloqueio por Contato",
        "Formulário com Preenchimento Automático",
      ],
      stack: ["Next.js App Router", "Framer Motion", "Form UX", "Tailwind CSS"],
    },
    {
      number: "07",
      code: "ARCH // TABLE-BOOKING",
      category: "Restaurantes & Reservas",
      title: "Reservas de Mesa & Comanda Digital",
      brandName: "Kobra Fire Reservas",
      description:
        "Veja como reunir reservas de mesa, comandas e pedidos em um painel que facilita o acompanhamento pela equipe.",
      href: "/templates/reservas",
      theme: "from-red-500/20 via-ocean to-petroleum",
      badgeColor: "border-red-400/35 bg-red-500/10 text-red-200",
      accentText: "text-red-300",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [
        { name: "Fire Red", hex: "#d4ff38" },
        { name: "Ember", hex: "#bce82c" },
        { name: "Charcoal", hex: "#141f50" },
      ],
      conversionFocus: "Mais Reservas Diretas & Menos No-Show",
      modules: [
        "Escolha de Horário e Mesa em Tempo Real",
        "Comanda Digital com Personalização de Produto",
        "Toasts de Confirmação e Feedback Visual",
        "Modais com Foco Preso e Escape para Fechar",
      ],
      stack: ["Next.js App Router", "Framer Motion", "Cart State", "Tailwind CSS"],
    },
    {
      number: "08", code: "ARCH // FOOD-DELIVERY", category: "Cardápio digital",
      title: "Cachorros-quentes & Açaí", brandName: "Dog & Açaí",
      description: "Da chapa ao copo: escolha os adicionais e monte um combo para entrega ou retirada.",
      href: "/templates/dog-e-acai", theme: "from-turquoise/25 via-ocean to-petroleum",
      badgeColor: "border-turquoise/35 bg-turquoise/10 text-ice", accentText: "text-ice",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [{ name: "Açaí", hex: "#2a40ba" }, { name: "Chapa", hex: "#bce82c" }],
      conversionFocus: "Pedidos de delivery e retirada",
      modules: ["Adicionais por produto", "Montagem de combos", "Sacola e revisão do pedido"],
      stack: ["Next.js App Router", "React", "Tailwind CSS"],
    },
    {
      number: "09", code: "Imóveis", category: "Mercado imobiliário",
      title: "Imobiliárias", brandName: "Pátio Imóveis",
      description: "Venda e locação com filtro por bairro, ficha do imóvel e pedido de visita pelo WhatsApp.",
      href: "/templates/imobiliaria", theme: "from-emerald-500/20 to-stone-950",
      badgeColor: "border-emerald-400/35 text-emerald-200", accentText: "text-emerald-300",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [{ name: "Mata", hex: "#254A40" }, { name: "Areia", hex: "#EAE7C9" }],
      conversionFocus: "Pedidos de visita por imóvel",
      modules: ["Comprar ou alugar", "Busca por bairro", "Ficha com metragem e condomínio"],
      stack: ["Next.js", "React", "WhatsApp"],
    },
    {
      number: "10", code: "Arquitetura", category: "Arquitetura residencial",
      title: "Escritórios de arquitetura", brandName: "Ateliê Vão",
      description: "Apresente o portfólio e deixe o visitante girar a planta de cada projeto para entender os ambientes.",
      href: "/templates/arquitetura", theme: "from-champagne/20 to-stone-950",
      badgeColor: "border-champagne/35 text-champagne", accentText: "text-champagne",
      btnGradient: "from-champagne to-champagne text-abyss",
      palette: [{ name: "Linho", hex: "#F3EEE2" }, { name: "Argila", hex: "#DDBA92" }],
      conversionFocus: "Contato com referência ao projeto",
      modules: ["Portfólio residencial", "Planta 3D e vista superior", "Áreas por ambiente"],
      stack: ["Next.js", "React", "SVG"],
    },
  ];

  const orderedTemplates = [
    ...templates.filter((template) => template.href !== "/templates/academias"),
    ...templates.filter((template) => template.href === "/templates/academias"),
  ].map((template, index) => ({
    ...template,
    number: String(index + 1).padStart(2, "0"),
  }));
  const [selectedIndex, setSelectedIndex] = useState<number>(2);
  const [fullscreenTemplate, setFullscreenTemplate] = useState<(typeof orderedTemplates)[number] | null>(null);

  const activeTemplate = orderedTemplates[selectedIndex];

  useEffect(() => {
    if (!fullscreenTemplate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenTemplate(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [fullscreenTemplate]);

  return (
    <section className="container-luxe py-28 sm:py-36 relative">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute top-12 left-1/4 h-[460px] w-[460px] rounded-full bg-champagne/10 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[420px] w-[420px] rounded-full bg-turquoise/10 blur-[150px]" />

      {/* =========================================================
          1. HERO HEADER DO CONSOLE DE ARQUITETURAS
      ========================================================= */}
      <div className="relative z-10 mb-14 flex flex-col justify-between gap-8 border-b border-turquoise/40 pb-12 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.08] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
              <Sparkles className="h-3.5 w-3.5 text-ice" />
              NexuSync · Modelos para o seu negócio
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
              SIMULADOR RESPONSIVO AO VIVO
            </span>
          </div>

          <h1 className="mb-5 font-display text-4xl font-black uppercase tracking-tight text-ivory sm:text-6xl lg:leading-[1.02]">
            Seu próximo site começa{" "}
            <span className="text-brand-gradient italic">
              rodando ao vivo aqui.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Não mostramos apenas fotos estáticas. Use o{" "}
            <strong className="text-ivory">painel de demonstração abaixo</strong>{" "}
            para navegar dentro de cada projeto em tempo real, testar a versão
            para celular e computador e escolher a base ideal para o seu negócio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/#planos"
            className="inline-flex items-center gap-2 rounded-2xl border border-turquoise/40 bg-ocean/65 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ivory transition-all hover:border-turquoise/50 hover:bg-champagne hover:text-abyss"
          >
            <span>Ver Planos & Preços</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* =========================================================
          2. CONSOLE INTERATIVO DE INSPECÇÃO AO VIVO (MASTER-DETAIL)
      ========================================================= */}
      <div
        id="template-live-console"
        className="relative z-10 mb-24 scroll-mt-24 rounded-[2.4rem] border border-turquoise/40 bg-ocean/95 p-4 shadow-[0_30px_100px_rgba(9,44,52,0.85)] backdrop-blur-2xl sm:p-7"
      >
        {/* Barra Superior de Seleção de Arquitetura + Controles de Viewport */}
        <div className="mb-6 border-b border-turquoise/40 pb-5">
          {/* Seletor de Projetos (Tabs do Console) */}
          <div role="group" aria-label="Escolha um template para visualizar" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {orderedTemplates.map((tpl, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tpl.href}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedIndex(idx)}
                  className={`group flex min-w-0 items-center gap-2.5 rounded-2xl border px-4 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise ${isSelected
                      ? "border-turquoise/50 bg-gradient-to-r from-turquoise/20 via-turquoise/10 to-transparent text-ivory shadow-lg"
                      : "border-turquoise/40 bg-ocean/65 text-ivory/55 hover:border-turquoise/40 hover:text-ivory"
                    }`}
                >
                  <span className="shrink-0 font-mono text-xs font-bold text-ice">
                    /{tpl.number}
                  </span>
                  <div className="min-w-0 break-words">
                    <span className="block text-xs font-black uppercase tracking-wider leading-relaxed">
                      {tpl.brandName}
                    </span>
                    <span className="block font-mono text-[10px] text-ivory/85">
                      {tpl.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Corpo do Console: Viewport Interativo (8 Cols) + Blueprint Técnico (4 Cols) */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-stretch">
          {/* COLUNA ESQUERDA: Simulador de Navegador Interativo (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-turquoise/40 bg-gradient-to-br from-ocean via-ocean to-petroleum p-3 sm:p-5 shadow-inner">
            <DeviceStage
              href={activeTemplate.href}
              title={`Console interativo ${activeTemplate.title}`}
              onFullscreen={() => setFullscreenTemplate(activeTemplate)}
            />
          </div>

          {/* COLUNA DIREITA: Ficha de Engenharia & Conversão do Template (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-turquoise/40 bg-ocean/90 p-6 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTemplate.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${activeTemplate.badgeColor}`}
                    >
                      {activeTemplate.code}
                    </span>
                    <span className="font-mono text-xs text-ivory/85">
                      /{activeTemplate.number}
                    </span>
                  </div>

                  <p className="font-mono text-xs uppercase tracking-widest text-ivory/85">
                    Projeto Demonstrativo: {activeTemplate.brandName}
                  </p>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ivory"><AccentText text={activeTemplate.title} /></h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {activeTemplate.description}
                  </p>
                </div>

                {/* Sistema de Cores do Projeto */}
                <div className="rounded-2xl border border-turquoise/40 bg-abyss/35 p-4">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ivory/85 mb-3">
                    Cores do modelo
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeTemplate.palette.map((color) => (
                      <div
                        key={color.hex}
                        className="flex items-center gap-2 rounded-xl border border-turquoise/40 bg-ocean/65 p-2"
                      >
                        <span
                          className="h-5 w-5 shrink-0 rounded-lg border border-turquoise/40 shadow"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0">
                          <span className="block truncate text-[10px] font-bold text-ivory">
                            {color.name}
                          </span>
                          <span className="block font-mono text-[9px] text-ivory/85">
                            {color.hex}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Módulos Funcionais Inclusos */}
                <div>
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-ivory/85 mb-3">
                    Engenharia & Módulos Inclusos:
                  </span>
                  <ul className="space-y-2.5">
                    {activeTemplate.modules.map((mod, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-ivory/85"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 mt-0.5 ${activeTemplate.accentText}`}
                        />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack Técnica */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTemplate.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-turquoise/40 bg-abyss/40 px-2.5 py-1 font-mono text-[10px] text-ivory/85"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Botões de Ação do Console */}
            <div className="mt-8 space-y-2.5 border-t border-turquoise/40 pt-5">
              <a
                href={`https://wa.me/5551993583936?text=${encodeURIComponent(
                  `Olá! Testei o modelo "${activeTemplate.title}" (${activeTemplate.brandName}) no catálogo da NexuSync e quero orçar um projeto baseado nessa estrutura.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${activeTemplate.btnGradient} py-4 px-5 text-xs font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.02]`}
              >
                <span>Quero este modelo para minha marca</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <Link
                href={activeTemplate.href}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-turquoise/40 bg-ocean/65 hover:bg-ice/10 py-3 px-4 text-xs font-bold uppercase tracking-wider text-ivory transition-colors"
              >
                <span>Abrir Página Completa Dedicada</span>
                <MoveUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. CATÁLOGO RÁPIDO LADO A LADO (VISÃO COMPARATIVA)
      ========================================================= */}
      <div className="relative z-10">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ice">
              {"// VISÃO COMPARATIVA DO CATÁLOGO"}
            </p>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ivory sm:text-4xl">
              Todos os modelos disponíveis ({orderedTemplates.length})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Clique em &ldquo;Carregar no Simulador&rdquo; ou abra diretamente a
            demonstração em tela inteira.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {orderedTemplates.map((template, idx) => {
            const isCurrentlyLoaded = idx === selectedIndex;
            return (
              <article
                key={template.href}
                className={`group flex flex-col overflow-hidden rounded-[2rem] border bg-ocean/90 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 ${isCurrentlyLoaded
                    ? "border-turquoise/50 ring-1 ring-turquoise/30"
                    : "border-turquoise/40 hover:border-turquoise/30"
                  }`}
              >
                {/* Topo com Preview Desktop em Escala */}
                <div
                  className={`relative h-[260px] overflow-hidden bg-gradient-to-br ${template.theme} p-4 sm:h-[290px] sm:p-5`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-turquoise/40 bg-ocean shadow-2xl">
                    <div className="flex h-8 items-center gap-1.5 border-b border-turquoise/40 bg-ocean px-3">
                      <span className="h-2 w-2 rounded-full bg-[#ff6b61]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#ffc14f]/80" />
                      <span className="h-2 w-2 rounded-full bg-[#49c781]/80" />
                      <span className="ml-auto truncate font-mono text-[9px] text-ivory/85">
                        nexusync.online{template.href}
                      </span>
                    </div>

                    <div className="relative h-[calc(100%-2rem)] w-full overflow-hidden">
                      <iframe
                        src={template.href}
                        title={`Prévia ${template.title}`}
                        loading="lazy"
                        scrolling="no"
                        tabIndex={-1}
                        className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-ocean"
                      />
                    </div>
                  </div>
                </div>

                {/* Corpo do Card */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${template.badgeColor}`}
                      >
                        {template.category}
                      </span>
                      <span className="font-mono text-xs text-ivory/85">
                        /{template.number} • {template.brandName}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-ivory"><AccentText text={template.title} /></h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-turquoise/40 pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIndex(idx);
                        document
                          .getElementById("template-live-console")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`rounded-xl py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all ${isCurrentlyLoaded
                          ? "bg-turquoise/20 border border-turquoise/40 text-ice"
                          : "border border-turquoise/40 bg-ocean/65 text-ivory hover:bg-ice/10"
                        }`}
                    >
                      {isCurrentlyLoaded
                        ? "● Ativo no Simulador"
                        : "Testar no Simulador ↑"}
                    </button>

                    <Link
                      href={template.href}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-ice hover:bg-turquoise text-abyss py-3 px-4 text-xs font-black uppercase tracking-wider transition-colors"
                    >
                      <span>Abrir Site Inteiro</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          4. CTA FINAL P/ PROJETO EXCLUSIVO
      ========================================================= */}
      <div className="mt-16 rounded-3xl border border-turquoise/40 bg-ocean/90 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-ice block mb-1">
            {"// ARQUITETURA 100% PERSONALIZADA"}
          </span>
          <h3 className="font-display text-2xl font-bold text-ivory"><AccentText text={"Seu segmento é diferente? Criamos um projeto inédito para a sua empresa."} /></h3>
        </div>
        <Link
          href="/#contato"
          className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-champagne hover:bg-turquoise px-6 py-4 text-xs font-black uppercase tracking-wider text-abyss transition-all shadow-lg"
        >
          <Flame className="h-4 w-4" />
          <span>Solicitar Projeto Sob Medida</span>
        </Link>
      </div>

      {/* =========================================================
          MODAL DE TELA CHEIA DO TEMPLATE
      ========================================================= */}
      <AnimatePresence>
        {fullscreenTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-abyss/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-turquoise/40 bg-ocean px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-ivory">
                  {fullscreenTemplate.brandName} — {fullscreenTemplate.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={fullscreenTemplate.href}
                  className="rounded-xl bg-champagne hover:bg-turquoise px-4 py-2 text-xs font-bold uppercase tracking-wider text-abyss"
                >
                  Ir para a Rota Direta
                </Link>
                <button
                  type="button"
                  onClick={() => setFullscreenTemplate(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-turquoise/40 bg-ocean/65 px-3.5 py-2 text-xs font-bold uppercase text-ivory hover:bg-red-500/20 hover:border-red-400/50"
                >
                  <span>Fechar</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-ice">
              <iframe
                src={fullscreenTemplate.href}
                title={fullscreenTemplate.title}
                className="h-full w-full border-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
