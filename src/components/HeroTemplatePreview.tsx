"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";

type PreviewTemplate = {
  name: string;
  brand: string;
  href: string;
  category: string;
};

const siteTemplates: readonly PreviewTemplate[] = [
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
  {
    name: "Dog & Açaí",
    brand: "Dog & Açaí",
    href: "/templates/dog-e-acai",
    category: "Cardápio digital",
  },
  {
    name: "Arquitetura",
    brand: "Ateliê Vão",
    href: "/templates/arquitetura",
    category: "Arquitetura residencial",
  },
  {
    name: "Academias",
    brand: "PulseFit",
    href: "/templates/academias",
    category: "Fitness e bem-estar",
  },
] as const;

const shopTemplates: readonly PreviewTemplate[] = [
  {
    name: "Streetwear",
    brand: "Vortex Atelier",
    href: "/templates/streetwear",
    category: "Moda e e-commerce",
  },
  {
    name: "Carros",
    brand: "Prime Motors",
    href: "/templates/carros",
    category: "Automotivo e seminovos",
  },
  {
    name: "Miniaturas",
    brand: "Alchemist Voxel",
    href: "/templates/miniaturas",
    category: "Arte 3D e colecionáveis",
  },
];

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

export function HeroTemplatePreview({
  mode = "sites",
}: {
  mode?: "sites" | "shops";
}) {
  const templates = mode === "shops" ? shopTemplates : siteTemplates;
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
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const visibleIndex = activeIndex % templates.length;
  const template = templates[visibleIndex];

  useEffect(() => {
    if (!previewVisible) return;
    const screen = screenRef.current;
    if (!screen) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / 1280),
    );
    observer.observe(screen);
    return () => observer.disconnect();
  }, [previewVisible]);

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
  }, [rotating, activeIndex, templates.length]);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className={`${mode === "shops" ? "" : "hidden lg:block"} rounded-3xl border border-violet-300/20 bg-white/[0.03] p-6 shadow-violet-glow`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">
          {mode === "shops" ? "Prévia de lojas virtuais" : "Prévia de sites demonstrativos"}
        </p>
        <span className="text-xs text-muted-foreground">
          {template.category}
        </span>
      </div>

      <div className="mx-auto w-full max-w-[500px]">
        <div className="rounded-t-2xl border border-white/15 bg-[#05060a] p-2.5 pb-2 shadow-2xl">
          <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] bg-[#0b0e13] px-3">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
            <span className="ml-2 min-w-0 truncate rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-0.5 font-mono text-[10px] text-white/50">
              nexusync.online{template.href}
            </span>
          </div>
          <div
            ref={screenRef}
            className="relative aspect-[1280/760] w-full overflow-hidden rounded-b-lg bg-[#0b0d10]"
          >
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center bg-gradient-to-b from-violet-950/60 to-[#0b0d10] text-xs font-semibold text-violet-200/70"
            >
              {template.brand}
            </div>
            {iframeReady && previewVisible && scale > 0 && (
              <iframe
                key={template.href}
                src={template.href}
                title={`Prévia responsiva demonstrativa do site ${template.brand}, categoria ${template.category}`}
                scrolling="no"
                tabIndex={-1}
                className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                style={{
                  width: 1280,
                  height: 760,
                  transform: `scale(${scale})`,
                }}
              />
            )}
          </div>
        </div>
        <div
          aria-hidden
          className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.2rem] border border-t-0 border-white/15 bg-gradient-to-b from-[#2a2b33] to-[#14151a]"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap gap-2"
          aria-label={
            mode === "shops"
              ? "Escolha uma loja demonstrativa para visualizar"
              : "Escolha um template para visualizar"
          }
        >
          {templates.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === visibleIndex}
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
