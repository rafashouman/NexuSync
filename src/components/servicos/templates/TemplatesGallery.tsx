"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { templateCatalog } from "@/data/templateCatalog";
import { ArrowIcon, SearchIcon } from "@/components/rua/icons";
import s from "../servico.module.css";

type Item = (typeof templateCatalog)[number];
const categories = [...new Set(templateCatalog.map((item) => item.category))];
const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Every demo with search, category filter and an in-page live preview (wide or narrow). */
export function TemplatesGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [preview, setPreview] = useState<Item | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [ready, setReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const openers = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!preview) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    previewRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    previewRef.current?.focus({ preventScroll: true });
  }, [preview]);

  const list = templateCatalog.filter((item) => (!category || item.category === category) && normalize(`${item.title} ${item.brandName} ${item.category} ${item.description}`).includes(normalize(query)));
  const show = (item: Item) => {
    if (preview?.href !== item.href) setReady(false);
    setPreview(item);
  };
  const close = () => {
    const prev = preview?.href;
    setPreview(null);
    if (prev) openers.current.get(prev)?.focus();
  };

  return (
    <div>
      {preview && (
        <div className={s.live} ref={previewRef} tabIndex={-1} aria-label={`Prévia de ${preview.brandName}`} onKeyDown={(e) => { if (e.key === "Escape") close(); }}>
          <div className={s.liveBar}>
            <div><small>Prévia interativa</small><h3>{preview.brandName}</h3></div>
            <div className={s.liveTools}>
              <button type="button" aria-pressed={!narrow} onClick={() => setNarrow(false)}>Largo</button>
              <button type="button" aria-pressed={narrow} onClick={() => setNarrow(true)}>Celular</button>
              <Link href={preview.href} target="_blank" rel="noopener noreferrer">Abrir demo <ArrowIcon /></Link>
              <button type="button" onClick={close} aria-label="Fechar prévia">Fechar</button>
            </div>
          </div>
          <p className={s.liveStatus} aria-live="polite">{ready ? "Prévia carregada. Você pode navegar e interagir abaixo." : "Carregando demonstração…"}</p>
          <div className={s.liveFrame} data-narrow={narrow}>
            <iframe key={preview.href} src={preview.href} title={`Demonstração de ${preview.brandName}`} onLoad={() => setReady(true)} />
          </div>
          <p className={s.micro}>A largura altera a apresentação do site; não simula todos os recursos de um aparelho. Dados e ações pertencem à demonstração.</p>
        </div>
      )}

      <div className={s.dirTools}>
        <label className={s.dirSearch}>
          <SearchIcon />
          <span className={s.srOnly}>Buscar exemplos</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque por segmento, marca ou solução" />
        </label>
        <div className={s.dirChips} role="group" aria-label="Filtrar por segmento">
          <button type="button" aria-pressed={!category} onClick={() => setCategory("")}>Todos</button>
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(category === item ? "" : item)}>{item}</button>
          ))}
        </div>
        <span className={s.dirCount} aria-live="polite">{list.length} de {templateCatalog.length} exemplos</span>
      </div>

      <div className={s.gallery}>
        {list.map((item, i) => (
          <article key={item.href} className={s.tpl}>
            <Link href={item.href} className={s.tplArt} data-variant={i % 4} aria-label={`Abrir demonstração de ${item.brandName}`}>
              <span>{item.category}</span>
              <strong>{item.brandName}</strong>
              <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
            </Link>
            <div className={s.tplText}>
              <small>{item.number} · demonstração</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <details className={s.scopeBox}>
                <summary>O que experimentar</summary>
                <ul>{item.modules.map((m) => <li key={m}>{m}</li>)}</ul>
              </details>
              <div className={s.dirActions}>
                <button type="button" ref={(node) => { if (node) openers.current.set(item.href, node); else openers.current.delete(item.href); }} onClick={() => show(item)}>Visualizar aqui</button>
                <Link href={item.href}>Abrir demo <ArrowIcon /></Link>
              </div>
            </div>
          </article>
        ))}
        {!list.length && (
          <div className={s.dirEmpty}>
            <p>Nenhum exemplo encontrado.</p>
            <button type="button" className={s.textLink} onClick={() => { setQuery(""); setCategory(""); }}>Limpar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
}
