"use server";

import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import {
  ADDRESS_MAX, MAX_QTY, NOTE_MAX, STORE, deliveryErrors, freightFor, getProduct, mapsLink, orderMessage, storeWhatsApp, type Delivery,
} from "@/components/ferragem/catalog-data";

const MAX_LINES = 80;
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
// Sem 0/O e 1/I, para o código ser ditado sem confusão.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const attempts = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear();
  return recent.length > RATE_LIMIT;
}

const newCode = () => `TL-${Array.from({ length: 5 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("")}`;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "");

function parseDelivery(value: unknown): Delivery {
  const raw = (value ?? {}) as Record<string, unknown>;
  const c = raw.coords as { lat?: unknown; lng?: unknown } | null;
  const lat = Number(c?.lat);
  const lng = Number(c?.lng);
  return {
    name: text(raw.name, ADDRESS_MAX),
    phone: text(raw.phone, 20),
    mode: raw.mode === "entrega" || raw.mode === "retirada" ? raw.mode : null,
    street: text(raw.street, ADDRESS_MAX),
    district: text(raw.district, ADDRESS_MAX),
    reference: text(raw.reference, ADDRESS_MAX),
    coords: c && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null,
  };
}

export type FerragemOrderResult =
  | { ok: true; code: string; url: string }
  /** `url` vem quando o pedido é válido mas não pôde ser gravado: ainda dá para enviar pelo WhatsApp. */
  | { ok: false; error: string; url?: string };

/** Grava o pedido do carrinho e devolve o link do WhatsApp já com o código. Preços sempre do catálogo, nunca do navegador. */
export async function sendFerragemOrder(input: {
  requestId: string;
  items: unknown;
  note: unknown;
  delivery: unknown;
  website: string;
}): Promise<FerragemOrderResult> {
  const invalid = { ok: false as const, error: "Não conseguimos ler o pedido. Atualize a página e tente de novo." };
  if (!input || typeof input !== "object") return invalid;
  // Campo oculto: robôs preenchem, pessoas não.
  if (typeof input.website === "string" && input.website.length > 0) return invalid;
  if (typeof input.requestId !== "string" || !/^[a-z0-9-]{10,64}$/.test(input.requestId)) return invalid;
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > MAX_LINES) return invalid;

  const lines = [];
  for (const item of input.items as { slug?: unknown; qty?: unknown }[]) {
    const product = typeof item?.slug === "string" ? getProduct(item.slug) : undefined;
    const qty = Number(item?.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false, error: "Um produto do carrinho mudou no catálogo. Remova e adicione de novo." };
    }
    lines.push({ product, qty });
  }

  const delivery = parseDelivery(input.delivery);
  if (Object.keys(deliveryErrors(delivery)).length) return { ok: false, error: "Confira seus dados e a forma de receber." };
  const note = text(input.note, NOTE_MAX);
  const fallback = storeWhatsApp(orderMessage(lines, note, delivery));

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { ok: false, error: "Muitos pedidos em pouco tempo. Envie direto pelo WhatsApp.", url: fallback };
  }

  const freight = freightFor(lines, delivery.mode);
  const cashTotal = lines.reduce((sum, line) => sum + line.product.cashPrice * line.qty, 0) + freight;
  const cardTotal = lines.reduce((sum, line) => sum + line.product.cardPrice * line.qty, 0) + freight;

  try {
    const db = await getDb();
    const now = Date.now();
    // O mesmo `requestId` (toque repetido, rede que caiu na volta) não cria um segundo pedido.
    const saved = await db.collection("ferragem_pedidos").findOneAndUpdate(
      { requestId: input.requestId },
      {
        $setOnInsert: {
          requestId: input.requestId,
          code: newCode(),
          items: lines.map(({ product, qty }) => ({
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            qty,
            cashPrice: product.cashPrice,
            heavy: Boolean(product.heavy),
          })),
          customer: { name: delivery.name, phone: delivery.phone },
          mode: delivery.mode,
          address:
            delivery.mode === "entrega"
              ? { street: delivery.street, district: delivery.district, reference: delivery.reference, coords: delivery.coords, map: mapsLink(delivery) }
              : null,
          note,
          freight,
          cashTotal,
          cardTotal,
          status: "novo",
          panelNote: "",
          history: [{ status: "novo", at: new Date(now) }],
          createdAt: new Date(now),
          deleteAfter: new Date(now + STORE.retentionDays * DAY_IN_MS),
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    if (!saved) throw new Error("Order was not returned after upsert.");
    const code = String(saved.code);
    return { ok: true, code, url: storeWhatsApp(orderMessage(lines, note, delivery, code)) };
  } catch (error) {
    console.error("Could not save the hardware store order.", error);
    return { ok: false, error: "Não conseguimos registrar o pedido agora, mas você ainda pode enviá-lo pelo WhatsApp.", url: fallback };
  }
}
