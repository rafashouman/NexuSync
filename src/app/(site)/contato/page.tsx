import Link from "next/link";
import { ArrowUpRight, Fingerprint, HeartHandshake, Check } from "lucide-react";
import { Contact } from "@/components/Contact";
import { nexuSyncMetadata } from "@/lib/site-metadata";
import { AboutHeroScene } from "../quem-somos/scenes";

export const metadata = nexuSyncMetadata({
  title: "Contato e orçamento | NexuSync",
  description: "Conte seu projeto. Fale com a NexuSync sobre sites, aplicativos, design, redes sociais, tráfego pago e SEO, por formulário ou WhatsApp.",
  path: "/contato",
});

export default function ContactPage() {
  return (
    <>
      <header className="container-luxe pt-40 sm:pt-48">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-ice">Contato · NexuSync</p>
        <h1 className="max-w-4xl text-4xl leading-tight tracking-tight sm:text-6xl">
          Seu próximo projeto <span className="text-brand-gradient">começa com uma conversa.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Escolha o assunto, conte o que precisa e fale com a gente pelo canal que preferir.</p>
      </header>
      <Contact />
      <section aria-labelledby="contact-about" className="border-t border-border bg-ocean/20 py-20 sm:py-28">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-ice">Quem somos</p>
            <h2 id="contact-about" className="text-3xl leading-tight sm:text-5xl">Seu negócio tem personalidade. <span className="text-brand-gradient">Sua presença digital também.</span></h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">Somos a NexuSync. Criamos sites, aplicativos e identidades visuais e cuidamos de redes sociais, tráfego pago e SEO. Primeiro entendemos sua empresa; depois, definimos uma solução com escopo, investimento e etapas claras.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {[
                { icon: HeartHandshake, title: "Contato próximo", text: "Atendimento direto em todo o Brasil." },
                { icon: Fingerprint, title: "Sua identidade", text: "Cada escolha parte da sua marca." },
                { icon: Check, title: "Etapas claras", text: "Você acompanha o desenvolvimento." },
              ].map(({ icon: Icon, title, text }) => <div key={title}><Icon className="mb-3 h-6 w-6 text-ice" /><h3 className="text-sm text-ice">{title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{text}</p></div>)}
            </div>
            <Link href="/quem-somos" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-champagne">Conheça nosso jeito de trabalhar <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="min-w-0"><AboutHeroScene /></div>
        </div>
      </section>
    </>
  );
}
