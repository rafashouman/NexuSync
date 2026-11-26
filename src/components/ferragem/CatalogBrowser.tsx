"use client";

import { useDeferredValue, useId, useState } from "react";
import { Search, X } from "lucide-react";
import { discountPercent, type Product } from "./catalog-data";
import { ProductCard } from "./ProductCard";
import s from "./ferragem.module.css";

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Sort = "relevancia" | "menor-preco" | "maior-desconto";

/** Busca, filtro de ofertas e ordenação sobre a lista recebida (todas ou uma categoria). */
export function CatalogBrowser({ products, scopeLabel }: { products: Product[]; scopeLabel: string }) {
  const [query, setQuery] = useState("");
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sort, setSort] = useState<Sort>("relevancia");
  const deferred = useDeferredValue(query);
  const ids = useId();

  const terms = normalize(deferred).split(/\s+/).filter(Boolean);
  const list = products
    .filter((product) => {
      if (onlyDeals && discountPercent(product) === 0) return false;
      const haystack = normalize(`${product.name} ${product.brand} ${product.sku} ${product.summary}`);
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => {
      if (sort === "menor-preco") return a.cashPrice - b.cashPrice;
      if (sort === "maior-desconto") return discountPercent(b) - discountPercent(a);
      return 0;
    });

  return (
    <div className={s.browser}>
      <div className={s.tools} role="search">
        <div className={s.searchBox}>
          <Search size={18} aria-hidden="true" />
          <label htmlFor={`${ids}-busca`} className={s.srOnly}>Buscar em {scopeLabel}</label>
          <input
            id={`${ids}-busca`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar produto, marca ou código"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca" className={s.clear}>
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <label className={s.toggle}>
          <input type="checkbox" checked={onlyDeals} onChange={(event) => setOnlyDeals(event.target.checked)} />
          <span>Só ofertas</span>
        </label>
        <div className={s.sort}>
          <label htmlFor={`${ids}-ordem`}>Ordenar</label>
          <select id={`${ids}-ordem`} value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
            <option value="relevancia">Destaques</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-desconto">Maior desconto</option>
          </select>
        </div>
      </div>

      <p className={s.count} aria-live="polite">
        {list.length === 1 ? "1 produto" : `${list.length} produtos`} em {scopeLabel}
      </p>

      {list.length ? (
        <ul className={s.grid}>
          {list.map((product, index) => (
            <li key={product.slug} data-reveal style={{ "--i": index % 4 } as React.CSSProperties}><ProductCard product={product} /></li>
          ))}
        </ul>
      ) : (
        <div className={s.empty}>
          <p>{deferred.trim() ? `Nenhum produto encontrado para “${deferred.trim()}”.` : "Nenhuma oferta nesta seção agora."}</p>
          <p>Confira a grafia ou pergunte para a loja: muita coisa ainda não está no catálogo.</p>
        </div>
      )}
    </div>
  );
}
