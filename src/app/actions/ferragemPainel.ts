"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NOTE_PANEL_MAX, ORDER_STATUSES, type OrderMode, type OrderStatus } from "@/components/ferragem/order-status";
import { checkCredentials, endSession, hasSession, startSession } from "@/lib/ferragem-auth";
import { getDb } from "@/lib/mongodb";

const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 5 * 60 * 1000;
const LIST_LIMIT = 300;
const COLLECTION = "ferragem_pedidos";

const failures = new Map<string, number[]>();

export type PanelOrder = {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  customer: { name: string; phone: string };
  mode: OrderMode;
  address: { street: string; district: string; reference: string; map: string | null; exact: boolean } | null;
  items: { name: string; sku: string; qty: number; total: number; heavy: boolean }[];
  note: string;
  panelNote: string;
  freight: number;
  cashTotal: number;
  cardTotal: number;
  history: { status: OrderStatus; at: number }[];
};

/** `expirou`: a sessão acabou. `sumiu`: o pedido não existe mais. */
export type PanelResult = "ok" | "expirou" | "sumiu";

const asStatus = (value: unknown): OrderStatus => ORDER_STATUSES.find((status) => status === value) ?? "novo";

export async function loginFerragem(user: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < FAILURE_WINDOW_MS);
  if (recent.length >= MAX_FAILURES) return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." };
  if (typeof user !== "string" || typeof password !== "string" || !checkCredentials(user.trim(), password)) {
    if (failures.size > 5000) failures.clear();
    failures.set(ip, [...recent, now]);
    return { ok: false, error: "Login ou senha incorretos." };
  }
  failures.delete(ip);
  await startSession();
  return { ok: true };
}

export async function logoutFerragem() {
  await endSession();
}

/** Devolve `null` sem sessão válida; lança erro se o banco não responder. */
export async function listFerragemOrders(): Promise<PanelOrder[] | null> {
  if (!(await hasSession())) return null;
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).limit(LIST_LIMIT).toArray();

  return docs.map((doc) => {
    const items = (doc.items ?? []) as { name: string; sku: string; qty: number; cashPrice: number; heavy?: boolean }[];
    const address = doc.address as { street: string; district: string; reference: string; coords: unknown; map: string | null } | null;
    const history = ((doc.history ?? []) as { status: unknown; at: Date }[]).map((entry) => ({ status: asStatus(entry.status), at: entry.at.getTime() }));
    return {
      id: doc._id.toString(),
      code: String(doc.code),
      status: asStatus(doc.status),
      createdAt: (doc.createdAt as Date).getTime(),
      updatedAt: history.at(-1)?.at ?? (doc.createdAt as Date).getTime(),
      customer: { name: String(doc.customer?.name ?? ""), phone: String(doc.customer?.phone ?? "") },
      mode: doc.mode === "entrega" ? "entrega" : "retirada",
      address: address
        ? { street: address.street, district: address.district, reference: address.reference, map: address.map, exact: Boolean(address.coords) }
        : null,
      items: items.map((item) => ({ name: item.name, sku: item.sku, qty: item.qty, total: item.cashPrice * item.qty, heavy: Boolean(item.heavy) })),
      note: String(doc.note ?? ""),
      panelNote: String(doc.panelNote ?? ""),
      freight: Number(doc.freight ?? 0),
      cashTotal: Number(doc.cashTotal ?? 0),
      cardTotal: Number(doc.cardTotal ?? 0),
      history,
    };
  });
}

export async function setFerragemOrderStatus(id: string, status: OrderStatus): Promise<PanelResult> {
  if (!(await hasSession())) return "expirou";
  if (typeof id !== "string" || !ObjectId.isValid(id) || !ORDER_STATUSES.includes(status)) return "sumiu";
  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status }, $push: { history: { status, at: new Date() } } } as never);
  return result.matchedCount ? "ok" : "sumiu";
}

/** Anotação interna da loja (o que está pendente, combinado com o cliente…). O cliente não vê. */
export async function setFerragemPanelNote(id: string, note: string): Promise<PanelResult> {
  if (!(await hasSession())) return "expirou";
  if (typeof id !== "string" || !ObjectId.isValid(id) || typeof note !== "string") return "sumiu";
  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { panelNote: note.trim().slice(0, NOTE_PANEL_MAX) } });
  return result.matchedCount ? "ok" : "sumiu";
}

export async function deleteFerragemOrder(id: string): Promise<PanelResult> {
  if (!(await hasSession())) return "expirou";
  if (typeof id !== "string" || !ObjectId.isValid(id)) return "sumiu";
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? "ok" : "sumiu";
}
