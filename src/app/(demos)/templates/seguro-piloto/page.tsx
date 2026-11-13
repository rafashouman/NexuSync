import PilotosLanding from "@/components/hotsites/PilotosLanding";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Seguro para pilotos | Demonstração de site NexuSync",
  description:
    "Conheça uma demonstração de página para cotação de seguro de vida voltado a pilotos de diferentes modalidades de aviação.",
  path: "/templates/seguro-piloto",
});

export default function SeguroPilotoPage() {
  return <PilotosLanding />;
}
