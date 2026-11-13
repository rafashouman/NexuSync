import { AppsPageContent } from "@/components/PortfolioPages";
import { PlansApps } from "@/components/PlansApps";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Sistemas Web e Automações para Pequenas Empresas | NexuSync",
  description:
    "Organize agendamentos, pedidos e tarefas com sistemas web e automações criados para a rotina do seu negócio. Veja exemplos e solicite uma proposta.",
  path: "/apps",
});

const appFaqs = [
  {
    q: "Que tipo de sistema web posso contratar?",
    a: "A NexuSync desenvolve aplicações web para organizar agendamentos, pedidos, cadastros, tarefas e indicadores. O formato e as funções são definidos conforme o processo que sua empresa precisa melhorar.",
  },
  {
    q: "Os agendamentos ficam confirmados automaticamente?",
    a: "No plano básico, o sistema registra a solicitação e a empresa confirma o horário. Sincronização em tempo real e notificações automáticas só entram quando estiverem previstas na proposta.",
  },
  {
    q: "O sistema funciona no celular?",
    a: "Os planos de aplicações preveem uma interface adaptada para celular, tablet e computador. O fluxo é definido para as tarefas que sua equipe e seus clientes precisam realizar.",
  },
  {
    q: "Integrações e automações estão sempre incluídas?",
    a: "Não. Pagamentos, notificações e integrações adicionais dependem das ferramentas compatíveis e do escopo contratado. A proposta descreve o que será conectado e como o fluxo funcionará.",
  },
];

export default function AppsPage() {
  return (
    <>
      <AppsPageContent />
      <PlansApps />
      <FAQ
        items={appFaqs}
        heading="Dúvidas sobre sistemas web e automações"
        description="Entenda o que pode ser organizado e quais recursos precisam estar previstos no escopo."
      />
    </>
  );
}
