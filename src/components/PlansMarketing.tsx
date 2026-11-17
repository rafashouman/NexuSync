"use client";

import { AccentText } from "@/components/AccentText";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Minus, Sparkles } from "lucide-react";
import {
  marketingAddons,
  marketingMicrocopy,
  marketingPlans,
} from "@/data/marketingPlans";
import { waLink } from "@/lib/site-config";
import { publicPriceCents } from "@/lib/public-pricing";
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
  const router = useRouter();
  const requestQuote = (interest: string) => {
    if (document.getElementById("orcamento")) selectInterest(interest);
    else router.push(`/contato?${new URLSearchParams({ interest, source: "form" })}#orcamento`);
  };
  return (
    <section
      id="planos-marketing"
      className="relative isolate scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise/[0.07] blur-[140px]"
      />

      <div className="container-luxe">
        <div className="mb-8 flex justify-center"><a href="/marketing" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice underline underline-offset-4">Conheça tráfego, redes sociais e SEO<ArrowRight className="h-4 w-4 shrink-0" /></a></div>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
            <Sparkles className="h-3.5 w-3.5 text-ice" />
            Planos mensais para pequenos e médios negócios
          </div>
          <h2 className="mb-6 font-display text-3xl uppercase tracking-tight sm:text-4xl md:text-5xl">
            O próximo passo da sua empresa{" "}
            <span className="text-brand-gradient">começa com um plano.</span>
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
              ["#planos-marketing", "Tráfego, SEO e Social Media"],
              ["/criacao-de-sites#planos", "Sites"],
              ["/apps#aplicacoes", "Aplicações"],
              ["/design#midias-digitais", "Design"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-turquoise/40 bg-ocean/65 px-4 py-1.5 text-ice transition-colors hover:border-turquoise/40 hover:bg-turquoise/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-turquoise"
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
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2"
        >
          {marketingPlans.map((plan) => (
            <motion.article
              key={plan.id}
              variants={itemVariants}
              className={`group relative flex flex-col rounded-[2rem] border p-8 backdrop-blur-2xl transition-all duration-500 ${
                plan.highlight
                  ? "border-turquoise/40 bg-gradient-to-b from-turquoise/[0.14] via-ocean/95 to-petroleum/95 shadow-[0_25px_80px_-20px_rgba(212,255,56,0.35)] lg:-translate-y-4"
                  : "border-turquoise/40 bg-ocean/80 hover:-translate-y-1.5 hover:border-turquoise/40"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold uppercase tracking-wider text-abyss shadow-brand-glow">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              <span className="mb-5 self-start rounded-full border border-turquoise/40 bg-ocean/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ice">
                {plan.idealFor}
              </span>

              <h3 className="font-display text-2xl font-bold text-foreground"><AccentText text={plan.name} /></h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <div className="my-6 rounded-2xl border border-turquoise/40 bg-abyss/25 p-5">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`whitespace-nowrap font-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold tracking-tight ${
                      plan.highlight ? "text-brand-gradient" : "text-foreground"
                    }`}
                  >
                    {publicPriceCents(plan.monthlyPriceCents)}
                  </span>
                  {plan.monthlyPriceCents !== null && plan.monthlyPriceCents <= 90000 && <span className="text-sm font-bold text-muted-foreground">/mês</span>}
                </div>
                <p className="mt-2 text-sm text-ice">
                  + {publicPriceCents(plan.setupPriceCents)}{" "}
                  <span className="text-muted-foreground">
                    implantação única
                  </span>
                </p>
                <div className="mt-3 flex items-start gap-2 border-t border-turquoise/40 pt-2.5 text-xs text-ivory/85">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ice" />
                  <span>{plan.onboardingTime}</span>
                </div>
              </div>

              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/85">
                O que está incluído:
              </p>
              <ul className="mb-6 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-foreground/85"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-turquoise/40 bg-turquoise/20 text-ice">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <details className="mb-8 rounded-xl border border-turquoise/40 bg-ocean/65 p-4 text-sm text-muted-foreground open:bg-ocean/65">
                <summary className="cursor-pointer font-medium text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-turquoise">
                  Detalhes do escopo e o que não está incluído
                </summary>
                <ul className="mt-3 flex flex-col gap-2">
                  {plan.details.map((d) => (
                    <li key={d} className="leading-snug">
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mb-2 mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/85">
                  Não inclui
                </p>
                <ul className="flex flex-col gap-2">
                  {plan.exclusions.map((e) => (
                    <li key={e} className="flex items-start gap-2 leading-snug">
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ivory/85" />
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
                  requestQuote(plan.id);
                }}
                className="mb-3 mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient py-4 text-sm font-bold text-abyss shadow-brand-glow transition-all duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise"
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
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise ${
                  "border border-turquoise/30 bg-ocean/65 text-ice hover:bg-turquoise/20"
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

        <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[2rem] border border-turquoise/40 bg-gradient-to-b from-ocean/90 to-petroleum/95 p-6 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-turquoise/15 blur-[90px]"
          />
          <div className="relative mb-8 max-w-2xl">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ice">
              Serviços adicionais
            </span>
            <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl"><AccentText text={"Contratações avulsas e adicionais"} /></h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Não duplicam entregas já incluídas no plano contratado. Os
              serviços de captação e automação não incluem campanhas de tráfego.
            </p>
          </div>
          <ul className="relative grid gap-4 md:grid-cols-2">
            {marketingAddons.map((a) => (
              <li
                key={a.name}
                className="group flex flex-col rounded-2xl border border-turquoise/40 bg-ocean/65 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-turquoise/30 hover:bg-ocean/65"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-display text-lg font-semibold text-foreground"><AccentText text={a.name} /></h4>
                  <span className="shrink-0 rounded-full border border-turquoise/40 bg-turquoise/15 px-3 py-1 text-sm font-semibold text-ice">
                    {a.price}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.scope}
                </p>
                <button
                  type="button"
                  onClick={() => requestQuote("nao-sei")}
                  className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-ice transition-colors hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-turquoise"
                >
                  Quero meu orçamento
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
