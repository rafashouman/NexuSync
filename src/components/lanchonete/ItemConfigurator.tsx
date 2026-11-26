"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { STORE, getItem, money, orderPath } from "./menu-data";
import { MAX_QTY, NOTE_MAX } from "./order";
import { addToCart } from "./cart-store";
import s from "./lanchonete.module.css";

/** Escolhas, adicionais, observação e quantidade de um item. */
export function ItemConfigurator({ slug }: { slug: string }) {
  const item = getItem(slug)!;
  const groups = item.choices ?? [];
  const [choices, setChoices] = useState<string[]>(() => groups.map(() => ""));
  const [addons, setAddons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [missing, setMissing] = useState(-1);
  const [message, setMessage] = useState("");

  const extras = (item.addons ?? []).filter((addon) => addons.includes(addon.id)).reduce((sum, addon) => sum + addon.price, 0);
  const total = (item.price + extras) * qty;

  function submit(event: FormEvent) {
    event.preventDefault();
    const index = choices.findIndex((choice) => !choice);
    setMissing(index);
    if (index >= 0) {
      setMessage("");
      document.getElementById(`escolha-${index}-0`)?.focus();
      return;
    }
    const ok = addToCart({ slug, qty, choices, addons, note: note.trim() });
    setMessage(ok ? `${qty}x ${item.name} na sacola.` : "A sacola está cheia. Envie este pedido antes de adicionar mais.");
  }

  return (
    <form className={s.config} onSubmit={submit} noValidate>
      {groups.map((group, i) => (
        <fieldset key={group.label} className={s.group} aria-describedby={missing === i ? `erro-${i}` : undefined}>
          <legend>{group.label}</legend>
          <div className={s.options}>
            {group.options.map((option, j) => (
              <label key={option} className={s.option}>
                <input
                  id={`escolha-${i}-${j}`}
                  type="radio"
                  name={`escolha-${slug}-${i}`}
                  checked={choices[i] === option}
                  onChange={() => {
                    setChoices(choices.map((value, k) => (k === i ? option : value)));
                    setMissing(-1);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {missing === i && <p id={`erro-${i}`} className={s.error} role="alert">Escolha uma opção em “{group.label}”.</p>}
        </fieldset>
      ))}

      {item.addons && (
        <fieldset className={s.group}>
          <legend>Adicionais</legend>
          <div className={s.addons}>
            {item.addons.map((addon) => (
              <label key={addon.id} className={s.addon}>
                <input
                  type="checkbox"
                  checked={addons.includes(addon.id)}
                  onChange={(event) => setAddons(event.target.checked ? [...addons, addon.id] : addons.filter((id) => id !== addon.id))}
                />
                <span>{addon.name}</span>
                <span className={s.addonPrice}>{addon.price ? `+ ${money(addon.price)}` : "sem custo"}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className={s.field}>
        <label htmlFor="observacao">Alguma observação? (opcional)</label>
        <textarea
          id="observacao"
          rows={2}
          maxLength={NOTE_MAX}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ex.: sem cebola"
        />
      </div>

      <div className={s.submitRow}>
        <div className={s.stepper} role="group" aria-label="Quantidade">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty === 1} aria-label="Diminuir quantidade">
            <Minus size={18} aria-hidden="true" />
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" onClick={() => setQty(Math.min(MAX_QTY, qty + 1))} disabled={qty === MAX_QTY} aria-label="Aumentar quantidade">
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
        <button type="submit" className={s.primary}>Adicionar · {money(total)}</button>
      </div>

      <div role="status">
        {message && (
          <p className={s.added}>
            {message} <Link href={orderPath}>Ver pedido</Link> ou <Link href={STORE.basePath}>continuar no cardápio</Link>.
          </p>
        )}
      </div>
    </form>
  );
}
