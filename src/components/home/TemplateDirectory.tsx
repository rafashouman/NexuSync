"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Search, Monitor, Smartphone, Eye, X } from "lucide-react";
import { templateCatalog } from "@/data/templateCatalog";
import s from "./CommerceExperience.module.css";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function TemplateDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [preview, setPreview] = useState<(typeof templateCatalog)[number] | null>(null);
  const [mobile, setMobile] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewButtons = useRef(new Map<string, HTMLButtonElement>());
  const [previewReady, setPreviewReady] = useState(false);
  useEffect(() => {
    if (!preview) return;
    previewRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    previewRef.current?.focus({ preventScroll: true });
  }, [preview]);
  const list = templateCatalog.filter(item => (!category || item.category === category) && normalize(`${item.title} ${item.brandName} ${item.category} ${item.description}`).includes(normalize(query)));
  function showPreview(item: (typeof templateCatalog)[number]) {
    if (preview?.href !== item.href) setPreviewReady(false);
    setPreview(item);
  }
  function closePreview() { const previous = preview?.href; setPreview(null); if (previous) previewButtons.current.get(previous)?.focus(); }
  return <div>
    {preview && <div className={s.livePreview} ref={previewRef} tabIndex={-1} aria-label={`Prévia de ${preview.brandName}`} onKeyDown={e => { if (e.key === "Escape") closePreview(); }}><div className={s.previewToolbar}><div><span>PRÉVIA INTERATIVA</span><h3>{preview.brandName}</h3></div><div className={s.previewTools}><button aria-label="Visualização ampla" aria-pressed={!mobile} onClick={() => setMobile(false)}><Monitor size={17} /></button><button aria-label="Visualização estreita" aria-pressed={mobile} onClick={() => setMobile(true)}><Smartphone size={17} /></button><Link href={preview.href} target="_blank" rel="noopener noreferrer">Abrir demo<ArrowUpRight size={15} /></Link><button aria-label="Fechar prévia" onClick={closePreview}><X size={18} /></button></div></div><p className={s.previewStatus} aria-live="polite">{previewReady ? "Prévia carregada. Você pode navegar e interagir abaixo." : "Carregando demonstração…"}</p><div className={s.frameStage} data-mobile={mobile}><iframe key={preview.href} src={preview.href} title={`Demonstração de ${preview.brandName}`} onLoad={() => setPreviewReady(true)} /></div><p className={s.note}>A largura altera a apresentação do site; não simula todos os recursos de um aparelho. Dados e ações pertencem à demonstração.</p></div>}
    <div className={s.galleryTools}><label><Search size={17} /><span className={s.srOnly}>Buscar templates</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Busque por segmento, marca ou solução" /></label><label><span className={s.srOnly}>Categoria</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Todos os segmentos</option>{templateCatalog.map(item => <option key={item.href} value={item.category}>{item.category}</option>)}</select></label><span aria-live="polite">{list.length} de {templateCatalog.length} exemplos</span></div>
    <div className={s.gallery}>{list.map((item, i) => <article key={item.href}><Link href={item.href} className={s.templateArt} data-variant={i % 4} aria-label={`Abrir demonstração de ${item.brandName}`}><span>{item.category}</span><strong>{item.brandName}</strong><div aria-hidden="true" className={s.templateGeometry}><i /><i /><i /></div><ArrowUpRight size={24} /></Link><div className={s.templateText}><small>{item.number} / DEMONSTRAÇÃO</small><h3>{item.title}</h3><p>{item.description}</p><details><summary>O que experimentar<PlusIcon /></summary><ul>{item.modules.map(module => <li key={module}>{module}</li>)}</ul></details><div className={s.templateActions}><button ref={node => { if (node) previewButtons.current.set(item.href, node); else previewButtons.current.delete(item.href); }} onClick={() => showPreview(item)}><Eye size={14} />Visualizar aqui</button><Link href={item.href}>Abrir demo<ArrowUpRight size={15} /></Link></div></div></article>)}</div>{!list.length && <div className={s.empty}><p>Nenhum exemplo encontrado.</p><button onClick={() => { setQuery(""); setCategory(""); }}>Limpar filtros</button></div>}
  </div>;
}

function PlusIcon() { return <span aria-hidden="true">+</span>; }
