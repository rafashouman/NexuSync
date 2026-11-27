"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { greetingUrl, painelPath, sectionPath } from "./data";
import s from "./luzinete.module.css";

/**
 * WhatsApp sempre à mão; no celular, também o botão de agendar.
 * O de agendar sai de cena na abertura e dentro da própria agenda, onde só atrapalharia.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const [covering, setCovering] = useState<string[]>([]);

  useEffect(() => {
    const targets = ["inicio", "agendar"].flatMap((id) => document.getElementById(id) ?? []);
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target.id);
          else seen.delete(entry.target.id);
        }
        setCovering([...seen]);
      },
      { rootMargin: "-30% 0px -20% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  // No painel, quem navega é a própria terapeuta.
  if (pathname === painelPath) return null;

  return (
    <div className={s.floating}>
      {covering.length === 0 && (
        <a href={sectionPath("agendar")} className={`${s.button} ${s.floatingBook}`}>
          Agendar minha sessão
        </a>
      )}
      <a href={greetingUrl} target="_blank" rel="noopener noreferrer" className={s.floatingWhats}>
        <MessageCircle aria-hidden="true" />
        <span className={s.srOnly}>Tirar uma dúvida pelo WhatsApp (abre em nova aba)</span>
      </a>
    </div>
  );
}
