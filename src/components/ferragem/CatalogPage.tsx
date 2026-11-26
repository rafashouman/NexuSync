import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES, PRODUCTS, STORE, discountPercent, productPath, storeWhatsApp, type Category } from "./catalog-data";
import { CatalogBrowser } from "./CatalogBrowser";
import { HeroDeal } from "./HeroDeal";
import { ICONS } from "./ProductArt";
import s from "./ferragem.module.css";

const SITE = "https://nexusync.online";

const TICKER = ["À vista no Pix", `Até ${STORE.maxInstallments}x no cartão`, "Pedido pronto no WhatsApp", ...CATEGORIES.map((category) => category.name)];

/** Página do catálogo: todas as categorias (sem `category`) ou uma delas. */
export function CatalogPage({ category }: { category?: Category }) {
  const products = category ? PRODUCTS.filter((product) => product.category === category.slug) : PRODUCTS;
  const path = category ? `${STORE.basePath}/categoria/${category.slug}` : STORE.basePath;
  const deals = PRODUCTS.filter((product) => product.image && discountPercent(product) > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 6);
  const categoryIndex = category ? CATEGORIES.findIndex((item) => item.slug === category.slug) + 1 : 0;
  const CategoryIcon = category ? ICONS[category.icon] : null;

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
      {category ? (
        <section className={s.catHero} aria-labelledby="titulo-catalogo">
          <div className={s.wrap}>
            <ol className={s.crumbs} aria-label="Você está em">
              <li><Link href={STORE.basePath}>Catálogo</Link></li>
              <li aria-current="page">{category.name}</li>
            </ol>
            <div className={s.catHeroRow}>
              <p className={s.catHeroIndex} aria-hidden="true">{String(categoryIndex).padStart(2, "0")}</p>
              <div>
                <h1 id="titulo-catalogo" className={s.title}>{category.name}</h1>
                <p className={s.lead}>
                  {products.length} produtos com preço à vista no Pix e parcelado no cartão. Abra um item para enviar o
                  link a quem precisa.
                </p>
              </div>
              {CategoryIcon && <CategoryIcon className={s.catHeroIcon} strokeWidth={1} aria-hidden="true" />}
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className={s.banner} aria-labelledby="titulo-catalogo">
            <div className={s.blueprint} aria-hidden="true" />
            <div className={s.bannerGrid}>
              <div className={s.bannerContent}>
                <p className={s.kicker}>
                  <span aria-hidden="true">{"//"}</span> Catálogo {STORE.name} · {PRODUCTS.length} produtos
                </p>
                <h1 id="titulo-catalogo" className={s.title}>
                  <span className={s.titleLine}>Tudo pra</span>{" "}
                  <span className={s.titleHot}>obra</span>{" "}
                  <span className={s.titleOutline}>e pra casa.</span>
                </h1>
                <p className={s.lead}>
                  Ferramentas, material elétrico e hidráulico, tintas e construção. Veja o preço à vista e parcelado e
                  mande o produto para a loja ou para quem vai comprar com você.
                </p>
                <div className={s.ctaRow}>
                  <a href="#produtos" className={s.cta}>
                    <span>Ver produtos</span>
                    <span className={s.ctaArrow} aria-hidden="true"><ArrowDown size={20} /></span>
                  </a>
                  <a className={s.ctaGhost} href={storeWhatsApp(`Olá! Vim pelo catálogo da ${STORE.name} e quero tirar uma dúvida.`)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" />
                    <span>Falar com a loja</span>
                    <span className={s.srOnly}> pelo WhatsApp (abre em nova aba)</span>
                  </a>
                </div>
                <dl className={s.stats}>
                  <div><dt>Produtos</dt><dd>{PRODUCTS.length}</dd></div>
                  <div><dt>Categorias</dt><dd>{CATEGORIES.length}</dd></div>
                  <div><dt>No cartão</dt><dd>{STORE.maxInstallments}x</dd></div>
                </dl>
              </div>
              <div className={s.bannerMedia} data-parallax>
                <div className={s.bannerPhoto}>
                  <Image src="/images/ferragem/hero-obra.webp" alt="" fill sizes="(min-width: 900px) 46vw, 100vw" loading="eager" fetchPriority="high" />
                </div>
                <span className={s.tape} aria-hidden="true" />
                <span className={s.ruler} aria-hidden="true" />
                {deals.length > 0 && <HeroDeal deals={deals} />}
              </div>
            </div>
          </section>

          <div className={s.ticker} aria-hidden="true">
            <div className={s.tickerTrack}>
              {[0, 1].map((copy) => (
                <span key={copy}>
                  {TICKER.map((word) => (
                    <span key={word} className={s.tickerItem}>{word}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={s.wrap}>
        {!category && (
          <section className={s.hero} aria-labelledby="titulo-departamentos">
            <div className={s.sectionHead}>
              <p className={s.sectionIndex} aria-hidden="true">01</p>
              <h2 id="titulo-departamentos" className={s.sectionTitle}>Departamentos</h2>
            </div>
            <ul className={s.catTiles}>
              {CATEGORIES.map((item, index) => {
                const Icon = ICONS[item.icon];
                const total = PRODUCTS.filter((product) => product.category === item.slug).length;
                return (
                  <li key={item.slug} data-reveal style={{ "--i": index % 4 } as React.CSSProperties}>
                    <Link href={`${STORE.basePath}/categoria/${item.slug}`} className={s.catTile} data-spot>
                      <span className={s.catTileNum} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <Icon className={s.catTileIcon} size={30} strokeWidth={1.5} aria-hidden="true" />
                      <span className={s.catTileName}>{item.name}<small>{total} produtos</small></span>
                      <span className={s.catTileArrow} aria-hidden="true"><ArrowUpRight size={18} /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        <section id="produtos" className={s.products} aria-labelledby="titulo-produtos">
          <div className={s.sectionHead}>
            <p className={s.sectionIndex} aria-hidden="true">{category ? "↓" : "02"}</p>
            <h2 id="titulo-produtos" className={s.sectionTitle}>{category ? "Produtos" : "Todos os produtos"}</h2>
          </div>
          <CatalogBrowser products={products} scopeLabel={category ? category.name.toLowerCase() : "todo o catálogo"} />
        </section>
      </div>
    </>
  );
}
