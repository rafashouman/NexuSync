"use client";

import { useEffect, useRef } from "react";
import s from "./rua.module.css";

/** Mounts the fixed 3D street. three.js is fetched after first paint and fully disposed on unmount. */
export function RuaWorld() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const veilS = useRef<HTMLDivElement>(null);
  const veilF = useRef<HTMLDivElement>(null);
  const tagRival = useRef<HTMLDivElement>(null);
  const tagYou = useRef<HTMLDivElement>(null);
  const tagYouTxt = useRef<HTMLElement>(null);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const root = canvas.current?.closest<HTMLElement>("[data-rua-root]");
    if (!root) return;
    const noGl = () => root.classList.add(s.noGl);
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) { noGl(); return; }
    const start = () => {
      if (cancelled) return;
      import("./world/scene").then(({ createWorld }) => {
        if (cancelled || !canvas.current || !veilS.current || !veilF.current || !tagRival.current || !tagYou.current || !tagYouTxt.current) return;
        dispose = createWorld({
          root,
          canvas: canvas.current,
          veilS: veilS.current,
          veilF: veilF.current,
          tagRival: tagRival.current,
          tagYou: tagYou.current,
          tagYouTxt: tagYouTxt.current,
        });
        if (!dispose) noGl();
      }).catch(noGl);
    };
    // Fetch and parse three.js only once the page has loaded and the browser is idle, so it never competes with the first paint.
    let idle = 0;
    let timer = 0;
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 1500 });
      else timer = window.setTimeout(start, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
      cancelled = true;
      dispose?.();
      root.classList.remove(s.noGl);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className={s.world} aria-hidden="true" tabIndex={-1} />
      <div ref={veilS} className={s.veilS} aria-hidden="true" />
      <div ref={veilF} className={s.veilF} aria-hidden="true" />
      <div ref={tagRival} className={`${s.tag} ${s.tagRival}`} aria-hidden="true">
        <span><i />Seu concorrente · 1º na busca</span>
      </div>
      <div ref={tagYou} className={`${s.tag} ${s.tagYou}`} aria-hidden="true">
        <span><i /><b ref={tagYouTxt}>Você · invisível na busca</b></span>
      </div>
    </>
  );
}
