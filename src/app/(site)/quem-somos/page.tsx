import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Fingerprint, HeartHandshake, MessageCircle, Sparkles } from "lucide-react";
import { AboutHeroScene, AppScenes, BrandScene, MarketingFlow, SiteJourney, WorkSteps } from "./scenes";
import { waLink } from "@/lib/site-config";

const title = "Quem somos | NexuSync — Sua presença digital com personalidade";
const description = "Conheça o jeito NexuSync de conectar sites, aplicativos, design e marketing aos objetivos do seu negócio. Criação com identidade e atendimento próximo.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "https://nexusync.online/quem-somos" },
  openGraph: {
    title, description, url: "https://nexusync.online/quem-somos", type: "website", locale: "pt_BR", siteName: "NexuSync",
    images: [{ url: "https://nexusync.online/images/capa-nexusync.png", alt: "NexuSync — Soluções digitais" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["https://nexusync.online/images/capa-nexusync.png"] },
};

const sections = [
  {
    id: "sites", number: "01", category: "SITES & LANDING PAGES", title: "Entre conhecer você", highlight: "e querer conversar.",
    text: "Seu site apresenta o que você faz, dá motivos para escolher sua empresa e deixa o contato ao alcance de um toque.",
    benefits: ["Sua oferta com clareza", "Sua identidade em cada detalhe", "Um caminho simples até o contato"],
    href: "/templates", link: "Explore nossos exemplos", scene: SiteJourney,
  },
  {
    id: "aplicativos", number: "02", category: "APLICATIVOS & FERRAMENTAS", title: "Seu dia já é cheio.", highlight: "A rotina pode ser mais leve.",
    text: "Agendamentos, pedidos e atendimento ganham um lugar organizado. Ferramentas que fazem sentido para quem usa todos os dias.",
    benefits: ["Menos informação espalhada", "Próximas tarefas à vista", "Mais clareza para sua equipe"],
    href: "/apps", link: "Experimente nossos aplicativos", scene: AppScenes,
  },
  {
    id: "design", number: "03", category: "DESIGN & IDENTIDADE", title: "Antes de ler o nome,", highlight: "já parece a sua marca.",
    text: "Cores, imagens e organização trabalham juntas para dar personalidade à sua comunicação e destacar o que você quer dizer.",
    benefits: ["Uma linguagem que conecta as peças", "Mensagens fáceis de entender", "Consistência nos seus canais"],
    href: "/design", link: "Conheça nosso trabalho de design", scene: BrandScene,
  },
  {
    id: "marketing", number: "04", category: "MARKETING & AUTOMAÇÕES", title: "O clique abre a porta.", highlight: "A conversa precisa continuar.",
    text: "Conectamos divulgação, contato e acompanhamento. Cada etapa tem uma função para o interesse encontrar um próximo passo.",
    benefits: ["Divulgação com uma direção", "Contatos com contexto", "Acompanhamento mais organizado"],
    href: "/marketing", link: "Veja como podemos ajudar", scene: MarketingFlow,
  },
] as const;

export default function AboutPage() {
  const contact = waLink("Olá! Quero descobrir o que faz sentido para a presença digital do meu negócio com a NexuSync.");
  return (
    <div className="[&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-violet-300">
      <section className="relative pb-12 pt-40 sm:pb-20 sm:pt-48" aria-labelledby="about-title">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,#8b5cf617,transparent_55%)]" />
        <div className="container-luxe relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <p className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200"><span className="h-1.5 w-1.5 rounded-full bg-violet-300" /> Quem somos · NexuSync</p>
              <h1 id="about-title" className="text-[clamp(2.5rem,4.3vw,4.6rem)] leading-[1.1] tracking-[-0.055em]">Seu negócio tem personalidade.<span className="mt-2 block text-violet-gradient">Sua presença digital também precisa ter.</span></h1>
              <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">Somos a NexuSync. Aproximamos criação, tecnologia e marketing do que torna o seu negócio único.</p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a href="#nosso-jeito" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-violet-gradient px-6 py-3.5 text-sm font-bold text-white shadow-violet-glow transition-transform hover:-translate-y-1 motion-reduce:transform-none">Veja o que muda na prática <ArrowDown size={16} /></a>
                <a href={contact} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-violet-200">Vamos conversar <ArrowUpRight size={17} /></a>
              </div>
              <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground"><HeartHandshake className="text-violet-300" size={22} strokeWidth={1.5} /><span>Gente de verdade. Conversa de perto.</span></div>
            </div>
            <AboutHeroScene />
          </div>
          <div className="mt-16 flex flex-col gap-5 border-y border-violet-200/10 py-7 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-lg font-semibold leading-7">Primeiro, o seu negócio.<br /><span className="text-muted-foreground">Depois, a solução.</span></p>
            <nav aria-label="Explore nossa forma de trabalhar" className="flex flex-wrap gap-2">{sections.map(section => <a key={section.id} href={`#${section.id}`} className="inline-flex min-h-11 items-center gap-3 rounded-full border border-violet-200/15 px-4 text-xs text-violet-100 transition-colors hover:bg-violet-400/10">{section.category.split(" & ")[0].toLocaleLowerCase("pt-BR")}<ArrowDown size={12} /></a>)}</nav>
          </div>
        </div>
      </section>

      <div id="nosso-jeito" className="scroll-mt-24">
        {sections.map(({ scene: Scene, ...section }, index) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className={`scroll-mt-20 border-b border-white/[0.06] py-16 sm:py-24 ${index % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
            <div className="container-luxe grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <p className="mb-5 flex items-center gap-4 text-[10px] font-bold tracking-[0.16em] text-violet-200"><span className="grid h-9 w-9 place-items-center rounded-full border border-violet-200/20 font-normal">{section.number}</span>{section.category}</p>
                <h2 id={`${section.id}-title`} className="text-[clamp(1.9rem,3vw,3rem)] leading-[1.2] tracking-[-0.045em]">{section.title}<span className="block text-violet-300">{section.highlight}</span></h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{section.text}</p>
                <ul className="my-7 space-y-3">{section.benefits.map(benefit => <li key={benefit} className="flex items-center gap-3 text-sm text-violet-100"><Check size={17} className="shrink-0 text-violet-400" aria-hidden />{benefit}</li>)}</ul>
                <Link href={section.href} className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-violet-200 underline-offset-4 hover:underline">{section.link}<ArrowUpRight size={17} /></Link>
              </div>
              <div className={`min-w-0 ${index % 2 === 1 ? "lg:order-1" : ""}`}><Scene /></div>
            </div>
          </section>
        ))}
      </div>

      <section className="py-20 sm:py-28" aria-labelledby="work-title">
        <div className="container-luxe">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="mb-5 text-[10px] font-bold tracking-[0.18em] text-violet-200">NOSSO JEITO DE TRABALHAR</p><h2 id="work-title" className="text-3xl leading-tight tracking-tight sm:text-5xl">Você participa.<br /><span className="text-violet-300">A gente constrói junto.</span></h2></div>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">Você conhece sua empresa. Nós ajudamos a transformar essa essência em uma experiência digital.</p>
          </div>
          <WorkSteps />
          <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-3">{[{ icon: HeartHandshake, title: "Contato próximo", text: "Conversa direta ao longo do projeto." }, { icon: Fingerprint, title: "Sua identidade", text: "Escolhas que partem da sua marca." }, { icon: Check, title: "Etapas claras", text: "Entregas e prazos alinhados desde o início." }].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><Icon size={22} className="mt-1 shrink-0 text-violet-300" strokeWidth={1.5} aria-hidden /><div><h3 className="text-sm">{title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{text}</p></div></div>)}</div>
        </div>
      </section>

      <section className="pb-20" aria-labelledby="invite-title">
        <div className="container-luxe">
          <div className="relative overflow-hidden rounded-[2rem] border border-violet-300/25 bg-[#1b1429] px-6 py-14 text-center sm:px-14 sm:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#8b5cf625,transparent_65%)]" />
            <Sparkles size={30} strokeWidth={1.3} className="relative mx-auto mb-7 text-violet-300" aria-hidden />
            <h2 id="invite-title" className="relative mx-auto max-w-3xl text-3xl leading-tight tracking-tight sm:text-5xl">Vamos descobrir o que faz sentido <span className="text-violet-300">para o seu negócio?</span></h2>
            <p className="relative mx-auto mt-6 max-w-lg text-sm leading-7 text-muted-foreground">Conte o seu momento e o que você quer melhorar. Nosso primeiro passo é ouvir.</p>
            <a href={contact} target="_blank" rel="noopener noreferrer" className="relative mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-violet-gradient px-7 py-4 text-sm font-bold text-white shadow-violet-glow transition-transform hover:-translate-y-1 motion-reduce:transform-none"><MessageCircle size={18} /> Vamos conversar <ArrowUpRight size={17} /></a>
          </div>
        </div>
      </section>
    </div>
  );
}
