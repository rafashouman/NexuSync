"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";

const templates = [
  {
    name: "Academias",
    brand: "PulseFit",
    href: "/templates/academias",
    category: "Fitness e bem-estar",
  },
  {
    name: "Cardápio",
    brand: "Kobra Burger",
    href: "/templates/cardapio",
    category: "Gastronomia",
  },
  {
    name: "Streetwear",
    brand: "Vortex Atelier",
    href: "/templates/streetwear",
    category: "Moda e e-commerce",
  },
] as const;

const ROTATION_MS = 9000;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HeroTemplatePreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );
  const template = templates[activeIndex];
  const rotating = !userPaused && !hovering && !tabHidden && !reducedMotion;

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Depending on activeIndex restarts the 9s timer after manual selection.
  useEffect(() => {
    if (!rotating) return;
    const timer = setTimeout(
      () => setActiveIndex((current) => (current + 1) % templates.length),
      ROTATION_MS,
    );
    return () => clearTimeout(timer);
  }, [rotating, activeIndex]);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="rounded-3xl border border-violet-300/20 bg-white/[0.03] p-4 shadow-violet-glow sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">
          Prévia de sites demonstrativos
        </p>
        <span className="text-xs text-muted-foreground">
          {template.category}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10] shadow-2xl">
        <div className="flex h-9 items-center gap-1.5 border-b border-white/[0.08] bg-[#0b0e13] px-3 sm:px-4">
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
          <span className="ml-2 min-w-0 truncate rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-white/50">
            nexusync.online{template.href}
          </span>
        </div>
        <div className="relative aspect-[1.44] w-full overflow-hidden bg-[#0b0d10]">
          <iframe
            key={template.href}
            src={template.href}
            title={`Prévia demonstrativa do site ${template.brand}, categoria ${template.category}`}
            loading="lazy"
            scrolling="no"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap gap-2"
          aria-label="Escolha um template para visualizar"
        >
          {templates.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
                index === activeIndex
                  ? "border-violet-300/50 bg-violet-400/15 text-white"
                  : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
              }`}
            >
              {item.name}
            </button>
          ))}
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((value) => !value)}
              aria-label={
                userPaused
                  ? "Retomar alternância automática"
                  : "Pausar alternância automática"
              }
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              {userPaused ? "▶ Retomar" : "⏸ Pausar"}
            </button>
          )}
        </div>
        <Link
          href={template.href}
          className="text-xs font-semibold text-violet-200 underline underline-offset-4 hover:text-white"
        >
          Explorar {template.brand}
        </Link>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Projetos demonstrativos; conteúdo ilustrativo.
      </p>
    </div>
  );
}
