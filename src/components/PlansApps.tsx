"use client";

import { appPlans } from "@/data/appPlans";
import { AccentText } from "@/components/AccentText";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePromoSlots, promoView } from "@/components/usePromoSlots";
import {
  Check,
  ArrowRight,
  Clock,
  Cpu,
  Terminal,
  Sparkles,
} from "lucide-react";

const WA_NUMBER = "5551993583936";



export function PlansApps() {
  const slots = usePromoSlots();
  const [selectedId, setSelectedId] = useState<string>(appPlans[0].id);
  const activePlan =
    appPlans.find((p) => p.id === selectedId) || appPlans[0];
  const ActiveIcon = activePlan.icon;

  return (
    <section
      id="aplicacoes"
      className="relative isolate overflow-hidden py-24 sm:py-32 border-t border-turquoise/40"
    >
      {/* Ambient Cyan/Indigo Glow exclusivo para Sistemas */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[34rem] w-[46rem] rounded-full bg-turquoise/[0.07] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-10 bottom-10 -z-10 h-[28rem] w-[36rem] rounded-full bg-turquoise/[0.08] blur-[140px]"
      />

      <div className="container-luxe">
        <div className="mb-8 flex justify-center"><a href="/apps" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice underline underline-offset-4">Explore nossos sistemas web<ArrowRight className="h-4 w-4 shrink-0" /></a></div>
        {/* Cabeçalho */}
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.08] px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-ice">
              <Cpu className="h-3.5 w-3.5 text-ice" />
              Menos tarefas repetidas no dia a dia
            </div>

            <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
              Seu negócio precisa de mais do que{" "}
              <span className="bg-gradient-to-r from-turquoise via-turquoise to-turquoise bg-clip-text text-transparent">
                apenas um site?
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Escolha o que precisa simplificar: receber solicitações de horário,
            acompanhar pedidos ou captar contatos em uma campanha. Tudo pelo
            navegador, sem instalar um programa.
          </p>
        </div>

        {/* =========================================================
            CONSOLE MASTER-DETAIL (DIFERENTE DOS 3 CARDS DE SITE)
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* COLUNA ESQUERDA: Seletor de Módulos de Sistema (5 Cols) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <div className="space-y-3.5">
              {appPlans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = plan.id === selectedId;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedId(plan.id)}
                    className={`group relative w-full text-left rounded-3xl border p-6 transition-all duration-300 ${
                      isSelected
                        ? "border-turquoise/50 bg-gradient-to-r from-turquoise/[0.14] via-ocean to-petroleum shadow-[0_20px_60px_-20px_rgba(212,255,56,0.3)]"
                        : "border-turquoise/40 bg-ocean/75 hover:border-turquoise/40 hover:bg-ocean/65"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-colors ${
                            isSelected
                              ? "border-turquoise/40 bg-turquoise/15 text-ice"
                              : "border-turquoise/40 bg-ocean/65 text-ivory/85 group-hover:text-ivory"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-ice">
                              {plan.code}
                            </span>
                            {plan.badge && (
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  plan.highlight
                                    ? "bg-champagne text-abyss"
                                    : "border border-turquoise/40 bg-ocean/65 text-ivory/85"
                                }`}
                              >
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 font-display text-xl font-bold text-ivory"><AccentText text={plan.name} /></h3>
                          <p className="text-xs text-muted-foreground">
                            {plan.category}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="block font-mono text-[10px] uppercase text-ivory/85">
                          A partir de
                        </span>
                        <span
                          className={`whitespace-nowrap font-display text-2xl font-bold ${
                            isSelected ? "text-ice" : "text-ivory"
                          }`}
                        >
                          {promoView(slots, plan.promoKey, plan).displayPrice}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUNA DIREITA: Blueprint Detalhado do Módulo Ativo (7 Cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2.2rem] border border-turquoise/30 bg-gradient-to-br from-ocean/95 via-ocean/95 to-petroleum p-7 shadow-2xl sm:p-10"
              >
                {/* Barra de Terminal no Topo do Card */}
                <div>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-turquoise/40 pb-5">
                    <div className="flex items-center gap-2.5">
                      <Terminal className="h-4 w-4 text-ice" />
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-ice">
                        O QUE A SOLUÇÃO OFERECE // {activePlan.code}
                      </span>
                    </div>
                    {promoView(slots, activePlan.promoKey, activePlan).label && (<span className="inline-flex items-center gap-1.5 rounded-full border border-turquoise/30 bg-turquoise/10 px-3 py-1 font-mono text-[11px] font-semibold text-ice">
                      <Sparkles className="h-3 w-3" />
                      {promoView(slots, activePlan.promoKey, activePlan).label}
                    </span>)}
                  </div>

                  {/* Cabeçalho e Preço em Linha */}
                  <div className="mb-7 flex flex-col justify-between gap-6 rounded-2xl border border-turquoise/40 bg-abyss/35 p-6 sm:flex-row sm:items-center">
                    <div className="max-w-md">
                      <span className="text-xs font-semibold uppercase tracking-wider text-ice">
                        Ideal para: {activePlan.idealFor}
                      </span>
                      <h3 className="mt-1 font-display text-3xl font-bold text-ivory"><AccentText text={activePlan.name} /></h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {activePlan.description}
                      </p>
                    </div>

                    <div className="shrink-0 border-t border-turquoise/40 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                      {promoView(slots, activePlan.promoKey, activePlan).originalPrice && (
                        <del className="whitespace-nowrap block text-xs text-muted-foreground/85">
                          De R$ {promoView(slots, activePlan.promoKey, activePlan).originalPrice}
                        </del>
                      )}
                      <div className="flex items-baseline gap-1 sm:justify-end">
                        <span className="whitespace-nowrap font-display text-[clamp(1.35rem,2vw,2rem)] font-bold tracking-tight text-ivory">
                          {promoView(slots, activePlan.promoKey, activePlan).displayPrice}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-ivory/85">
                        <Clock className="h-3.5 w-3.5 text-ice" />
                        <span>Prazo: {activePlan.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stack Badges */}
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ivory/85 mr-1">
                      Arquitetura:
                    </span>
                    {activePlan.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-turquoise/40 bg-turquoise/[0.06] px-2.5 py-1 font-mono text-[11px] font-semibold text-ice"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Grid de Entregáveis em 2 Colunas */}
                  <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/85">
                    Módulos & Entregáveis Incluídos:
                  </p>
                  <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activePlan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl border border-turquoise/40 bg-ocean/65 p-3 text-xs sm:text-sm text-foreground/90"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-turquoise/40 bg-turquoise/20 text-ice">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rodapé com Escopo e CTA */}
                <div className="border-t border-turquoise/40 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[11px] leading-relaxed text-ivory/85 max-w-md">
                    {activePlan.scope}
                  </p>

                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                      activePlan.waMessage
                    )}`}
                    data-analytics-section="apps"
                    data-analytics-interest="aplicacao-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn shrink-0 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand-gradient px-7 py-4 text-sm font-black uppercase tracking-wider text-abyss shadow-[0_0_30px_rgba(212,255,56,0.35)] transition-all hover:scale-[1.02]"
                  >
                    <ActiveIcon className="h-4 w-4" />
                    <span>{activePlan.buttonText}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}