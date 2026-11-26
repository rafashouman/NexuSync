"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { cartPath, type Product } from "./catalog-data";
import { addToCart, useCart } from "./cart-store";
import { QuantityStepper } from "./QuantityStepper";
import s from "./ferragem.module.css";

const useQuantityInCart = (slug: string) => useCart().items.find((item) => item.slug === slug)?.qty ?? 0;

/** Botão curto do card: soma uma unidade sem sair da lista. */
export function QuickAdd({ product }: { product: Product }) {
  const inCart = useQuantityInCart(product.slug);
  return (
    <button type="button" className={s.quickAdd} onClick={() => addToCart(product.slug)}>
      <ShoppingCart size={16} aria-hidden="true" />
      <span>Adicionar</span>
      <span className={s.srOnly}> {product.name} ao carrinho</span>
      {inCart > 0 && (
        <span className={s.quickCount}>
          {inCart}
          <span className={s.srOnly}> no carrinho</span>
        </span>
      )}
    </button>
  );
}

/** Quantidade e botão da página do produto. */
export function AddToCart({ product }: { product: Product }) {
  const inCart = useQuantityInCart(product.slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className={s.buy}>
      <div className={s.buyRow}>
        <QuantityStepper qty={qty} name={product.name} onChange={setQty} />
        <button
          type="button"
          className={s.primary}
          onClick={() => {
            addToCart(product.slug, qty);
            setAdded(true);
            setQty(1);
          }}
        >
          <ShoppingCart size={20} aria-hidden="true" />Adicionar ao carrinho
        </button>
      </div>
      <p className={s.buyStatus} role="status">
        {inCart > 0 && (
          <>
            <Check size={18} aria-hidden="true" />
            <span>
              {added ? "Adicionado. " : ""}Você tem {inCart} no carrinho. <Link href={cartPath}>Ver carrinho</Link>
            </span>
          </>
        )}
      </p>
    </div>
  );
}
