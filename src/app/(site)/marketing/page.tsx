import MarketingExperience from "@/components/home/MarketingExperience";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Tráfego, SEO e Social Media para Pequenas Empresas | NexuSync",
  description:
    "Gestão de redes sociais, anúncios no Google e na Meta, SEO e presença local para sua empresa. Conheça as entregas e solicite uma proposta.",
  path: "/marketing",
});

export default function MarketingPage() {
  return <MarketingExperience />;
}
