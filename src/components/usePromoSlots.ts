"use client";

import { useEffect, useState } from "react";
import { MAX_PROMO_SLOTS, PROMO_KEYS, type PromoKey, type PromoRemaining } from "@/lib/promo-slots";
import { isPublicPrice } from "@/lib/public-pricing";

let cached: Promise<PromoRemaining | null> | null = null;

// Uma única consulta por carregamento da página, compartilhada entre as seções de planos.
function loadSlots() {
  cached ??= fetchSlots().then((slots) => {
    // Uma falha transitória não deve ficar em cache até recarregar a página.
    if (slots === null) cached = null;
    return slots;
  });
  return cached;
}

async function fetchSlots(): Promise<PromoRemaining | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch("/api/promo-slots", {
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) throw new Error(`Promo slots: ${response.status}`);
      const value: unknown = await response.json();
      if (
        !value || typeof value !== "object" ||
        !PROMO_KEYS.every((key) => {
          const remaining = (value as Record<string, unknown>)[key];
          return typeof remaining === "number" && Number.isInteger(remaining) &&
            remaining >= 0 && remaining <= MAX_PROMO_SLOTS;
        })
      ) return null;
      return value as PromoRemaining;
    } catch {
      // Sem conexão, timeout ou servidor indisponível: mantém o fallback visual.
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  return null;
}

export function usePromoSlots() {
  const [slots, setSlots] = useState<PromoRemaining | null>(null);
  useEffect(() => {
    let active = true;
    const refresh = () => {
      void loadSlots().then((value) => {
        if (active) setSlots(value);
      });
    };
    refresh();
    window.addEventListener("online", refresh);
    return () => {
      active = false;
      window.removeEventListener("online", refresh);
    };
  }, []);
  return slots;
}

// Sem resposta do servidor, mantém o preço promocional sem exibir contagem de vagas.
// Com vagas esgotadas, o preço volta ao valor cheio e o selo some.
export function promoView(
  slots: PromoRemaining | null,
  key: PromoKey,
  plan: { price: string; originalPrice?: string }
) {
  const remaining = slots?.[key];
  const exhausted = remaining !== undefined && remaining <= 0;
  const price = exhausted ? plan.originalPrice ?? plan.price : plan.price;
  const consultation = !isPublicPrice(price);
  const originalPrice = !exhausted && !consultation && plan.originalPrice && isPublicPrice(plan.originalPrice)
    ? plan.originalPrice : undefined;
  return {
    price: consultation ? "Sob consulta" : price,
    displayPrice: consultation ? "Sob consulta" : `R$ ${price}`,
    consultation,
    originalPrice,
    label:
      consultation || remaining === undefined || exhausted ? null : remaining === 1
        ? "Última vaga promocional"
        : `Promoção · restam ${remaining} vagas`,
  };
}
