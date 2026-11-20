"use client";

import Image from "next/image";
import { useState } from "react";
import { works, workCategories, type WorkCategory } from "@/data/designPortfolio";
import s from "./CreativeExperience.module.css";

export function DesignPortfolio() {
  const [filter, setFilter] = useState<WorkCategory | "todos">("todos");
  const shown = filter === "todos" ? works : works.filter((work) => work.category === filter);
  const options = [{ id: "todos" as const, label: `Todos (${works.length})` }, ...workCategories];

  return (
    <div>
      <div className={s.workFilter} role="group" aria-label="Filtrar trabalhos">
        {options.map((option) => (
          <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>{option.label}</button>
        ))}
      </div>
      <ul className={s.workGrid} aria-live="polite">
        {shown.map((work) => (
          <li key={work.src}>
            <div className={s.workArt}>
              <Image src={work.src} alt={`${work.name}: ${work.piece}`} width={640} height={480} sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw" />
            </div>
            <p><b>{work.name}</b><span>{work.piece}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
