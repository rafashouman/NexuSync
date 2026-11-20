import SitesExperience from "@/components/home/SitesExperience";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/criacao-de-sites";
const title = "Criação de Sites Profissionais para Empresas | NexuSync";
const description = "Sites institucionais, landing pages e hotsites para apresentar sua empresa com confiança e facilitar pedidos de orçamento. Conheça a NexuSync.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function SitesPage() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Criação de sites", path, serviceType: "Criação de sites institucionais, landing pages e hotsites", description })} />
      <JsonLd data={breadcrumbs(["Criação de sites", path])} />
      <SitesExperience />
    </>
  );
}
