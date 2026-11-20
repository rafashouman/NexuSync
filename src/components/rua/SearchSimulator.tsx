"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { trackAnalyticsEvent, type HomeSearchCategory } from "@/lib/analytics";
import { PULSE_EVENT } from "./events";
import { SearchIcon } from "./icons";
import s from "./rua.module.css";

const CHIPS = ["dentista", "pizzaria", "eletricista", "barbearia"] as const;
const CYCLE: HomeSearchCategory[] = ["dentista", "pizzaria", "eletricista", "advogado", "pet shop", "barbearia"];
const categoryOf = (q: string): HomeSearchCategory => {
  const normalized = q.trim().toLowerCase();
  return (CYCLE as string[]).includes(normalized) ? (normalized as HomeSearchCategory) : "outro";
};

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SearchSimulator() {
  const [query, setQuery] = useState("dentista");
  const [result, setResult] = useState<string | null>("dentista");
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
      <p className={s.searchTitle}>Simule uma busca na sua cidade</p>
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
                <b>{cap(result)} · seu concorrente</b>
                <small>★ 4,8 · a 300 m · aberto agora</small>
                <span className={s.acts}><span>Site</span><span>Rotas</span><span>Ligar</span></span>
              </div>
            </li>
            <li key={`you-${result}`} className={s.you}>
              <span className={`${s.rpin} ${s.rpinOff}`} aria-hidden="true" />
              <div><b>Sua empresa</b><small>Nenhum resultado encontrado.</small></div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
