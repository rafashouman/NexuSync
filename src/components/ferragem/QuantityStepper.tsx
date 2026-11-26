"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_QTY } from "./cart-store";
import s from "./ferragem.module.css";

type Props = {
  qty: number;
  name: string;
  /** Com `removable`, o botão de menos vira lixeira na última unidade. */
  removable?: boolean;
  onChange: (qty: number) => void;
};

/** Menos, campo digitável (em obra se compra de 20 em 20) e mais. */
export function QuantityStepper({ qty, name, removable = false, onChange }: Props) {
  const removes = removable && qty === 1;
  // Texto em digitação. A quantidade já vale a cada tecla: no celular, tocar num botão nem sempre tira o foco do campo.
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft !== null && (draft === "" || Number(draft) === qty) ? draft : String(qty);

  function type(text: string) {
    const typed = Number(text);
    setDraft(text);
    if (Number.isInteger(typed) && typed >= 1) onChange(Math.min(MAX_QTY, typed));
  }

  function step(next: number) {
    setDraft(null);
    onChange(next);
  }

  return (
    <div className={s.stepper} role="group" aria-label={`Quantidade de ${name}`}>
      <button type="button" onClick={() => step(qty - 1)} disabled={qty === 1 && !removable} aria-label={removes ? `Remover ${name}` : `Diminuir ${name}`}>
        {removes ? <Trash2 size={18} aria-hidden="true" /> : <Minus size={18} aria-hidden="true" />}
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={shown}
        aria-label={`Quantidade de ${name}`}
        onChange={(event) => type(event.target.value)}
        onBlur={() => setDraft(null)}
      />
      <button type="button" onClick={() => step(qty + 1)} disabled={qty >= MAX_QTY} aria-label={`Aumentar ${name}`}>
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
