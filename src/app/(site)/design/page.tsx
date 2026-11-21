import { JsonLd } from "@/components/JsonLd";
import DesignPage from "@/components/servicos/design/DesignPage";
import { designFaqs } from "@/data/designFaqs";
import { breadcrumbs, faqSchema, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/design";
const title = "Design e Motion Graphics para Marcas e Negócios | NexuSync";
const description = "Motion graphics para dar vida à sua marca, além de identidade visual, peças digitais e interfaces para sites e apps. Veja um exemplo em vídeo e peça um orçamento.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Design e motion graphics", path, serviceType: "Motion graphics, identidade visual e design digital", description })} />
      <JsonLd data={faqSchema(designFaqs.map(({ q, a }) => [q, a] as const))} />
      <JsonLd data={breadcrumbs(["Design e motion graphics", path])} />
      <DesignPage />
    </>
  );
}
