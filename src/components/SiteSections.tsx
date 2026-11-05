"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  LayoutTemplate,
  Megaphone,
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
    title: "Landing pages",
    subtitle: "Do anúncio ao pedido de orçamento.",
    description:
      "Anunciar não basta se o visitante sai sem entender sua oferta. Reunimos benefícios, respostas e botões de contato em uma página focada no próximo passo.",
    interest: "landing-page",
    whatsapp: "Olá! Quero conversar sobre uma landing page para meu negócio.",
    cta: "Quero uma landing page",
    icon: Megaphone,
    number: "01",
    tone: "violet",
  },
  {
    title: "Hotsites dinâmicos",
    subtitle: "Sua campanha com um destino claro.",
    description:
      "Vai lançar um produto, divulgar um evento ou abrir inscrições? Dê à sua ação uma página própria, com informações e recursos definidos para o objetivo da campanha.",
    interest: "hotsite",
    whatsapp: "Olá! Quero um orçamento para um hotsite dinâmico.",
    cta: "Quero um hotsite",
    icon: Sparkles,
    number: "02",
    tone: "fuchsia",
  },
  {
    title: "Sites institucionais",
    subtitle: "Confiança antes da primeira conversa.",
    description:
      "Evite explicar tudo do zero a cada contato. Apresente sua empresa, seus serviços e diferenciais em um só lugar para o cliente chegar à conversa mais informado.",
    interest: "institucional",
    whatsapp: "Olá! Quero conversar sobre um site institucional para minha empresa.",
    cta: "Quero um site institucional",
    icon: Building2,
    number: "03",
    tone: "cyan",
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
    body: "Você compartilha informações sobre seu público, sua oferta e o objetivo do site. Alinhamos o que precisa ser apresentado.",
    icon: MessageCircle,
  },
  {
    title: "Definimos a proposta",
    body: "Você recebe escopo, investimento, prazo e a lista de materiais necessários para começar.",
    icon: ClipboardList,
  },
  {
    title: "Criamos e apresentamos",
    body: "Desenvolvemos o projeto para você revisar e solicitar os ajustes previstos na proposta. Você fornece os conteúdos combinados.",
    icon: LayoutTemplate,
  },
  {
    title: "Publicamos seu site",
    body: "Após a aprovação, preparamos a publicação e orientamos os próximos passos definidos no escopo.",
    icon: Rocket,
  },
] as const;

export function SiteSolutions() {
  return (
    <section
      id="servicos"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-border py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-violet-500/[0.09] blur-[120px]"
      />
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-3xl sm:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.8)]" />
            Criação de sites para profissionais e empresas
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Um site pensado para o seu{" "}
            <span className="text-violet-gradient">próximo objetivo.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Precisa divulgar uma oferta, receber inscrições ou apresentar sua
            empresa? Conheça o formato que atende a cada necessidade. Se tiver
            dúvida, ajudamos você a escolher.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            const accent =
              solution.tone === "violet"
                ? "border-violet-300/20 bg-violet-400/10 text-violet-200"
                : solution.tone === "fuchsia"
                  ? "border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-200"
                  : "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";

            return (
              <motion.article
                key={solution.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#0c0e14]/75 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-violet-300/30 hover:bg-[#11101a] sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/[0.08] blur-[70px] transition-opacity group-hover:bg-violet-400/[0.16]"
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl border ${accent}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-white/30">
                    {solution.number}
                  </span>
                </div>
                <div className="relative mt-8">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-violet-200">
                    {solution.subtitle}
                  </p>
                  <p className="mt-4 min-h-[6.5rem] leading-7 text-muted-foreground">
                    {solution.description}
                  </p>
                </div>
                <div className="relative mt-8">
                  <QuoteLink
                    interest={solution.interest}
                    section="sites"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-gradient px-5 py-3.5 text-center font-semibold text-white shadow-violet-glow transition-transform hover:scale-[1.02]"
                  >
                    {solution.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </QuoteLink>
                  <a
                    data-analytics-section="sites"
                    data-analytics-interest={solution.interest}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-white"
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
            className="font-semibold text-violet-200 underline decoration-violet-300/40 underline-offset-4 transition-colors hover:text-white"
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
        className="pointer-events-none absolute -right-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-fuchsia-500/[0.07] blur-[130px]"
      />
      <div className="container-luxe">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Uma presença digital que trabalha por você
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Facilite o caminho entre conhecer sua empresa e{" "}
              <span className="text-violet-gradient">falar com você.</span>
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              Um bom site combina informação, confiança e caminhos claros para
              o cliente dar o próximo passo.
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
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-300/25 hover:bg-violet-400/[0.045] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08] text-violet-200 transition-colors group-hover:border-violet-300/30 group-hover:bg-violet-400/15">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-white/25">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-snug text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.body}
                  </p>
                  <div
                    aria-hidden
                    className="mt-5 h-px w-10 bg-gradient-to-r from-violet-300/70 to-transparent transition-all duration-300 group-hover:w-20"
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
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-border bg-violet-500/[0.035] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-violet-500/[0.08] blur-[140px]"
      />
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-20"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Processo transparente, do início ao lançamento
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Do primeiro contato ao site publicado,{" "}
            <span className="text-violet-gradient">com etapas claras.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Você sabe o que acontece em cada fase e o que precisamos para tirar
            o projeto do papel.
          </p>
        </motion.div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-violet-400/10 via-violet-300/40 to-violet-400/10 lg:block"
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
                  className="group relative rounded-[1.6rem] border border-white/[0.08] bg-[#0d0c14]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#12101c] sm:p-7"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl border border-violet-300/20 bg-[#171322] text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-all duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-500/15 group-hover:shadow-[0_0_36px_rgba(139,92,246,0.22)]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs tracking-widest text-violet-200/60">
                      ETAPA 0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-xl font-semibold leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute -bottom-3.5 left-1/2 z-10 hidden h-7 w-7 -translate-x-1/2 rounded-full border border-violet-300/20 bg-[#171322] p-1.5 text-violet-200 sm:block lg:hidden"
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
