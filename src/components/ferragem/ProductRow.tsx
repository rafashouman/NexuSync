import type { Product } from "./catalog-data";
import { ProductCard } from "./ProductCard";
import s from "./ferragem.module.css";

/** Faixa de sugestões com título. Sem produtos, não aparece. */
export function ProductRow({ id, title, products }: { id: string; title: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className={s.related} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ul className={s.grid}>
        {products.map((product, index) => (
          <li key={product.slug} data-reveal style={{ "--i": index % 4 } as React.CSSProperties}><ProductCard product={product} /></li>
        ))}
      </ul>
    </section>
  );
}
