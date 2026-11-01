"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Minus, Sparkles } from "lucide-react";
import {
  marketingAddons,
  marketingMicrocopy,
  marketingPlans,
} from "@/data/marketingPlans";
import { formatBRL, waLink } from "@/lib/site-config";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { selectInterest } from "@/lib/quote";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function PlansMarketing() {
  return (
    <section
      id="planos-marketing"
      className="relative isolate scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/[0.07] blur-[140px]"
      />

      <div className="container-luxe">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
            Planos mensais para pequenos e médios negócios
          </div>
          <h2 className="mb-6 font-display text-3xl uppercase tracking-tight sm:text-4xl md:text-5xl">
            O próximo passo da sua empresa{" "}
            <span className="text-violet-gradient">começa com um plano.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Fortaleça sua presença, atraia oportunidades ou conecte toda a
            operação. Entregas definidas, acompanhamento próximo e investimento
            transparente.
          </p>

          <nav
            aria-label="Atalhos de planos"
            className="mt-8 flex flex-wrap justify-center gap-2 text-sm"
          >
            {[
              ["#planos-marketing", "Marketing mensal"],
              ["#planos", "Sites"],
              ["#planosapp", "Aplicações"],
              ["#planosdg", "Design"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-violet-100 transition-colors hover:border-violet-300/40 hover:bg-violet-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3"
        >
          {marketingPlans.map((plan) => (
            <motion.article
              key={plan.id}
              variants={itemVariants}
              className={`group relative flex flex-col rounded-[2rem] border p-8 backdrop-blur-2xl transition-all duration-500 ${
                plan.highlight
                  ? "border-violet-300/40 bg-gradient-to-b from-violet-500/[0.14] via-[#130e1e]/95 to-[#0b0d13]/95 shadow-[0_25px_80px_-20px_rgba(139,92,246,0.35)] lg:-translate-y-4"
                  : "border-white/[0.09] bg-[#0c0e14]/80 hover:-translate-y-1.5 hover:border-violet-300/25"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-violet-gradient px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-violet-glow">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              <span className="mb-5 self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-violet-200">
                {plan.idealFor}
              </span>

              <h3 className="font-display text-2xl font-bold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <div className="my-6 rounded-2xl border border-white/[0.07] bg-black/25 p-5">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`font-display text-4xl font-semibold tracking-tighter sm:text-5xl ${
                      plan.highlight ? "text-violet-gradient" : "text-foreground"
                    }`}
                  >
                    {formatBRL(plan.monthlyPriceCents)}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">
                    /mês
                  </span>
                </div>
                <p className="mt-2 text-sm text-violet-100">
                  + {formatBRL(plan.setupPriceCents)}{" "}
                  <span className="text-muted-foreground">
                    implantação única
                  </span>
                </p>
                <div className="mt-3 flex items-start gap-2 border-t border-white/[0.06] pt-2.5 text-xs text-white/60">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />
                  <span>{plan.onboardingTime}</span>
                </div>
              </div>

              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                O que está incluído:
              </p>
              <ul className="mb-6 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-foreground/85"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-violet-400/40 bg-violet-500/20 text-violet-200">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <details className="mb-8 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-muted-foreground open:bg-white/[0.04]">
                <summary className="cursor-pointer font-medium text-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300">
                  Detalhes do escopo e o que não está incluído
                </summary>
                <ul className="mt-3 flex flex-col gap-2">
                  {plan.details.map((d) => (
                    <li key={d} className="leading-snug">
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mb-2 mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Não inclui
                </p>
                <ul className="flex flex-col gap-2">
                  {plan.exclusions.map((e) => (
                    <li key={e} className="flex items-start gap-2 leading-snug">
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                      {e}
                    </li>
                  ))}
                </ul>
              </details>

              <button
                type="button"
                onClick={() => {
                  trackAnalyticsEvent({
                    eventName: "marketing_plan_click",
                    plan_id: plan.id,
                    section: "planos-marketing",
                    destination: "form",
                  });
                  selectInterest(plan.id);
                }}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-gradient py-4 text-sm font-bold text-white shadow-violet-glow transition-all duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
              >
                Pedir proposta
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={waLink(plan.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  const base = {
                    plan_id: plan.id,
                    section: "planos-marketing",
                    destination: "whatsapp" as const,
                  };
                  trackAnalyticsEvent({ eventName: "marketing_plan_click", ...base });
                  trackAnalyticsEvent({ eventName: "whatsapp_click", ...base });
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
                  "border border-violet-300/30 bg-white/[0.03] text-violet-100 hover:bg-violet-500/20"
                }`}
              >
                {plan.buttonText}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
        </motion.div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          {marketingMicrocopy}
        </p>

        <div className="mx-auto mt-16 max-w-5xl rounded-[2rem] border border-white/[0.09] bg-[#0c0e14]/80 p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            Contratações avulsas e adicionais
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Não duplicam entregas já incluídas no Crescimento Integrado. Os
            serviços de captação e automação não incluem campanhas de tráfego.
          </p>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            {marketingAddons.map((a) => (
              <div
                key={a.name}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
              >
                <dt className="font-semibold text-foreground">{a.name}</dt>
                <dd className="mt-1 text-sm font-medium text-violet-200">
                  {a.price}
                </dd>
                <dd className="mt-1 text-sm text-muted-foreground">{a.scope}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            Mais unidades, canais ou integrações? Seu plano acompanha a operação.
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Para empresas com múltiplas unidades, maior volume de conteúdo ou
            processos comerciais específicos, desenhamos um escopo próprio.
          </p>
          <a
            href={waLink(
              "Olá! Minha empresa tem uma operação maior e quero um escopo sob medida com a NexuSync."
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackAnalyticsEvent({
                eventName: "marketing_plan_click",
                plan_id: "sob-medida",
                section: "planos-marketing",
                destination: "whatsapp",
              })
            }
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-300/30 px-5 py-2.5 text-sm font-semibold text-violet-100 hover:bg-violet-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
          >
            Sob medida <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
