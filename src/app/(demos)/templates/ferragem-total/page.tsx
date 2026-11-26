import { CatalogPage } from "@/components/ferragem/CatalogPage";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Catálogo online para ferragem | Demo Total Lar",
  description:
    "Demonstração de catálogo online para ferragem e material de construção: preço de, à vista e parcelado, página de cada produto para enviar pelo WhatsApp e domínio próprio.",
  path: "/templates/ferragem-total",
  noindex: true,
});

export default function Page() {
  return <CatalogPage />;
}
