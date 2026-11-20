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
const desktopPreviewQuery = "(min-width: 1024px)";

function subscribePreviewViewport(callback: () => void, query: string) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HeroTemplatePreview({
  mode = "sites",
  presentation = "default",
}: {
  mode?: "sites" | "shops";
  presentation?: "default" | "home";
}) {
  const templates = mode === "shops" ? shopTemplates : siteTemplates;
  const previewViewportQuery =
    presentation === "home" ? "(min-width: 768px)" : desktopPreviewQuery;
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const previewVisible = useSyncExternalStore(
    (callback) => subscribePreviewViewport(callback, previewViewportQuery),
    () => window.matchMedia(previewViewportQuery).matches,
    () => false,
  );
  const desktopVisible = useSyncExternalStore(
    (callback) => subscribePreviewViewport(callback, desktopPreviewQuery),
    () => window.matchMedia(desktopPreviewQuery).matches,
    () => false,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );
  const [iframeReady, setIframeReady] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const phoneScreenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [phoneScale, setPhoneScale] = useState(0);
  const visibleIndex = activeIndex % templates.length;
  const template = templates[visibleIndex];

  const homePreview = presentation === "home" ? (
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className={`${previewVisible ? "block" : "hidden"} relative mx-auto w-full max-w-[650px]`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-8 top-10 h-64 rounded-full bg-[#ffb547]/20 blur-[90px]" />
        <div className="relative grid items-end">
        <div data-preview-device="laptop" className="relative hidden min-w-0 pb-0 lg:col-start-1 lg:row-start-1 lg:block lg:w-[90%]">
          <div className="relative w-full pl-3">
            <div className="rounded-t-2xl border border-[#8be7c5]/35 bg-abyss p-[3px] pb-[3px] shadow-[0_30px_70px_rgba(9,44,52,0.55)]">
              <div className="flex h-8 items-center gap-1.5 border-b border-turquoise/25 bg-abyss px-3">
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
                <span className="ml-2 min-w-0 truncate rounded-full border border-turquoise/25 bg-ocean/65 px-3 py-0.5 font-mono text-[10px] text-[#c8d2eb]">
                  nexusync.online{template.href}
                </span>
              </div>
              <div
                ref={screenRef}
                className="relative aspect-[1280/760] w-full overflow-hidden rounded-b-lg bg-abyss"
              >
                <div aria-hidden className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#2032a6] to-[#141f50] text-xs font-semibold text-[#8be7c5]">
                  {template.brand}
                </div>
                {iframeReady && desktopVisible && scale > 0 && (
                  <iframe
                    key={`desktop-${template.href}`}
                    src={template.href}
                    title={`Prévia desktop demonstrativa do site ${template.brand}, categoria ${template.category}`}
                    scrolling="no"
                    tabIndex={-1}
                    className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                    style={{ width: 1280, height: 760, transform: `scale(${scale})` }}
                  />
                )}
              </div>
            </div>
            <div aria-hidden className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.2rem] border border-t-0 border-[#8be7c5]/25 bg-gradient-to-b from-[#8be7c5] to-[#2a40ba]" />
          </div>
        </div>

        <div data-preview-device="phone" className="relative mx-auto w-[min(100%,240px)] md:w-[min(100%,250px)] lg:col-start-1 lg:row-start-1 lg:z-10 lg:mx-0 lg:w-[34%] lg:max-w-[220px] lg:justify-self-end">
          <div className="rounded-[2.4rem] border border-[#8be7c5]/45 bg-abyss p-1 shadow-[0_24px_60px_rgba(9,44,52,0.65)]">
            <div className="relative overflow-hidden rounded-[2.05rem]">
              <span aria-hidden className="pointer-events-none absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-abyss" />
              <div ref={phoneScreenRef} className="relative aspect-[390/844] w-full overflow-hidden bg-abyss">
                <div aria-hidden className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#2032a6] to-[#141f50] text-center text-xs font-semibold text-[#8be7c5]">
                  {template.brand}
                </div>
                {iframeReady && previewVisible && phoneScale > 0 && (
                  <iframe
                    key={`phone-${template.href}`}
                    src={template.href}
                    title={`Prévia mobile demonstrativa do site ${template.brand}, categoria ${template.category}`}
                    scrolling="no"
                    tabIndex={-1}
                    className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                    style={{ width: 390, height: 844, transform: `scale(${phoneScale})` }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

        <div data-preview-navigation className="relative mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <div className="flex flex-wrap justify-center gap-1.5" aria-label="Escolha um site demonstrativo para visualizar">
            {templates.map((item, index) => (
              <button
                key={item.href}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === visibleIndex}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb547] ${
                  index === visibleIndex
                    ? "border-[#ffb547]/65 bg-[#ffb547]/15 text-[#f4f4e9]"
                    : "border-[#8be7c5]/25 text-[#c8d2eb] hover:border-[#8be7c5]/55 hover:text-[#f4f4e9]"
                }`}
              >
                {item.name}
              </button>
            ))}
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-label={userPaused ? "Retomar alternância automática" : "Pausar alternância automática"}
                className="rounded-full border border-[#8be7c5]/25 px-2.5 py-1 text-[10px] font-semibold text-[#c8d2eb] hover:border-[#8be7c5]/55 hover:text-[#f4f4e9]"
              >
                {userPaused ? "▶ Retomar" : "⏸ Pausar"}
              </button>
            )}
          </div>
          <Link href={template.href} className="text-[11px] font-semibold text-[#ffb547] underline underline-offset-4 hover:text-[#f4f4e9]">
            Explorar {template.brand}
          </Link>
        </div>
        <p className="relative mt-2 text-center text-[10px] text-[#c8d2eb] lg:text-left">
          Projetos demonstrativos; conteúdo ilustrativo.
        </p>
      </div>
    ) : null;

  useEffect(() => {
    if (presentation === "home" ? !desktopVisible : !previewVisible) return;
    const screen = screenRef.current;
    if (!screen) return;
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / 1280),
    );
    observer.observe(screen);
    return () => observer.disconnect();
  }, [desktopVisible, previewVisible, presentation]);

  useEffect(() => {
    if (presentation !== "home" || !previewVisible) return;
    const screen = phoneScreenRef.current;
    if (!screen) return;
    const observer = new ResizeObserver(([entry]) =>
      setPhoneScale(entry.contentRect.width / 390),
    );
    observer.observe(screen);
    return () => observer.disconnect();
  }, [previewVisible, presentation]);

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

  if (presentation === "home") return homePreview;

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className={`${mode === "shops" ? "" : "hidden lg:block"} rounded-3xl border border-turquoise/20 bg-ocean/65 p-6 shadow-brand-glow`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-ice">
          {mode === "shops" ? "Prévia de lojas virtuais" : "Prévia de sites demonstrativos"}
        </p>
        <span className="text-xs text-muted-foreground">
          {template.category}
        </span>
      </div>

      <div className="mx-auto w-full max-w-[500px]">
        <div className="rounded-t-2xl border border-turquoise/25 bg-abyss p-[3px] pb-[3px] shadow-2xl">
          <div className="flex h-8 items-center gap-1.5 border-b border-turquoise/25 bg-abyss px-3">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff6b61]" />
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#ffc14f]" />
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#49c781]" />
            <span className="ml-2 min-w-0 truncate rounded-full border border-turquoise/25 bg-ocean/65 px-3 py-0.5 font-mono text-[10px] text-ivory/50">
              nexusync.online{template.href}
            </span>
          </div>
          <div
            ref={screenRef}
            className="relative aspect-[1280/760] w-full overflow-hidden rounded-b-lg bg-abyss"
          >
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center bg-gradient-to-b from-turquoise/60 to-[#141f50] text-xs font-semibold text-ice/70"
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
          className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[1.2rem] border border-t-0 border-turquoise/25 bg-gradient-to-b from-[#141f50] to-[#141f50]"
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
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise ${
                index === activeIndex
                  ? "border-turquoise/50 bg-turquoise/15 text-ivory"
                  : "border-turquoise/25 text-ivory/60 hover:border-turquoise/25 hover:text-ivory"
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
              className="rounded-full border border-turquoise/25 px-3 py-1.5 text-xs font-semibold text-ivory/60 transition-colors hover:border-turquoise/25 hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise"
            >
              {userPaused ? "▶ Retomar" : "⏸ Pausar"}
            </button>
          )}
        </div>
        <Link
          href={template.href}
          className="text-xs font-semibold text-ice underline underline-offset-4 hover:text-ivory"
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
