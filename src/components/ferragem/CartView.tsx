"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { Check, LocateFixed, MapPin, MessageCircle, Store, Truck, Weight } from "lucide-react";
import {
  PRODUCTS, STORE, deliveryErrors, freightFor, getProduct, installmentText, mapsLink, money, orderMessage, productPath, storeWhatsApp,
} from "./catalog-data";
import { ADDRESS_MAX, NOTE_MAX, clearCart, setDelivery, setNote, setQuantity, useCart, useHydrated } from "./cart-store";
import { ProductArt } from "./ProductArt";
import { ProductRow } from "./ProductRow";
import { QuantityStepper } from "./QuantityStepper";
import { forCart } from "./suggestions";
import s from "./ferragem.module.css";

type Locating = "idle" | "busy" | "denied" | "unavailable";

export function CartView() {
  const { items, note, delivery } = useCart();
  const hydrated = useHydrated();
  const [showErrors, setShowErrors] = useState(false);
  const [locating, setLocating] = useState<Locating>("idle");
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

  const heavy = lines.filter((line) => line.product.heavy);
  const freight = freightFor(lines, delivery.mode);
  const cashItems = lines.reduce((sum, line) => sum + line.product.cashPrice * line.qty, 0);
  const cashTotal = cashItems + freight;
  const cardTotal = lines.reduce((sum, line) => sum + line.product.cardPrice * line.qty, 0) + freight;
  const units = lines.reduce((sum, line) => sum + line.qty, 0);
  const errors = deliveryErrors(delivery);
  const blocked = Object.keys(errors).length > 0;
  const map = delivery.mode === "entrega" ? mapsLink(delivery) : null;
  const show = (key: keyof typeof errors) => (showErrors ? errors[key] : undefined);

  function send(event: MouseEvent<HTMLAnchorElement>) {
    if (!blocked) return;
    event.preventDefault();
    setShowErrors(true);
    const first = errors.mode ? "entrega-modo-entrega" : errors.street ? "entrega-rua" : "entrega-bairro";
    document.getElementById(first)?.focus();
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setLocating("unavailable");
      return;
    }
    setLocating("busy");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDelivery({ coords: { lat: coords.latitude, lng: coords.longitude } });
        setLocating("idle");
      },
      (error) => setLocating(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

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
                {product.heavy && (
                  <p className={s.heavyTag}><Weight size={14} aria-hidden="true" />Produto pesado: tem frete na entrega</p>
                )}
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

          <fieldset className={s.receive} aria-describedby={show("mode") ? "erro-modo" : undefined}>
            <legend>Como você quer receber?</legend>
            <div className={s.receiveOptions}>
              <label className={s.receiveOption}>
                <input
                  id="entrega-modo-entrega"
                  type="radio"
                  name="entrega-modo"
                  checked={delivery.mode === "entrega"}
                  onChange={() => setDelivery({ mode: "entrega" })}
                />
                <Truck size={22} aria-hidden="true" />
                <span>Entrega<small>{heavy.length ? `Frete ${money(STORE.heavyFreight)}` : "Sem frete"}</small></span>
              </label>
              <label className={s.receiveOption}>
                <input type="radio" name="entrega-modo" checked={delivery.mode === "retirada"} onChange={() => setDelivery({ mode: "retirada" })} />
                <Store size={22} aria-hidden="true" />
                <span>Retirar na loja<small>Sem custo</small></span>
              </label>
            </div>
            {show("mode") && <p id="erro-modo" className={s.fieldError}>{errors.mode}</p>}
          </fieldset>

          {delivery.mode === "entrega" && (
            <div className={s.shipTo}>
              <div className={s.addressField}>
                <label htmlFor="entrega-rua">Rua e número</label>
                <input
                  id="entrega-rua"
                  value={delivery.street}
                  maxLength={ADDRESS_MAX}
                  autoComplete="address-line1"
                  placeholder="Ex.: Rua das Acácias, 120"
                  onChange={(event) => setDelivery({ street: event.target.value })}
                  aria-invalid={Boolean(show("street"))}
                  aria-describedby={show("street") ? "erro-rua" : undefined}
                />
                {show("street") && <p id="erro-rua" className={s.fieldError}>{errors.street}</p>}
              </div>
              <div className={s.addressField}>
                <label htmlFor="entrega-bairro">Bairro</label>
                <input
                  id="entrega-bairro"
                  value={delivery.district}
                  maxLength={ADDRESS_MAX}
                  autoComplete="address-level3"
                  onChange={(event) => setDelivery({ district: event.target.value })}
                  aria-invalid={Boolean(show("district"))}
                  aria-describedby={show("district") ? "erro-bairro" : undefined}
                />
                {show("district") && <p id="erro-bairro" className={s.fieldError}>{errors.district}</p>}
              </div>
              <div className={s.addressField}>
                <label htmlFor="entrega-referencia">Complemento ou referência (opcional)</label>
                <input
                  id="entrega-referencia"
                  value={delivery.reference}
                  maxLength={ADDRESS_MAX}
                  placeholder="Ex.: casa dos fundos, portão verde"
                  onChange={(event) => setDelivery({ reference: event.target.value })}
                />
              </div>
              <div className={s.locate}>
                <button type="button" onClick={locate} disabled={locating === "busy"}>
                  {delivery.coords ? <Check size={18} aria-hidden="true" /> : <LocateFixed size={18} aria-hidden="true" />}
                  {locating === "busy" ? "Buscando localização…" : delivery.coords ? "Localização enviada junto" : "Usar minha localização"}
                </button>
                <p role="status">
                  {locating === "denied" && "Sem permissão de localização. O mapa vai pelo endereço digitado."}
                  {locating === "unavailable" && "Não deu para achar a localização. O mapa vai pelo endereço digitado."}
                  {locating === "idle" && !delivery.coords && "Opcional: manda o ponto exato no mapa para o entregador."}
                  {locating === "idle" && delivery.coords && (
                    <>
                      Ponto exato no pedido.{" "}
                      <button type="button" className={s.linkButton} onClick={() => setDelivery({ coords: null })}>Tirar</button>
                    </>
                  )}
                </p>
                {map && (
                  <a href={map} target="_blank" rel="noopener noreferrer" className={s.mapPreview}>
                    <MapPin size={16} aria-hidden="true" />Conferir no Google Maps<span className={s.srOnly}> (abre em nova aba)</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <dl aria-live="polite">
            <div>
              <dt>{units === 1 ? "1 unidade" : `${units} unidades`}, à vista no Pix</dt>
              <dd>{money(cashItems)}</dd>
            </div>
            {delivery.mode === "entrega" && (
              <div>
                <dt>Frete{heavy.length ? ` (${heavy.map((line) => line.product.name).join(", ")})` : ""}</dt>
                <dd>{freight ? money(freight) : "Grátis"}</dd>
              </div>
            )}
            <div>
              <dt>Total à vista no Pix</dt>
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
          {heavy.length > 0 && delivery.mode !== "entrega" && (
            <p className={s.checkoutNote}>
              Frete de {money(STORE.heavyFreight)} só na entrega, por causa de produto pesado. Na retirada não há frete.
            </p>
          )}

          <label htmlFor="observacao-pedido">Observação (opcional)</label>
          <textarea
            id="observacao-pedido"
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex.: furadeira em 220 V; entregar depois das 14 h"
          />

          <a
            className={s.order}
            href={storeWhatsApp(orderMessage(lines, note, delivery))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={send}
            aria-disabled={blocked || undefined}
          >
            <MessageCircle size={22} aria-hidden="true" />Fazer pedido
            <span className={s.srOnly}> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <p className={s.checkoutNote}>
            O pedido abre pronto no WhatsApp {STORE.whatsappLabel}
            {delivery.mode === "entrega" ? ", com o endereço e o link do mapa" : ""}; é só tocar em enviar. A loja confirma
            estoque, valores e {delivery.mode === "retirada" ? "quando retirar" : "o prazo de entrega"}.
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
