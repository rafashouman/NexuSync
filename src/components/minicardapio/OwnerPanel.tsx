"use client";

import { useId, useState, type FormEvent, type RefObject } from "react";
import { ArrowLeft, ImagePlus, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import {
  DESCRIPTION_MAX, MAX_PRODUCTS, NAME_MAX, TAG_MAX, money, parsePrice, priceInput, type Product,
} from "./data";
import { photoToDataUrl, resetProducts, saveProducts } from "./store";
import { ProductPhoto } from "./ProductPhoto";
import s from "./minicardapio.module.css";

type Draft = { id: string | null; name: string; description: string; price: string; tag: string; image?: string };

const blank: Draft = { id: null, name: "", description: "", price: "", tag: "" };

/** "Modo dono": o cliente do Mini Cardápio cadastra, edita, esgota e tira produtos. */
export function OwnerPanel({ dialogRef, products }: { dialogRef: RefObject<HTMLDialogElement | null>; products: Product[] }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Partial<Record<"name" | "price" | "image", string>>>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const ids = useId();
  const full = products.length >= MAX_PRODUCTS;
  const tags = [...new Set(products.map((product) => product.tag?.trim()).filter(Boolean) as string[])];

  function persist(next: Product[], message: string) {
    const ok = saveProducts(next);
    setNotice(ok ? message : "O navegador não deixou salvar (sem espaço ou janela anônima). A mudança vale até fechar a página.");
  }

  function edit(product?: Product) {
    setErrors({});
    setNotice("");
    setDraft(
      product
        ? { id: product.id, name: product.name, description: product.description, price: priceInput(product.price), tag: product.tag ?? "", image: product.image }
        : { ...blank },
    );
    requestAnimationFrame(() => document.getElementById(`${ids}-nome`)?.focus());
  }

  async function pickPhoto(file: File | undefined) {
    if (!file || !draft) return;
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Escolha um arquivo de imagem (JPG, PNG ou WebP)." });
      return;
    }
    setBusy(true);
    try {
      const image = await photoToDataUrl(file);
      setDraft((current) => (current ? { ...current, image } : current));
      setErrors({ ...errors, image: undefined });
    } catch {
      setErrors({ ...errors, image: "Não deu para ler esta foto. Tente outra." });
    } finally {
      setBusy(false);
    }
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const price = parsePrice(draft.price);
    const nextErrors: typeof errors = {};
    if (draft.name.trim().length < 2) nextErrors.name = "Dê um nome ao produto.";
    if (price === null) nextErrors.price = "Informe o preço, como 16,90.";
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.price) {
      document.getElementById(`${ids}-${nextErrors.name ? "nome" : "preco"}`)?.focus();
      return;
    }
    const item: Product = {
      id: draft.id ?? `p-${Date.now().toString(36)}`,
      name: draft.name.trim(),
      description: draft.description.trim(),
      price: price!,
      tag: draft.tag.trim() || undefined,
      image: draft.image,
      soldOut: products.find((product) => product.id === draft.id)?.soldOut,
    };
    const next = draft.id ? products.map((product) => (product.id === draft.id ? item : product)) : [...products, item];
    persist(next, draft.id ? `${item.name} atualizado. Já aparece no cardápio.` : `${item.name} cadastrado. Já aparece no cardápio.`);
    setDraft(null);
  }

  return (
    <dialog ref={dialogRef} className={`${s.sheet} ${s.owner}`} aria-labelledby={`${ids}-titulo`} onClose={() => setDraft(null)}>
      <div className={s.sheetHead}>
        {draft ? (
          <button type="button" className={s.back} onClick={() => setDraft(null)}><ArrowLeft size={18} aria-hidden="true" />Produtos</button>
        ) : (
          <p className={s.ownerKicker}>Modo dono</p>
        )}
        <button type="button" className={s.close} onClick={() => dialogRef.current?.close()} aria-label="Fechar modo dono"><X size={22} aria-hidden="true" /></button>
      </div>

      {draft ? (
        <form className={s.form} onSubmit={save} noValidate>
          <h2 id={`${ids}-titulo`} className={s.ownerTitle}>{draft.id ? "Editar produto" : "Novo produto"}</h2>

          <div className={s.photoField}>
            <div className={s.photoPreview}>
              <ProductPhoto product={{ id: "rascunho", name: draft.name || "?", description: "", price: 0, image: draft.image }} sizes="160px" />
            </div>
            <div className={s.photoActions}>
              <label className={s.ghost} htmlFor={`${ids}-foto`}>
                <ImagePlus size={18} aria-hidden="true" />{busy ? "Preparando foto…" : draft.image ? "Trocar foto" : "Enviar foto"}
              </label>
              <input id={`${ids}-foto`} className={s.fileInput} type="file" accept="image/*" onChange={(event) => pickPhoto(event.target.files?.[0])} />
              {draft.image && (
                <button type="button" className={s.textButton} onClick={() => setDraft({ ...draft, image: undefined })}>Tirar foto</button>
              )}
              <p className={s.hint}>Sem foto, o cardápio mostra a inicial do produto.</p>
              {errors.image && <p className={s.error} role="alert">{errors.image}</p>}
            </div>
          </div>

          <div className={s.field}>
            <label htmlFor={`${ids}-nome`}>Nome</label>
            <input id={`${ids}-nome`} value={draft.name} maxLength={NAME_MAX} onChange={(event) => setDraft({ ...draft, name: event.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${ids}-nome-erro` : undefined} placeholder="Ex.: Dog calabresa" />
            {errors.name && <p id={`${ids}-nome-erro`} className={s.error}>{errors.name}</p>}
          </div>

          <div className={s.fieldRow}>
            <div className={s.field}>
              <label htmlFor={`${ids}-preco`}>Preço (R$)</label>
              <input id={`${ids}-preco`} value={draft.price} inputMode="decimal" maxLength={10} onChange={(event) => setDraft({ ...draft, price: event.target.value })} aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? `${ids}-preco-erro` : undefined} placeholder="16,90" />
              {errors.price && <p id={`${ids}-preco-erro`} className={s.error}>{errors.price}</p>}
            </div>
            <div className={s.field}>
              <label htmlFor={`${ids}-grupo`}>Grupo (opcional)</label>
              <input id={`${ids}-grupo`} value={draft.tag} maxLength={TAG_MAX} list={`${ids}-grupos`} onChange={(event) => setDraft({ ...draft, tag: event.target.value })} placeholder="Ex.: Dogs" />
              <datalist id={`${ids}-grupos`}>{tags.map((tag) => <option key={tag} value={tag} />)}</datalist>
            </div>
          </div>

          <div className={s.field}>
            <label htmlFor={`${ids}-descricao`}>Descrição (opcional)</label>
            <textarea id={`${ids}-descricao`} rows={3} value={draft.description} maxLength={DESCRIPTION_MAX} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="O que vem no produto" />
            <p className={s.counter}>{draft.description.length}/{DESCRIPTION_MAX}</p>
          </div>

          <button type="submit" className={s.send} disabled={busy}>{draft.id ? "Salvar alterações" : "Cadastrar produto"}</button>
        </form>
      ) : (
        <div className={s.ownerBody}>
          <h2 id={`${ids}-titulo`} className={s.ownerTitle}>Seus produtos</h2>
          <div className={s.meter} aria-label={`${products.length} de ${MAX_PRODUCTS} produtos cadastrados`}>
            <span style={{ width: `${(products.length / MAX_PRODUCTS) * 100}%` }} />
          </div>
          <p className={s.hint}>
            {products.length} de {MAX_PRODUCTS} produtos. Tudo o que você muda aqui aparece no cardápio na hora. Nesta demonstração,
            fica salvo só neste navegador.
          </p>
          <p className={s.notice} role="status">{notice}</p>

          <ul className={s.ownerList}>
            {products.map((product, index) => (
              <li key={product.id} data-sold-out={product.soldOut ? "" : undefined}>
                <span className={s.lineThumb}><ProductPhoto product={product} sizes="56px" /></span>
                <span className={s.lineName}>
                  {product.name}
                  <small>{money(product.price)}{product.tag ? ` · ${product.tag}` : ""}</small>
                </span>
                <label className={s.switch}>
                  <input
                    type="checkbox"
                    checked={!product.soldOut}
                    onChange={(event) =>
                      persist(
                        products.map((item, i) => (i === index ? { ...item, soldOut: !event.target.checked } : item)),
                        event.target.checked ? `${product.name} voltou ao cardápio.` : `${product.name} marcado como esgotado.`,
                      )
                    }
                  />
                  <span aria-hidden="true" />
                  <span className={s.switchText}>{product.soldOut ? "Esgotado" : "À venda"}<span className={s.srOnly}>: {product.name}</span></span>
                </label>
                <span className={s.rowActions}>
                  <button type="button" onClick={() => edit(product)} aria-label={`Editar ${product.name}`}><Pencil size={16} aria-hidden="true" /></button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Tirar "${product.name}" do cardápio?`)) {
                        persist(products.filter((item) => item.id !== product.id), `${product.name} saiu do cardápio.`);
                      }
                    }}
                    aria-label={`Remover ${product.name}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <button type="button" className={s.send} onClick={() => edit()} disabled={full}>
            <Plus size={20} aria-hidden="true" />{full ? `Limite de ${MAX_PRODUCTS} produtos` : "Adicionar produto"}
          </button>
          <button
            type="button"
            className={s.textButton}
            onClick={() => {
              if (window.confirm("Voltar aos produtos de exemplo? Suas mudanças nesta demonstração serão apagadas.")) {
                resetProducts();
                setNotice("Produtos de exemplo restaurados.");
              }
            }}
          >
            <RotateCcw size={16} aria-hidden="true" />Restaurar exemplo
          </button>
        </div>
      )}
    </dialog>
  );
}
