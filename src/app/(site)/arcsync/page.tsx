import type { Metadata } from "next";
import { PrelaunchProductPage } from "@/components/PrelaunchProductPage";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...nexuSyncMetadata({
    title: "ArcSync em Pré-lançamento | NexuSync",
    description:
      "Conheça o status do ArcSync, um produto da NexuSync ainda em desenvolvimento. Recursos e disponibilidade serão divulgados quando confirmados.",
    path: "/arcsync",
  }),
  robots: { index: false, follow: true },
};

export default function ArcSyncPage() {
  return (
    <PrelaunchProductPage
      name="ArcSync"
      audience="Estamos avaliando uma solução voltada a profissionais de marketing, social media e equipes que trabalham com conteúdo."
      whatsappMessage="Olá! Gostaria de conversar sobre o pré-lançamento do ArcSync."
    />
  );
}
