"use client";

import Image from "next/image";
import { useState } from "react";
import { works, workCategories, type WorkCategory } from "@/data/designPortfolio";
import s from "../servico.module.css";

/** Portfolio pieces with a category filter (same data as before, Rua styling). */
export function PortfolioRua() {
  const [filter, setFilter] = useState<WorkCategory | "todos">("todos");
  const shown = filter === "todos" ? works : works.filter((work) => work.category === filter);
  const options = [{ id: "todos" as const, label: `Todos (${works.length})` }, ...workCategories];
  return (
    <div>
      <div className={s.dirChips} role="group" aria-label="Filtrar trabalhos">
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>{option.label}</button>
        ))}
      </div>
      <ul className={s.works} aria-live="polite">
        {shown.map((work) => (
          <li key={work.src}>
            <div className={s.workArt}>
              <Image src={work.src} alt={`${work.name}: ${work.piece}`} width={640} height={480} sizes="(max-width: 860px) 50vw, 25vw" />
            </div>
            <p><b>{work.name}</b><span>{work.piece}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
