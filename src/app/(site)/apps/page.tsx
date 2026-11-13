import { AppsPageContent } from "@/components/PortfolioPages";
import { PlansApps } from "@/components/PlansApps";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Aplicações web para agendamentos e gestão | NexuSync",
  description:
    "Conheça demonstrações de aplicações web para agendamentos, gestão e experiências interativas. Recursos e escopo definidos conforme o projeto.",
  path: "/apps",
});

export default function AppsPage() {
  return (
    <>
      <AppsPageContent />
      <PlansApps />
    </>
  );
}
