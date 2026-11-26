"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Hammer, MapPin, MessageCircle, ShoppingCart, type LucideIcon } from "lucide-react";
import { CATEGORIES, STORE, cartPath, storeWhatsApp } from "./catalog-data";
import { useCart } from "./cart-store";
import { ICONS } from "./ProductArt";
import s from "./ferragem.module.css";

/** Logo da loja ou, sem logo, ícone com nome e slogan. */
function Brand() {
  if (STORE.logo) {
    return (
      <Image
        src={STORE.logo.src}
        width={STORE.logo.width}
        height={STORE.logo.height}
        alt={`${STORE.name}, ${STORE.tagline.toLowerCase()}`}
        className={s.logo}
        priority
        unoptimized
      />
    );
  }
  return (
    <>
      <span className={s.mark} aria-hidden="true">
        <Hammer size={20} strokeWidth={2.25} />
      </span>
      <span className={s.brandText}>
        <span className={s.brandName}>{STORE.name}</span>
        <span className={s.brandTag}>{STORE.tagline}</span>
      </span>
    </>
  );
}

/** Atalho do carrinho com o total de unidades. */
function CartLink() {
  const count = useCart().items.reduce((sum, item) => sum + item.qty, 0);
  const current = usePathname() === cartPath;
  const units = `${count} ${count === 1 ? "unidade" : "unidades"}`;
  return (
    <>
      <Link href={cartPath} className={s.cartButton} aria-current={current ? "page" : undefined}>
        <ShoppingCart size={20} aria-hidden="true" />
        <span className={s.cartLabel}>Carrinho</span>
        {count > 0 && (
          <span className={s.cartCount}>
            {count > 999 ? "999+" : count}
            <span className={s.srOnly}> {count === 1 ? "unidade" : "unidades"}</span>
          </span>
        )}
      </Link>
      <span className={s.srOnly} role="status">{count > 0 ? `Carrinho com ${units}` : ""}</span>
    </>
  );
}

export function StoreHeader() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <Link href={STORE.basePath} className={s.brand} aria-label={STORE.logo ? `${STORE.name}, início do catálogo` : undefined}>
          <Brand />
        </Link>
        {(STORE.city || STORE.hours) && (
          <ul className={s.headerInfo}>
            {STORE.city && <li><MapPin size={15} aria-hidden="true" />{STORE.city}</li>}
            {STORE.hours && <li><Clock size={15} aria-hidden="true" />{STORE.hours}</li>}
          </ul>
        )}
        <a className={s.waButton} href={storeWhatsApp(`Olá! Vim pelo catálogo da ${STORE.name} e quero tirar uma dúvida.`)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} aria-hidden="true" />
          <span>Falar com a loja</span>
          <span className={s.srOnly}> pelo WhatsApp (abre em nova aba)</span>
        </a>
        <CartLink />
      </div>
      <CategoryNav />
    </header>
  );
}

function CategoryNav() {
  const pathname = usePathname();
  const items: { href: string; label: string; icon: LucideIcon | null }[] = [
    { href: STORE.basePath, label: "Todos", icon: null },
    ...CATEGORIES.map((category) => ({ href: `${STORE.basePath}/categoria/${category.slug}`, label: category.short, icon: ICONS[category.icon] })),
  ];
  return (
    <nav className={s.catNav} aria-label="Categorias">
      <ul className={s.catList}>
        {items.map(({ href, label, icon: Icon }) => {
          const current = pathname === href;
          return (
            <li key={href}>
              <Link href={href} className={s.catLink} aria-current={current ? "page" : undefined}>
                {Icon && <Icon size={16} aria-hidden="true" />}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function StoreFooter() {
  const place = [STORE.address, STORE.city].filter(Boolean).join(" · ");
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div>
          <p className={s.footerName}>{STORE.name}</p>
          <p>{STORE.tagline}</p>
          {place && <p>{place}</p>}
          {STORE.hours && <p>{STORE.hours}</p>}
          <p>WhatsApp {STORE.whatsappLabel}</p>
        </div>
        <div>
          <p className={s.footerNote}>
            Monte o carrinho e envie o pedido pelo WhatsApp: a loja confirma preço, estoque e entrega.
          </p>
          <p className={s.footerNote}>
            Demonstração criada pela <Link href="/criacao-de-sites">NexuSync</Link>: produtos, marcas e preços são
            ilustrativos e não representam o estoque da loja.
          </p>
        </div>
      </div>
    </footer>
  );
}
