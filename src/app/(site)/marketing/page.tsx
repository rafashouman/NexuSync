import { PlansMarketing } from "@/components/PlansMarketing";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Marketing Digital para Pequenas Empresas | NexuSync",
  description:
    "Fortaleça a presença da sua empresa com conteúdo para redes sociais, anúncios e organização de contatos. Conheça os planos de marketing da NexuSync.",
  path: "/marketing",
});

const marketingFaqs = [
  {
    q: "O plano de redes sociais inclui responder mensagens?",
    a: "O plano Presença Ativa inclui calendário, legendas e publicações para Instagram e Facebook. Atendimento de mensagens, respostas diárias a comentários, produção de vídeos e anúncios não fazem parte desse plano.",
  },
  {
    q: "A verba para anúncios está incluída na mensalidade?",
    a: "Não. A verba de mídia é paga diretamente pelo cliente à plataforma de anúncios. A proposta informa o serviço contratado e os custos que ficam separados.",
  },
  {
    q: "A NexuSync garante vendas ou contatos?",
    a: "Não há garantia de volume de vendas ou contatos. Os resultados variam conforme mercado, oferta, investimento e atendimento. A proposta descreve as entregas e os indicadores acompanhados.",
  },
  {
    q: "Como posso organizar os contatos que chegam pelas campanhas?",
    a: "O plano Crescimento Integrado prevê um funil de CRM, uma fonte de leads e um fluxo de automação dentro do escopo descrito. A configuração depende dos canais e ferramentas compatíveis com o seu negócio.",
  },
];

export default function MarketingPage() {
  return (
    <div className="pt-28">
      <section className="container-luxe pb-8">
        <h1 className="font-display text-4xl">
          Marketing digital para sua empresa ser vista e lembrada
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Organize a comunicação da sua marca, divulgue seus serviços e
          acompanhe os contatos com um plano alinhado ao momento da sua empresa.
        </p>
      </section>
      <PlansMarketing />
      <FAQ
        items={marketingFaqs}
        heading="Dúvidas sobre marketing digital para empresas"
        description="Veja o que pode estar incluído em redes sociais, anúncios e acompanhamento de contatos."
      />
      <Contact />
    </div>
  );
}
