import SitesExperience from "@/components/home/SitesExperience";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Criação de Sites Profissionais para Empresas | NexuSync",
  description: "Sites institucionais, landing pages e hotsites para apresentar sua empresa com confiança e facilitar pedidos de orçamento. Conheça a NexuSync.",
  path: "/criacao-de-sites",
});

export default function SitesPage() {
  return <SitesExperience />;
}
