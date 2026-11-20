import CreativeExperience from "@/components/home/CreativeExperience";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/design";
const title = "Identidade Visual e Design para Empresas | NexuSync";
const description = "Apresente sua marca com identidade visual, peças digitais e interfaces coerentes. Conheça os serviços de design da NexuSync.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Design e motion graphics", path, serviceType: "Identidade visual e design digital", description })} />
      <JsonLd data={breadcrumbs(["Design", path])} />
      <CreativeExperience kind="design" />
    </>
  );
}
