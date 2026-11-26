import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, Bike, Store, Wallet } from "lucide-react";
import { CATEGORIES, ITEMS, STORE, money, painelPath } from "./menu-data";
import s from "./lanchonete.module.css";

/** Faixa que separa a demonstração da "lanchonete". */
export function DemoBar() {
  return (
    <div className={s.demoBar}>
      <p className={s.wrap}>
        <span>Demonstração NexuSync: lanchonete, preços e fotos são ilustrativos.</span>
        <Link href="/templates">Ver outros modelos</Link>
      </p>
    </div>
  );
}

const HERO_PHOTOS = [
  { slug: "x-tudo", className: s.heroPhotoA },
  { slug: "espeto-carne", className: s.heroPhotoB },
  { slug: "pastel-carne", className: s.heroPhotoC },
];

/** Letreiro aceso da página inicial: nome em neon, fotos que flutuam e o toldo embaixo. */
export function MenuHeader() {
  const photos = HERO_PHOTOS.map((photo) => ({ ...photo, item: ITEMS.find((item) => item.slug === photo.slug) })).filter(
    (photo) => photo.item?.image,
  );
  const marquee = CATEGORIES.map((category) => category.short);
  return (
    <>
      <header className={s.header}>
        <div className={s.glow} aria-hidden="true" />
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className={s.open}><span aria-hidden="true" />Aberto para pedidos</p>
            <h1 className={s.brand}>
              {STORE.name.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className={s.brandWord} style={{ "--d": `${index * 0.18}s` } as React.CSSProperties}>
                  {word}
                </span>
              ))}
            </h1>
            <p className={s.tagline}>{STORE.tagline}</p>
            <ul className={s.facts}>
              <li><Bike size={18} aria-hidden="true" />Entrega {money(STORE.deliveryFee)}</li>
              <li><Store size={18} aria-hidden="true" />Retirada no balcão</li>
              <li><Wallet size={18} aria-hidden="true" />Pix, cartão ou dinheiro</li>
            </ul>
            <a href="#cardapio" className={s.heroCta}>
              <span>Ver o cardápio</span>
              <span className={s.heroCtaArrow} aria-hidden="true"><ArrowDown size={20} /></span>
            </a>
          </div>
          <div className={s.heroArt} data-parallax aria-hidden="true">
            {photos.map(({ slug, className, item }) => (
              <div key={slug} className={`${s.heroPhoto} ${className}`}>
                <Image src={item!.image!} alt="" fill sizes="(min-width: 860px) 280px, 40vw" loading="eager" />
                <span className={s.heroTag}>{money(item!.price)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.marquee} aria-hidden="true">
          <div className={s.marqueeTrack}>
            {[0, 1, 2].map((copy) => (
              <span key={copy}>
                {marquee.map((word) => <span key={word} className={s.marqueeItem}>{word}</span>)}
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className={s.awning} aria-hidden="true" />
    </>
  );
}

/** Cabeçalho curto das páginas internas. */
export function TopBar() {
  return (
    <>
      <header className={s.topBar}>
        <div className={s.wrap}>
          <Link href={STORE.basePath} className={s.back}><ArrowLeft size={20} aria-hidden="true" />Cardápio</Link>
          <span className={s.topBrand}>{STORE.name}</span>
        </div>
      </header>
      <div className={s.awning} aria-hidden="true" />
    </>
  );
}

export function MenuFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <p className={s.footerName}>{STORE.name}</p>
        <p>Pedidos pelo cardápio, confirmados no WhatsApp {STORE.whatsappLabel}.</p>
        <p className={s.footerNote}>
          <Link href={painelPath} prefetch={false}>Área da lanchonete</Link>
        </p>
        <p className={s.footerNote}>
          Demonstração criada pela <Link href="/criacao-de-sites">NexuSync</Link>. A lanchonete é fictícia; preços e fotos
          são ilustrativos.
        </p>
      </div>
    </footer>
  );
}
