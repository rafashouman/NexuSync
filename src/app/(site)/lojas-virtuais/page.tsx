import ShopsExperience from "@/components/home/ShopsExperience";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Loja Virtual e Catálogo Digital para seu Negócio | NexuSync",
  description:
    "Venda pela internet com uma loja virtual ou catálogo digital organizado. Mostre produtos, preços e formas de pedido em um só lugar. Solicite um orçamento.",
  path: "/lojas-virtuais",
});

export default function Page() { return <ShopsExperience />; }
