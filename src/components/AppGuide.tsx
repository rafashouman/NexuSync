"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X } from "lucide-react";
import type { TourStep } from "@/data/appTours";

const primary = "rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-cyan-200";
const secondary = "rounded-xl border border-white/20 px-3 py-2.5 text-sm text-white hover:bg-white/10";

export function AppGuide({ slug, steps }: { slug: string; steps: TourStep[] }) {
  const [index, setIndex] = useState(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = steps[index];
  const storageKey = `nexusync:tour:v2:${slug}`;

  useEffect(() => {
    if (window.self !== window.top) return;
    try { if (localStorage.getItem(storageKey) === "hide") return; } catch { /* Private browsing */ }
    const frame = requestAnimationFrame(() => setIndex(0));
    return () => cancelAnimationFrame(frame);
  }, [storageKey]);

  function close() {
    setIndex(-1);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }

  function finish(showAgain: boolean) {
    try { localStorage.setItem(storageKey, showAgain ? "show" : "hide"); } catch { /* Private browsing */ }
    close();
  }

  useEffect(() => {
    if (index < 0) return;
    heading.current?.focus({ preventScroll: true });
    function escape(event: KeyboardEvent) { if (event.key === "Escape") close(); }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [index]);

  useLayoutEffect(() => {
    if (!step) return;
    let target: HTMLElement | null = null;
    let frame = 0;
    const panel = card.current!;
    const clicked = () => setIndex(index + 1);
    const resize = new ResizeObserver(schedule);
    const missing = window.setTimeout(() => setUnavailable(true), 5500);
    let settlingUntil = 0;

    function measure() {
      frame = 0;
      if (!target?.isConnected || !target.getClientRects().length) {
        target?.removeEventListener("click", clicked);
        if (target) resize.unobserve(target);
        target = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${step.target}"]`))
          .find(el => el.getClientRects().length > 0) ?? null;
        if (!target) { setRect(null); return; }
        resize.observe(target);
        target.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
        settlingUntil = performance.now() + 450;
        if (step.click) target.addEventListener("click", clicked, { once: true });
      }
      const bounds = target.getBoundingClientRect();
      setRect(previous => previous && previous.x === bounds.x && previous.y === bounds.y
        && previous.width === bounds.width && previous.height === bounds.height ? previous : bounds);
      const gap = 14;
      const { innerWidth: w, innerHeight: h } = window;
      const below = bounds.bottom + gap;
      const above = bounds.top - gap - panel.offsetHeight;
      const top = below + panel.offsetHeight <= h - gap || (above < gap && bounds.top < h / 2)
        ? below : above;
      panel.style.top = Math.max(gap, Math.min(h - panel.offsetHeight - gap, top)) + "px";
      panel.style.left = Math.max(gap, Math.min(w - panel.offsetWidth - gap, bounds.left)) + "px";
      if (performance.now() < settlingUntil) schedule();
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
    resize.observe(panel);
    const mutations = new MutationObserver(() => { if (!target?.isConnected) schedule(); });
    mutations.observe(document.body, { subtree: true, childList: true });
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    frame = requestAnimationFrame(() => {
      setUnavailable(false);
      measure();
    });
    return () => {
      clearTimeout(missing);
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      target?.removeEventListener("click", clicked);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      panel.style.removeProperty("top");
      panel.style.removeProperty("left");
    };
  }, [step, index]);

  if (index < 0) return <button type="button" ref={trigger} onClick={() => setIndex(0)}
    className="fixed bottom-20 left-3 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg sm:bottom-5">
    <BookOpen size={16} /> Como usar
  </button>;

  return createPortal(<>
    {step && rect && <div aria-hidden="true" className="pointer-events-none fixed z-[9998] rounded-xl border-2 border-cyan-300 shadow-[0_0_0_9999px_rgba(3,7,18,.52)]"
      style={{ top: rect.top - 4, left: rect.left - 4, width: rect.width + 8, height: rect.height + 8 }} />}
    <aside ref={card} aria-label="Guia de uso" className="fixed bottom-auto left-3 top-4 z-[9999] max-h-[70dvh] w-[min(22rem,calc(100vw-28px))] overflow-y-auto rounded-2xl border border-cyan-300/40 bg-zinc-950 p-4 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-300">{step ? `Passo ${index + 1} de ${steps.length}` : "Guia concluído"}</span>
        <button type="button" aria-label="Fechar guia" onClick={close} className="rounded-lg p-2 hover:bg-white/10"><X size={18} /></button>
      </div>
      <h2 ref={heading} tabIndex={-1} className="text-lg font-bold outline-none">{step?.title ?? "Mostrar o guia na próxima visita?"}</h2>
      <p className="mt-1 text-sm leading-relaxed text-zinc-300">{step ? (rect ? step.text : unavailable ? "Este controle está fechado ou indisponível agora. Você pode seguir para o próximo passo." : "Aguardando o controle aparecer…") : "Você pode reabrir o passo a passo pelo botão Como usar."}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {step ? <>
          {index > 0 && !steps[index - 1].click && <button type="button" className={secondary} onClick={() => setIndex(index - 1)}>Voltar</button>}
          <button type="button" className={step.click && rect ? secondary : primary} onClick={() => setIndex(index + 1)}>
            {step.click && rect ? "Pular etapa" : index === steps.length - 1 ? "Concluir" : "Próximo"}
          </button>
        </> : <>
          <button type="button" className={primary} onClick={() => finish(true)}>Sim, mostrar</button>
          <button type="button" className={secondary} onClick={() => finish(false)}>Não mostrar</button>
        </>}
      </div>
    </aside>
  </>, document.body);
}
