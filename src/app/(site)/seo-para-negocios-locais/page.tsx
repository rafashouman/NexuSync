import { JsonLd } from "@/components/JsonLd";
import SeoPage, { seoFaqs, seoService } from "@/components/servicos/seo/SeoPage";
import { breadcrumbs, faqSchema, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/seo-para-negocios-locais";
const title = "SEO para Negócios Locais: Seja Encontrado | NexuSync";
const description =
  "Quem procura o seu serviço no Google precisa te encontrar. SEO básico em todos os sites da NexuSync e serviço de SEO e presença local, sem prometer posição.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "SEO e presença local", path, serviceType: "SEO para negócios locais", description: seoService.description })} />
      <JsonLd data={faqSchema(seoFaqs)} />
      <JsonLd data={breadcrumbs(["SEO para negócios locais", path])} />
      <SeoPage />
    </>
  );
}
