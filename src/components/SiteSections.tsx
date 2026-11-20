"use client";

import { AccentText } from "@/components/AccentText";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  LayoutTemplate,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { QuoteLink } from "@/components/QuoteLink";
import { waLink } from "@/lib/site-config";

const solutions = [
  {
    title: "Criação de sites profissionais",
    subtitle: "Seu negócio faz um bom trabalho. Seu site precisa mostrar isso.",
    description:
      "Quando alguém pesquisa sua empresa, a primeira impressão importa. Criamos sites modernos, responsivos e fáceis de navegar para apresentar seus serviços com clareza e transmitir confiança desde o primeiro contato.",
    href: "/criacao-de-sites",
    interest: "institucional",
    whatsapp: "Olá! Quero conversar sobre um site profissional para minha empresa.",
    cta: "Quero um site para minha empresa",
    icon: Building2,
    number: "01",
  },
  {
    title: "Lojas virtuais e catálogos digitais",
    subtitle: "Facilite a vida de quem quer comprar de você.",
    description:
      "Cansou de responder às mesmas perguntas sobre preços, produtos e disponibilidade? Com uma loja virtual ou catálogo online, seus clientes encontram as informações de que precisam em um só lugar.",
    href: "/criacao-de-sites#lojas-virtuais",
    interest: "loja-virtual",
    whatsapp: "Olá! Quero vender pela internet com uma loja virtual ou catálogo digital.",
    cta: "Quero vender pela internet",
    icon: LayoutTemplate,
    number: "02",
  },
  {
    title: "Sistemas web e automação de processos",
    subtitle: "Seu tempo vale mais do que tarefas repetitivas.",
    description:
      "Se você passa boa parte do dia organizando horários, atualizando informações ou acompanhando atendimentos manualmente, podemos ajudar. Desenvolvemos sistemas web e automações para tornar sua operação mais prática e organizada.",
    href: "/apps",
    interest: "automacoes",
    whatsapp: "Olá! Quero automatizar uma parte da rotina do meu negócio.",
    cta: "Quero automatizar meu negócio",
    icon: ClipboardList,
    number: "03",
  },
  {
    title: "Design e identidade visual",
    subtitle: "Sua empresa merece ser vista e lembrada.",
    description:
      "Uma marca bem apresentada faz diferença. Criamos identidade visual, peças digitais e interfaces para apresentar sua empresa com clareza e manter uma comunicação visual consistente.",
    href: "/design",
    interest: "design",
    whatsapp: "Olá! Quero fortalecer a presença e a identidade visual da minha marca.",
    cta: "Quero fortalecer minha marca",
    icon: Palette,
    number: "04",
  },
] as const;

const benefits = [
  {
    title: "Mostre por que escolher você",
    body: "Ajude o cliente a reconhecer o problema que você resolve e a entender o valor do seu serviço.",
    icon: Target,
  },
  {
    title: "Passe confiança desde o início",
    body: "Uma apresentação organizada ajuda quem ainda não conhece sua empresa a avaliar seus serviços com segurança.",
    icon: Palette,
  },
  {
    title: "Encurte o caminho até o orçamento",
    body: "Botões visíveis de WhatsApp e formulário ajudam o visitante interessado a falar com você sem procurar.",
    icon: MessageCircle,
  },
  {
    title: "Facilite a decisão no celular",
    body: "Textos legíveis e navegação simples para o cliente conhecer sua oferta e entrar em contato de onde estiver.",
    icon: MonitorSmartphone,
  },
] as const;

const steps = [
  {
    title: "Entendemos seu negócio",
    body: "Conte o que sua empresa oferece, quem atende e o que quer melhorar. Não precisa conhecer termos técnicos.",
    icon: MessageCircle,
  },
  {
    title: "Definimos a proposta",
    body: "Você recebe o escopo, o investimento, o prazo e os materiais necessários antes de decidir.",
    icon: ClipboardList,
  },
  {
    title: "Criamos e apresentamos",
    body: "Desenvolvemos o projeto e mostramos para sua revisão, com os ajustes previstos na proposta.",
    icon: LayoutTemplate,
  },
  {
    title: "Publicamos e orientamos",
    body: "Depois da sua aprovação, colocamos o projeto no ar e explicamos os próximos passos previstos no escopo.",
    icon: Rocket,
  },
] as const;

