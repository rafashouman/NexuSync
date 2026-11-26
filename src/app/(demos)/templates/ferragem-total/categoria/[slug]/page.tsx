import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/ferragem/CatalogPage";
import { CATEGORIES, STORE, getCategory } from "@/components/ferragem/catalog-data";
import { nexuSyncMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };

/**
 * Todas as páginas são pré-renderizadas. Com <Suspense> em volta de `params`, o conteúdo iria no HTML
 * dentro de um bloco oculto, exibido só via JavaScript; por isso a validação de navegação instantânea fica desligada.
 */
export const instant = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) return {};
  return nexuSyncMetadata({
    title: `${category.name} | Demo ${STORE.name}`,
    description: `${category.name} no catálogo de demonstração da ${STORE.name}, com preço à vista e parcelado e link de cada produto para enviar pelo WhatsApp.`,
    path: `${STORE.basePath}/categoria/${category.slug}`,
    noindex: true,
  });
}

export default async function Page({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  return <CatalogPage category={category} />;
}
