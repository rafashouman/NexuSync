"use client";

import { useEffect, useRef } from "react";
import s from "./StudioCursor.module.css";

/** A native cursor stays in place until a real mouse enters the site. */
export function StudioCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = cursor.current;
    const site = element?.closest<HTMLElement>(".nexusync-site");
    if (!element || !site) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;
    let hasMouse = false;
    let target: EventTarget | null = null;

    function hide() {
      site!.removeAttribute("data-custom-cursor");
      element!.dataset.visible = "false";
      element!.dataset.pressed = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    }
    function updateTarget(target: EventTarget | null) {
      const node = target instanceof Element ? target : null;
      if (!fine.matches || reduced.matches || !node || !site!.contains(node) ||
        node.closest('input, textarea, select, iframe, [contenteditable="true"], [disabled], [aria-disabled="true"]')) {
        hide();
        return;
      }
      const control = node.closest('a[href], button, summary, label, [role="button"]');
      let dark = !!node.closest('[data-cursor-tone="ink"]');
      const background = control && getComputedStyle(control).backgroundColor;
      if (background?.startsWith("rgb")) {
        const channels = background.match(/[\d.]+/g)?.map(Number);
        if (channels && (channels.length === 3 || channels[3] > .9)) {
          dark = (channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722) > 140;
        }
      }
      element!.dataset.interactive = String(!!control);
      element!.style.setProperty("--cursor-color", dark ? "#080b12" : "#ffb547");
      element!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element!.dataset.visible = "true";
      site!.dataset.customCursor = "true";
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") { hasMouse = false; hide(); return; }
      hasMouse = true;
      x = event.clientX;
      y = event.clientY;
      target = event.target;
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; updateTarget(target); });
    }
    function scroll() {
      if (hasMouse && element!.dataset.visible === "true") updateTarget(document.elementFromPoint(x, y));
    }
    function leave(event: PointerEvent) {
      if (!event.relatedTarget || event.relatedTarget instanceof HTMLIFrameElement) hide();
    }
    function press(event: PointerEvent) {
      if (event.pointerType !== "mouse") { hasMouse = false; hide(); return; }
      if (element!.dataset.visible === "true") element!.dataset.pressed = "true";
    }
    function release() { element!.dataset.pressed = "false"; }
    function keyboard(event: KeyboardEvent) { if (event.key === "Tab" || event.key === "Escape") hide(); }
    function visibility() { if (document.hidden) hide(); }
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("scroll", scroll, { passive: true, capture: true });
    document.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    fine.addEventListener("change", hide);
    reduced.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("scroll", scroll, true);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
      fine.removeEventListener("change", hide);
      reduced.removeEventListener("change", hide);
    };
  }, []);
  return <div ref={cursor} className={s.cursor} aria-hidden="true" data-studio-cursor=""><span className={s.mark} /></div>;
}
