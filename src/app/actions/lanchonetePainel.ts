"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { PAYMENTS, type Customer } from "@/components/lanchonete/order";
import { ORDER_STATUSES, type OrderStatus } from "@/components/lanchonete/order-status";
import { checkCredentials, endSession, hasSession, startSession } from "@/lib/lanchonete-auth";
import { getDb } from "@/lib/mongodb";

const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 5 * 60 * 1000;
const LIST_LIMIT = 200;

const failures = new Map<string, number[]>();

export type PanelOrder = {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: number;
  items: { name: string; qty: number; total: number; details: string[] }[];
  customer: Customer & { paymentLabel: string };
  deliveryFee: number;
  total: number;
};

/** `expirou`: a sessão acabou. `sumiu`: o pedido já tinha sido apagado. */
export type PanelResult = "ok" | "expirou" | "sumiu";

export async function loginLanchonete(user: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < FAILURE_WINDOW_MS);
  if (recent.length >= MAX_FAILURES) {
    return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." };
  }
  if (typeof user !== "string" || typeof password !== "string" || !checkCredentials(user.trim(), password)) {
    if (failures.size > 5000) failures.clear();
    failures.set(ip, [...recent, now]);
    return { ok: false, error: "Login ou senha incorretos." };
  }
  failures.delete(ip);
  await startSession();
  return { ok: true };
}

export async function logoutLanchonete() {
  await endSession();
}

/** Devolve `null` sem sessão válida; lança erro se o banco não responder. */
export async function listLanchoneteOrders(): Promise<PanelOrder[] | null> {
  if (!(await hasSession())) return null;

  const db = await getDb();
  const docs = await db.collection("lanchonete_pedidos").find({}).sort({ createdAt: -1 }).limit(LIST_LIMIT).toArray();

  return docs.map((doc) => {
    const customer = doc.customer as Customer;
    const items = doc.items as { name: string; qty: number; total: number; choices: string[]; addonNames: string[]; note: string }[];
    return {
      id: doc._id.toString(),
      code: String(doc.code),
      status: ORDER_STATUSES.find((status) => status === doc.status) ?? "novo",
      createdAt: (doc.createdAt as Date).getTime(),
      items: items.map((item) => ({
        name: item.name,
        qty: item.qty,
        total: item.total,
        details: [...item.choices, ...item.addonNames.map((name) => `+ ${name}`), ...(item.note ? [`Obs.: ${item.note}`] : [])],
      })),
      customer: { ...customer, paymentLabel: PAYMENTS.find((option) => option.id === customer.payment)?.label ?? customer.payment },
      deliveryFee: Number(doc.deliveryFee),
      total: Number(doc.total),
    };
  });
}

export async function setLanchoneteOrderStatus(id: string, status: OrderStatus): Promise<PanelResult> {
  if (!(await hasSession())) return "expirou";
  if (typeof id !== "string" || !ObjectId.isValid(id) || !ORDER_STATUSES.includes(status)) return "sumiu";
  const db = await getDb();
  const result = await db.collection("lanchonete_pedidos").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return result.matchedCount ? "ok" : "sumiu";
}

export async function deleteLanchoneteOrder(id: string): Promise<PanelResult> {
  if (!(await hasSession())) return "expirou";
  if (typeof id !== "string" || !ObjectId.isValid(id)) return "sumiu";
  const db = await getDb();
  const result = await db.collection("lanchonete_pedidos").deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount ? "ok" : "sumiu";
}
