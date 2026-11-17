"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { aboutSections } from "@/data/aboutSections";
import { SitesPlayground } from "./SitesPlayground";
import { AppPlayground, DesignPlayground } from "./CreativePlayground";
import { MarketingPlayground } from "./MarketingPlayground";
import s from "./StudioExperience.module.css";

export function AboutFocus() {
  const [selected, setSelected] = useState(0);
  const section = aboutSections[selected];
  return <div><div className={s.focusTabs} role="group" aria-label="Explore nossas soluções">{aboutSections.map((item, i) => <button key={item.id} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>{item.number}</span>{["Sites", "Aplicativos", "Design", "Marketing"][i]}<ArrowUpRight size={16} /></button>)}</div>
    <div className={s.focusGrid}><div className={s.focusText} aria-live="polite"><span>{section.category}</span><h3>{section.title}<br /><em>{section.highlight}</em></h3><p>{section.text}</p><ul>{section.benefits.map(benefit => <li key={benefit}><Check size={14} />{benefit}</li>)}</ul><Link href={section.href}>{section.link}<ArrowUpRight size={18} /></Link></div><div className={s.focusDemo}>{selected === 0 ? <SitesPlayground /> : selected === 1 ? <AppPlayground /> : selected === 2 ? <DesignPlayground /> : <MarketingPlayground />}</div></div>
  </div>;
}
