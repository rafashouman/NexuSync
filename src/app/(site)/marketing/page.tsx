import { JsonLd } from "@/components/JsonLd";
import MarketingPage from "@/components/servicos/marketing/MarketingPage";
import { breadcrumbs, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/marketing";
const title = "SEO, Redes Sociais e Tráfego Pago | NexuSync";
const description =
  "SEO e presença local, gestão de redes sociais e, por último, anúncios no Google e na Meta para sua empresa. Conheça as entregas e solicite uma proposta.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Marketing digital", path, serviceType: "SEO, gestão de redes sociais e tráfego pago", description })} />
      <JsonLd data={breadcrumbs(["Marketing", path])} />
      <MarketingPage />
    </>
  );
}
