"use client";

import { useState } from "react";
import s from "../servico.module.css";

/** Copies the e-mail address; if the clipboard is blocked the address is already visible next to the button. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
    }
  }
  return (
    <button type="button" className={s.copyBtn} onClick={copy} title="Copiar e-mail" aria-live="polite">
      {copied ? "Copiado ✓" : failed ? "Copie o e-mail ao lado" : "Copiar"}
    </button>
  );
}
