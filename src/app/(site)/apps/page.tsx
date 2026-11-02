import { AppsPageContent } from "@/components/PortfolioPages";
import { PlansApps } from "@/components/PlansApps";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aplicações web para agendamentos e gestão | NexuSync",
  description:
    "Conheça demonstrações de aplicações web para agendamentos, gestão e experiências interativas. Recursos e escopo definidos conforme o projeto.",
};

export default function AppsPage() {
  return (
    <>
      <AppsPageContent />
      <PlansApps />
    </>
  );
}
