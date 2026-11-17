"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search, Link2 } from "lucide-react";
import { appCatalog } from "@/data/appCatalog";
import s from "./CreativeExperience.module.css";

const categories = [...new Set(appCatalog.map(app => app.category))];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function ChaosAppDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [copied, setCopied] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const apps = appCatalog.filter(app => (!category || app.category === category) && normalize(`${app.name} ${app.description} ${app.category}`).includes(normalize(query)));
  async function copy(path: string) {
    const url = new URL(path, window.location.origin).href;
    try { await navigator.clipboard.writeText(url); setCopied(path); setManualUrl(""); }
    catch { setCopied(""); setManualUrl(url); }
  }
  return <div><div className={s.catalogTools}><label><Search size={16} /><span className={s.srOnly}>Buscar aplicativos</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Busque uma solução ou experiência" type="search" /></label><label><span className={s.srOnly}>Filtrar por categoria</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Todas as categorias</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label><span aria-live="polite">{apps.length} de {appCatalog.length} exemplos</span></div><div className={s.catalog}>{apps.map((app, i) => <article key={app.slug}><Link href={app.path}><div className={s.catalogArt} data-variant={i % 3} aria-hidden="true"><span>{app.name.slice(0, 1)}</span><ArrowUpRight /></div><small>{app.category} / DEMO</small><h3>{app.name}<ArrowUpRight size={18} /></h3><p>{app.description}</p></Link><button className={s.copyButton} onClick={() => void copy(app.path)}><Link2 size={13} />{copied === app.path ? "Link copiado" : "Copiar link"}</button>{manualUrl.endsWith(app.path) && <label className={s.manualCopy}>Selecione e copie o endereço<input readOnly value={manualUrl} onFocus={e => e.target.select()} /></label>}</article>)}</div>{!apps.length && <div className={s.empty}><p>Nenhum exemplo encontrado para essa busca.</p><button onClick={() => { setQuery(""); setCategory(""); }}>Limpar filtros</button></div>}<p className={s.srOnly} aria-live="polite">{copied ? "Link copiado para a área de transferência." : ""}</p></div>;
}
