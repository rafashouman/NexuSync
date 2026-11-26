import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CartBar } from "@/components/lanchonete/CartBar";
import { TopBar } from "@/components/lanchonete/Chrome";
import { ItemArt } from "@/components/lanchonete/ItemArt";
import { ItemConfigurator } from "@/components/lanchonete/ItemConfigurator";
import { ShareItem } from "@/components/lanchonete/ShareItem";
import { ITEMS, STORE, getCategory, getItem, itemPath, money } from "@/components/lanchonete/menu-data";
import s from "@/components/lanchonete/lanchonete.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const SITE = "https://nexusync.online";

type Props = { params: Promise<{ slug: string }> };

/**
 * Todas as páginas são pré-renderizadas. Com <Suspense> em volta de `params`, o conteúdo iria no HTML
 * dentro de um bloco oculto, exibido só via JavaScript; por isso a validação de navegação instantânea fica desligada.
 */
export const instant = false;

export function generateStaticParams() {
  return ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const item = getItem((await params).slug);
  if (!item) return {};
  return nexuSyncMetadata({
    title: `${item.name} ${money(item.price)} | ${STORE.name}`,
    description: `${item.description} Peça pelo cardápio e confirme no WhatsApp.`,
    path: itemPath(item),
    noindex: true,
    image: item.image ?? "/images/lanchonete/x-tudo.jpg",
  });
}

export default async function ItemPage({ params }: Props) {
  const item = getItem((await params).slug);
  if (!item) notFound();
  const category = getCategory(item.category)!;
  const url = `${SITE}${itemPath(item)}`;
  const related = ITEMS.filter((other) => other.category === item.category && other.slug !== item.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          url,
          ...(item.image ? { image: `${SITE}${item.image}` } : {}),
          offers: { "@type": "Offer", price: (item.price / 100).toFixed(2), priceCurrency: "BRL", url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Cardápio", item: `${SITE}${STORE.basePath}` },
            { "@type": "ListItem", position: 2, name: item.name, item: url },
          ],
        }}
      />
      <TopBar />
      <div className={s.wrap}>
        <div className={s.item}>
          <div className={s.itemMedia}>
            <ItemArt item={item} large />
          </div>
          <div>
            <p className={s.category}>
              <Link href={`${STORE.basePath}#${category.slug}`}>{category.name}</Link>
            </p>
            <h1 className={s.pageTitle}>{item.name}</h1>
            <p className={s.description}>{item.description}</p>
            <p><span className={`${s.price} ${s.priceLarge}`}>{money(item.price)}</span></p>
            <ItemConfigurator key={item.slug} slug={item.slug} />
            <ShareItem name={item.name} url={url} />
          </div>
        </div>

        <section className={s.related} aria-labelledby="relacionados">
          <h2 id="relacionados" className={s.sectionTitle}>Mais em {category.short.toLowerCase()}</h2>
          <ul className={s.list}>
            {related.map((other) => (
              <li key={other.slug} className={s.row}>
                <ItemArt item={other} />
                <div className={s.rowText}>
                  <h3><Link href={itemPath(other)} className={s.rowLink}>{other.name}</Link></h3>
                  <p>{other.description}</p>
                  <div className={s.rowFoot}><span className={s.price}>{money(other.price)}</span></div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <CartBar />
    </>
  );
}
