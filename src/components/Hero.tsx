import { QuoteLink } from "@/components/QuoteLink";
import { HeroTemplatePreview } from "@/components/HeroTemplatePreview";

export function Hero() {
  return <section id="hero" className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
    <div aria-hidden className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-500/15 blur-[100px]" />
    <div className="container-luxe relative grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
          Criação de sites, lojas virtuais e sistemas web
        </p>
        <h1 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.12] tracking-tight">
          Criação de sites e soluções digitais para{" "}
          <span className="text-violet-gradient">fazer seu negócio crescer</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Sua empresa tem muito a oferecer. Que tal mostrar isso também na
          internet?
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-violet-100">
          Na NexuSync, criamos sites profissionais, lojas virtuais, sistemas
          web e automações para ajudar pequenos negócios a conquistar
          credibilidade, facilitar vendas e simplificar o dia a dia.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <QuoteLink
            interest="nao-sei"
            section="hero"
            className="rounded-full bg-violet-gradient px-7 py-4 font-bold text-white shadow-violet-glow"
          >
            Solicitar um orçamento
          </QuoteLink>
          <a
            href="#servicos"
            className="text-sm font-semibold text-violet-200"
          >
            Conhecer nossos serviços
          </a>
        </div>
        <p className="mt-6 text-xs leading-6 text-muted-foreground">
          Sites profissionais · Lojas virtuais · Sistemas web · Automações
        </p>
      </div>
      <HeroTemplatePreview />
    </div>
  </section>;
}
