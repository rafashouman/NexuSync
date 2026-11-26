"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { discountPercent, money, productPath, type Product } from "./catalog-data";
import s from "./ferragem.module.css";

/** Etiqueta de oferta que gira entre os produtos com desconto. Pausa ao passar o mouse ou no botão. */
export function HeroDeal({ deals }: { deals: Product[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const stopped = paused || hover;

  useEffect(() => {
    if (stopped || deals.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % deals.length), 3400);
    return () => window.clearInterval(timer);
  }, [stopped, deals.length]);

  const deal = deals[index];
  if (!deal) return null;
  const off = discountPercent(deal);

  return (
    <div
      className={s.deal}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
    >
      <div className={s.dealHead}>
        <span className={s.dealLive} aria-hidden="true" />
        <span>Oferta no Pix</span>
        <span className={s.dealCount} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}/{String(deals.length).padStart(2, "0")}
        </span>
        <button type="button" className={s.dealPause} onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar ofertas" : "Pausar ofertas"}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
      <Link href={productPath(deal)} className={s.dealBody} key={deal.slug}>
        <span className={s.dealThumb}>
          {deal.image && <Image src={deal.image} alt="" fill sizes="88px" />}
        </span>
        <span className={s.dealText}>
          <span className={s.dealName}>{deal.name}</span>
          <span className={s.dealPrices}>
            {deal.listPrice ? <s>{money(deal.listPrice)}</s> : null}
            <strong>{money(deal.cashPrice)}</strong>
          </span>
        </span>
        {off > 0 && <span className={s.dealOff}>-{off}%</span>}
      </Link>
      <div className={s.dealBar} aria-hidden="true">
        <span key={`${deal.slug}-${stopped}`} data-run={stopped ? undefined : ""} />
      </div>
    </div>
  );
}
