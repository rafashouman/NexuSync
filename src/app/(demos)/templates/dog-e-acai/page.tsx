import { AppGuide } from "@/components/AppGuide";
import { tours } from "@/data/appTours";
import type { Metadata } from "next";
import DeliveryMenu from "@/components/DeliveryMenu";

export const metadata: Metadata = {
  title: "Dog & Açaí | Cardápio digital NexuSync",
  openGraph: { title: "Dog & Açaí | Cardápio digital", description: "Cachorros-quentes na chapa, açaí no copo e combos para delivery.", images: ["https://nexusync.online/images/dog-acai/cardapio.webp"] },
  description: "Monte seu cachorro-quente, personalize o açaí e experimente o pedido para entrega ou retirada.",
};

export default function DogAcaiPage() {
  return <><AppGuide slug="dog-e-acai" steps={tours["dog-e-acai"]} /><DeliveryMenu dogAcai /></>;
}
