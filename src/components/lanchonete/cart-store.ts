"use client";

/** Sacola guardada no navegador do cliente. Sem armazenamento disponível, vale só enquanto a página está aberta. */
import { useSyncExternalStore } from "react";
import { MAX_LINES, MAX_QTY, lineKey, parseLine, type CartLine } from "./order";

export type LastOrder = { code: string; url: string };
type Cart = { lines: CartLine[]; last: LastOrder | null };

const KEY = "lanches-restinga-sacola-v1";
const EMPTY: Cart = { lines: [], last: null };

let cache: Cart | null = null;
const listeners = new Set<() => void>();

function read(): Cart {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const lines = Array.isArray(data?.lines)
      ? data.lines.map(parseLine).filter((line: CartLine | null): line is CartLine => line !== null).slice(0, MAX_LINES)
      : [];
    const last =
      typeof data?.last?.code === "string" && String(data.last.url).startsWith("https://wa.me/")
        ? { code: data.last.code, url: data.last.url }
        : null;
    return { lines, last };
  } catch {
    return EMPTY;
  }
}

const snapshot = () => (cache ??= read());

function write(next: Cart) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Navegação privada ou armazenamento bloqueado: a sacola segue na memória.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Mantém duas abas do cardápio com a mesma sacola.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const useCart = () => useSyncExternalStore(subscribe, snapshot, () => EMPTY);

const noop = () => () => {};
/** `false` no HTML do servidor: evita mostrar "sacola vazia" antes de ler a sacola salva. */
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

/** Devolve `false` quando a sacola já está no limite de itens diferentes. */
export function addToCart(line: CartLine) {
  const { lines } = snapshot();
  const key = lineKey(line);
  const existing = lines.find((item) => lineKey(item) === key);
  if (!existing && lines.length >= MAX_LINES) return false;
  const next = existing
    ? lines.map((item) => (item === existing ? { ...item, qty: Math.min(MAX_QTY, item.qty + line.qty) } : item))
    : [...lines, line];
  write({ lines: next, last: null });
  return true;
}

export function setQuantity(key: string, qty: number) {
  const { lines, last } = snapshot();
  write({
    last,
    lines: lines.flatMap((item) => (lineKey(item) !== key ? [item] : qty < 1 ? [] : [{ ...item, qty: Math.min(MAX_QTY, qty) }])),
  });
}

export function finishOrder(last: LastOrder) {
  write({ lines: [], last });
}
