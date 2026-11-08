"use client";

import "./EstateDemos.css";
import Image from "next/image";
import { useState } from "react";
import { RotateCcw, RotateCw } from "lucide-react";

type Space = { name: string; x: number; y: number; w: number; d: number; color: string };
type Block = { x: number; y: number; w: number; d: number; h: number; color: string };
type Project = { name: string; place: string; text: string; photo: string; width: number; depth: number; rooms: Space[]; furniture: Block[] };
const projects: Project[] = [
  { name: "Casa do Pátio", place: "Residência · Canoas, RS", text: "A área social ocupa toda a frente da casa. Ao fundo, o quarto e a cozinha se abrem para um pátio descoberto.", photo: "photo-1600607687939-ce8a6c25118c", width: 10, depth: 8,
    rooms: [
      { name: "Estar e jantar", x: 0, y: 0, w: 10, d: 4, color: "#ddba92" },
      { name: "Quarto", x: 0, y: 4, w: 4, d: 4, color: "#cab49d" },
      { name: "Cozinha", x: 4, y: 4, w: 3, d: 4, color: "#c1c7b5" },
      { name: "Pátio", x: 7, y: 4, w: 3, d: 4, color: "#9aaf88" },
    ],
    furniture: [
      { x: 1, y: .6, w: 3, d: 1, h: .55, color: "#8d7667" },
      { x: 6.3, y: 1, w: 2, d: 1.2, h: .7, color: "#b79268" },
      { x: .5, y: 5.6, w: 2, d: 1.6, h: .46, color: "#e6d8ba" },
      { x: 4.3, y: 6.9, w: 2.4, d: .7, h: .85, color: "#78897b" },
    ] },
  { name: "Apartamento Ipê", place: "Interiores · Porto Alegre, RS", text: "Uma bancada aproxima a cozinha do estar. A faixa íntima reúne quarto e banho para liberar a circulação junto à entrada.", photo: "photo-1600210492486-724fe5c67fb0", width: 8, depth: 6,
    rooms: [
      { name: "Sala integrada", x: 0, y: 0, w: 5, d: 4, color: "#ddba92" },
      { name: "Cozinha", x: 0, y: 4, w: 5, d: 2, color: "#c1c7b5" },
      { name: "Quarto", x: 5, y: 0, w: 3, d: 4, color: "#cab49d" },
      { name: "Banho", x: 5, y: 4, w: 3, d: 2, color: "#b4c4c6" },
    ],
    furniture: [
      { x: .6, y: .6, w: 2.6, d: 1, h: .55, color: "#8d7667" },
      { x: .4, y: 5, w: 3.4, d: .7, h: .85, color: "#78897b" },
      { x: 5.6, y: .6, w: 1.7, d: 2, h: .46, color: "#e6d8ba" },
    ] },
];

