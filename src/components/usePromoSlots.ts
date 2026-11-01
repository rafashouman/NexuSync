"use client";

import { useEffect, useState } from "react";
import { getPromoSlots } from "@/app/actions/promoSlots";
import type { PromoKey, PromoRemaining } from "@/lib/promo-slots";

let cached: Promise<PromoRemaining | null> | null = null;

// Uma única consulta por carregamento da página, compartilhada entre as seções de planos.
function loadSlots() {
  cached ??= getPromoSlots().catch((error) => {
    console.error("Could not load promo slots.", error);
    return null;
  });
  return cached;
}

export function usePromoSlots() {
  const [slots, setSlots] = useState<PromoRemaining | null>(null);
  useEffect(() => {
    let active = true;
    loadSlots().then((value) => {
      if (active) setSlots(value);
    });
    return () => {
      active = false;
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
  if (remaining === undefined) {
    return { price: plan.price, originalPrice: plan.originalPrice, label: null };
  }
  if (remaining <= 0) {
    return { price: plan.originalPrice ?? plan.price, originalPrice: undefined, label: null };
  }
  return {
    price: plan.price,
    originalPrice: plan.originalPrice,
    label:
      remaining === 1
        ? "Última vaga promocional"
        : `Promoção · restam ${remaining} vagas`,
  };
}
