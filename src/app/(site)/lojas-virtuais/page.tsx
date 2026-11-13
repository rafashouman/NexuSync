import { Plans } from "@/components/Plans";
import { Contact } from "@/components/Contact";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Sites e lojas virtuais: planos e preços | NexuSync",
  description: "Compare sites com catálogo e lojas virtuais com pagamento online. Confira os escopos e solicite uma proposta.",
  path: "/lojas-virtuais",
});

export default function ShopsPage() { return <div className="pt-28"><h1 className="container-luxe font-display text-4xl">Facilite a escolha do produto e o próximo pedido</h1><Plans /><Contact /></div>; }
