import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info, MessageCircle, Weight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import {
  PRODUCTS, STORE, getCategory, getProduct, installmentLabel, money, productPath, storeWhatsApp, type Product,
} from "@/components/ferragem/catalog-data";
import { AddToCart } from "@/components/ferragem/AddToCart";
import { PriceBlock } from "@/components/ferragem/ProductCard";
import { ProductArt } from "@/components/ferragem/ProductArt";
import { ProductRow } from "@/components/ferragem/ProductRow";
import { SharePanel } from "@/components/ferragem/SharePanel";
import { goesWith, similarTo } from "@/components/ferragem/suggestions";
import s from "@/components/ferragem/ferragem.module.css";

const SITE = "https://nexusync.online";

type Props = { params: Promise<{ slug: string }> };

/**
 * Todas as páginas são pré-renderizadas. Com <Suspense> em volta de `params`, o conteúdo iria no HTML
 * dentro de um bloco oculto, exibido só via JavaScript; por isso a validação de navegação instantânea fica desligada.
 */
export const instant = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

function priceLine(product: Product) {
  return `${money(product.cashPrice)} à vista no Pix ou ${installmentLabel(product)}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name} | ${STORE.name}`;
  const description = `${priceLine(product)} ${product.summary}`;
  const path = productPath(product);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: false, follow: true },
    openGraph: {
      title, description, type: "website", locale: "pt_BR", siteName: STORE.name, url: path,
      images: [{ url: `${path}/imagem`, width: 1200, height: 630, alt: `${product.name}: ${priceLine(product)}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${path}/imagem`] },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const path = productPath(product);
  const together = goesWith(product.slug);
  const similar = similarTo(product, together);
  const askMessage = `Olá! Tenho interesse neste produto do catálogo:\n*${product.name}* (cód. ${product.sku})\n${money(product.cashPrice)} à vista\n${SITE}${path}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: product.sku,
          description: product.summary,
          category: category.name,
          brand: { "@type": "Brand", name: product.brand },
          image: `${SITE}${path}/imagem`,
          url: `${SITE}${path}`,
          offers: {
            "@type": "Offer",
            price: (product.cashPrice / 100).toFixed(2),
            priceCurrency: "BRL",
            url: `${SITE}${path}`,
            seller: { "@type": "Organization", name: STORE.name },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Catálogo", item: `${SITE}${STORE.basePath}` },
            { "@type": "ListItem", position: 2, name: category.name, item: `${SITE}${STORE.basePath}/categoria/${category.slug}` },
            { "@type": "ListItem", position: 3, name: product.name, item: `${SITE}${path}` },
          ],
        }}
      />

      <div className={s.wrap}>
        <ol className={s.crumbs} aria-label="Você está em">
          <li><Link href={STORE.basePath}>Catálogo</Link></li>
          <li><Link href={`${STORE.basePath}/categoria/${category.slug}`}>{category.name}</Link></li>
          <li aria-current="page">{product.name}</li>
        </ol>

        <div className={s.product}>
          <div className={s.productMedia}>
            <ProductArt product={product} size="large" priority />
          </div>

          <div>
            <p className={s.productMeta}>{product.brand} · Cód. {product.sku} · Vendido por {product.unit}</p>
            <h1 className={s.productTitle}>{product.name}</h1>
            <p className={s.productSummary}>{product.summary}</p>

            <PriceBlock product={product} />
            {product.heavy && (
              <p className={s.heavyNote}>
                <Weight size={18} aria-hidden="true" />
                <span>Produto pesado: frete de {money(STORE.heavyFreight)} na entrega. Retirando na loja, não tem frete.</span>
              </p>
            )}

            <AddToCart key={product.slug} product={product} />

            <a className={s.ask} href={storeWhatsApp(askMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" />Tirar dúvida sobre este produto
              <span className={s.srOnly}> pelo WhatsApp (abre em nova aba)</span>
            </a>

            <section className={s.specs} aria-labelledby="ficha-tecnica">
              <h2 id="ficha-tecnica">Ficha técnica</h2>
              <dl>
                <div><dt>Marca</dt><dd>{product.brand}</dd></div>
                {product.specs.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </section>

            <SharePanel product={product} imagePath={`${path}/imagem`} />
          </div>
        </div>

        <ProductRow id="leve-junto" title="Leve junto" products={together} />
        <ProductRow id="parecidos" title={`Veja também em ${category.name.toLowerCase()}`} products={similar} />

        <p className={s.notice}>
          <Info size={18} aria-hidden="true" />
          <span>Catálogo para consulta: monte o carrinho e combine o pedido com a loja pelo WhatsApp.</span>
        </p>
      </div>
    </>
  );
}
