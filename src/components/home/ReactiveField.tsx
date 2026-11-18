"use client";

import { useEffect, useRef } from "react";

type Point = readonly [number, number, number];
type Shape = "sphere" | "weave";

function curves(shape: Shape): Point[][] {
  return Array.from({ length: 18 }, (_, lane) => {
    const phase = lane / 18 * Math.PI * 2;
    return Array.from({ length: 81 }, (_, i): Point => {
      const t = i / 80 * Math.PI * 2;
      if (shape === "weave") {
        const v = phase + t * 2;
        const radius = 1.15 + Math.cos(v) * .42;
        return [Math.cos(t) * radius, Math.sin(v) * .64, Math.sin(t) * radius];
      }
      const twist = phase + Math.sin(t) * .72;
      return [Math.cos(t) * 1.5, Math.sin(t) * Math.cos(twist) * 1.5, Math.sin(t) * Math.sin(twist) * 1.5];
    });
  });
}
const fields = { sphere: curves("sphere"), weave: curves("weave") };

function project(points: Point[], pitch: number, yaw: number) {
  const cx = Math.cos(pitch), sx = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  return points.map(([x, y, z], i) => {
    const dx = x * cy + z * sy;
    const dz = z * cy - x * sy;
    const dy = y * cx - dz * sx;
    const depth = y * sx + dz * cx;
    const scale = 125 * 5 / (5 + depth);
    return `${i ? "L" : "M"}${(250 + dx * scale).toFixed(2)},${(250 + dy * scale).toFixed(2)}`;
  }).join(" ");
}

/** SVG curves with a projected 3D rotation; no additional WebGL context. */
export function ReactiveField({ shape = "sphere", paused = false, className = "" }: {
  shape?: Shape;
  paused?: boolean;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const pose = useRef({ pitch: .45, yaw: -.35, phase: 0 });
  useEffect(() => {
    const element = svg.current;
    const section = element?.closest("section");
    if (!element || !section) return;
    const paths = element.querySelectorAll("path");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, previous = 0;
    let visible = false, targetX = 0, targetY = 0;
    const orientation = pose.current;
    function enabled() { return visible && !paused && fine.matches && !reduced.matches && !document.hidden; }
    function animate(time: number) {
      if (!enabled()) { frame = 0; return; }
      frame = requestAnimationFrame(animate);
      if (time - previous < 32) return;
      const dt = previous ? Math.min((time - previous) / 1000, .05) : 0;
      previous = time;
      orientation.phase += dt * .07;
      const follow = 1 - Math.exp(-dt * 5);
      orientation.pitch += (.45 + targetY * .48 - orientation.pitch) * follow;
      orientation.yaw += (-.35 + targetX * .65 - orientation.yaw) * follow;
      fields[shape].forEach((points, i) => paths[i]?.setAttribute("d", project(points, orientation.pitch, orientation.yaw + orientation.phase)));
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      element!.dataset.active = String(enabled());
      if (enabled()) frame = requestAnimationFrame(animate);
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !enabled()) return;
      const bounds = section!.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    }
    function leave() { targetX = 0; targetY = 0; }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [shape, paused]);
  return <svg ref={svg} className={className} viewBox="0 0 500 500" fill="none" aria-hidden="true" data-reactive-field={shape}>
    {fields[shape].map((points, i) => <path key={i} d={project(points, .45, -.35)} stroke="currentColor" strokeWidth=".9" vectorEffect="non-scaling-stroke" />)}
  </svg>;
}
