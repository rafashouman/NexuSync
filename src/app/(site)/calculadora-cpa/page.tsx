import { JsonLd } from "@/components/JsonLd";
import CalculadoraPage, { calculadoraFaqs } from "@/components/servicos/calculadora/CalculadoraPage";
import { breadcrumbs, faqSchema, SITE_URL } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/calculadora-cpa";
const title = "Calculadora de CPA: Quanto Custa Cada Venda do Anúncio | NexuSync";
const description =
  "Calculadora gratuita de custo por venda (CPA) para anúncios no Instagram e Facebook. Veja quantas vendas esperar, o limite que ainda dá lucro e três cenários, para site ou WhatsApp.";

export const metadata = nexuSyncMetadata({ title, description, path });

/** Free tool: no price, no rating, no invented numbers. */
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}${path}#app`,
  name: "Calculadora de CPA da NexuSync",
  url: `${SITE_URL}${path}`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  description,
  provider: { "@id": `${SITE_URL}/#organization` },
};

export default function Page() {
  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema(calculadoraFaqs)} />
      <JsonLd data={breadcrumbs(["Calculadora de CPA", path])} />
      <CalculadoraPage />
    </>
  );
}
