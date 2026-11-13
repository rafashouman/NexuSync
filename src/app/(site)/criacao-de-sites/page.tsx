import Link from "next/link";
import { ServiceHero, ServiceJourney } from "@/components/ServiceJourney";
import { ServiceSectionNav } from "@/components/ServiceSectionNav";
import { HeroTemplatePreview } from "@/components/HeroTemplatePreview";
import { SelectedWork } from "@/components/SelectedWork";
import { Plans } from "@/components/Plans";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const sectionLinks = [
  { href: "#sites-necessidades", label: "O que seu site precisa resolver" },
  { href: "#sites-formatos", label: "Formatos de site" },
  { href: "#lojas-virtuais", label: "Lojas virtuais" },
  { href: "#templates", label: "Templates" },
  { href: "#sites-processo", label: "Etapas do projeto" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "Dúvidas" },
] as const;

export const metadata = nexuSyncMetadata({
  title: "Criação de Sites Profissionais para Empresas | NexuSync",
  description: "Sites institucionais, landing pages e hotsites para apresentar sua empresa com confiança e facilitar pedidos de orçamento. Conheça a NexuSync.",
  path: "/criacao-de-sites",
});

export default function SitesPage() {
  return (
    <>
      <ServiceHero kind="sites" visual={<HeroTemplatePreview />} />
      <ServiceSectionNav items={sectionLinks} />
      <ServiceJourney kind="sites" />
      <section
        id="lojas-virtuais"
        className="scroll-mt-32 border-y border-border bg-white/[0.015] py-16 sm:py-24"
      >
        <div className="container-luxe grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-200">
              Lojas virtuais e catálogos digitais
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight sm:text-4xl">
              Seus produtos também podem ter uma vitrine própria na internet.
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Reúna produtos, preços e formas de pedido em um catálogo, cardápio
              digital ou loja virtual. O formato depende de como sua empresa
              vende e atende os clientes.
            </p>
          </div>
          <Link
            href="/lojas-virtuais"
            className="inline-flex items-center justify-center rounded-xl border border-violet-300/30 px-5 py-3 font-semibold text-violet-200 transition-colors hover:bg-violet-400/10"
          >
            Ver opções de loja virtual
          </Link>
        </div>
      </section>
      <SelectedWork />
      <Plans sitesOnly />
      <FAQ
        items={[
          { q: "O site vai aparecer no Google?", a: "O projeto inclui a configuração de SEO descrita na proposta. Indexação e posições nas pesquisas dependem também dos mecanismos de busca, da concorrência e da continuidade do trabalho de conteúdo e divulgação." },
          { q: "Quanto custa e quanto tempo leva?", a: "Os planos abaixo apresentam preços e estimativas para os respectivos escopos. O prazo depende dos materiais e das aprovações. A proposta confirma as páginas, os recursos, as revisões e os custos recorrentes." },
          { q: "Posso atualizar o conteúdo depois?", a: "As possibilidades de edição e manutenção dependem da solução contratada. Combinamos quem fará as atualizações e quais recursos de administração serão entregues." },
          { q: "Vocês reformulam sites existentes?", a: "Sim. Primeiro avaliamos o site atual, seu conteúdo e as funcionalidades necessárias. A proposta define o que será aproveitado e quais páginas e recursos precisam ser refeitos." },
          { q: "Preciso fornecer textos, fotos e logotipo?", a: "Reunimos seus materiais no início e definimos o que você fornece. Produção de conteúdo, imagens, identidade visual, domínio e hospedagem precisam estar previstos na proposta." },
        ]}
        heading="Dúvidas antes de criar seu site"
      />
    </>
  );
}
