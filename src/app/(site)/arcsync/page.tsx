import type { Metadata } from "next";
import { ProductOverview } from "@/components/ProductOverview";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...nexuSyncMetadata({
    title: "ArcSync | Planejamento e Agendamento de Publicações",
    description:
      "Organize rascunhos, calendário, aprovações e agendamento de publicações com o ArcSync. Conheça a solução e acesse o aplicativo.",
    path: "/arcsync",
  }),
};

export default function ArcSyncPage() {
  return (
    <ProductOverview product="arcsync" />
  );
}
