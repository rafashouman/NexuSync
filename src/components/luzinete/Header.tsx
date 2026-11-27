"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MENU, SITE, sectionPath } from "./data";
import s from "./luzinete.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className={s.header}>
      <div className={s.headerRow}>
        <a href={sectionPath("inicio")} className={s.brand}>
          <Image
            src={`${SITE.images}/luz-nascimento.png`}
            alt={`Terapeuta ${SITE.name}, início`}
            width={164}
            height={60}
            priority
          />
        </a>
        <nav id="lz-menu" aria-label="Seções" className={s.nav} data-open={open}>
          <ul>
            {MENU.map(([id, label]) => (
              <li key={id}>
                <a href={sectionPath(id)} onClick={() => setOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={sectionPath("agendar")} className={`${s.button} ${s.headerCta}`}>
          Agendar
        </a>
        <button
          ref={toggle}
          type="button"
          className={s.menuButton}
          aria-expanded={open}
          aria-controls="lz-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className={s.srOnly}>{open ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </div>
    </header>
  );
}
