"use client";

import { useEffect } from "react";

/**
 * Movimento leve dos modelos de loja, sem biblioteca:
 * - `data-reveal`: entra na tela ao rolar, com o atraso de `--i`; sem JS ou com redução de movimento, tudo aparece;
 * - `data-spot`: guarda a posição do ponteiro em --mx/--my para o brilho do card;
 * - `data-parallax`: recebe --px/--py (-0.5 a 0.5) conforme o ponteiro na janela.
 *
 * O elemento raiz define a entrada em `--reveal-from` (transform inicial), `--reveal-ms`, `--reveal-step` e `--ease`.
 * A entrada usa a Web Animations API porque este efeito pode rodar antes de o conteúdo da página ser hidratado:
 * mudar atributos ou classes desses elementos causaria erro de hidratação.
 */
export function TemplateFx({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const style = getComputedStyle(root);
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    const from = read("--reveal-from", "translateY(24px)");
    const duration = parseFloat(read("--reveal-ms", "600"));
    const step = parseFloat(read("--reveal-step", "80"));
    const easing = read("--ease", "ease-out");

    // Cada elemento fica parado no primeiro quadro (invisível) até aparecer na tela.
    const entrances = new Map<Element, Animation>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entrances.get(entry.target)?.play();
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    function watch() {
      if (calm) return;
      root!.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (entrances.has(el)) return;
        const animation = el.animate(
          [{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }],
          { duration, easing, delay: step * (Number(el.style.getPropertyValue("--i")) || 0), fill: "backwards" },
        );
        animation.pause();
        entrances.set(el, animation);
        io.observe(el);
      });
    }
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(root, { childList: true, subtree: true });

    let frame = 0;
    let last: PointerEvent | null = null;
    function paint() {
      frame = 0;
      if (!last) return;
      const event = last;
      const target = event.target instanceof Element ? event.target : null;
      const spot = target?.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const box = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${event.clientX - box.left}px`);
        spot.style.setProperty("--my", `${event.clientY - box.top}px`);
      }
      if (calm) return;
      const px = (event.clientX / window.innerWidth - 0.5).toFixed(3);
      const py = (event.clientY / window.innerHeight - 0.5).toFixed(3);
      root!.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        el.style.setProperty("--px", px);
        el.style.setProperty("--py", py);
      });
    }
    function move(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    }
    root.addEventListener("pointermove", move, { passive: true });

    return () => {
      io.disconnect();
      mutations.disconnect();
      entrances.forEach((animation) => animation.cancel());
      root.removeEventListener("pointermove", move);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootId]);

  return null;
}
