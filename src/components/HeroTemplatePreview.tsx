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
const previewViewportQuery = "(min-width: 1024px)";

function subscribePreviewViewport(callback: () => void) {
  const query = window.matchMedia(previewViewportQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

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
  const previewVisible = useSyncExternalStore(
    subscribePreviewViewport,
    () => window.matchMedia(previewViewportQuery).matches,
    () => false,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );
  const [iframeReady, setIframeReady] = useState(false);
  const template = templates[activeIndex];

  // Defer the heavy demo iframe until the main page has loaded and hydrated.
  useEffect(() => {
    if (!previewVisible) return;
    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(() => setIframeReady(true), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, [previewVisible]);
  const rotating = previewVisible && !userPaused && !hovering && !tabHidden && !reducedMotion;

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
      className="hidden rounded-3xl border border-violet-300/20 bg-white/[0.03] p-6 shadow-violet-glow lg:block">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">
          Prévia de sites demonstrativos
        </p>
        <span className="text-xs text-muted-foreground">
          {template.category}
        </span>
      </div>

      {/* Phone at 1024–1279px; tablet viewport (768×1024) from 1280px. */}
      <div className="mx-auto w-fit max-w-full rounded-[2.75rem] border border-white/15 bg-[#05060a] p-3 shadow-2xl xl:rounded-[2rem]">
        <div className="relative h-[608px] w-[280px] overflow-hidden rounded-[2.1rem] bg-[#0b0d10] xl:h-[480px] xl:w-[360px] xl:rounded-[1.25rem] 2xl:h-[544px] 2xl:w-[408px]">
          <span
            aria-hidden
            className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black xl:top-1 xl:h-1.5 xl:w-1.5"
          />
          <div
            aria-hidden
            className="absolute inset-0 grid place-items-center bg-gradient-to-b from-violet-950/60 to-[#0b0d10] text-xs font-semibold text-violet-200/70"
          >
            {template.brand}
          </div>
          {iframeReady && previewVisible && <iframe
            key={template.href}
            src={template.href}
            title={`Prévia responsiva demonstrativa do site ${template.brand}, categoria ${template.category}`}
            scrolling="no"
            tabIndex={-1}
            className="pointer-events-none absolute left-0 top-0 h-[844px] w-[390px] origin-top-left scale-[0.718] border-0 xl:h-[1024px] xl:w-[768px] xl:scale-[0.46875] 2xl:scale-[0.53125]"
                      />}
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
