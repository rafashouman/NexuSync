"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PRODUCTS, STORE, getProduct, installmentText, money, orderMessage, productPath, storeWhatsApp } from "./catalog-data";
import { NOTE_MAX, clearCart, setNote, setQuantity, useCart, useHydrated } from "./cart-store";
import { ProductArt } from "./ProductArt";
import { ProductRow } from "./ProductRow";
import { QuantityStepper } from "./QuantityStepper";
import { forCart } from "./suggestions";
import s from "./ferragem.module.css";

export function CartView() {
  const { items, note } = useCart();
  const hydrated = useHydrated();
  const lines = items.map((item) => ({ product: getProduct(item.slug)!, qty: item.qty }));

  if (!hydrated) {
    return (
      <div className={s.cartEmpty}>
        <h1 className={s.cartTitle}>Seu carrinho</h1>
        <p>Abrindo o carrinho…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <div className={s.cartEmpty}>
          <h1 className={s.cartTitle}>Seu carrinho está vazio</h1>
          <p>Adicione produtos do catálogo e envie tudo de uma vez para a loja.</p>
          <Link href={STORE.basePath} className={s.primary}>Ver o catálogo</Link>
        </div>
        <ProductRow id="destaques" title="Destaques do catálogo" products={PRODUCTS.filter((product) => product.badge).slice(0, 4)} />
      </>
    );
  }

  const cashTotal = lines.reduce((sum, line) => sum + line.product.cashPrice * line.qty, 0);
  const cardTotal = lines.reduce((sum, line) => sum + line.product.cardPrice * line.qty, 0);
  const units = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <>
      <h1 className={s.cartTitle}>Seu carrinho</h1>

      <div className={s.cart}>
        <ul className={s.cartList}>
          {lines.map(({ product, qty }) => (
            <li key={product.slug} className={s.cartItem}>
              <div className={s.cartThumb} aria-hidden="true">
                <ProductArt product={product} />
              </div>
              <div className={s.cartInfo}>
                <h2><Link href={productPath(product)}>{product.name}</Link></h2>
                <p>Cód. {product.sku} · {money(product.cashPrice)} à vista por {product.unit}</p>
                <div className={s.cartRow}>
                  <QuantityStepper qty={qty} name={product.name} removable onChange={(next) => setQuantity(product.slug, next)} />
                  <strong>{money(product.cashPrice * qty)}</strong>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section className={s.checkout} aria-labelledby="resumo-pedido">
          <h2 id="resumo-pedido">Resumo do pedido</h2>
          <dl aria-live="polite">
            <div>
              <dt>{units === 1 ? "1 unidade" : `${units} unidades`}, à vista no Pix</dt>
              <dd className={s.cashTotal}>{money(cashTotal)}</dd>
            </div>
            <div>
              <dt>No cartão</dt>
              <dd>
                {installmentText(cardTotal)}
                <small>total {money(cardTotal)}</small>
              </dd>
            </div>
          </dl>

          <label htmlFor="observacao-pedido">Observação (opcional)</label>
          <textarea
            id="observacao-pedido"
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex.: furadeira em 220 V; quero entrega"
          />

          <a className={s.order} href={storeWhatsApp(orderMessage(lines, note))} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={22} aria-hidden="true" />Fazer pedido
            <span className={s.srOnly}> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <p className={s.checkoutNote}>
            O pedido abre pronto no WhatsApp {STORE.whatsappLabel}; é só tocar em enviar. A loja confirma estoque, valores
            e entrega.
          </p>

          <div className={s.checkoutLinks}>
            <Link href={STORE.basePath}>Continuar comprando</Link>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Esvaziar o carrinho?")) clearCart();
              }}
            >
              Esvaziar carrinho
            </button>
          </div>
        </section>
      </div>

      <ProductRow id="complete" title="Complete o seu pedido" products={forCart(items.map((item) => item.slug))} />
    </>
  );
}
