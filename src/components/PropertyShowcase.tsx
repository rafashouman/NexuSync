"use client";

import "./EstateDemos.css";
import Image from "next/image";
import { useState } from "react";
import { ArrowDown, BedDouble, Ruler } from "lucide-react";

const homes = [
  { id: "AP-102", name: "Apartamento das figueiras", district: "Petrópolis", deal: "Comprar", price: 645000, beds: 2, area: 84, fee: 540, image: "photo-1600210492486-724fe5c67fb0", detail: "Living integrado com espaço para jantar, janelas amplas e uma vaga coberta." },
  { id: "AP-208", name: "Estúdio junto ao parque", district: "Bom Fim", deal: "Alugar", price: 2150, beds: 1, area: 42, fee: 320, image: "photo-1600566753086-00f18fb6b3ea", detail: "Planta aberta com cozinha integrada e espaço de trabalho perto da Redenção." },
  { id: "CA-314", name: "Casa do pátio verde", district: "Tristeza", deal: "Comprar", price: 920000, beds: 3, area: 168, fee: 0, image: "photo-1600596542815-ffad4c1539a9", detail: "Casa com quintal, churrasqueira e espaço para reunir a família na zona sul." },
  { id: "AP-407", name: "Varanda do bairro", district: "Petrópolis", deal: "Alugar", price: 3100, beds: 2, area: 76, fee: 450, image: "photo-1600607687939-ce8a6c25118c", detail: "Apartamento com varanda, lavanderia independente e uma vaga de garagem." },
];
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const photo = (id: string, width: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export default function PropertyShowcase() {
  const [deal, setDeal] = useState("Comprar");
  const [district, setDistrict] = useState("");
  const [open, setOpen] = useState("");
  const matches = homes.filter(home => home.deal === deal && (!district || home.district === district));
  return <main id="conteudo" className="estate-demo">
    <header className="ed-wrap ed-nav"><a className="ed-brand" href="#conteudo">pátio<span className="text-sm tracking-normal"> / imóveis</span></a><nav className="ed-links" aria-label="Navegação da imobiliária"><a href="#imoveis">Encontre seu imóvel</a><a href="#bairros">Nossos bairros</a><a href="#contato" className="ed-pill">Vamos conversar ↗</a></nav></header>
    <section className="ed-hero">
      <Image unoptimized fill priority sizes="100vw" className="ed-hero-image" src={photo(homes[0].image, 1800)} alt="Sala ampla com luz natural e espaços integrados"/>
      <div className="ed-shade"/>
      <div className="ed-wrap"><p className="ed-kicker">Imóveis com vida ao redor · Porto Alegre, RS</p>
        <h1>Um novo endereço.<br/><em>O seu jeito de viver.</em></h1>
        <p className="ed-hero-copy">Do café na esquina ao sol que entra na sala. Encontre um lugar que faça sentido para a sua rotina.</p>
        <a href="#imoveis" className="ed-pill ed-solid">Encontre o seu lugar <ArrowDown size={16}/></a></div>
    </section>
    <section id="imoveis" className="ed-wrap ed-section scroll-mt-4">
      <div className="ed-heading"><div><p className="ed-kicker">Curadoria de imóveis</p><h2>Espaços para o seu<br/><em>próximo capítulo.</em></h2></div><p className="ed-muted">Casas e apartamentos em bairros com personalidade. Explore a seleção e encontre o que combina com você.</p></div>
      <div className="ed-search"><div className="ed-tabs">
        {["Comprar","Alugar"].map(type => <button key={type} aria-pressed={type === deal} onClick={() => {setDeal(type); setOpen("");}} className="rounded-full px-5 py-2 font-bold aria-pressed:bg-[#254a40] aria-pressed:text-white">{type}</button>)}</div>
        <label className="text-sm font-bold">Bairro<select value={district} onChange={e => {setDistrict(e.target.value); setOpen("");}} className="ml-2 rounded-lg border border-stone-300 bg-white p-2"><option value="">Todos</option>{Array.from(new Set(homes.map(h => h.district))).map(d => <option key={d}>{d}</option>)}</select></label></div>
      <p role="status" className="mb-4 text-sm">{matches.length} {matches.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}</p>
      {!matches.length && <button className="underline" onClick={() => setDistrict("")}>Ver todos os bairros</button>}
      <div className="ed-grid">{matches.map(home => <article key={home.id} className="ed-card">
        <div className="ed-photo"><Image unoptimized fill loading="lazy" sizes="(min-width:768px) 50vw, 100vw" className="object-cover" src={photo(home.image, 850)} alt={home.name}/><span className="ed-tag">{home.deal === "Comprar" ? "À venda" : "Para alugar"} · {home.id}</span></div>
        <div className="ed-card-body"><p className="text-sm">{home.district} · Porto Alegre</p><h3>{home.name}</h3>
          <p className="ed-spec"><BedDouble size={17}/>{home.beds} {home.beds === 1 ? "quarto" : "quartos"} <Ruler size={16}/>{home.area} m²</p>
          <div className="ed-price"><strong>{money.format(home.price)}{deal === "Alugar" && " / mês"}</strong>
          <button aria-expanded={open === home.id} onClick={() => setOpen(open === home.id ? "" : home.id)} className="ed-text-button">{open === home.id ? "Fechar ficha" : "Conhecer imóvel ↗"}</button></div>
          {open === home.id && <div className="ed-detail"><p>{home.detail}</p><p>Condomínio {money.format(home.fee)} por mês · Ref. {home.id}</p>
            <a className="ed-pill ed-solid" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent("Olá! Quero combinar uma visita ao imóvel " + home.id + ", " + home.name + ", em " + home.district + ". Quais horários estão disponíveis?")}`}>Compartilhar pedido de visita no WhatsApp</a></div>}
        </div></article>)}</div>
      <p className="mt-8 text-sm text-stone-600">Imóveis e valores ilustrativos para demonstração.</p>
    </section>
    <section className="ed-dark"><div className="ed-wrap ed-section ed-split">
      <div className="ed-split-photo"><Image unoptimized fill loading="lazy" sizes="(min-width:760px) 45vw, 100vw" src={photo(homes[2].image,900)} alt="Casa cercada de verde"/></div>
      <div><p className="ed-kicker">De perto, do começo à chave</p><h2>O cuidado está<br/>em cada escolha.</h2>
        <div className="ed-service"><strong>Um bairro que combina com você</strong><p>Conte como é o seu dia. A busca começa pelas suas prioridades, da mobilidade ao espaço para a família.</p></div>
        <div className="ed-service"><strong>Visitas com contexto</strong><p>Confira a ficha, separe suas perguntas e compartilhe o imóvel para combinar uma visita.</p></div>
        <div className="ed-service"><strong>Decisões bem informadas</strong><p>Preço, metragem e condomínio na mesma ficha para facilitar sua comparação.</p></div></div>
    </div></section>
    <section id="bairros" className="ed-wrap ed-section"><div className="ed-heading"><div><p className="ed-kicker">Porto Alegre por perto</p><h2>Antes do imóvel,<br/><em>o bairro.</em></h2></div><p className="ed-muted">Escolha onde você quer viver para explorar os imóveis disponíveis.</p></div>
      <div className="ed-bairros">{[{name:"Petrópolis",image:homes[0].image},{name:"Bom Fim",image:homes[1].image},{name:"Tristeza",image:homes[2].image}].map(b => <button key={b.name} className="ed-bairro" onClick={() => {setDistrict(b.name);setDeal(b.name === "Bom Fim" ? "Alugar" : "Comprar");setOpen("");document.getElementById("imoveis")?.scrollIntoView({behavior:"smooth"});}}><Image unoptimized fill loading="lazy" sizes="(min-width:760px) 30vw, 100vw" src={photo(b.image,700)} alt=""/><span>{b.name} ↗</span></button>)}</div>
    </section>
    <section id="contato" className="ed-wrap ed-contact"><div><p className="ed-kicker">A busca começa com uma conversa</p><h2>Como é o lugar<br/>que você procura?</h2><p className="ed-muted">Prepare sua mensagem com o tipo de imóvel e o bairro de interesse.</p></div>
      <form className="ed-form" onSubmit={event => {event.preventDefault();const data=new FormData(event.currentTarget);window.open("https://wa.me/?text="+encodeURIComponent("Olá! Sou "+data.get("name")+". Procuro "+deal.toLowerCase()+" um imóvel. "+data.get("message")),"_blank","noopener,noreferrer");}}>
        <label>Seu nome<input name="name" autoComplete="name" required maxLength={80}/></label><label>O que é importante para você?<textarea name="message" required rows={3} maxLength={1000} placeholder="Bairro, número de quartos, faixa de preço…"/></label><button className="ed-pill ed-solid">Preparar mensagem no WhatsApp ↗</button></form>
    </section>
    <footer className="ed-wrap ed-footer"><span className="ed-brand">pátio / imóveis</span><span>Porto Alegre · RS</span><span>Modelo demonstrativo · Imóveis ilustrativos</span></footer></main>;
}
