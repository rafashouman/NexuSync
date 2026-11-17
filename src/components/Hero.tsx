import { QuoteLink } from "@/components/QuoteLink";
import { HeroTemplatePreview } from "@/components/HeroTemplatePreview";
import { ChartNoAxesColumnIncreasing, Gem, Rocket } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="home-hero relative isolate overflow-hidden pb-12 pt-32 sm:pb-16 sm:pt-36 lg:pb-14"
    >
      <div aria-hidden className="home-hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="container-luxe relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.72fr)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <div className="relative z-10">
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8be7c5]">
            Agência digital NexuSync
            <span aria-hidden className="h-px w-8 bg-[#d4ff38]" />
          </p>
          <h1 className="max-w-2xl font-display text-[clamp(2.5rem,4.2vw,3.8rem)] leading-[1.04] tracking-tight">
            Seu negócio merece{" "}
            <span className="block text-brand-gradient">ir mais longe.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#f4f4e9] sm:text-lg sm:leading-8">
            Sites, aplicativos e estratégias para atrair mais clientes,
            fortalecer sua marca e gerar resultados reais no digital.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuoteLink
              interest="nao-sei"
              section="hero"
              className="inline-flex min-h-12 items-center rounded-full bg-brand-gradient px-6 py-3 font-bold text-abyss shadow-brand-glow transition-transform hover:-translate-y-0.5"
            >
              Solicitar orçamento <span aria-hidden className="ml-2">→</span>
            </QuoteLink>
            <a
              href="#servicos"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#10b981] px-5 py-3 text-sm font-semibold text-[#f4f4e9] transition-colors hover:bg-[#2032a6]"
            >
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-[#d4ff38] text-xs text-abyss">▶</span>
              Conhecer soluções
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-[#10b981]/30 pt-4 text-[11px] leading-4 text-[#c8d2eb] sm:gap-x-6">
            <span className="inline-flex items-center gap-2"><Rocket className="h-4 w-4 text-[#d4ff38]" aria-hidden /> Tecnologia de ponta</span>
            <span className="inline-flex items-center gap-2"><Gem className="h-4 w-4 text-[#d4ff38]" aria-hidden /> Design estratégico</span>
            <span className="inline-flex items-center gap-2"><ChartNoAxesColumnIncreasing className="h-4 w-4 text-[#d4ff38]" aria-hidden /> Foco em resultados</span>
          </div>
        </div>
        <HeroTemplatePreview presentation="home" />
      </div>
    </section>
  );
}
