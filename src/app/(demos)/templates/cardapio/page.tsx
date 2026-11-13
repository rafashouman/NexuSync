import { AppGuide } from "@/components/AppGuide";
import { tours } from "@/data/appTours";
import DeliveryMenu from "@/components/DeliveryMenu";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Cardápio digital para hamburgueria | Demonstração NexuSync",
  description:
    "Explore uma demonstração de cardápio digital para hamburgueria: personalize um pedido e veja o fluxo de atendimento.",
  path: "/templates/cardapio",
});

export default function CardapioPage() {
  return <><AppGuide slug="cardapio" steps={tours["cardapio"]} /><DeliveryMenu /></>;
}
