import PropertyShowcase from "@/components/PropertyShowcase";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Site imobiliário com busca por bairro | Demo Pátio Imóveis",
  description:
    "Explore uma demonstração de site imobiliário para compra e aluguel em Porto Alegre, com busca por bairro e pedidos de visita.",
  path: "/templates/imobiliaria",
  noindex: true,
});

export default function Page() {
  return <PropertyShowcase />;
}
