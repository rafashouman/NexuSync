import type { Metadata } from "next";
import { PlansMarketing } from "@/components/PlansMarketing";
import { Contact } from "@/components/Contact";
export const metadata: Metadata = { title: "Marketing digital para empresas | NexuSync", description: "Conheça os planos de redes sociais, anúncios e acompanhamento de leads da NexuSync." };
export default function MarketingPage() { return <div className="pt-28"><h1 className="container-luxe font-display text-4xl">Marketing para apoiar seu negócio</h1><PlansMarketing /><Contact /></div>; }