export function SiteSolutions() {
  return (
    <section
      id="servicos"
      className="home-solutions relative isolate scroll-mt-24 overflow-hidden border-t border-[#10b981]/25 py-14 sm:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-[#ffb547]/[0.12] blur-[120px]"
      />
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-8 max-w-6xl text-center sm:mb-10"
        >
          <div className="mb-3 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ffb547]">
            <span aria-hidden className="h-px w-8 bg-[#ffb547]" />
            Nossas soluções
            <span aria-hidden className="h-px w-8 bg-[#ffb547]" />
          </div>
          <h2 className="text-balance font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl xl:text-4xl">
              Soluções digitais completas <span className="text-champagne">para o seu negócio</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Da presença online à performance, unimos tecnologia, estratégia e design para gerar crescimento.
          </p>
        </motion.div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.article
                key={solution.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#10b981]/35 bg-[#2032a6]/65 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#8be7c5]/65 hover:bg-[#2032a6] sm:p-6"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#ffb547]/[0.1] blur-[70px] transition-opacity group-hover:bg-[#ffb547]/[0.2]"
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl border border-[#10b981]/45 bg-ocean text-[#ffb547]"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-[#8be7c5]/65">
                    {solution.number}
                  </span>
                </div>
                <div className="relative mt-5">
                  <h3 className="font-display text-xl font-semibold tracking-tight"><AccentText text={solution.title} /></h3>
                  <p className="mt-2 text-xs font-semibold text-[#8be7c5]">
                    <AccentText text={solution.subtitle} />
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {solution.description}
                  </p>
                </div>
                <div className="relative mt-auto pt-6">
                  <Link
                    href={solution.href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-champagne/60 bg-brand-gradient px-4 py-3 text-center text-sm font-bold text-abyss transition-colors"
                  >
                    Conhecer esta solução
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <a
                    data-analytics-section="sites"
                    data-analytics-interest={solution.interest}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 text-xs font-semibold text-[#c8d2eb] transition-colors hover:text-[#ffb547]"
                    href={waLink(solution.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Conversar pelo WhatsApp
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          Ainda não sabe qual escolher?
          <QuoteLink
            interest="nao-sei"
            section="sites"
            className="font-semibold text-[#ffb547] underline decoration-[#ffb547]/40 underline-offset-4 transition-colors hover:text-[#f4f4e9]"
          >
            Conte seu objetivo e ajudamos a definir o formato.
          </QuoteLink>
        </p>
      </div>
    </section>
  );
}

export function SiteBenefits() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-turquoise/[0.07] blur-[130px]"
      />
      <div className="container-luxe">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ice">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Tecnologia para a rotina da sua empresa
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Você cuida do seu negócio.{" "}
              <span className="text-brand-gradient">
                A gente ajuda com a tecnologia.
              </span>
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              Sabemos que empreender já exige atenção a muita coisa. Por isso,
              antes de falar sobre ferramentas, queremos entender como sua
              empresa funciona, quais desafios você enfrenta e o que precisa
              melhorar. Talvez você precise começar com um site. Talvez seja
              hora de organizar suas vendas ou automatizar processos. O
              importante é encontrar uma solução que faça sentido para o
              momento da sua empresa.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.article
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-turquoise/40 bg-ocean/65 p-5 transition-all duration-300 hover:border-turquoise/40 hover:bg-turquoise/[0.045] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-turquoise/40 bg-turquoise/[0.08] text-ice transition-colors group-hover:border-turquoise/30 group-hover:bg-turquoise/15">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-ivory/25">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-snug text-ivory"><AccentText text={benefit.title} /></h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.body}
                  </p>
                  <div
                    aria-hidden
                    className="mt-5 h-px w-10 bg-gradient-to-r from-turquoise/70 to-transparent transition-all duration-300 group-hover:w-20"
                  />
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteProcess() {
  return (
    <section
      id="como-funciona"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-border bg-turquoise/[0.035] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-turquoise/[0.08] blur-[140px]"
      />
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-20"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Processo transparente, do início ao lançamento
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Do primeiro contato ao site publicado,{" "}
            <span className="text-brand-gradient">com etapas claras.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Você sabe o que acontece em cada fase e o que precisamos para tirar
            o projeto do papel.
          </p>
        </motion.div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-turquoise/10 via-turquoise/40 to-turquoise/10 lg:block"
          />
          <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative rounded-[1.6rem] border border-turquoise/40 bg-ocean/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-turquoise/40 hover:bg-ocean sm:p-7"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl border border-turquoise/40 bg-ocean text-ice shadow-[0_0_30px_rgba(255,181,71,0.12)] transition-all duration-300 group-hover:border-turquoise/40 group-hover:bg-turquoise/15 group-hover:shadow-[0_0_36px_rgba(255,181,71,0.22)]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs tracking-widest text-ice/60">
                      ETAPA 0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-semibold leading-snug"><AccentText text={step.title} /></h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute -bottom-3.5 left-1/2 z-10 hidden h-7 w-7 -translate-x-1/2 rounded-full border border-turquoise/40 bg-ocean p-1.5 text-ice sm:block lg:hidden"
                    />
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
