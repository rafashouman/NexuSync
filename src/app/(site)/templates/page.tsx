import { TemplatesPageContent } from "@/components/PortfolioPages";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Exemplos de sites e lojas virtuais | NexuSync",
  description:
    "Veja exemplos interativos de sites, lojas virtuais e soluções digitais criados pela NexuSync para diferentes tipos de negócio.",
  path: "/templates",
});

export default function TemplatesPage() {
  return <TemplatesPageContent />;
}
