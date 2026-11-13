import { PlansMarketing } from "@/components/PlansMarketing";
import { ServiceHero, ServiceJourney } from "@/components/ServiceJourney";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";
import { ArrowUpRight, BarChart3, Megaphone, MousePointer2 } from "lucide-react";

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
    <>
      <ServiceHero
        kind="marketing"
        visual={
          <div
            aria-hidden="true"
            className="mx-auto max-w-[520px] rounded-[2rem] border border-violet-200/15 bg-[#111019] p-5 shadow-[0_30px_90px_-40px_rgba(139,92,246,.55)] sm:p-7"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">
                  Visão da campanha
                </p>
                <p className="mt-1 text-sm text-white/60">Exemplo ilustrativo</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
                <Megaphone className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs text-white/50">Alcance</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="font-display text-2xl font-semibold text-white">12,8 mil</span>
                  <BarChart3 className="mb-1 h-4 w-4 text-violet-200" />
                </div>
                <div className="mt-4 flex h-8 items-end gap-1">
                  {[35, 54, 42, 75, 58, 88, 68, 100].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-sm bg-violet-300/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs text-white/50">Interações</p>
                <div className="mt-2 flex items-end justify-between">
                  <span className="font-display text-2xl font-semibold text-white">Engajamento</span>
                  <MousePointer2 className="mb-1 h-4 w-4 text-fuchsia-200" />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full w-[68%] rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300" />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div>
                <p className="text-xs text-white/50">Próxima etapa</p>
                <p className="mt-1 text-sm font-semibold text-white">Revisar conteúdo e objetivo</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-violet-200" />
            </div>
          </div>
        }
      />
      <ServiceJourney kind="marketing" />
      <PlansMarketing />
      <FAQ
        items={marketingFaqs}
        heading="Dúvidas sobre marketing digital para empresas"
        description="Veja o que pode estar incluído em redes sociais, anúncios e acompanhamento de contatos."
      />
    </>
  );
}
