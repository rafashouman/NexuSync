import CreativeExperience from "@/components/home/CreativeExperience";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Sistemas Web e Automações para Pequenas Empresas | NexuSync",
  description:
    "Organize agendamentos, pedidos e tarefas com sistemas web e automações criados para a rotina do seu negócio. Veja exemplos e solicite uma proposta.",
  path: "/apps",
});

export default function Page() {
  return <CreativeExperience kind="apps" />;
}
