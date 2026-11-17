import { PlansMarketing } from "@/components/PlansMarketing";
import { ServiceHero, ServiceJourney } from "@/components/ServiceJourney";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";
import { ArrowUpRight, BarChart3, Megaphone, MousePointer2 } from "lucide-react";

export const metadata = nexuSyncMetadata({
  title: "Tráfego, SEO e Social Media para Pequenas Empresas | NexuSync",
  description:
    "Gestão de redes sociais, anúncios no Google e na Meta, SEO e presença local para sua empresa. Conheça as entregas e solicite uma proposta.",
  path: "/marketing",
});

const marketingFaqs = [
  {
    q: "O plano de redes sociais inclui responder mensagens?",
    a: "O plano Presença Ativa inclui calendário, legendas e publicações para Instagram e Facebook. Atendimento de mensagens, respostas diárias a comentários, produção de vídeos e anúncios não fazem parte desse plano.",
  },
  {
    q: "O serviço de SEO garante a primeira posição no Google?",
    a: "Não. O serviço avalia e melhora a estrutura, os conteúdos e a presença da empresa nas buscas. Posições dependem de concorrência e outros fatores; o escopo é definido após o diagnóstico.",
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
    <>
      <ServiceHero
        kind="marketing"
        visual={
          <div
            aria-hidden="true"
            className="mx-auto max-w-[520px] rounded-[2rem] border border-turquoise/40 bg-ocean p-5 shadow-[0_30px_90px_-40px_rgba(212,255,56,.55)] sm:p-7"
          >
            <div className="flex items-center justify-between border-b border-turquoise/40 pb-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ice">
                  Visão da campanha
                </p>
                <p className="mt-1 text-sm text-ivory/85">Exemplo ilustrativo</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-turquoise/40 bg-turquoise/10 text-ice">
                <Megaphone className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
                <p className="text-xs text-ivory/85">Alcance</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="font-display text-2xl font-semibold text-ivory">12,8 mil</span>
                  <BarChart3 className="mb-1 h-4 w-4 text-ice" />
                </div>
                <div className="mt-4 flex h-8 items-end gap-1">
                  {[35, 54, 42, 75, 58, 88, 68, 100].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-sm bg-turquoise/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
                <p className="text-xs text-ivory/85">Interações</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="font-display text-2xl font-semibold text-ivory">Engajamento</span>
                  <MousePointer2 className="mb-1 h-4 w-4 text-ice" />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-ice/10">
                  <span className="block h-full w-[68%] rounded-full bg-brand-gradient" />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-turquoise/40 bg-ocean/65 p-4">
              <div>
                <p className="text-xs text-ivory/85">Próxima etapa</p>
                <p className="mt-1 text-sm font-semibold text-ivory">Revisar campanhas e buscas</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-ice" />
            </div>
          </div>
        }
      />
      <ServiceJourney kind="marketing" />
      <PlansMarketing />
      <FAQ
        items={marketingFaqs}
        heading="Dúvidas sobre tráfego, SEO e social media"
        description="Entenda a gestão de redes sociais, os anúncios, as melhorias de SEO e o acompanhamento das campanhas."
      />
    </>
  );
}
