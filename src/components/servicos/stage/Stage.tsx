"use client";

import { useEffect, useRef } from "react";
import type { StageRefs } from "./core";
import s from "../servico.module.css";

type SceneModule = { createScene: (refs: StageRefs) => (() => void) | null };

/**
 * Sticky 3D stage of a service page. Put it first inside an element with [data-stage-root];
 * the [data-stage-step] elements inside it drive the scene. three.js loads after first paint
 * (idle) and is disposed on unmount; without WebGL the page simply shows the text.
 */
export function Stage({ load }: { load: () => Promise<SceneModule> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const loader = useRef(load);

  useEffect(() => {
    const root = canvas.current?.closest<HTMLElement>("[data-stage-root]");
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-stage-step]"));
    const onStep = (i: number) => {
      root.dataset.step = String(i);
      steps.forEach((el, k) => { el.dataset.state = k < i ? "done" : k === i ? "on" : "off"; });
    };
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const noGl = () => root.classList.add(s.noGl);
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) { noGl(); return; }
    const start = () => {
      if (cancelled) return;
      loader.current().then(({ createScene }) => {
        if (cancelled || !canvas.current) return;
        dispose = createScene({ root, canvas: canvas.current, steps, onStep });
        if (!dispose) noGl();
        else root.classList.add(s.glOn);
      }).catch(noGl);
    };
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
      root.classList.remove(s.noGl, s.glOn);
    };
  }, []);

  return (
    <div className={s.stage} aria-hidden="true">
      <canvas ref={canvas} className={s.canvas} tabIndex={-1} />
      <div className={s.veil} />
    </div>
  );
}
