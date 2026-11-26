import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES, PRODUCTS, STORE, productPath, type Category } from "./catalog-data";
import { CatalogBrowser } from "./CatalogBrowser";
import { ICONS } from "./ProductArt";
import s from "./ferragem.module.css";

const SITE = "https://nexusync.online";

/** Página do catálogo: todas as categorias (sem `category`) ou uma delas. */
export function CatalogPage({ category }: { category?: Category }) {
  const products = category ? PRODUCTS.filter((product) => product.category === category.slug) : PRODUCTS;
  const path = category ? `${STORE.basePath}/categoria/${category.slug}` : STORE.basePath;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: category ? `${category.name} | ${STORE.name}` : `Catálogo ${STORE.name}`,
          url: `${SITE}${path}`,
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE}${productPath(product)}`,
            name: product.name,
          })),
        }}
      />
      {!category && (
        <section className={s.banner} aria-labelledby="titulo-catalogo">
          <Image src="/images/ferragem/hero-obra.webp" alt="" fill sizes="100vw" loading="eager" fetchPriority="high" />
          <div className={s.bannerContent}>
            <p className={s.kicker}>Catálogo {STORE.name}</p>
            <h1 id="titulo-catalogo" className={s.title}>Tudo para a obra e para a casa</h1>
            <p className={s.lead}>
              Ferramentas, material elétrico e hidráulico, tintas e construção. Veja o preço à vista e parcelado e
              mande o produto para a loja ou para quem vai comprar com você.
            </p>
          </div>
        </section>
      )}
      <div className={s.wrap}>
        <section className={s.hero} aria-labelledby={category ? "titulo-catalogo" : "titulo-produtos"}>
          {category ? (
            <>
              <ol className={s.crumbs} aria-label="Você está em">
                <li><Link href={STORE.basePath}>Catálogo</Link></li>
                <li aria-current="page">{category.name}</li>
              </ol>
              <h1 id="titulo-catalogo" className={s.title} style={{ marginTop: 12 }}>{category.name}</h1>
              <p className={s.lead}>Preço à vista no Pix e parcelado no cartão em cada produto. Abra um item para enviar o link a quem precisa.</p>
            </>
          ) : (
            <>
              <ul className={s.catTiles}>
                {CATEGORIES.map((item) => {
                  const Icon = ICONS[item.icon];
                  const total = PRODUCTS.filter((product) => product.category === item.slug).length;
                  return (
                    <li key={item.slug}>
                      <Link href={`${STORE.basePath}/categoria/${item.slug}`} className={s.catTile}>
                        <span className={s.catTileIcon} style={{ background: item.tone }}><Icon size={20} aria-hidden="true" /></span>
                        <span>{item.name}<small>{total} produtos</small></span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h2 id="titulo-produtos" className={s.sectionTitle}>Todos os produtos</h2>
            </>
          )}
        </section>
        <CatalogBrowser products={products} scopeLabel={category ? category.name.toLowerCase() : "todo o catálogo"} />
      </div>
    </>
  );
}
