import type { Metadata } from "next";
import { Plans } from "@/components/Plans";
import { Contact } from "@/components/Contact";
export const metadata: Metadata = { title: "Sites e lojas virtuais: planos e preços | NexuSync", description: "Compare sites com catálogo e lojas virtuais com pagamento online. Confira os escopos e solicite uma proposta." };
export default function ShopsPage() { return <div className="pt-28"><h1 className="container-luxe font-display text-4xl">Facilite a escolha do produto e o próximo pedido</h1><Plans /><Contact /></div>; }
