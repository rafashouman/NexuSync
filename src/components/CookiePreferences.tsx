"use client";

import { useSyncExternalStore } from "react";
import { clearTrackingCookies, readConsent, saveConsent, subscribeConsent, type Consent } from "@/lib/consent";
import c from "@/components/home/PrivacyExperience.module.css";

/** Permite rever a escolha feita no banner de cookies. */
export function CookiePreferences() {
  const consent = useSyncExternalStore<Consent | null | undefined>(subscribeConsent, readConsent, () => undefined);

  const choose = (value: Consent) => {
    const wasGranted = consent === "granted";
    if (!saveConsent(value) || value === "granted") return;
    clearTrackingCookies();
    // Os scripts já carregados só saem com a página recarregada.
    if (wasGranted) window.location.reload();
  };

  const status = consent === "granted" ? "cookies aceitos" : consent === "denied" ? "cookies recusados" : "ainda sem escolha";

  return (
    <div className={c.prefs}>
      <p role="status">Sua escolha neste navegador: <strong>{consent === undefined ? "carregando…" : status}</strong>.</p>
      <div className={c.prefsButtons}>
        <button type="button" data-kind="main" aria-pressed={consent === "granted"} onClick={() => choose("granted")}>Aceitar cookies</button>
        <button type="button" aria-pressed={consent === "denied"} onClick={() => choose("denied")}>Recusar cookies</button>
      </div>
    </div>
  );
}
