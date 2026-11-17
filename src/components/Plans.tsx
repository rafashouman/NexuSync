"use client";

import { sitePlans } from "@/data/sitePlans";
import { AccentText } from "@/components/AccentText";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";

import { usePromoSlots, promoView } from "@/components/usePromoSlots";
import { waLink } from "@/lib/site-config";


const plans = sitePlans;


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Plans({ sitesOnly = false, commerceOnly = false }: { sitesOnly?: boolean; commerceOnly?: boolean }) {
  const slots = usePromoSlots();
  return (
    <section
      id="planos"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      {/* Glow Central */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise/[0.08] blur-[140px]"
      />

      <div className="container-luxe">
        <div className="mb-8 flex justify-center"><a href="/criacao-de-sites" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice underline underline-offset-4">Explore os formatos de sites<ArrowRight className="h-4 w-4 shrink-0" /></a></div>
        {/* Cabeçalho */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-turquoise/40 bg-turquoise/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ice"
          >
            <Sparkles className="h-3.5 w-3.5 text-ice" />
            Investimento em projetos avulsos
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 font-display text-3xl uppercase tracking-tight sm:text-4xl md:text-5xl"
          >
            Escolha a estrutura para o{" "}
            <span className="text-brand-gradient">seu negócio.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Confira as opções e o que está incluído. O formato, a quantidade de páginas e os recursos do seu site são definidos na proposta antes do início.
          </motion.p>
        </div>

        {/* Cards de Planos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {(commerceOnly ? plans.slice(1) : plans).map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`group relative flex flex-col justify-between rounded-[2rem] border p-6 2xl:p-8 backdrop-blur-2xl transition-all duration-500 ${plan.highlight
                  ? "border-turquoise/40 bg-gradient-to-b from-turquoise/[0.14] via-ocean/95 to-petroleum/95 shadow-[0_25px_80px_-20px_rgba(212,255,56,0.35)] md:-translate-y-4"
                  : "border-turquoise/40 bg-ocean/80 hover:-translate-y-1.5 hover:border-turquoise/40 hover:bg-ocean/65"
                }`}
            >
              {/* Linha Superior Brilhante no Plano Destaque */}
              {plan.highlight && (
                <div
                  aria-hidden
                  className="absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-turquoise to-transparent"
                />
              )}

              {plan.badge && (
                <div className="absolute -top-4 left-1/2 z-20 inline-flex whitespace-nowrap -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold uppercase tracking-wider text-abyss shadow-brand-glow">
                  <Sparkles className="h-3 w-3" />
                  {plan.badge}
                </div>
              )}

              <div className="relative z-10 flex flex-1 flex-col">
                {/* Topo: Categoria e Número */}
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full border border-turquoise/40 bg-ocean/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ice">
                    {plan.idealFor}
                  </span>
                  <span className="font-mono text-xs text-ivory/85">
                    /{plan.id}
                  </span>
                </div>

                {/* Nome e Descrição */}
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-ice"><AccentText text={plan.name} /></h3>
                  <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Box de Preço */}
                <div className="mb-6 rounded-2xl border border-turquoise/40 bg-abyss/25 p-5">
                  {promoView(slots, plan.promoKey, plan).label && (
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ice">
                      {promoView(slots, plan.promoKey, plan).label}
                    </p>
                  )}
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`whitespace-nowrap font-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold tracking-tight ${plan.highlight
                            ? "text-brand-gradient"
                            : "text-foreground group-hover:text-ice"
                          }`}
                      >
                        {promoView(slots, plan.promoKey, plan).displayPrice}
                      </span>
                    </div>
                    {promoView(slots, plan.promoKey, plan).originalPrice && (
                      <del className="whitespace-nowrap text-sm text-muted-foreground/85 decoration-white/50">
                        De R$ {promoView(slots, plan.promoKey, plan).originalPrice}
                      </del>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-turquoise/40 pt-2.5 text-xs text-ivory/85">
                    <Clock className="h-3.5 w-3.5 text-ice" />
                    <span>{plan.deliveryTime}</span>
                  </div>
                </div>

                {/* Lista de Entregáveis */}
                <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory/85">
                  O que está incluído:
                </p>
                <ul className="mb-8 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-foreground/85"
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${plan.highlight
                            ? "border-turquoise/40 bg-turquoise/20 text-ice"
                            : "border-turquoise/40 bg-ocean/65 text-muted-foreground group-hover:border-turquoise/30 group-hover:text-ice"
                          }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
                  {plan.scope}
                </p>

                {/* Botão de Ação */}
                <a
                  href={waLink(plan.waMessage)}
                  data-analytics-section="sites"
                  data-analytics-interest="site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/btn mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all duration-300 ${plan.highlight
                      ? "bg-brand-gradient text-abyss shadow-brand-glow hover:scale-[1.02]"
                      : "border border-turquoise/40 bg-ocean/65 text-foreground hover:border-turquoise/40 hover:bg-turquoise/15 hover:text-ivory"
                    }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {sitesOnly && <div className="mt-8 rounded-2xl border border-turquoise/40 bg-turquoise/5 p-7">
          <h3 className="font-display text-2xl"><AccentText text={"Hotsite dinâmico sob medida"} /></h3>
          <p className="mt-3 leading-7 text-muted-foreground">Para campanhas, eventos e lançamentos que precisam de uma experiência própria. Recursos interativos, investimento e prazo são definidos após entender seu projeto.</p>
          <a href={waLink("Olá! Quero um orçamento para um hotsite dinâmico.")} data-analytics-section="sites" data-analytics-interest="hotsite" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold text-ice underline underline-offset-4">Pedir orçamento de hotsite</a>
          <p className="mt-5 text-sm text-muted-foreground">Precisa vender com carrinho e pagamento online? <a href="/criacao-de-sites#lojas-virtuais" className="text-ice underline">Conheça a opção de loja virtual.</a></p>
        </div>}
        {/* Barra Inferior de Garantias Técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 gap-4 rounded-2xl border border-turquoise/40 bg-ocean/65 p-6 backdrop-blur-xl sm:grid-cols-3"
        >
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-turquoise/40 bg-turquoise/10 text-ice">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ivory">
                Navegação ágil
              </p>
              <p className="text-xs text-muted-foreground">
                Cuidado com carregamento e experiência de uso
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-turquoise/40 bg-turquoise/10 text-ice">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ivory">
                Design Exclusivo & Responsivo
              </p>
              <p className="text-xs text-muted-foreground">
                Interfaces fluidas no mobile, tablet e desktop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-turquoise/40 bg-turquoise/10 text-ice">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ivory">
                Suporte Próximo pelo WhatsApp
              </p>
              <p className="text-xs text-muted-foreground">
                Acompanhamento direto do briefing ao lançamento
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
