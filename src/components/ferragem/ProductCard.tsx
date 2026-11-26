import Link from "next/link";
import { discountPercent, installmentLabel, money, productPath, type Product } from "./catalog-data";
import { ProductArt } from "./ProductArt";
import s from "./ferragem.module.css";

/** Card do produto com os três preços. O cartão todo é o link para a página do produto. */
export function ProductCard({ product, headingLevel = 3 }: { product: Product; headingLevel?: 2 | 3 }) {
  const off = discountPercent(product);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={s.card}>
      <div className={s.cardArt}>
        <ProductArt product={product} />
        {(product.badge || off > 0) && (
          <span className={s.cardBadge}>{off > 0 ? `${off}% off no Pix` : product.badge}</span>
        )}
      </div>
      <div className={s.cardBody}>
        <p className={s.cardBrand}>{product.brand}</p>
        <Heading className={s.cardName}>
          <Link href={productPath(product)} className={s.cardLink}>{product.name}</Link>
        </Heading>
        <PriceBlock product={product} compact />
      </div>
    </article>
  );
}

export function PriceBlock({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <dl className={compact ? s.pricesCompact : s.prices}>
      {product.listPrice ? (
        <div className={s.priceFrom}>
          <dt>{compact ? "De" : "Preço de"}</dt>
          <dd><s>{money(product.listPrice)}</s></dd>
        </div>
      ) : null}
      <div className={s.priceCash}>
        <dt>À vista no Pix</dt>
        <dd>{money(product.cashPrice)}</dd>
      </div>
      <div className={s.priceCard}>
        <dt>{compact ? "ou" : "Parcelado no cartão"}</dt>
        <dd>{installmentLabel(product)}{!compact && installmentLabel(product).includes("x de") ? ` (total ${money(product.cardPrice)})` : ""}</dd>
      </div>
    </dl>
  );
}
