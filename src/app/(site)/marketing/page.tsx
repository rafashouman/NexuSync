import { PlansMarketing } from "@/components/PlansMarketing";
import { Contact } from "@/components/Contact";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Marketing digital para empresas | NexuSync",
  description: "Conheça os planos de redes sociais, anúncios e acompanhamento de leads da NexuSync.",
  path: "/marketing",
});

export default function MarketingPage() { return <div className="pt-28"><h1 className="container-luxe font-display text-4xl">Seja encontrado. Facilite o contato. Acompanhe cada oportunidade.</h1><PlansMarketing /><Contact /></div>; }
