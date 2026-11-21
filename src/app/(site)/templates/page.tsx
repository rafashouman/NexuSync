import { JsonLd } from "@/components/JsonLd";
import TemplatesPage from "@/components/servicos/templates/TemplatesPage";
import { breadcrumbs } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Exemplos de sites e lojas virtuais | NexuSync",
  description:
    "Veja exemplos interativos de sites, lojas virtuais e soluções digitais criados pela NexuSync para diferentes tipos de negócio.",
  path: "/templates",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs(["Exemplos", "/templates"])} />
      <TemplatesPage />
    </>
  );
}
