"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { trackAnalyticsEvent } from "@/lib/analytics";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const byId = (id: string) => document.getElementById(id);

/** Scroll-driven DOM effects of the home: smooth scroll, method steps, drill, receipt and timer. */
export function RuaEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ lerp: 0.085, smoothWheel: true, autoRaf: true, anchors: { offset: -40, duration: 1.8 } });

    const track = byId("rua-track");
    const step = byId("rua-step");
    const segs = Array.from(byId("rua-segs")?.children ?? []);
    const phases = Array.from(byId("rua-phases")?.children ?? []);
    const lines = Array.from(document.querySelectorAll<HTMLElement>("[data-rua-line]"));
    const receipt = byId("rua-receipt");
    const drill = byId("rua-drill");
    const drillG = byId("rua-drill-g");
    const hole = byId("rua-hole");
    const dust = byId("rua-dust");
    const frameG = byId("rua-frame");
    const bit = byId("rua-bit");
    const rings = byId("rua-rings");
    const chain = Array.from(byId("rua-chain")?.querySelectorAll("span") ?? []);
    let lastStep = -1;
    let methodReported = false;

    function method() {
      if (!track || !step) return;
      const r = track.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      const n = Math.min(4, 1 + Math.floor(p * 4));
      if (n === lastStep) return;
      lastStep = n;
      if (n === 4 && !methodReported) {
        methodReported = true;
        trackAnalyticsEvent({ eventName: "home_method_complete" });
      }
      step.textContent = String(n);
      segs.forEach((seg, i) => seg.setAttribute("data-on", String(i < n)));
      phases.forEach((li, i) => li.setAttribute("data-state", i === n - 1 ? "on" : i < n - 1 ? "done" : "off"));
    }

    function printReceipt() {
      if (!receipt) return;
      const r = receipt.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.9 - r.top) / (r.height * 0.85));
      lines.forEach((line, i) => line.setAttribute("data-ink", String(p > ((i + 0.5) / lines.length) * 0.9)));
    }

    function drillScene(t: number) {
      if (!drill || !drillG || !hole || !dust || !frameG || !bit || !rings) return;
      const r = drill.getBoundingClientRect();
      const d = reduce ? 1 : clamp((window.innerHeight * 0.95 - r.top) / (window.innerHeight * 0.8));
      const approach = smooth(ramp(d, 0, 0.32));
      const drilling = ramp(d, 0.32, 0.55);
      const retreat = smooth(ramp(d, 0.55, 0.72));
      const hang = ramp(d, 0.72, 1);
      const working = drilling > 0 && drilling < 1;
      const shake = working && !reduce ? Math.sin(t * 60) * 1.2 : 0;
      drillG.setAttribute("transform", `translate(${(lerp(-150, 0, approach) - retreat * 230).toFixed(1)} ${shake.toFixed(1)})`);
      drillG.setAttribute("opacity", (1 - retreat).toFixed(2));
      bit.setAttribute("stroke-dashoffset", (drilling * 120 + (working ? t * 40 : 0)).toFixed(1));
      hole.setAttribute("r", (drilling * 6).toFixed(2));
      dust.setAttribute("opacity", (drilling > 0 && retreat < 1 ? (1 - retreat) * Math.min(1, drilling * 3) : 0).toFixed(2));
      const drop = 1 - smooth(clamp(hang * 1.6));
      const swing = hang > 0 && !reduce ? Math.sin(hang * 18) * (1 - hang) * 7 : 0;
      frameG.setAttribute("opacity", hang > 0 ? "1" : "0");
      frameG.setAttribute("transform", `translate(0 ${(-drop * 140).toFixed(1)}) rotate(${swing.toFixed(2)} 384 120)`);
      rings.setAttribute("opacity", hang > 0.6 ? (reduce ? "1" : (0.5 + 0.5 * Math.sin(t * 8)).toFixed(2)) : "0");
      const steps = [approach > 0.9, drilling > 0.6, hang > 0.5, hang > 0.85];
      chain.forEach((c, i) => c.setAttribute("data-on", String(steps[i])));
    }

    let raf = 0;
    const loop = (ms: number) => {
      method();
      printReceipt();
      drillScene(ms / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const started = Date.now();
    const timerEl = byId("rua-timer");
    const timer = setInterval(() => {
      if (!timerEl) return;
      const secs = Math.floor((Date.now() - started) / 1000);
      timerEl.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    }, 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      lenis?.destroy();
    };
  }, []);

  return null;
}
