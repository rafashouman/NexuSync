"use client";

import { designPlans } from "@/data/designPlans";
import { AccentText } from "@/components/AccentText";
import { motion } from "framer-motion";
import { usePromoSlots, promoView } from "@/components/usePromoSlots";
import {
  Palette,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  FileCheck,
} from "lucide-react";

const WA_NUMBER = "5551993583936";



export function PlansDG() {
  const slots = usePromoSlots();
  return (
    <section
      id="midias-digitais"
      className="relative isolate overflow-hidden py-24 sm:py-32 border-t border-turquoise/40"
    >
      {/* Glow Editorial Rose/Amber exclusivo para Design */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/4 -z-10 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-turquoise/[0.07] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 bottom-16 -z-10 h-[26rem] w-[36rem] rounded-full bg-champagne/[0.06] blur-[140px]"
      />

      <div className="container-luxe">
        <div className="mb-8 flex justify-center"><a href="/design" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice underline underline-offset-4">Conheça nossos serviços de design<ArrowRight className="h-4 w-4 shrink-0" /></a></div>
        {/* Cabeçalho */}
        <div className="mb-16 flex flex-col justify-between gap-6 border-b border-turquoise/40 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice">
              <Palette className="h-3.5 w-3.5 text-champagne" />
              Estúdio de Identidade & Direção de Arte
            </div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
              Design para valorizar{" "}
              <span className="bg-gradient-to-r from-turquoise via-turquoise to-champagne bg-clip-text text-transparent">
                sua marca e sua oferta
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Seu cliente precisa reconhecer sua marca e entender sua oferta.
            Escolha entre peças digitais, identidade visual e telas para sites
            e aplicativos, com entregas definidas em cada pacote.
          </p>
        </div>

        {/* =========================================================
            LAYOUT HORIZONTAL EDITORIAL (DIFERENTE DE PLANS E APPS)
        ========================================================= */}
        <div className="space-y-6">
          {designPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-[2.2rem] border p-7 transition-all duration-300 sm:p-9 ${
                  plan.highlight
                    ? "border-turquoise/45 bg-gradient-to-r from-turquoise/[0.12] via-ocean/95 to-petroleum/95 shadow-[0_25px_80px_-25px_rgba(212,255,56,0.3)]"
                    : "border-turquoise/40 bg-ocean/85 hover:border-turquoise/30"
                }`}
              >
                {plan.badge && (
                  <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-1 text-[11px] font-black uppercase tracking-wider text-abyss shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  {/* Coluna 1: Identidade do Pack & Resumo Rápido (4 Cols) */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-black text-ice">
                        /{plan.id}
                      </span>
                      <span className="rounded-full border border-turquoise/40 bg-ocean/65 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-ice">
                        {plan.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-turquoise/40 bg-turquoise/10 text-ice">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-ivory sm:text-3xl"><AccentText text={plan.name} /></h3>
                        <p className="mt-2 text-xs leading-5 text-ice">
                          Para: {plan.idealFor}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {plan.description}
                    </p>

                    {/* Pílulas de Entregáveis Chave */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {plan.deliverablesSummary.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-champagne/20 bg-champagne/[0.07] px-2.5 py-1 font-mono text-[11px] font-semibold text-champagne"
                        >
                          <FileCheck className="h-3 w-3 text-champagne" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Coluna 2: Checklist de Direção de Arte (5 Cols) */}
                  <div className="lg:col-span-5 lg:border-x lg:border-turquoise/40 lg:px-8">
                    <p className="mb-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ivory/85">
                      O que você recebe:
                    </p>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                      {plan.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85"
                        >
                          <span
                            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                              plan.highlight
                                ? "bg-turquoise/25 text-ice border border-turquoise/40"
                                : "bg-ice/10 text-ivory/85"
                            }`}
                          >
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coluna 3: Investimento & Contratação (3 Cols) */}
                  <div className="lg:col-span-3 flex h-full flex-col justify-between rounded-2xl border border-turquoise/40 bg-abyss/30 p-5">
                    <div>
                      {promoView(slots, plan.promoKey, plan).label && (<span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-champagne">
                        {promoView(slots, plan.promoKey, plan).label}
                      </span>)}

                      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                        <span className="whitespace-nowrap font-display text-[clamp(1.35rem,2vw,2rem)] font-bold tracking-tight text-ivory">
                          {promoView(slots, plan.promoKey, plan).displayPrice}
                        </span>
                        {promoView(slots, plan.promoKey, plan).originalPrice && (
                          <del className="whitespace-nowrap text-xs text-muted-foreground/85">
                            R$ {promoView(slots, plan.promoKey, plan).originalPrice}
                          </del>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2 border-t border-turquoise/40 pt-2.5 text-xs text-ivory/85">
                        <Clock className="h-3.5 w-3.5 text-ice" />
                        <span>Entrega: {plan.deliveryTime}</span>
                      </div>

                      <p className="mt-3 text-[11px] leading-relaxed text-ivory/85">
                        {plan.scope}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                        plan.waMessage
                      )}`}
                      data-analytics-section="media"
                      data-analytics-interest="design"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 group/btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-center text-sm font-bold leading-snug transition-all ${
                        plan.highlight
                          ? "bg-brand-gradient text-abyss shadow-lg hover:scale-[1.02]"
                          : "border border-turquoise/40 bg-ocean/65 text-ivory hover:border-turquoise/40 hover:bg-turquoise/20"
                      }`}
                    >
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
