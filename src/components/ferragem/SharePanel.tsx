"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail, Share2 } from "lucide-react";
import { STORE, money, installmentLabel, productPath, shareMessage, type Product } from "./catalog-data";
import { useDomain, useOrigin } from "./domain-store";
import s from "./ferragem.module.css";

type Brand = "whatsapp" | "telegram" | "facebook" | "x";

const BRAND_PATHS: Record<Brand, string> = {
  whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z",
  telegram: "M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.2.2-.5.4-.9.4l.3-4.8 8.8-7.9c.4-.3-.1-.5-.6-.2L6.8 13.3l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 3.2c.9-.3 1.6.2 1.3 1.1Z",
  facebook: "M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.2-1.5 1.5-1.5h1.6V5.1a22 22 0 0 0-2.4-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6v7.7a10 10 0 1 1 3.2 0Z",
  x: "M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.4L5.4 21H2.3l7.2-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z",
};

function BrandIcon({ brand }: { brand: Brand }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d={BRAND_PATHS[brand]} />
    </svg>
  );
}

function useCanShare() {
  return useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === "function",
    () => false,
  );
}

export function SharePanel({ product, imagePath }: { product: Product; imagePath: string }) {
  const origin = useOrigin();
  const domain = useDomain();
  const canShare = useCanShare();
  const [copied, setCopied] = useState(false);
  const url = `${origin}${productPath(product)}`;
  const text = shareMessage(product, url);
  const plain = text.replace(/\*/g, "");
  const shortText = `${product.name} — ${money(product.cashPrice)} à vista`;

  const channels: { label: string; href: string; brand?: Brand; className: string }[] = [
    { label: "WhatsApp", brand: "whatsapp", className: s.shareWa, href: `https://wa.me/?text=${encodeURIComponent(text)}` },
    { label: "Telegram", brand: "telegram", className: s.shareTg, href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(plain.replace(url, "").trim())}` },
    { label: "Facebook", brand: "facebook", className: s.shareFb, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "X", brand: "x", className: s.shareX, href: `https://x.com/intent/post?text=${encodeURIComponent(shortText)}&url=${encodeURIComponent(url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copie o link do produto:", url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: product.name, text: plain.replace(url, "").trim(), url });
    } catch {
      /* a pessoa fechou a janela de compartilhar */
    }
  }

  return (
    <section className={s.share} aria-labelledby="enviar-produto">
      <h2 id="enviar-produto" className={s.shareTitle}>Enviar este produto</h2>
      <p className={s.shareLead}>O link abre esta página com foto, preços e o botão para falar com a loja.</p>

      <ul className={s.shareGrid}>
        {channels.map((channel) => (
          <li key={channel.label}>
            <a className={`${s.shareButton} ${channel.className}`} href={channel.href} target="_blank" rel="noopener noreferrer">
              {channel.brand && <BrandIcon brand={channel.brand} />}
              <span>{channel.label}</span>
              <span className={s.srOnly}> (abre em nova aba)</span>
            </a>
          </li>
        ))}
        <li>
          <a className={`${s.shareButton} ${s.shareMail}`} href={`mailto:?subject=${encodeURIComponent(`${product.name} | ${STORE.name}`)}&body=${encodeURIComponent(plain)}`}>
            <Mail size={20} aria-hidden="true" />
            <span>E-mail</span>
          </a>
        </li>
        <li>
          <button type="button" className={`${s.shareButton} ${s.shareCopy}`} onClick={copy}>
            {copied ? <Check size={20} aria-hidden="true" /> : <Copy size={20} aria-hidden="true" />}
            <span>{copied ? "Link copiado" : "Copiar link"}</span>
          </button>
        </li>
        {canShare && (
          <li className={s.shareWide}>
            <button type="button" className={`${s.shareButton} ${s.shareMore}`} onClick={nativeShare}>
              <Share2 size={20} aria-hidden="true" />
              <span>Mais apps (Instagram, Messenger, SMS…)</span>
            </button>
          </li>
        )}
      </ul>
      <p className={s.srOnly} aria-live="polite">{copied ? "Link copiado" : ""}</p>

      <figure className={s.preview}>
        <figcaption className={s.previewCaption}>Assim o link aparece na conversa</figcaption>
        <div className={s.bubble}>
          {/* eslint-disable-next-line @next/next/no-img-element -- imagem gerada pela rota opengraph-image */}
          <img src={imagePath} alt="" width={1200} height={630} className={s.bubbleImage} loading="lazy" />
          <div className={s.bubbleBody}>
            <strong>{product.name} | {STORE.name}</strong>
            <span>{money(product.cashPrice)} à vista ou {installmentLabel(product)}</span>
            <span className={s.bubbleDomain}>{domain.replace(/^www\./, "")}</span>
          </div>
        </div>
        <p className={s.previewNote}>
          Nesta demonstração o link enviado é o da NexuSync. No site publicado, sai com o domínio da loja.
        </p>
      </figure>
    </section>
  );
}
