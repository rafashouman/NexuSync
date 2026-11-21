"use client";

import Link from "next/link";
import { useState } from "react";
import { appCatalog } from "@/data/appCatalog";
import { ArrowIcon, SearchIcon } from "@/components/rua/icons";
import s from "../servico.module.css";

const categories = [...new Set(appCatalog.map((app) => app.category))];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Every app and demo in one place: search, filter by category, open or copy the link to share. */
export function AppsDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [copied, setCopied] = useState("");
  const apps = appCatalog.filter((app) => (!category || app.category === category) && normalize(`${app.name} ${app.description} ${app.category}`).includes(normalize(query)));

  async function copy(path: string) {
    const url = new URL(path, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(path);
    } catch {
      window.prompt("Copie o link:", url);
    }
  }

  return (
    <div>
      <div className={s.dirTools}>
        <label className={s.dirSearch}>
          <SearchIcon />
          <span className={s.srOnly}>Buscar aplicativos</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque uma solução ou experiência" type="search" />
        </label>
        <div className={s.dirChips} role="group" aria-label="Filtrar por categoria">
          <button type="button" aria-pressed={!category} onClick={() => setCategory("")}>Todas</button>
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(category === item ? "" : item)}>{item}</button>
          ))}
        </div>
        <span className={s.dirCount} aria-live="polite">{apps.length} de {appCatalog.length} exemplos</span>
      </div>
      <div className={s.dir}>
        {apps.map((app) => (
          <article key={app.slug} className={s.dirItem}>
            <small>{app.category}</small>
            <h3>{app.name}</h3>
            <p>{app.description}</p>
            <div className={s.dirActions}>
              <Link href={app.path}>Abrir <ArrowIcon /></Link>
              <button type="button" onClick={() => copy(app.path)}>{copied === app.path ? "Link copiado" : "Copiar link"}</button>
            </div>
          </article>
        ))}
        {!apps.length && <p className={s.dirEmpty}>Nenhum exemplo encontrado. Tente outra palavra ou limpe o filtro.</p>}
      </div>
    </div>
  );
}
