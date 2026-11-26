"use client";

import { useRef, useState, useTransition, type FormEvent, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { sendLanchoneteOrder } from "@/app/actions/lanchonetePedidos";
import { STORE, money } from "./menu-data";
import {
  MAX_QTY, PAYMENTS, deliveryFee, lineDetails, lineKey, parseCustomer, subtotal, type Customer, type CustomerErrors,
} from "./order";
import { finishOrder, setQuantity, useCart, useHydrated } from "./cart-store";
import s from "./lanchonete.module.css";

const BLANK: Customer = {
  name: "", phone: "", mode: "entrega", street: "", number: "", district: "", reference: "", payment: "pix", changeFor: "", note: "",
};

const newRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

type TextKey = Exclude<keyof Customer, "mode" | "payment">;

export function Checkout() {
  const { lines, last } = useCart();
  const hydrated = useHydrated();
  const [customer, setCustomer] = useState<Customer>(BLANK);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [failure, setFailure] = useState<{ error: string; url?: string } | null>(null);
  const [website, setWebsite] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const attempt = useRef<{ key: string; id: string } | null>(null);

  const sum = subtotal(lines);
  const fee = deliveryFee(customer.mode);
  const total = sum + fee;

  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFailure(null);
  }

  function showErrors(found: CustomerErrors) {
    setErrors(found);
    const first = Object.keys(found)[0];
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setFailure(null);
    const check = parseCustomer(customer, total);
    if (!check.ok) {
      showErrors(check.errors);
      return;
    }
    // Reenviar o mesmo pedido reaproveita o identificador; mudou algo, é um pedido novo.
    const key = JSON.stringify([lines, customer]);
    if (attempt.current?.key !== key) attempt.current = { key, id: newRequestId() };
    const requestId = attempt.current.id;

    startTransition(async () => {
      try {
        const result = await sendLanchoneteOrder({ requestId, lines, customer, website });
        if (result.ok) {
          attempt.current = null;
          finishOrder({ code: result.code, url: result.url });
          window.scrollTo({ top: 0 });
          return;
        }
        if (result.fields) showErrors(result.fields);
        setFailure({ error: result.error, url: result.url });
      } catch {
        setFailure({ error: "Sem conexão com a lanchonete. Confira a internet e toque em enviar de novo." });
      }
    });
  }

  if (!hydrated) {
    return (
      <div className={s.loading}>
        <h1 className={s.pageTitle}>Seu pedido</h1>
        <p>Abrindo sua sacola…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    if (last) {
      return (
        <div className={s.done}>
          <h1 className={s.pageTitle}>Pedido <span className={s.nowrap}>{last.code}</span> registrado</h1>
          <p>
            <strong>Falta um passo:</strong> envie a mensagem no WhatsApp para a lanchonete confirmar e começar a preparar.
          </p>
          <a className={s.whats} href={last.url} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={22} aria-hidden="true" />Enviar pedido no WhatsApp
            <span className={s.srOnly}> (abre em nova aba)</span>
          </a>
          <p className={s.hint}>A mensagem vai pronta para {STORE.whatsappLabel}. É só tocar em enviar.</p>
          <Link href={STORE.basePath} className={s.ghost}>Voltar ao cardápio</Link>
        </div>
      );
    }
    return (
      <div className={s.done}>
        <h1 className={s.pageTitle}>Sua sacola está vazia</h1>
        <p>Escolha um lanche no cardápio e ele aparece aqui.</p>
        <Link href={STORE.basePath} className={s.primary}>Ver o cardápio</Link>
      </div>
    );
  }

  function field(
    name: TextKey,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> & { wide?: boolean } = {},
  ) {
    const { wide, ...input } = props;
    const error = errors[name];
    return (
      <div className={wide ? `${s.field} ${s.wide}` : s.field}>
        <label htmlFor={`pedido-${name}`}>{label}</label>
        <input
          id={`pedido-${name}`}
          name={name}
          value={customer[name]}
          onChange={(event) => update(name, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `erro-${name}` : undefined}
          {...input}
        />
        {error && <p id={`erro-${name}`} className={s.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div className={s.checkout}>
      <h1 className={s.pageTitle}>Seu pedido</h1>

      <section className={s.summary} aria-label="Itens do pedido">
        <ul>
          {lines.map((line) => {
            const key = lineKey(line);
            const { item, addons, choices, total: lineTotal } = lineDetails(line);
            const details = [...choices, ...addons.map((addon) => `+ ${addon.name}`), ...(line.note ? [`Obs.: ${line.note}`] : [])];
            return (
              <li key={key}>
                <div className={s.lineTop}>
                  <span className={s.lineName}>{item.name}</span>
                  <strong>{money(lineTotal)}</strong>
                </div>
                {details.length > 0 && <p className={s.lineDetails}>{details.join(" · ")}</p>}
                <div className={s.stepper} role="group" aria-label={`Quantidade de ${item.name}`}>
                  <button
                    type="button"
                    onClick={() => setQuantity(key, line.qty - 1)}
                    aria-label={line.qty === 1 ? `Remover ${item.name}` : `Diminuir ${item.name}`}
                  >
                    {line.qty === 1 ? <Trash2 size={18} aria-hidden="true" /> : <Minus size={18} aria-hidden="true" />}
                  </button>
                  <output aria-live="polite">{line.qty}</output>
                  <button type="button" onClick={() => setQuantity(key, line.qty + 1)} disabled={line.qty === MAX_QTY} aria-label={`Aumentar ${item.name}`}>
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <dl className={s.totals}>
          <div><dt>Subtotal</dt><dd>{money(sum)}</dd></div>
          <div><dt>Entrega</dt><dd>{fee ? money(fee) : "sem taxa na retirada"}</dd></div>
          <div className={s.grand}><dt>Total</dt><dd>{money(total)}</dd></div>
        </dl>
        <Link href={STORE.basePath} className={s.textLink}>Adicionar mais itens</Link>
      </section>

      <form ref={formRef} className={s.form} onSubmit={submit} noValidate>
        <fieldset className={s.group}>
          <legend>Como você quer receber?</legend>
          <div className={s.options}>
            {([["entrega", "Entrega"], ["retirada", "Retirar no balcão"]] as const).map(([value, label]) => (
              <label key={value} className={s.option}>
                <input type="radio" name="mode" checked={customer.mode === value} onChange={() => update("mode", value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={s.fields}>
          {field("name", "Seu nome", { autoComplete: "name", maxLength: 80, wide: true })}
          {field("phone", "WhatsApp ou telefone com DDD", { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 20, wide: true, placeholder: "(22) 99999-0000" })}
          {customer.mode === "entrega" && (
            <>
              {field("street", "Rua", { autoComplete: "address-line1", maxLength: 120, wide: true })}
              {field("number", "Número", { maxLength: 15 })}
              {field("district", "Bairro", { autoComplete: "address-level3", maxLength: 80 })}
              {field("reference", "Ponto de referência (opcional)", { maxLength: 120, wide: true })}
            </>
          )}
        </div>

        <fieldset className={s.group}>
          <legend>Pagamento</legend>
          <div className={s.options}>
            {PAYMENTS.map((option) => (
              <label key={option.id} className={s.option}>
                <input type="radio" name="payment" checked={customer.payment === option.id} onChange={() => update("payment", option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={s.fields}>
          {customer.payment === "dinheiro" && field("changeFor", "Troco para quanto? (opcional)", { inputMode: "decimal", maxLength: 15, wide: true, placeholder: "50,00" })}
          {field("note", "Recado para a cozinha (opcional)", { maxLength: 240, wide: true })}
        </div>

        {/* Armadilha para robôs: invisível e fora da navegação por teclado. */}
        <div className={s.trap} aria-hidden="true">
          <label>
            Site
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </label>
        </div>

        {failure && (
          <div className={s.failure} role="alert">
            <p>{failure.error}</p>
            {failure.url && (
              <a className={s.ghost} href={failure.url} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} aria-hidden="true" />Enviar pelo WhatsApp<span className={s.srOnly}> (abre em nova aba)</span>
              </a>
            )}
          </div>
        )}

        <button type="submit" className={`${s.primary} ${s.block}`} disabled={pending}>
          {pending ? "Registrando…" : `Fazer pedido · ${money(total)}`}
        </button>
        <p className={s.hint}>
          Guardamos estes dados só para atender o pedido e apagamos depois de {STORE.retentionDays} dias. Em seguida, você
          envia a mensagem pelo WhatsApp. <Link href="/privacidade">Privacidade</Link>
        </p>
      </form>
    </div>
  );
}
