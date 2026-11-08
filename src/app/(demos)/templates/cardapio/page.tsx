import { AppGuide } from "@/components/AppGuide";
import { tours } from "@/data/appTours";
import DeliveryMenu from "@/components/DeliveryMenu";

export default function CardapioPage() {
  return <><AppGuide slug="cardapio" steps={tours["cardapio"]} /><DeliveryMenu /></>;
}