function FloorPlan({ project }: { project: Project }) {
  const [angle, rotate] = useState(32);
  const [flat, setFlat] = useState(false);
  const rad = flat ? 0 : angle * Math.PI / 180;
  const scale = 345 / Math.hypot(project.width, project.depth);
  function point(x: number, y: number, z = 0) {
    const dx = x - project.width / 2, dy = y - project.depth / 2;
    return [200 + (dx * Math.cos(rad) - dy * Math.sin(rad)) * scale,
      140 + ((dx * Math.sin(rad) + dy * Math.cos(rad)) * (flat ? 1 : .55) - (flat ? 0 : z * .835)) * scale].join(",");
  }
  const walls: Block[] = [];
  function wall(x: number, y: number, w: number, d: number) {
    walls.push({ x, y, w, d, h: flat ? 0 : .85, color: "#ede2d0" });
  }
  // Paredes compartilhadas são desenhadas apenas uma vez; os vãos dão acesso aos ambientes.
  for (const room of project.rooms) {
    wall(room.x, room.y, room.w - 1, .13);
    wall(room.x, room.y, .13, room.x === 0 ? room.d : room.d - .9);
  }
  wall(0, project.depth - .13, project.width, .13);
  wall(project.width - .13, 0, .13, project.depth);
  const blocks = [...walls, ...project.furniture].sort((a, b) => {
    const depth = (v: Block) => (v.x + v.w / 2) * Math.sin(rad) + (v.y + v.d / 2) * Math.cos(rad);
    return depth(a) - depth(b);
  });
  const tool = "rounded-full border border-stone-400 px-4 py-2 text-sm disabled:opacity-35";
  return <div className="rounded-2xl border border-[#cec4ae] bg-[#f3eee2] p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-serif text-2xl">Planta do projeto</h3>
      <button className={tool} aria-pressed={flat} onClick={() => setFlat(!flat)}>{flat ? "Ver em 3D" : "Ver de cima"}</button></div>
    <svg className="mx-auto max-h-[23rem] w-full" viewBox="0 0 400 280" role="img" aria-label={`Planta ${flat ? "superior" : "3D"} de ${project.name}, com ${project.rooms.map(r => r.name).join(", ")}`}>
      {project.rooms.map(r => <polygon key={r.name} points={[point(r.x,r.y),point(r.x+r.w,r.y),point(r.x+r.w,r.y+r.d),point(r.x,r.y+r.d)].join(" ")} fill={r.color} stroke="#7a7060" strokeWidth=".6"/>)}
      {blocks.map(b => {
        const x2 = b.x + b.w, y2 = b.y + b.d;
        const frontY = Math.cos(rad) >= 0 ? y2 : b.y, frontX = Math.sin(rad) >= 0 ? x2 : b.x;
        return <g key={`${b.x}-${b.y}-${b.w}-${b.d}`} fill={b.color} stroke="#756c5e" strokeWidth=".65" strokeLinejoin="round">
          <polygon points={[point(b.x,frontY),point(x2,frontY),point(x2,frontY,b.h),point(b.x,frontY,b.h)].join(" ")} style={{filter:"brightness(.84)"}}/>
          <polygon points={[point(frontX,b.y),point(frontX,y2),point(frontX,y2,b.h),point(frontX,b.y,b.h)].join(" ")} style={{filter:"brightness(.69)"}}/>
          <polygon points={[point(b.x,b.y,b.h),point(x2,b.y,b.h),point(x2,y2,b.h),point(b.x,y2,b.h)].join(" ")}/></g>;
      })}
    </svg>
    <div className="flex justify-center gap-2"><button disabled={flat} className={tool} aria-label="Girar planta para a esquerda" onClick={() => rotate(n => n - 30)}><RotateCcw size={18}/></button>
      <button disabled={flat} className={tool} aria-label="Girar planta para a direita" onClick={() => rotate(n => n + 30)}><RotateCw size={18}/></button></div>
    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">{project.rooms.map(r => <li key={r.name}><span className="mr-1 inline-block size-3 border border-black/20" style={{background:r.color}}/>{r.name} · {r.w*r.d} m²</li>)}</ul>
  </div>;
}

