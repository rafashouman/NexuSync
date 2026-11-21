import { JsonLd } from "@/components/JsonLd";
import ContatoPage from "@/components/servicos/contato/ContatoPage";
import { breadcrumbs } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Contato e orçamento | NexuSync",
  description: "Conte seu projeto. Fale com a NexuSync sobre sites, aplicativos, design, redes sociais, tráfego pago e SEO, por formulário ou WhatsApp.",
  path: "/contato",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbs(["Contato e orçamento", "/contato"])} />
      <ContatoPage />
    </>
  );
}
