import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Info, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import {
  PRODUCTS, STORE, getCategory, getProduct, installmentLabel, money, productPath, storeWhatsApp, type Product,
} from "@/components/ferragem/catalog-data";
import { PriceBlock, ProductCard } from "@/components/ferragem/ProductCard";
import { ProductArt } from "@/components/ferragem/ProductArt";
import { SharePanel } from "@/components/ferragem/SharePanel";
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
  const related = PRODUCTS.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);
  const orderMessage = `Olá! Tenho interesse neste produto do catálogo:\n*${product.name}* (cód. ${product.sku})\n${money(product.cashPrice)} à vista\n${SITE}${path}`;

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

            <div className={s.ctaRow}>
              <a className={s.ctaWa} href={storeWhatsApp(orderMessage)} target="_blank" rel="noopener noreferrer">
                <span><MessageCircle size={20} aria-hidden="true" />Pedir pelo WhatsApp</span>
                <span className={s.ctaArrow} aria-hidden="true"><ArrowUpRight size={20} /></span>
                <span className={s.srOnly}> (abre em nova aba)</span>
              </a>
            </div>
            <p className={s.ctaNote}>A mensagem já vai com o nome, o código e o link do produto.</p>

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

        {related.length > 0 && (
          <section className={s.related} aria-labelledby="relacionados">
            <h2 id="relacionados">Mais em {category.name.toLowerCase()}</h2>
            <ul className={s.grid}>
              {related.map((item) => (
                <li key={item.slug}><ProductCard product={item} /></li>
              ))}
            </ul>
          </section>
        )}

        <p className={s.notice}>
          <Info size={18} aria-hidden="true" />
          <span>Catálogo para consulta: escolha os produtos e combine o pedido com a loja pelo WhatsApp.</span>
        </p>
      </div>
    </>
  );
}
