"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowDown, Minus, MessageCircle, Plus, Settings2, ShoppingBag, Trash2, X } from "lucide-react";
import { STORE, money, orderMessage, whatsappLink, type Order, type Product } from "./data";
import { useProducts } from "./store";
import { OwnerPanel } from "./OwnerPanel";
import { ProductPhoto } from "./ProductPhoto";
import { DEMO_CONTENT_ID } from "@/components/ui/DemoShell";
import s from "./minicardapio.module.css";

const EMPTY_ORDER: Order = { name: "", mode: "entrega", address: "", payment: "Pix", change: "", note: "" };

export function MiniCardapio() {
  const products = useProducts();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("Tudo");
  const [order, setOrder] = useState<Order>(EMPTY_ORDER);
  const [errors, setErrors] = useState<Partial<Record<"name" | "address", string>>>({});
  const [sent, setSent] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const cartDialog = useRef<HTMLDialogElement>(null);
  const ownerDialog = useRef<HTMLDialogElement>(null);
  const ids = useId();

  const tags = useMemo(() => ["Tudo", ...new Set(products.map((product) => product.tag?.trim()).filter(Boolean) as string[])], [products]);
  const activeFilter = tags.includes(filter) ? filter : "Tudo";
  const visible = activeFilter === "Tudo" ? products : products.filter((product) => product.tag?.trim() === activeFilter);
  const lines = products.filter((product) => !product.soldOut && (cart[product.id] ?? 0) > 0).map((product) => ({ product, qty: cart[product.id] }));
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const withPhoto = products.filter((product) => product.image);
  const heroPhotos = withPhoto.length > 1 ? [withPhoto[0], withPhoto[withPhoto.length - 1]] : withPhoto;

  function change(product: Product, delta: number) {
    setCart((current) => {
      const qty = Math.max(0, Math.min(99, (current[product.id] ?? 0) + delta));
      const next = { ...current, [product.id]: qty };
      if (qty === 0) delete next[product.id];
      return next;
    });
    setStatus(delta > 0 ? `${product.name} na sacola.` : `${product.name}: quantidade atualizada.`);
  }

  function openCart() {
    setSent(null);
    cartDialog.current?.showModal();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (order.name.trim().length < 2) nextErrors.name = "Diga seu nome para a loja saber de quem é o pedido.";
    if (order.mode === "entrega" && order.address.trim().length < 6) nextErrors.address = "Informe rua, número e bairro para a entrega.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(`${ids}-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    const url = whatsappLink(orderMessage(lines, order));
    // Com "noopener" o navegador devolve null mesmo abrindo; por isso a referência é cortada à mão.
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    setSent(opened ? "" : url);
    if (opened) {
      setCart({});
      cartDialog.current?.close();
      setStatus("Pedido aberto no WhatsApp. É só tocar em enviar.");
    }
  }

  const field = (key: keyof Order) => ({
    id: `${ids}-${key}`,
    value: order[key],
    onChange: (event: { target: { value: string } }) => setOrder((current) => ({ ...current, [key]: event.target.value })),
  });

  return (
    <>
      <div className={s.demoBar}>
        <div className={s.wrap}>
          <p><strong>Mini Cardápio NexuSync</strong> · você cadastra os produtos e o pedido chega no seu WhatsApp.</p>
          <button type="button" className={s.ownerButton} onClick={() => ownerDialog.current?.showModal()}>
            <Settings2 size={16} aria-hidden="true" />Testar o modo dono
          </button>
        </div>
      </div>

      <header className={s.hero}>
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className={s.badge}><MessageCircle size={16} aria-hidden="true" />Pedido direto no WhatsApp</p>
            <h1 className={s.title}>
              <span className={s.titleTop}>{STORE.name.split("&")[0].trim()}</span>
              <span className={s.amp} aria-hidden="true">&amp;</span>
              <span className={s.srOnly}> e </span>
              <span className={s.titleBottom}>{STORE.name.split("&")[1]?.trim()}</span>
            </h1>
            <p className={s.lead}>{STORE.tagline}</p>
            <a href="#cardapio" className={s.cta}>
              <span>Montar meu pedido</span>
              <span className={s.ctaArrow} aria-hidden="true"><ArrowDown size={20} /></span>
            </a>
          </div>
          <div className={s.heroArt} data-parallax aria-hidden="true">
            <svg className={s.seal} viewBox="0 0 200 200">
              <defs>
                <path id={`${ids}-circulo`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href={`#${ids}-circulo`}>FEITO NA HORA ✸ GELADO NO COPO ✸ </textPath>
              </text>
            </svg>
            {heroPhotos.map((product, index) => (
              <div key={product.id} className={`${s.sticker} ${index === 0 ? s.stickerA : s.stickerB}`}>
                <ProductPhoto product={product} sizes="(min-width: 860px) 300px, 45vw" />
                <span className={s.stickerPrice}>{money(product.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main id={DEMO_CONTENT_ID}>
      <div className={s.marquee} aria-hidden="true">
        <div className={s.marqueeTrack}>
          {[0, 1, 2].map((copy) => (
            <span key={copy}>
              {products.map((product) => <span key={product.id} className={s.marqueeItem}>{product.name}</span>)}
            </span>
          ))}
        </div>
      </div>

      <div className={s.wrap} id="cardapio">
        <div className={s.menuHead}>
          <h2 className={s.sectionTitle}>Cardápio</h2>
          {tags.length > 2 && (
            <div className={s.chips} role="group" aria-label="Filtrar produtos">
              {tags.map((tag) => (
                <button key={tag} type="button" className={s.chip} aria-pressed={activeFilter === tag} onClick={() => setFilter(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className={s.srOnly} role="status">{status}</p>

        {products.length === 0 ? (
          <div className={s.empty}>
            <p>Nenhum produto cadastrado ainda.</p>
            <button type="button" className={s.ghost} onClick={() => ownerDialog.current?.showModal()}>Cadastrar o primeiro produto</button>
          </div>
        ) : (
          <ul className={s.grid}>
            {visible.map((product, index) => {
              const qty = cart[product.id] ?? 0;
              return (
                <li key={product.id} data-reveal style={{ "--i": index % 3 } as React.CSSProperties}>
                  <article className={s.card} data-sold-out={product.soldOut ? "" : undefined}>
                    <div className={s.cardImg}>
                      <ProductPhoto product={product} sizes="(min-width: 900px) 360px, (min-width: 560px) 50vw, 100vw" />
                      {product.tag && <span className={s.cardTag}>{product.tag}</span>}
                      {product.soldOut && <span className={s.soldOut}>Esgotado hoje</span>}
                    </div>
                    <div className={s.cardBody}>
                      <h3 className={s.cardName}>{product.name}</h3>
                      {product.description && <p className={s.cardText}>{product.description}</p>}
                      <div className={s.cardFoot}>
                        <span className={s.price}>{money(product.price)}</span>
                        {product.soldOut ? null : qty === 0 ? (
                          <button type="button" className={s.add} onClick={() => change(product, 1)}>
                            <Plus size={18} aria-hidden="true" />Pedir<span className={s.srOnly}> {product.name}</span>
                          </button>
                        ) : (
                          <div className={s.stepper} role="group" aria-label={`Quantidade de ${product.name}`}>
                            <button type="button" onClick={() => change(product, -1)} aria-label={qty === 1 ? `Tirar ${product.name}` : "Menos um"}>
                              {qty === 1 ? <Trash2 size={16} aria-hidden="true" /> : <Minus size={16} aria-hidden="true" />}
                            </button>
                            <output aria-live="polite">{qty}</output>
                            <button type="button" onClick={() => change(product, 1)} aria-label="Mais um"><Plus size={16} aria-hidden="true" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <section className={s.how} aria-labelledby={`${ids}-como`}>
          <h2 id={`${ids}-como`} className={s.sectionTitle}>Como funciona</h2>
          <ol className={s.steps}>
            <li><strong>01</strong><span>Escolha os produtos e a quantidade.</span></li>
            <li><strong>02</strong><span>Diga se é entrega ou retirada e como vai pagar.</span></li>
            <li><strong>03</strong><span>O WhatsApp abre com o pedido escrito. É só enviar.</span></li>
          </ol>
        </section>
      </div>
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <p className={s.footerName}>{STORE.name}</p>
          <p>Pedidos pelo WhatsApp {STORE.whatsappLabel}.</p>
          <p className={s.footerNote}>
            Demonstração do Mini Cardápio da <a href="/criacao-de-sites">NexuSync</a>. A loja é fictícia; produtos e preços
            são ilustrativos.
          </p>
        </div>
      </footer>

      {count > 0 && (
        <>
          <div className={s.bagSpace} aria-hidden="true" />
          <div className={s.bagBar}>
            <button type="button" className={s.bagButton} onClick={openCart}>
              <span className={s.bagCount}>{count}</span>
              <span>Ver pedido</span>
              <strong>{money(total)}</strong>
            </button>
          </div>
        </>
      )}

      <dialog ref={cartDialog} className={s.sheet} aria-labelledby={`${ids}-pedido`}>
        <div className={s.sheetHead}>
          <h2 id={`${ids}-pedido`}><ShoppingBag size={22} aria-hidden="true" />Seu pedido</h2>
          <button type="button" className={s.close} onClick={() => cartDialog.current?.close()} aria-label="Fechar pedido"><X size={22} aria-hidden="true" /></button>
        </div>
        {lines.length === 0 ? (
          <p className={s.sheetEmpty}>Sua sacola está vazia.</p>
        ) : (
          <form className={s.form} onSubmit={submit} noValidate>
            <ul className={s.lines}>
              {lines.map(({ product, qty }) => (
                <li key={product.id}>
                  <span className={s.lineThumb}><ProductPhoto product={product} sizes="56px" /></span>
                  <span className={s.lineName}>{product.name}<small>{money(product.price)} cada</small></span>
                  <div className={s.stepper} role="group" aria-label={`Quantidade de ${product.name}`}>
                    <button type="button" onClick={() => change(product, -1)} aria-label={qty === 1 ? `Tirar ${product.name}` : "Menos um"}>
                      {qty === 1 ? <Trash2 size={16} aria-hidden="true" /> : <Minus size={16} aria-hidden="true" />}
                    </button>
                    <output>{qty}</output>
                    <button type="button" onClick={() => change(product, 1)} aria-label="Mais um"><Plus size={16} aria-hidden="true" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <p className={s.total}><span>Total</span><strong>{money(total)}</strong></p>

            <div className={s.field}>
              <label htmlFor={`${ids}-name`}>Seu nome</label>
              <input {...field("name")} autoComplete="name" maxLength={60} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${ids}-name-erro` : undefined} />
              {errors.name && <p id={`${ids}-name-erro`} className={s.error}>{errors.name}</p>}
            </div>

            <fieldset className={s.group}>
              <legend>Como você quer receber?</legend>
              <div className={s.segmented}>
                {(["entrega", "retirada"] as const).map((mode) => (
                  <label key={mode}>
                    <input type="radio" name="modo" checked={order.mode === mode} onChange={() => setOrder({ ...order, mode })} />
                    <span>{mode === "entrega" ? "Entrega" : "Retirada"}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {order.mode === "entrega" && (
              <div className={s.field}>
                <label htmlFor={`${ids}-address`}>Endereço</label>
                <input {...field("address")} autoComplete="street-address" maxLength={140} placeholder="Rua, número, bairro" aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? `${ids}-address-erro` : undefined} />
                {errors.address && <p id={`${ids}-address-erro`} className={s.error}>{errors.address}</p>}
              </div>
            )}

            <fieldset className={s.group}>
              <legend>Pagamento</legend>
              <div className={s.segmented}>
                {(["Pix", "Cartão", "Dinheiro"] as const).map((payment) => (
                  <label key={payment}>
                    <input type="radio" name="pagamento" checked={order.payment === payment} onChange={() => setOrder({ ...order, payment })} />
                    <span>{payment}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {order.payment === "Dinheiro" && (
              <div className={s.field}>
                <label htmlFor={`${ids}-change`}>Troco para quanto? (opcional)</label>
                <input {...field("change")} inputMode="decimal" maxLength={12} placeholder="Ex.: R$ 50" />
              </div>
            )}

            <div className={s.field}>
              <label htmlFor={`${ids}-note`}>Observação (opcional)</label>
              <textarea {...field("note")} rows={2} maxLength={200} placeholder="Ex.: sem milho; refri sabor guaraná" />
            </div>

            <button type="submit" className={s.send}>
              <MessageCircle size={22} aria-hidden="true" />Enviar pedido no WhatsApp
              <span className={s.srOnly}> (abre em nova aba)</span>
            </button>
            {sent && (
              <p className={s.hint}>
                O navegador bloqueou a nova aba. <a href={sent} target="_blank" rel="noopener noreferrer">Abrir o WhatsApp com o pedido</a>
              </p>
            )}
            <p className={s.hint}>A mensagem vai pronta para {STORE.whatsappLabel}. A loja confirma o pedido por lá.</p>
          </form>
        )}
      </dialog>

      <OwnerPanel dialogRef={ownerDialog} products={products} />
    </>
  );
}
