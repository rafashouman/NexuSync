import { DesignPageContent } from "@/components/PortfolioPages";
import { PlansDG } from "@/components/PlansDG";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design e mídias digitais para marcas | NexuSync",
  description:
    "Conheça peças digitais, identidade visual e design de interfaces da NexuSync. Entregas e escopo definidos em cada pacote.",
};

export default function DesignPage() {
  return (
    <>
      <DesignPageContent />
      <PlansDG />
    </>
  );
}
