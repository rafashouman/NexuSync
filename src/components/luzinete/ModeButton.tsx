"use client";

import { sectionPath, type Mode } from "./data";
import s from "./luzinete.module.css";

export const MODE_EVENT = "luzinete:modalidade";

/** Leva à agenda já com a modalidade escolhida. */
export function ModeButton({ mode, label }: { mode: Mode; label: string }) {
  return (
    <a
      href={sectionPath("agendar")}
      className={`${s.button} ${s.buttonOutline}`}
      onClick={() => window.dispatchEvent(new CustomEvent<Mode>(MODE_EVENT, { detail: mode }))}
    >
      {label}
    </a>
  );
}
