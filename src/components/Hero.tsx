import { QuoteLink } from "@/components/QuoteLink";
import { HeroTemplatePreview } from "@/components/HeroTemplatePreview";

export function Hero() {
  return <section id="hero" className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
    <div aria-hidden className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-500/15 blur-[100px]" />
    <div className="container-luxe relative grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">Criação de sites, landing pages e hotsites</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.12] tracking-tight">Seu próximo cliente precisa entender <span className="text-violet-gradient">por que escolher você.</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Criamos sites profissionais para apresentar seu negócio com clareza, valorizar seus serviços e facilitar pedidos de orçamento pelo WhatsApp ou formulário.</p>
        <p className="mt-4 max-w-xl text-sm leading-6 text-violet-100">Landing pages e hotsites para profissionais liberais, comércios e pequenas e médias empresas.</p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <QuoteLink
            interest="nao-sei"
            section="hero"
            className="rounded-full bg-violet-gradient px-7 py-4 font-bold text-white shadow-violet-glow"
          >
            Pedir orçamento do meu site
          </QuoteLink>
          <a href="#trabalhos" className="text-sm font-semibold text-violet-200">Ver exemplos de sites ↓</a>
        </div>
        <p className="mt-6 text-xs leading-6 text-muted-foreground">Design adaptado ao celular · Contato facilitado · Atendimento em todo o Brasil</p>
      </div>
      <HeroTemplatePreview />
    </div>
  </section>;
}
