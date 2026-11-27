"use client";

/** Projection kept only in the visitor's browser. Without storage, it lasts while the page is open. */
import { useSyncExternalStore } from "react";
import type { CpaProduct } from "@/lib/cpa";

export type NumberField = "ticket" | "custos" | "verba" | "meta" | "unit" | "taxa";
export type CalcState = { atual: number; produtos: CpaProduct[]; drafts: Record<NumberField, string> };

const KEY = "nexusync-calculadora-cpa-v1";
const FIELDS: NumberField[] = ["ticket", "custos", "verba", "meta", "unit", "taxa"];
const MAX_PRODUCTS = 12;

/** Example numbers, marked as examples on screen. They are not results of any client. */
export const EXAMPLE: CpaProduct[] = [
  { nome: "Exemplo: curso online", modo: "site", obj: "verba", ticket: 497, custos: 50, verba: 3000, meta: 20, unit: 1.5, taxa: 2 },
  { nome: "Exemplo: serviço pelo WhatsApp", modo: "whats", obj: "verba", ticket: 297, custos: 120, verba: 800, meta: 10, unit: 8, taxa: 10 },
];

export const BLANK: CpaProduct = { nome: "Novo produto", modo: "site", obj: "verba", ticket: 0, custos: 0, verba: 0, meta: 0, unit: 0, taxa: 0 };

const show = (n: number) => (n ? String(n).replace(".", ",") : "");
const draftsOf = (p: CpaProduct) => Object.fromEntries(FIELDS.map((f) => [f, show(p[f])])) as Record<NumberField, string>;
const build = (produtos: CpaProduct[], atual: number): CalcState => ({ atual, produtos, drafts: draftsOf(produtos[atual]) });
const INITIAL = build(EXAMPLE, 0);

function parseProduct(value: unknown): CpaProduct | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const n = (k: string) => (typeof v[k] === "number" && Number.isFinite(v[k]) && (v[k] as number) >= 0 ? (v[k] as number) : 0);
  return {
    nome: typeof v.nome === "string" ? v.nome.slice(0, 60) : "Produto",
    modo: v.modo === "whats" ? "whats" : "site",
    obj: v.obj === "meta" ? "meta" : "verba",
    ticket: n("ticket"), custos: n("custos"), verba: n("verba"), meta: n("meta"), unit: n("unit"), taxa: n("taxa"),
  };
}

function read(): CalcState {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) ?? "null");
    const produtos = Array.isArray(data?.produtos)
      ? data.produtos.map(parseProduct).filter((p: CpaProduct | null): p is CpaProduct => p !== null).slice(0, MAX_PRODUCTS)
      : [];
    if (!produtos.length) return INITIAL;
    const atual = Number.isInteger(data.atual) && data.atual >= 0 && data.atual < produtos.length ? data.atual : 0;
    return build(produtos, atual);
  } catch {
    return INITIAL;
  }
}

let cache: CalcState | null = null;
const listeners = new Set<() => void>();
const snapshot = () => (cache ??= read());

function write(next: CalcState) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify({ atual: next.atual, produtos: next.produtos }));
  } catch {
    // Private browsing or blocked storage: the projection stays in memory.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const useCalc = () => useSyncExternalStore(subscribe, snapshot, () => INITIAL);

export function updateProduct(patch: Partial<CpaProduct>) {
  const s = snapshot();
  write({ ...s, produtos: s.produtos.map((p, i) => (i === s.atual ? { ...p, ...patch } : p)) });
}

/** Keeps what the visitor typed (e.g. "1,") while storing the parsed number. */
export function typeNumber(field: NumberField, text: string, value: number) {
  const s = snapshot();
  write({ ...s, drafts: { ...s.drafts, [field]: text }, produtos: s.produtos.map((p, i) => (i === s.atual ? { ...p, [field]: value } : p)) });
}

export const selectProduct = (i: number) => write(build(snapshot().produtos, i));

/** Returns false when the list is already at the limit. */
export function addProduct(product: CpaProduct = BLANK, at?: number) {
  const s = snapshot();
  if (s.produtos.length >= MAX_PRODUCTS) return false;
  const index = at ?? s.produtos.length;
  const produtos = [...s.produtos];
  produtos.splice(index, 0, { ...product });
  write(build(produtos, index));
  return true;
}

export function removeProduct() {
  const s = snapshot();
  if (s.produtos.length < 2) return;
  const produtos = s.produtos.filter((_, i) => i !== s.atual);
  write(build(produtos, Math.max(0, s.atual - 1)));
}

export const resetExample = () => write(INITIAL);
