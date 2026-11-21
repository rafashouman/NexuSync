import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ProductOverview } from "@/components/ProductOverview";
import { breadcrumbs } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = {
  ...nexuSyncMetadata({
    title: "VisionSync | CRM e Organização do Atendimento no WhatsApp",
    description:
      "Organize contatos, etapas, notas e retornos com o VisionSync. Conheça o painel de CRM e a extensão para apoiar o atendimento no WhatsApp Web.",
    path: "/visionsync",
  }),
};

export default function VisionSyncPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(["VisionSync", "/visionsync"])} />
      <ProductOverview product="visionsync" />
    </>
  );
}
