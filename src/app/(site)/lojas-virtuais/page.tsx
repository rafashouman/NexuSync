import { JsonLd } from "@/components/JsonLd";
import LojasPage from "@/components/servicos/lojas/LojasPage";
import { breadcrumbs, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/lojas-virtuais";
const title = "Loja Virtual e Catálogo Digital para seu Negócio | NexuSync";
const description = "Venda pela internet com uma loja virtual ou catálogo digital organizado. Mostre produtos, preços e formas de pedido em um só lugar. Solicite um orçamento.";

export const metadata = nexuSyncMetadata({ title, description, path });

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema({ name: "Lojas virtuais e catálogos digitais", path, serviceType: "Criação de lojas virtuais e catálogos digitais", description })} />
      <JsonLd data={breadcrumbs(["Lojas virtuais e catálogos", path])} />
      <LojasPage />
    </>
  );
}
