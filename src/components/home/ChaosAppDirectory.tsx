"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search, Link2 } from "lucide-react";
import { appCatalog } from "@/data/appCatalog";
import { ExperienceVisual, type ExperienceKind } from "./ExperienceVisual";
import s from "./CreativeExperience.module.css";

const categories = [...new Set(appCatalog.map(app => app.category))];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const previews: Record<string, [string, string, string]> = {
  pulsemetrics: ["RECEITA", "ROAS", "LEADS"],
  pulsespin: ["GIRAR", "DESCOBRIR", "CUPOM"],
  memory: ["ENCONTRAR", "COMBINAR", "AVANÇAR"],
  "images-blend": ["IMAGEM", "CAMADAS", "COMPOSIÇÃO"],
  arknoid: ["BOLA", "BARRA", "BLOCOS"],
  voxelvaders: ["NAVE", "INVASORES", "ONDAS"],
  "pulse-arkanoid": ["CARTUCHO", "BARRA", "BLOCOS"],
  "cyber-tarot": ["ESCOLHER", "TIRAR", "JOGAR"],
  arcade: ["CARTUCHO", "JOGAR", "EXPLORAR"],
  reservas: ["MESA", "PEDIDO", "COZINHA"],
  connection: ["PERGUNTA", "CARTAS", "LEITURA"],
  bluemoon: ["CARTAS", "COMBINAR", "JOGAR"],
  academias: ["TREINOS", "ESTRUTURA", "CONTATO"],
  miniaturas: ["MODELO", "OPÇÕES", "ORÇAMENTO"],
  "seguro-piloto": ["COBERTURA", "DÚVIDAS", "SOLICITAÇÃO"],
  imobiliaria: ["BAIRRO", "IMÓVEIS", "CONTATO"],
  "cyber-oregon": ["DIAGNÓSTICO", "ESCOPO", "CONTATO"],
};
const scenes: Record<string, ExperienceKind> = {
  chronos: "app", cardapio: "burger", "dog-e-acai": "acai", carros: "motors", streetwear: "fashion", arquitetura: "web",
};
function CatalogGraphic({ slug }: { slug: string }) {
  if (slug === "pulsespin") return <div className={s.catalogWheel}><span>✦</span></div>;
  if (slug === "memory") return <div className={s.catalogMemory}>{["✦", "◈", "◈", "✦"].map((symbol, i) => <span key={i}>{symbol}</span>)}</div>;
  if (["arknoid", "pulse-arkanoid", "voxelvaders", "arcade"].includes(slug)) return <div className={s.catalogArcade}><div>{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div><span>●</span><b /></div>;
  if (["cyber-tarot", "connection", "bluemoon"].includes(slug)) return <div className={s.catalogCards}><span>✦</span><span>☾</span><span>✧</span></div>;
  if (slug === "pulsemetrics") return <div className={s.catalogMetrics}><b>5,8x <small>ROAS</small></b><div>{[35, 65, 50, 80, 60, 95].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div>;
  if (slug === "images-blend") return <div className={s.catalogLayers}><i /><i /><i /></div>;
  if (slug === "reservas") return <div className={s.catalogTables}><span>MESA 01 <b>LIVRE</b></span><span>MESA 02 <b>ATENDIMENTO</b></span><span>COZINHA <b>EM PREPARO</b></span></div>;
  return <div className={s.catalogFlow}><span>01</span><i /><span>02</span><i /><span>03</span></div>;
}
function CatalogPreview({ app }: { app: (typeof appCatalog)[number] }) {
  const scene = scenes[app.slug];
  if (scene) return <ExperienceVisual kind={scene} />;
  const steps = previews[app.slug];
  return <div className={s.catalogPreview} data-app={app.slug} aria-hidden="true">
    <div className={s.catalogPreviewTop}><span>● &nbsp; {app.name}</span><span>DEMO ↗</span></div>
    <div className={s.catalogPreviewBody}><div><small>{app.category.toUpperCase()}</small><b>{app.name}</b><CatalogGraphic slug={app.slug} /></div><div className={s.catalogPreviewSteps}>{steps?.map((step, i) => <div key={step}><i>0{i + 1}</i><span>{step}</span><b>↗</b></div>)}</div></div>
  </div>;
}
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
  return <div><div className={s.catalogTools}><label><Search size={16} /><span className={s.srOnly}>Buscar aplicativos</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Busque uma solução ou experiência" type="search" /></label><label><span className={s.srOnly}>Filtrar por categoria</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Todas as categorias</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label><span aria-live="polite">{apps.length} de {appCatalog.length} exemplos</span></div><div className={s.catalog}>{apps.map(app => <article key={app.slug}><Link href={app.path}><div className={s.catalogArt}><CatalogPreview app={app} /></div><small>{app.category} / DEMO</small><h3>{app.name}<ArrowUpRight size={18} /></h3><p>{app.description}</p></Link><button className={s.copyButton} onClick={() => void copy(app.path)}><Link2 size={13} />{copied === app.path ? "Link copiado" : "Copiar link"}</button>{manualUrl.endsWith(app.path) && <label className={s.manualCopy}>Selecione e copie o endereço<input readOnly value={manualUrl} onFocus={e => e.target.select()} /></label>}</article>)}</div>{!apps.length && <div className={s.empty}><p>Nenhum exemplo encontrado para essa busca.</p><button onClick={() => { setQuery(""); setCategory(""); }}>Limpar filtros</button></div>}<p className={s.srOnly} aria-live="polite">{copied ? "Link copiado para a área de transferência." : ""}</p></div>;
}
