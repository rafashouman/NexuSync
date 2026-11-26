"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Plus, Search } from "lucide-react";
import { CATEGORIES, ITEMS, itemPath, money, type MenuItem } from "./menu-data";
import { addToCart } from "./cart-store";
import { ItemArt } from "./ItemArt";
import s from "./lanchonete.module.css";

const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function MenuBrowser() {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<{ slug: string; message: string } | null>(null);
  const [active, setActive] = useState(CATEGORIES[0].slug);
  const term = normalize(query.trim());
  const sections = CATEGORIES.map((category) => ({
    category,
    items: ITEMS.filter(
      (item) => item.category === category.slug && (!term || normalize(`${item.name} ${item.description} ${category.name}`).includes(term)),
    ),
  })).filter((section) => section.items.length > 0);

  // Marca na barra a categoria que está na tela.
  useEffect(() => {
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting ? entry.boundingClientRect.top : Infinity);
        const visible = [...seen].filter(([, top]) => top !== Infinity).sort((a, b) => a[1] - b[1]);
        if (visible[0]) setActive(visible[0][0]);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    document.querySelectorAll("[data-menu-section]").forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [term]);

  useEffect(() => {
    const tab = document.getElementById(`aba-${active}`);
    const list = tab?.closest("ul");
    if (!tab || !list) return;
    list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  function quickAdd(item: MenuItem) {
    const ok = addToCart({ slug: item.slug, qty: 1, choices: [], addons: [], note: "" });
    setAdded({ slug: item.slug, message: ok ? `${item.name} está na sacola.` : "A sacola está cheia." });
  }

  return (
    <>
      <div className={s.toolbar} id="cardapio">
        <div className={s.wrap}>
          <div className={s.search}>
            <Search size={18} aria-hidden="true" />
            <label htmlFor="busca-cardapio" className={s.srOnly}>Buscar no cardápio</label>
            <input
              id="busca-cardapio"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar pastel, x-tudo, suco…"
              autoComplete="off"
            />
          </div>
          <nav aria-label="Categorias do cardápio">
            <ul className={s.tabs}>
              {sections.map(({ category }) => (
                <li key={category.slug}>
                  <a id={`aba-${category.slug}`} href={`#${category.slug}`} aria-current={active === category.slug ? "true" : undefined}>
                    {category.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className={s.wrap}>
        <p className={s.srOnly} role="status">{added?.message}</p>
        {sections.length === 0 && (
          <div className={s.empty}>
            <p>Nada no cardápio com “{query.trim()}”.</p>
            <button type="button" className={s.ghost} onClick={() => setQuery("")}>Ver o cardápio inteiro</button>
          </div>
        )}
        {sections.map(({ category, items }) => (
          <section key={category.slug} id={category.slug} data-menu-section className={s.section} aria-labelledby={`titulo-${category.slug}`}>
            <h2 id={`titulo-${category.slug}`} className={s.sectionTitle}>
              <span className={s.sectionCount} aria-hidden="true">{String(items.length).padStart(2, "0")}</span>
              {category.name}
            </h2>
            <ul className={s.list}>
              {items.map((item, index) => {
                const needsChoice = Boolean(item.choices?.length);
                const done = added?.slug === item.slug;
                return (
                  <li key={item.slug} className={s.row} data-reveal data-spot style={{ "--i": index % 2 } as React.CSSProperties}>
                    <ItemArt item={item} />
                    <div className={s.rowText}>
                      <h3><Link href={itemPath(item)} className={s.rowLink}>{item.name}</Link></h3>
                      <p>{item.description}</p>
                      <div className={s.rowFoot}>
                        <span className={s.price}>{money(item.price)}</span>
                        {needsChoice ? (
                          <Link href={itemPath(item)} className={s.choose} aria-label={`Escolher opções de ${item.name}`}>Escolher</Link>
                        ) : (
                          <button type="button" className={s.add} onClick={() => quickAdd(item)} aria-label={`Adicionar ${item.name} à sacola`}>
                            {done ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
