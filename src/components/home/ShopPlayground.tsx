"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ArrowUpRight, Check } from "lucide-react";
import s from "./CommerceExperience.module.css";

const formats = ["Catálogo", "Loja virtual", "Cardápio"];
const products = [
  { name: "Camiseta básica de algodão", price: 16990, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" },
  { name: "Camiseta estonada", price: 18990, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80" },
];
const menu = [
  { name: "X-bacon da casa", price: 4890, image: "/images/showcase/burger-photo.jpg" },
  { name: "Smash duplo com cheddar", price: 3890, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80" },
];
const money = (value: number) => (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function ShopPlayground() {
  const [format, setFormat] = useState(0);
  const [quantities, setQuantities] = useState([0, 0]);
  const [review, setReview] = useState(false);
  const items = format === 2 ? menu : products;
  const total = items.reduce((value, item, i) => value + item.price * quantities[i], 0);
  function change(index: number, delta: number) { setReview(false); setQuantities(previous => previous.map((value, i) => i === index ? Math.max(0, Math.min(99, value + delta)) : value)); }
  return <div className={s.shopPlayground}><div className={s.tabs} role="group" aria-label="Formato da demonstração">{formats.map((label, i) => <button key={label} aria-pressed={format === i} onClick={() => { setFormat(i); setQuantities([0, 0]); setReview(false); }}>{label}</button>)}</div><div className={s.shopWindow}>
    <div className={s.shopTop}><b>{format === 2 ? "kobra" : "vortex"}<span>.</span></b><small>{format === 2 ? "CARDÁPIO / DELIVERY" : "ATELIER / COLEÇÃO"}</small></div><div className={s.shopWindowTitle}><span>DEMONSTRAÇÃO / {formats[format].toUpperCase()}</span><h2>{format === 2 ? "Escolha seu" : "Explore a"}<br /><em>{format === 2 ? "próximo favorito." : "coleção."}</em></h2></div><div className={s.products}>{items.map((item, i) => <article key={`${format}-${item.name}`}><div className={s.productArt}><Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 760px) 45vw, 22vw" /></div><h3>{item.name}</h3><p>{money(item.price)}</p><div className={s.quantity}><button onClick={() => change(i, -1)} aria-label={`Remover ${item.name}`} disabled={quantities[i] === 0}><Minus size={12} /></button><output aria-label={`Quantidade de ${item.name}`}>{quantities[i]}</output><button onClick={() => change(i, 1)} aria-label={`Adicionar ${item.name}`} disabled={quantities[i] === 99}><Plus size={12} /></button></div></article>)}</div><div className={s.orderSummary}><span>Total ilustrativo<strong>{money(total)}</strong></span><button disabled={!total} onClick={() => setReview(!review)}>{review ? "Voltar à seleção" : format === 1 ? "Revisar compra" : "Revisar pedido"}<ArrowUpRight size={15} /></button></div><div className={s.review} aria-live="polite">{review ? <><Check size={14} /><span>{quantities.reduce((a, b) => a + b, 0)} item(ns) · {format === 1 ? "Checkout e pagamento definidos no projeto." : "Pedido preparado para o atendimento."} Esta simulação não envia pedidos.</span></> : <span>{format === 1 ? "Carrinho, pagamento e entrega conforme a plataforma e o escopo." : "O cliente escolhe. O atendimento conclui pelo canal combinado."}</span>}</div>
    </div><p className={s.note}>Produtos e valores fictícios. Nenhum pedido ou pagamento é realizado.</p></div>;
}
