// Consentimento de cookies (somente navegador). Suba a versão da chave sempre que
// o que se coleta ou compartilha mudar, para pedir a permissão de novo.
const CONSENT_KEY = "nexusync-cookie-consent-v3";

export type Consent = "granted" | "denied";

const listeners = new Set<() => void>();

export function subscribeConsent(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function readConsent(): Consent | null {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    return saved === "granted" || saved === "denied" ? saved : null;
  } catch {
    return null;
  }
}

/** Retorna false quando o navegador bloqueia o armazenamento (seguimos sem rastrear). */
export function saveConsent(value: Consent): boolean {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    return false;
  }
  listeners.forEach((cb) => cb());
  return true;
}

/** Apaga os cookies do Pixel da Meta e do Google Analytics quando a permissão é retirada. */
export function clearTrackingCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => /^(_fbp|_fbc|_gid|_ga|_ga_.+)$/.test(name));
  const parts = window.location.hostname.split(".");
  const domains = ["", ...parts.slice(0, -1).map((_, i) => `; domain=.${parts.slice(i).join(".")}`)];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}
