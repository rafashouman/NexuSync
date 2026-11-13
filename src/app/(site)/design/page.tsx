import { DesignPageContent } from "@/components/PortfolioPages";
import { PlansDG } from "@/components/PlansDG";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Design e mídias digitais para marcas | NexuSync",
  description:
    "Conheça peças digitais, identidade visual e design de interfaces da NexuSync. Entregas e escopo definidos em cada pacote.",
  path: "/design",
});

export default function DesignPage() {
  return (
    <>
      <DesignPageContent />
      <PlansDG />
    </>
  );
}
