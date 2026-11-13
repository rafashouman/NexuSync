import type { Metadata } from "next";
import { PrelaunchProductPage } from "@/components/PrelaunchProductPage";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...nexuSyncMetadata({
    title: "VisionSync em Pré-lançamento | NexuSync",
    description:
      "Conheça o status do VisionSync, um produto da NexuSync ainda em desenvolvimento. Recursos e disponibilidade serão divulgados quando confirmados.",
    path: "/visionsync",
  }),
  robots: { index: false, follow: true },
};

export default function VisionSyncPage() {
  return (
    <PrelaunchProductPage
      name="VisionSync"
      audience="Estamos avaliando uma solução voltada a pequenos negócios que buscam mais clareza sobre como organizar suas informações e processos."
      whatsappMessage="Olá! Gostaria de conversar sobre o pré-lançamento do VisionSync."
    />
  );
}
