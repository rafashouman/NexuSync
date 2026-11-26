"use server";

import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { STORE, whatsappUrl } from "@/components/lanchonete/menu-data";
import {
  MAX_LINES,
  deliveryFee,
  lineDetails,
  orderMessage,
  parseCustomer,
  parseLine,
  subtotal,
  type CartLine,
  type CustomerErrors,
} from "@/components/lanchonete/order";

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

const newCode = () => `LR-${Array.from({ length: 5 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("")}`;

export type OrderResult =
  | { ok: true; code: string; url: string }
  /** `url` vem quando o pedido é válido mas não pôde ser gravado: ainda dá para enviar pelo WhatsApp. */
  | { ok: false; error: string; fields?: CustomerErrors; url?: string };

export async function sendLanchoneteOrder(input: {
  requestId: string;
  lines: unknown;
  customer: unknown;
  website: string;
}): Promise<OrderResult> {
  const invalid = { ok: false as const, error: "Não conseguimos ler o pedido. Atualize a página e tente de novo." };
  if (!input || typeof input !== "object") return invalid;
  // Campo oculto: robôs preenchem, pessoas não.
  if (typeof input.website === "string" && input.website.length > 0) return invalid;
  if (typeof input.requestId !== "string" || !/^[a-z0-9-]{10,64}$/.test(input.requestId)) return invalid;
  if (!Array.isArray(input.lines) || input.lines.length === 0 || input.lines.length > MAX_LINES) return invalid;

  const parsed = input.lines.map(parseLine);
  if (parsed.some((line) => line === null)) {
    return { ok: false, error: "Um item da sacola mudou no cardápio. Remova e adicione de novo." };
  }
  const lines = parsed as CartLine[];

  const mode = (input.customer as { mode?: unknown } | null)?.mode === "retirada" ? "retirada" : "entrega";
  const fee = deliveryFee(mode);
  const sum = subtotal(lines);
  const result = parseCustomer(input.customer, sum + fee);
  if (!result.ok) return { ok: false, error: "Confira os campos marcados.", fields: result.errors };
  const { customer } = result;

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return {
      ok: false,
      error: "Muitos pedidos em pouco tempo. Aguarde alguns minutos ou envie direto pelo WhatsApp.",
      url: whatsappUrl(orderMessage(null, lines, customer)),
    };
  }

  try {
    const db = await getDb();
    const now = Date.now();
    // O mesmo `requestId` (toque repetido, rede que caiu na volta) não cria um segundo pedido.
    const saved = await db.collection("lanchonete_pedidos").findOneAndUpdate(
      { requestId: input.requestId },
      {
        $setOnInsert: {
          requestId: input.requestId,
          code: newCode(),
          items: lines.map((line) => {
            const { item, addons, unit, total } = lineDetails(line);
            return { ...line, name: item.name, addonNames: addons.map((addon) => addon.name), unit, total };
          }),
          customer,
          subtotal: sum,
          deliveryFee: fee,
          total: sum + fee,
          status: "novo",
          createdAt: new Date(now),
          deleteAfter: new Date(now + STORE.retentionDays * DAY_IN_MS),
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    if (!saved) throw new Error("Order was not returned after upsert.");
    const code = String(saved.code);
    return { ok: true, code, url: whatsappUrl(orderMessage(code, lines, customer)) };
  } catch (error) {
    console.error("Could not save the snack bar order.", error);
    return {
      ok: false,
      error: "Não conseguimos registrar o pedido agora. Você ainda pode enviá-lo pelo WhatsApp.",
      url: whatsappUrl(orderMessage(null, lines, customer)),
    };
  }
}
