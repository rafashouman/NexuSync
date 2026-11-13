import { AppGuide } from "@/components/AppGuide";
import { tours } from "@/data/appTours";
import DeliveryMenu from "@/components/DeliveryMenu";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Cardápio digital para lancheria | Demonstração Dog & Açaí",
  description:
    "Explore um cardápio digital para lancheria: personalize cachorro-quente, açaí e combos para entrega ou retirada.",
  path: "/templates/dog-e-acai",
  image: "/images/dog-acai/cardapio.webp",
});

export default function DogAcaiPage() {
  return <><AppGuide slug="dog-e-acai" steps={tours["dog-e-acai"]} /><DeliveryMenu dogAcai /></>;
}
