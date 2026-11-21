"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { siteNavigation, solutionPillars } from "@/data/siteNavigation";
import { ArrowIcon } from "./icons";
import s from "./rua.module.css";

// Same menu as the inner pages (Soluções · Produtos e exemplos · A NexuSync), without framer-motion or lucide:
// native <details> dropdowns, so the home stays light. The home itself only tells the story.
const products = siteNavigation[1].links;
const about = siteNavigation[2].links.filter(([, href]) => !href.startsWith("/#"));

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function Item({ label, href, onPick }: { label: string; href: string; onPick: () => void }) {
  return (
    <Link href={href} onClick={onPick}>
      <span>{label}</span>
      <ArrowIcon />
    </Link>
  );
}

export function RuaNav() {
  const nav = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  const closeDropdowns = () => nav.current?.querySelectorAll("details[open]").forEach((d) => d.removeAttribute("open"));
  const closeAll = () => { closeDropdowns(); setOpen(false); };

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!nav.current?.contains(e.target as Node)) closeDropdowns();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeDropdowns();
      setOpen((was) => { if (was) toggle.current?.focus(); return false; });
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav ref={nav} className={s.navLinks} aria-label="Navegação principal">
        <details className={s.drop} name="rua-nav">
          <summary>Soluções <Chevron /></summary>
          <div className={s.dropPanel}>
            {solutionPillars.map((pillar, i) => (
              <Fragment key={pillar.pillar}>
                <span className={s.dropLabel}>{`0${i + 1} · ${pillar.pillar}`}</span>
                {pillar.links.map(([label, href]) => <Item key={href} label={label} href={href} onPick={closeAll} />)}
              </Fragment>
            ))}
          </div>
        </details>
        <details className={s.drop} name="rua-nav">
          <summary>Produtos e exemplos <Chevron /></summary>
          <div className={s.dropPanel}>
            {products.map(([label, href]) => <Item key={href} label={label} href={href} onPick={closeAll} />)}
          </div>
        </details>
        <Link className={s.navPlain} href="/quem-somos">A NexuSync</Link>
      </nav>

      <button ref={toggle} type="button" className={s.menuBtn} aria-expanded={open} aria-controls="rua-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen((v) => !v)}>
        <i /><i /><i />
      </button>
      {open && (
        <nav id="rua-menu" className={s.menuPanel} aria-label="Menu">
          <div>
            <span className={s.dropLabel}>Soluções</span>
            {solutionPillars.flatMap((p) => p.links).map(([label, href]) => <Item key={href} label={label} href={href} onPick={closeAll} />)}
          </div>
          <div>
            <span className={s.dropLabel}>Produtos e exemplos</span>
            {products.map(([label, href]) => <Item key={href} label={label} href={href} onPick={closeAll} />)}
          </div>
          <div>
            <span className={s.dropLabel}>A NexuSync</span>
            {about.map(([label, href]) => <Item key={href} label={label} href={href} onPick={closeAll} />)}
          </div>
        </nav>
      )}
    </>
  );
}
