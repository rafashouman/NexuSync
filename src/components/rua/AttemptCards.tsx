"use client";

import { useEffect, useRef, useState } from "react";
import { attempts } from "./content";
import { ATTEMPT_EVENT } from "./events";
import s from "./rua.module.css";

export function AttemptCards() {
  const [lit, setLit] = useState<{ i: number; on: boolean }>({ i: -1, on: false });
  const grid = useRef<HTMLDivElement>(null);
  const hold = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function light(i: number) {
    setLit({ i, on: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLit({ i, on: false }), 1250);
    window.dispatchEvent(new CustomEvent(ATTEMPT_EVENT, { detail: i }));
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let next = 0;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.3 });
    if (grid.current) io.observe(grid.current);
    const cycle = setInterval(() => {
      if (!visible || hold.current) return;
      light(next);
      next = (next + 1) % attempts.length;
    }, 1800);
    return () => { clearInterval(cycle); io.disconnect(); clearTimeout(timer.current); };
  }, []);

  return (
    <div className={s.tries} ref={grid}>
      {attempts.map((attempt, i) => (
        <article key={attempt.name} className={s.try} tabIndex={0}
          data-state={lit.i === i && lit.on ? "on" : "off"}
          onMouseEnter={() => { hold.current = true; light(i); }}
          onMouseLeave={() => { hold.current = false; }}
          onFocus={() => { hold.current = true; light(i); }}
          onBlur={() => { hold.current = false; }}>
          <h3>{attempt.name}</h3>
          <p className={s.up}><b>Acende</b>{attempt.up}</p>
          <p className={s.down}><b>Apaga</b>{attempt.down}</p>
        </article>
      ))}
    </div>
  );
}
