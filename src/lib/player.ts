"use client";

// Identidade anônima por apelido, guardada no navegador (sem login).
const STORAGE_KEY = "nexusync_player";
const CHANGE_EVENT = "nexusync:player-changed";

export interface Player {
  uid: string;
  displayName: string;
  email: null;
  /** Token opaco aceito pelas server actions (id + apelido). */
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
}

function readPlayer(): Player | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id?: unknown; name?: unknown };
    if (typeof parsed.id !== "string" || typeof parsed.name !== "string") {
      return null;
    }
    const { id, name } = parsed;
    const token = btoa(
      String.fromCharCode(...new TextEncoder().encode(JSON.stringify({ id, name })))
    );
    return {
      uid: id,
      displayName: name,
      email: null,
      getIdToken: async () => token,
    };
  } catch {
    return null;
  }
}

export function onPlayerChange(callback: (player: Player | null) => void) {
  const notify = () => callback(readPlayer());
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener("storage", notify);
  notify();
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

export async function signInPlayer() {
  const existing = readPlayer();
  const answer = window.prompt(
    "Escolha um apelido (2 a 24 caracteres):",
    existing?.displayName ?? ""
  );
  const name = answer?.trim().slice(0, 24) ?? "";
  if (name.length < 2) {
    throw new Error("Apelido inválido.");
  }
  const id = existing?.uid ?? crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, name }));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