export default function ArchitectPortfolio() {
  const [selected, select] = useState(0);
  const project = projects[selected];
  return <main id="conteudo" className="estate-demo architecture-demo">
    <header className="ed-wrap ed-nav"><a href="#conteudo" className="ed-brand">vão<span className="text-sm tracking-normal"> / arquitetura</span></a><nav className="ed-links" aria-label="Navegação do escritório"><a href="#projetos">Projetos</a><a href="#estudio">O estúdio</a><a href="#contato" className="ed-pill">Seu projeto começa aqui ↗</a></nav></header>
    <section className="ed-hero">
      <Image unoptimized fill priority sizes="100vw" className="ed-hero-image" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85" alt="Interiores com materiais naturais e iluminação suave"/>
      <div className="ed-shade"/>
      <div className="ed-wrap"><p className="ed-kicker">Arquitetura e interiores · Rio Grande do Sul</p><h1>Entre a luz.<br/><em>Fique a vida.</em></h1><div className="flex flex-wrap items-end justify-between gap-6"><p className="ed-hero-copy">Projetamos espaços para os dias comuns e para tudo o que merece ser celebrado. Arquitetura que começa pela sua história.</p><a className="ed-pill" href="#projetos">Conheça os projetos ↓</a></div></div>
    </section>
    <section id="estudio" className="ed-wrap ed-section ed-split"><div><p className="ed-kicker">O estúdio</p><h2>Menos pressa.<br/>Mais <em>sentido.</em></h2></div><div><p className="text-xl leading-relaxed">Uma casa começa muito antes da primeira parede. Começa no jeito como você recebe, descansa, trabalha e ocupa o mundo.</p><p className="ed-muted mt-6">No Ateliê Vão, cada escolha parte dessa escuta. Luz natural, materiais que envelhecem bem e ambientes conectados ajudam a dar forma ao que é seu.</p><a href="#processo" className="ed-text-button mt-6 inline-block">Conheça nosso processo ↗</a></div></section>
    <section id="projetos" className="ed-wrap ed-section border-t border-stone-300"><div className="ed-heading"><div><p className="ed-kicker">Portfólio residencial</p><h2>Espaços para<br/><em>se reconhecer.</em></h2></div><p className="ed-muted">Entre no projeto. Explore a planta, mude o ponto de vista e entenda como os ambientes se conectam.</p></div>
      <div className="ed-tabs mb-9 w-fit">{projects.map((p,i) => <button key={p.name} aria-pressed={i === selected} onClick={() => select(i)}>{p.name}</button>)}</div>
      <div className="ed-project-photo"><Image unoptimized fill loading="lazy" sizes="90vw" className="object-cover" src={`https://images.unsplash.com/${project.photo}?auto=format&fit=crop&w=1400&q=85`} alt={`Referência de interiores para ${project.name}`}/></div>
      <div className="ed-project-layout"><div><p className="ed-kicker">{project.place}</p><h3 className="text-4xl!">{project.name}</h3><p className="ed-muted">{project.text}</p><dl className="mt-6 space-y-3 border-t border-stone-300 pt-5 text-sm"><div className="flex justify-between"><dt>Área representada</dt><dd>{project.width*project.depth} m²</dd></div><div className="flex justify-between"><dt>Ambientes</dt><dd>{project.rooms.length}</dd></div><div className="flex justify-between"><dt>Estudo</dt><dd>Residencial</dd></div></dl><a href="#contato" className="ed-pill mt-8">Conversar sobre um projeto ↗</a></div>
        <FloorPlan key={project.name} project={project}/></div>
    </section>
    <section id="processo" className="ed-dark"><div className="ed-wrap ed-section"><p className="ed-kicker">Da primeira conversa à sua casa</p><h2>Um projeto construído<br/><em>junto com você.</em></h2><div className="ed-process">
      <article><h3>Escutar</h3><p>Conhecemos sua rotina, as necessidades do espaço e as possibilidades do imóvel. Alinhamos as prioridades e o investimento previsto.</p></article>
      <article><h3>Desenhar</h3><p>Plantas, referências e estudos de volume tornam as escolhas visíveis. Você acompanha as decisões e entende cada ambiente.</p></article>
      <article><h3>Detalhar</h3><p>Materiais, acabamentos e soluções se encontram no projeto. A documentação orienta os próximos passos da execução.</p></article>
    </div></div></section>
    <section className="ed-wrap ed-section ed-split"><div className="ed-split-photo"><Image unoptimized fill loading="lazy" sizes="(min-width:760px) 45vw, 100vw" src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80" alt="Detalhes de um espaço residencial iluminado"/></div><div><p className="ed-kicker">Materialidade e permanência</p><h2>O detalhe muda<br/><em>como se vive.</em></h2><p className="ed-muted">Uma textura que acolhe. Uma passagem que aproxima. Uma janela que encontra o sol. A arquitetura acontece nesses encontros.</p><div className="mt-7 border-t border-stone-300 pt-5"><p className="ed-muted">Residências · Interiores · Reformas</p></div></div></section>
    <section id="contato" className="ed-wrap ed-contact"><div><p className="ed-kicker">Vamos imaginar seu espaço?</p><h2>Conte o que<br/>você quer <em>viver.</em></h2><p className="ed-muted">Compartilhe a cidade, o tipo de imóvel e o que você tem em mente para preparar sua primeira conversa.</p></div>
      <form className="ed-form" onSubmit={event => {event.preventDefault();const data=new FormData(event.currentTarget);window.open("https://wa.me/?text="+encodeURIComponent("Olá! Sou "+data.get("name")+". Gostei do projeto "+project.name+". Meu projeto é em "+data.get("city")+". "+data.get("message")),"_blank","noopener,noreferrer");}}>
        <label>Seu nome<input required name="name" autoComplete="name" maxLength={80}/></label><label>Cidade do projeto<input required name="city" autoComplete="address-level2" maxLength={100}/></label><label>O que você imagina para o seu espaço?<textarea required name="message" rows={3} maxLength={1000}/></label><button className="ed-pill ed-solid">Preparar conversa no WhatsApp ↗</button></form></section>
    <footer className="ed-wrap ed-footer"><span className="ed-brand">vão / arquitetura</span><span>Arquitetura residencial · RS</span><span>Portfólio demonstrativo</span></footer>
  </main>;
}
