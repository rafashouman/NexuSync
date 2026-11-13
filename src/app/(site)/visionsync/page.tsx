import type { Metadata } from "next";
import { ProductOverview } from "@/components/ProductOverview";
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
    <ProductOverview product="visionsync" />
  );
}
