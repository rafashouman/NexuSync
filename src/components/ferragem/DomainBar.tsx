"use client";

import { useId, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Globe, LockKeyhole, X } from "lucide-react";
import { STORE } from "./catalog-data";
import { normalizeDomain, setDomain, useDomain } from "./domain-store";
import s from "./ferragem.module.css";

/** Faixa da demonstração: mostra o catálogo no endereço do cliente. Fica fora da "loja". */
export function DomainBar() {
  const domain = useDomain();
  const pathname = usePathname() ?? STORE.basePath;
  const path = pathname.startsWith(STORE.basePath) ? pathname.slice(STORE.basePath.length) || "/" : "/";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();
  const custom = domain !== STORE.demoDomain;

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = normalizeDomain(draft);
    if (!value) {
      setError("Digite um domínio válido, como www.sualoja.com.br");
      return;
    }
    setDomain(value);
    setError("");
    setEditing(false);
  }

  return (
    <div className={s.demoBar}>
      <div className={s.demoInner}>
        <p className={s.demoLabel}>Demonstração NexuSync</p>
        <div className={s.address} aria-label="Endereço simulado do catálogo">
          <LockKeyhole size={14} aria-hidden="true" />
          <span className={s.addressText}>
            <span className={s.addressMuted}>https://</span>
            <strong>{domain}</strong>
            <span className={s.addressMuted}>{path === "/" ? "" : path}</span>
          </span>
        </div>
        {editing ? (
          <form className={s.domainForm} onSubmit={submit} noValidate>
            <label htmlFor={inputId} className={s.srOnly}>Seu domínio</label>
            <input
              id={inputId}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="www.sualoja.com.br"
              inputMode="url"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-erro` : undefined}
            />
            <button type="submit" className={s.demoButton}>Ver no meu domínio</button>
            <button type="button" className={s.demoIcon} onClick={() => { setEditing(false); setError(""); }} aria-label="Cancelar">
              <X size={16} aria-hidden="true" />
            </button>
            {error && <p id={`${inputId}-erro`} className={s.demoError} role="alert">{error}</p>}
          </form>
        ) : (
          <div className={s.demoActions}>
            <button type="button" className={s.demoButton} onClick={() => { setDraft(custom ? domain : ""); setEditing(true); }}>
              <Globe size={15} aria-hidden="true" />
              {custom ? "Trocar domínio" : "Testar com o meu domínio"}
            </button>
            {custom && (
              <button type="button" className={s.demoLink} onClick={() => setDomain(null)}>Voltar ao exemplo</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
