import { JsonLd } from "@/components/JsonLd";
import AppsPage from "@/components/servicos/apps/AppsPage";
import { breadcrumbs, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/apps";
const title = "Sistemas Web e Automações para Pequenas Empresas | NexuSync";
const description = "Organize agendamentos, pedidos e tarefas com sistemas web e automações criados para a rotina do seu negócio. Veja exemplos e solicite uma proposta.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Aplicativos e automações", path, serviceType: "Sistemas web e automações para pequenas empresas", description })} />
      <JsonLd data={breadcrumbs(["Aplicativos e automações", path])} />
      <AppsPage />
    </>
  );
}
