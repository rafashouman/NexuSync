import { JsonLd } from "@/components/JsonLd";
import RedesPage, { socialFaqs } from "@/components/servicos/redes/RedesPage";
import { breadcrumbs, faqSchema, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/redes-sociais";
const title = "Gestão de Redes Sociais para Pequenas Empresas | NexuSync";
const description = "Conteúdo, legendas e publicações para Instagram e Facebook com o plano Presença Ativa: calendário, stories e relatório mensal, sem prometer alcance.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function SocialPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Gestão de redes sociais", path, serviceType: "Gestão de Instagram e Facebook para pequenas empresas", description })} />
      <JsonLd data={faqSchema(socialFaqs)} />
      <JsonLd data={breadcrumbs(["Marketing", "/marketing"], ["Gestão de redes sociais", path])} />
      <RedesPage />
    </>
  );
}
