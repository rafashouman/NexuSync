"use client";

import { useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import s from "./lanchonete.module.css";

/** Enviar o link deste item: WhatsApp direto, ou o compartilhamento do celular (com cópia do link como reserva). */
export function ShareItem({ name, url }: { name: string; url: string }) {
  const [status, setStatus] = useState("");

  async function share() {
    // No endereço onde a página está aberta (local, homologação ou produção).
    const here = window.location.origin + window.location.pathname;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url: here });
        return;
      }
      await navigator.clipboard.writeText(here);
      setStatus("Link copiado.");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setStatus(`Copie o link: ${here}`);
    }
  }

  return (
    <section className={s.share} aria-labelledby="enviar-item">
      <h2 id="enviar-item">Enviar para alguém</h2>
      <div className={s.shareRow}>
        <a
          className={s.ghost}
          href={`https://wa.me/?text=${encodeURIComponent(`Olha este do cardápio: ${name}\n${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} aria-hidden="true" />WhatsApp<span className={s.srOnly}> (abre em nova aba)</span>
        </a>
        <button type="button" className={s.ghost} onClick={share}>
          <Share2 size={18} aria-hidden="true" />Compartilhar link
        </button>
      </div>
      <p className={s.shareStatus} role="status">{status}</p>
    </section>
  );
}
