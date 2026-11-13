import ArchitectPortfolio from "@/components/ArchitectPortfolio";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Site para escritório de arquitetura | Demonstração Ateliê Vão",
  description:
    "Conheça uma demonstração de portfólio de arquitetura residencial com plantas interativas e estudos de interiores.",
  path: "/templates/arquitetura",
});

export default function Page() {
  return <ArchitectPortfolio />;
}
