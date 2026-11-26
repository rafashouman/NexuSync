"use client";

import { useSyncExternalStore } from "react";
import { STORE } from "./catalog-data";

/**
 * Domínio mostrado na simulação de endereço. Só muda o que aparece na tela:
 * os links enviados continuam apontando para o endereço real desta demo.
 * Aceita `?dominio=www.sualoja.com.br` na URL, para abrir a demo já com o domínio do cliente.
 */
const KEY = "ferragem-total:dominio";
const listeners = new Set<() => void>();
let current: string | null = null;

export function normalizeDomain(input: string) {
  const value = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/[/?#].*$/, "");
  return /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(value) ? value : null;
}

function read() {
  if (current !== null) return current;
  let value: string = STORE.demoDomain;
  try {
    const fromUrl = normalizeDomain(new URLSearchParams(window.location.search).get("dominio") ?? "");
    const saved = normalizeDomain(localStorage.getItem(KEY) ?? "");
    value = fromUrl ?? saved ?? value;
    if (fromUrl) localStorage.setItem(KEY, fromUrl);
  } catch {
    /* navegação privada: fica o domínio de exemplo */
  }
  current = value;
  return value;
}

export function setDomain(domain: string | null) {
  current = domain ?? STORE.demoDomain;
  try {
    if (domain) localStorage.setItem(KEY, domain);
    else localStorage.removeItem(KEY);
  } catch {
    /* sem armazenamento: vale só nesta visita */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDomain() {
  return useSyncExternalStore(subscribe, read, () => STORE.demoDomain);
}

/** Origem real da página, para montar os links de compartilhamento. */
export function useOrigin() {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "https://nexusync.online",
  );
}
