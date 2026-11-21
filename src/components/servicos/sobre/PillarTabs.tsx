"use client";

import Link from "next/link";
import { useState } from "react";
import { aboutSections } from "@/data/aboutSections";
import { ArrowIcon } from "@/components/rua/icons";
import s from "../servico.module.css";

const LABELS = ["Sites", "Aplicativos", "Design", "Marketing"];

/** What changes in practice in each area: one tab per area, the text and a link to its page. */
export function PillarTabs() {
  const [selected, setSelected] = useState(0);
  const item = aboutSections[selected];
  return (
    <div className={s.tabs}>
      <div className={s.tabList} role="group" aria-label="Explore nossas soluções">
        {aboutSections.map((section, i) => (
          <button key={section.id} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>
            <span>{section.number}</span>{LABELS[i]}
          </button>
        ))}
      </div>
      <div className={s.tabPanel} aria-live="polite" key={item.id}>
        <small>{item.category}</small>
        <h3>{item.title} <span>{item.highlight}</span></h3>
        <p>{item.text}</p>
        <ul className={s.feats}>
          {item.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
        <Link className={s.textLink} href={item.href}>{item.link} <ArrowIcon /></Link>
      </div>
    </div>
  );
}
