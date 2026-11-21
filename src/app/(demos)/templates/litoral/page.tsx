import RotaLitoral from "@/components/litoral/RotaLitoral";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Site para pousada | Demo Rota Litoral",
  description:
    "Demonstração de site para pousada: uma viagem de carro pelo litoral, do amanhecer à noite, com quartos, passeios, refeições, rádio ambiente e planejador de estadia pelo WhatsApp.",
  path: "/templates/litoral",
  noindex: true,
});

export default function Page() {
  return <RotaLitoral />;
}
