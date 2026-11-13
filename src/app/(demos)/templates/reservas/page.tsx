import KobraTableBooking from "@/components/KobraTableBooking";
import { ScrollProgress } from "@/components/ui/MotionKit";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Reservas para restaurante | Demonstração NexuSync",
  description:
    "Veja uma demonstração de reservas de mesas e operação de restaurante com atendimento e fluxo de cozinha.",
  path: "/templates/reservas",
});

export default function ReservasStandalonePage() {
  return (
    <main id="conteudo">
      <ScrollProgress />
      <h1 className="sr-only">Kobra.Fire: reservas, pedidos e operação do restaurante</h1>
      <KobraTableBooking initialTab="booking" />
    </main>
  );
}