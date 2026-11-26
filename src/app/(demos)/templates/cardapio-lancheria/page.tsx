import { JsonLd } from "@/components/JsonLd";
import { CartBar } from "@/components/lanchonete/CartBar";
import { MenuHeader } from "@/components/lanchonete/Chrome";
import { MenuBrowser } from "@/components/lanchonete/MenuBrowser";
import { CATEGORIES, ITEMS, STORE, itemPath } from "@/components/lanchonete/menu-data";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const SITE = "https://nexusync.online";

export const metadata = nexuSyncMetadata({
  title: "Cardápio virtual para lanchonete | Demo Lanches da Restinga",
  description:
    "Cardápio online de lanchonete com churrasquinho, sanduíches, pastéis, bebidas e sobremesas. O pedido é registrado e enviado pelo WhatsApp.",
  path: STORE.basePath,
  noindex: true,
  image: "/images/lanchonete/x-tudo.jpg",
});

export default function CardapioPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Menu",
          name: `Cardápio ${STORE.name}`,
          url: `${SITE}${STORE.basePath}`,
          inLanguage: "pt-BR",
          hasMenuSection: CATEGORIES.map((category) => ({
            "@type": "MenuSection",
            name: category.name,
            hasMenuItem: ITEMS.filter((item) => item.category === category.slug).map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
              url: `${SITE}${itemPath(item)}`,
              offers: { "@type": "Offer", price: (item.price / 100).toFixed(2), priceCurrency: "BRL" },
            })),
          })),
        }}
      />
      <MenuHeader />
      <MenuBrowser />
      <CartBar />
    </>
  );
}
