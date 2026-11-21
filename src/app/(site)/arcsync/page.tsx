import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ProductOverview } from "@/components/ProductOverview";
import { breadcrumbs } from "@/lib/seo";
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
    <>
      <JsonLd data={breadcrumbs(["ArcSync", "/arcsync"])} />
      <ProductOverview product="arcsync" />
    </>
  );
}
