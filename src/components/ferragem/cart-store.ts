"use client";

/** Carrinho guardado no navegador do cliente. Sem armazenamento disponível, vale só enquanto a página está aberta. */
import { useSyncExternalStore } from "react";
import { ADDRESS_MAX, MAX_QTY, NOTE_MAX, getProduct, type Delivery } from "./catalog-data";

export { ADDRESS_MAX, MAX_QTY, NOTE_MAX };

export type CartItem = { slug: string; qty: number };
type Cart = { items: CartItem[]; note: string; delivery: Delivery };

const KEY = "total-lar-carrinho-v1";
const NO_DELIVERY: Delivery = { name: "", phone: "", mode: null, street: "", district: "", reference: "", coords: null };
const EMPTY: Cart = { items: [], note: "", delivery: NO_DELIVERY };

const text = (value: unknown) => (typeof value === "string" ? value.slice(0, ADDRESS_MAX) : "");
const coord = (value: unknown, limit: number) => typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit;

/** Endereço salvo: fica no aparelho para a próxima compra. */
function readDelivery(data: unknown): Delivery {
  const raw = (data ?? {}) as Partial<Record<keyof Delivery, unknown>>;
  const c = raw.coords as { lat?: unknown; lng?: unknown } | null | undefined;
  return {
    name: text(raw.name),
    phone: text(raw.phone).slice(0, 20),
    mode: raw.mode === "entrega" || raw.mode === "retirada" ? raw.mode : null,
    street: text(raw.street),
    district: text(raw.district),
    reference: text(raw.reference),
    coords: c && coord(c.lat, 90) && coord(c.lng, 180) ? { lat: c.lat as number, lng: c.lng as number } : null,
  };
}

let cache: Cart | null = null;
const listeners = new Set<() => void>();

const validQty = (qty: unknown): qty is number => typeof qty === "number" && Number.isInteger(qty) && qty >= 1 && qty <= MAX_QTY;

/** Descarta o que estiver inválido ou não existir mais no catálogo. */
function read(): Cart {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const found = new Map<string, number>();
    for (const item of Array.isArray(data?.items) ? data.items : []) {
      if (typeof item?.slug === "string" && getProduct(item.slug) && validQty(item.qty)) found.set(item.slug, item.qty);
    }
    return {
      items: [...found].map(([slug, qty]) => ({ slug, qty })),
      note: typeof data?.note === "string" ? data.note.slice(0, NOTE_MAX) : "",
      delivery: readDelivery(data?.delivery),
    };
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
    // Navegação privada ou armazenamento bloqueado: o carrinho segue na memória.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Mantém duas abas do catálogo com o mesmo carrinho.
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
/** `false` no HTML do servidor: evita mostrar "carrinho vazio" antes de ler o carrinho salvo. */
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

/** Soma `qty` ao que já houver do produto. */
export function addToCart(slug: string, qty = 1) {
  const cart = snapshot();
  const items = cart.items.some((item) => item.slug === slug)
    ? cart.items.map((item) => (item.slug === slug ? { slug, qty: Math.min(MAX_QTY, item.qty + qty) } : item))
    : [...cart.items, { slug, qty: Math.min(MAX_QTY, qty) }];
  write({ ...cart, items });
}

/** Menos de 1 remove o produto. */
export function setQuantity(slug: string, qty: number) {
  const cart = snapshot();
  const items = cart.items.flatMap((item) =>
    item.slug !== slug ? [item] : qty < 1 ? [] : [{ slug, qty: Math.min(MAX_QTY, qty) }],
  );
  write({ ...cart, items });
}

export const setNote = (note: string) => write({ ...snapshot(), note: note.slice(0, NOTE_MAX) });

/** Troca parte da entrega. Mexer na rua ou no bairro apaga a localização do aparelho, que pode não bater mais. */
export function setDelivery(patch: Partial<Delivery>) {
  const cart = snapshot();
  const touchesAddress = "street" in patch || "district" in patch;
  const delivery: Delivery = { ...cart.delivery, ...(touchesAddress && !("coords" in patch) ? { coords: null } : {}), ...patch };
  for (const key of ["name", "phone", "street", "district", "reference"] as const) delivery[key] = delivery[key].slice(0, ADDRESS_MAX);
  write({ ...cart, delivery });
}

/** Esvazia os produtos e a observação; o endereço fica salvo para a próxima compra. */
export const clearCart = () => write({ ...EMPTY, delivery: snapshot().delivery });
