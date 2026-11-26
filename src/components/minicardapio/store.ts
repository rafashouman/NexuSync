"use client";

import { useSyncExternalStore } from "react";
import { EXAMPLE_PRODUCTS, MAX_PRODUCTS, type Product } from "./data";

/** Produtos do "modo dono". Na demonstração ficam só no localStorage de quem testa. */
const KEY = "nexusync:mini-cardapio:v1";
const listeners = new Set<() => void>();
let cache: Product[] | null = null;

function isProduct(value: unknown): value is Product {
  const item = value as Product;
  return Boolean(item) && typeof item.id === "string" && typeof item.name === "string" && typeof item.price === "number";
}

function read(): Product[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? parsed.filter(isProduct).slice(0, MAX_PRODUCTS) : EXAMPLE_PRODUCTS;
  } catch {
    cache = EXAMPLE_PRODUCTS;
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
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

export function useProducts() {
  return useSyncExternalStore(subscribe, read, () => EXAMPLE_PRODUCTS);
}

/** Salva e avisa a tela. Devolve false se o navegador recusou (sem espaço ou modo privado). */
export function saveProducts(next: Product[]) {
  cache = next;
  let ok = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    ok = false;
  }
  listeners.forEach((listener) => listener());
  return ok;
}

export function resetProducts() {
  cache = EXAMPLE_PRODUCTS;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* Navegação privada */
  }
  listeners.forEach((listener) => listener());
}

/** Reduz a foto enviada para caber no navegador (lado maior até 640 px, WebP ou JPEG). */
export async function photoToDataUrl(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const webp = canvas.toDataURL("image/webp", 0.8);
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.8);
}
