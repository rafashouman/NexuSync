"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { trackAnalyticsEvent, type HomeSearchCategory } from "@/lib/analytics";
import { PULSE_EVENT } from "./events";
import { SearchIcon } from "./icons";
import s from "./rua.module.css";

const CHIPS = ["hamburgueria", "loja de roupas", "dentista", "barbearia"] as const;
const CYCLE: HomeSearchCategory[] = ["hamburgueria", "dentista", "loja de roupas", "advogado", "pet shop", "barbearia"];

/** O que o site da "Sua empresa" mostra em cada segmento e qual demonstração o "Explorar" abre. */
const DEMO_BY_CATEGORY: Record<string, { features: string; href: string }> = {
  hamburgueria: { features: "Monte seu pedido · cardápio com fotos", href: "/templates/cardapio" },
  "loja de roupas": { features: "Vitrine da coleção · peças por categoria", href: "/templates/streetwear" },
};
const DEFAULT_DEMO = { features: "Serviços explicados · agenda · WhatsApp", href: "/templates" };
const demoOf = (q: string) => DEMO_BY_CATEGORY[q.trim().toLowerCase()] ?? DEFAULT_DEMO;
const categoryOf = (q: string): HomeSearchCategory => {
  const normalized = q.trim().toLowerCase();
  return (CYCLE as string[]).includes(normalized) ? (normalized as HomeSearchCategory) : "outro";
};

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SearchSimulator() {
  const [query, setQuery] = useState("hamburgueria");
  const [result, setResult] = useState<string | null>("hamburgueria");
  const token = useRef(0);
  const auto = useRef(true);
  const box = useRef<HTMLDivElement>(null);

  function announce() {
    document.getElementById("rua-hl")?.setAttribute("data-lit", "true");
    window.dispatchEvent(new CustomEvent(PULSE_EVENT));
  }

  function show(q: string) {
    setResult(q);
    announce();
  }

  async function type(q: string, my: number) {
    setResult(null);
    document.getElementById("rua-hl")?.setAttribute("data-lit", "false");
    for (let i = 1; i <= q.length; i++) {
      if (my !== token.current) return;
      setQuery(q.slice(0, i));
      await sleep(55 + Math.random() * 55);
    }
    await sleep(300);
    if (my === token.current) show(q);
  }

  useEffect(() => {
    announce();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.15 });
    if (box.current) io.observe(box.current);
    let alive = true;
    let i = 1;
    (async () => {
      await sleep(3600);
      while (alive && auto.current) {
        if (!visible) { await sleep(900); continue; }
        const my = ++token.current;
        await type(CYCLE[i++ % CYCLE.length], my);
        if (!alive || !auto.current || my !== token.current) return;
        await sleep(3400);
      }
    })();
    return () => { alive = false; io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopAuto() { auto.current = false; token.current++; }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    stopAuto();
    const q = query.trim().slice(0, 40) || "seu serviço";
    setQuery(q);
    show(q);
    trackAnalyticsEvent({ eventName: "home_search_simulated", category: categoryOf(q), input: "typed" });
  }

  return (
    <div className={s.search} ref={box} data-rua-search="">
      <p className={s.searchTitle}>Simule uma busca. Qual resultado você abriria?</p>
      <form className={s.field} onSubmit={onSubmit} autoComplete="off">
        <label htmlFor="rua-q">
          <SearchIcon />
          <input id="rua-q" name="q" maxLength={40} value={query} aria-label="Seu serviço"
            onFocus={(e) => { if (auto.current) { stopAuto(); e.currentTarget.select(); } }}
            onChange={(e) => setQuery(e.target.value)} />
          <span className={s.near}>perto de mim</span>
        </label>
        <button type="submit" aria-label="Pesquisar">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </button>
      </form>
      <div className={s.chips} role="group" aria-label="Exemplos de serviço">
        {CHIPS.map((chip) => (
          <button key={chip} type="button" className={s.chip} aria-pressed={result === chip}
            onClick={() => {
              stopAuto();
              const my = ++token.current;
              type(chip, my);
              trackAnalyticsEvent({ eventName: "home_search_simulated", category: chip, input: "chip" });
            }}>
            {cap(chip)}
          </button>
        ))}
      </div>
      <ul className={s.results} aria-live="polite">
        {result && (
          <>
            <li key={`top-${result}`} className={s.top}>
              <span className={s.rpin} aria-hidden="true" />
              <div>
                <b>Sua empresa · {cap(result)}</b>
                <small>{demoOf(result).features}</small>
                <span className={s.acts}><a href={demoOf(result).href}><span>Explorar</span></a><span>Rotas</span><span>Ligar</span></span>
              </div>
            </li>
            <li key={`you-${result}`} className={s.you}>
              <span className={`${s.rpin} ${s.rpinOff}`} aria-hidden="true" />
              <div><b>{cap(result)} · site padrão</b><small>Início · Sobre · Contato. Nada para explorar.</small></div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
