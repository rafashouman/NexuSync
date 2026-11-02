import Image from "next/image";
import { waLink } from "@/lib/site-config";

export function Hero() {
  return <section id="hero" className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
    <div aria-hidden className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-500/15 blur-[100px]" />
    <div className="container-luxe relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">Criação de sites, landing pages e hotsites</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.2rem,4.5vw,4.5rem)] leading-[1.12] tracking-tight">Seu próximo cliente precisa entender <span className="text-violet-gradient">por que escolher você.</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Criamos sites profissionais para apresentar seu negócio com clareza, valorizar seus serviços e facilitar pedidos de orçamento pelo WhatsApp ou formulário.</p>
        <p className="mt-4 max-w-xl text-sm leading-6 text-violet-100">Landing pages e hotsites para profissionais liberais, comércios e pequenas e médias empresas.</p>
        <div className="mt-8 flex flex-wrap items-center gap-5"><a href={waLink("Olá! Quero pedir um orçamento para criar o site do meu negócio.")} target="_blank" rel="noopener noreferrer" className="rounded-full bg-violet-gradient px-7 py-4 font-bold text-white shadow-violet-glow">Pedir orçamento do meu site</a><a href="#trabalhos" className="text-sm font-semibold text-violet-200">Ver exemplos de sites ↓</a></div>
        <p className="mt-6 text-xs leading-6 text-muted-foreground">Design adaptado ao celular · Contato facilitado · Atendimento em todo o Brasil</p>
      </div>
      <div className="rounded-3xl border border-violet-300/20 bg-white/[0.03] p-5 shadow-violet-glow sm:p-7">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-violet-200">Explore uma demonstração</p>
        <a href="/templates/academias" className="block overflow-hidden rounded-2xl border border-white/10"><Image src="/images/site-preview-desktop.webp" width={1440} height={1000} preload sizes="(max-width: 1023px) 90vw, 40vw" alt="Demonstração PulseFit: site de academia com apresentação dos serviços e chamada para sessão experimental" className="aspect-[1.44] w-full object-cover object-top" /></a>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">Veja o design em ação: apresentação do negócio, serviços e um caminho claro até o contato.</p>
        <a href="/templates/academias" className="mt-4 inline-block text-sm font-semibold text-violet-200 underline underline-offset-4">Explorar exemplo PulseFit</a>
        <p className="mt-3 text-xs text-muted-foreground">Projeto demonstrativo. Conteúdo e números ilustrativos.</p>
      </div>
    </div>
  </section>;
}
