"use client";

import { useEffect } from "react";

/**
 * Text motion of the home, all scroll-triggered and skipped with reduced motion:
 * - [data-rua-type]: the text writes itself with a caret; [data-hi] phrases inside light up afterwards.
 * - [data-rua-words]: words rise in one after another.
 * - [data-rua-play]: a block (scene mock) gets data-rua-play="true" so its CSS animation runs; [data-rua-count] inside counts up.
 * - [data-rua-stagger]: direct children enter in sequence.
 * Without JS (or with reduced motion) nothing is hidden: the "ready" states are only set here.
 */

/** Wraps every character in a span (words kept unbreakable). Idempotent, so dev StrictMode can run it twice. */
function splitChars(el: HTMLElement): HTMLElement[] {
  if (!el.dataset.split) {
    el.dataset.split = "1";
    const walk = (node: Node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.ELEMENT_NODE) { walk(child); continue; }
        if (child.nodeType !== Node.TEXT_NODE) continue;
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? "").split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(part); continue; }
          const word = document.createElement("span");
          word.dataset.word = "";
          for (const ch of part) {
            const c = document.createElement("span");
            c.dataset.c = "";
            c.textContent = ch;
            word.append(c);
          }
          frag.append(word);
        }
        child.replaceWith(frag);
      }
    };
    walk(el);
  }
  return Array.from(el.querySelectorAll<HTMLElement>("[data-c]"));
}

function splitWords(el: HTMLElement): HTMLElement[] {
  if (!el.dataset.split) {
    el.dataset.split = "1";
    let i = 0;
    const walk = (node: Node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          // links and inline elements move as one word
          const e = child as HTMLElement;
          e.dataset.w = "";
          e.style.setProperty("--i", String(i++));
          continue;
        }
        if (child.nodeType !== Node.TEXT_NODE) continue;
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? "").split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(part); continue; }
          const w = document.createElement("span");
          w.dataset.w = "";
          w.style.setProperty("--i", String(i++));
          w.textContent = part;
          frag.append(w);
        }
        child.replaceWith(frag);
      }
    };
    walk(el);
  }
  return Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
}

export function RuaText() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-rua-root]");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
    const plays = new Map<Element, () => void>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        plays.get(e.target)?.();
      }
    }, { threshold: 0.3, rootMargin: "0px 0px -12% 0px" });
    const watch = (el: Element, fn: () => void) => { plays.set(el, fn); io.observe(el); };

    root.querySelectorAll<HTMLElement>("[data-rua-type]").forEach((el) => {
      const chars = splitChars(el);
      if (!chars.length) return;
      const his = Array.from(el.querySelectorAll<HTMLElement>("[data-hi]"));
      chars.forEach((c) => c.setAttribute("data-c", "0"));
      his.forEach((h) => h.setAttribute("data-on", "false"));
      const caret = document.createElement("i");
      caret.dataset.caret = "";
      caret.setAttribute("aria-hidden", "true");
      watch(el, () => {
        const step = Math.min(38, Math.max(14, 1500 / chars.length));
        let i = 0;
        const tick = () => {
          chars[i].setAttribute("data-c", "1");
          chars[i].after(caret);
          i++;
          if (i < chars.length) later(tick, step * (0.55 + Math.random() * 0.9));
          else {
            his.forEach((h, k) => later(() => h.setAttribute("data-on", "true"), 150 + k * 220));
            later(() => caret.remove(), 1600);
          }
        };
        later(tick, 120);
      });
    });

    root.querySelectorAll<HTMLElement>("[data-rua-words]").forEach((el) => {
      splitWords(el);
      el.setAttribute("data-rua-words", "ready");
      watch(el, () => el.setAttribute("data-rua-words", "in"));
    });

    root.querySelectorAll<HTMLElement>("[data-rua-stagger]").forEach((el) => {
      const kids = Array.from(el.children) as HTMLElement[];
      kids.forEach((k, i) => k.style.setProperty("--i", String(i)));
      el.setAttribute("data-rua-stagger", "ready");
      watch(el, () => {
        el.setAttribute("data-rua-stagger", "in");
        // the delay only belongs to the entrance, not to later hovers
        later(() => kids.forEach((k) => k.style.removeProperty("--i")), 700 + kids.length * 100);
      });
    });

    root.querySelectorAll<HTMLElement>("[data-rua-play]").forEach((el) => {
      const counts = Array.from(el.querySelectorAll<HTMLElement>("[data-rua-count]"));
      counts.forEach((c) => { c.textContent = "0"; });
      el.setAttribute("data-rua-play", "ready");
      watch(el, () => {
        el.setAttribute("data-rua-play", "in");
        counts.forEach((c) => {
          const target = Number(c.dataset.ruaCount) || 0;
          const t0 = performance.now() + 300;
          const run = (now: number) => {
            const p = Math.min(1, Math.max(0, (now - t0) / 1400));
            c.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(run);
          };
          requestAnimationFrame(run);
        });
      });
    });

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
