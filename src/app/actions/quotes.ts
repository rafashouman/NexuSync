"use server";

import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/admin-auth";
import {
  QUOTE_BUDGETS,
  QUOTE_GOALS,
  QUOTE_INTERESTS,
  QUOTE_STATUSES,
} from "@/lib/quote";

const RETENTION_DAYS = 180;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const attempts = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear();
  return recent.length > RATE_LIMIT;
}

const text = (value: unknown, max: number, required = true) => {
  const v = typeof value === "string" ? value.trim() : "";
  if (v.length > max || (required && v.length === 0)) return null;
  return v;
};

export interface QuoteInput {
  name: string;
  company: string;
  segment: string;
  contact: string;
  goal: string;
  interest: string;
  budget: string;
  message: string;
  consentContact: boolean;
  consentPromo: boolean;
  website: string;
}

export async function saveQuoteRequest(
  input: QuoteInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const invalid = { ok: false as const, error: "Confira os campos e tente novamente." };
  if (!input || typeof input !== "object") return invalid;

  // Campo oculto: robôs preenchem, pessoas não. Fingimos sucesso sem gravar.
  if (typeof input.website === "string" && input.website.length > 0) {
    return { ok: true };
  }

  const name = text(input.name, 100);
  const company = text(input.company, 150, false);
  const segment = text(input.segment, 100);
  const contact = text(input.contact, 150);
  const message = text(input.message, 1000, false);
  const isPhone = contact !== null && /^[0-9+() -]{8,24}$/.test(contact);
  const isEmail = contact !== null && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

  const goal = QUOTE_GOALS.find((g) => g.id === input.goal);
  const interest = QUOTE_INTERESTS.find((i) => i.id === input.interest);
  const budget =
    input.budget === "" || (QUOTE_BUDGETS as readonly string[]).includes(input.budget)
      ? input.budget
      : null;

  if (
    !name ||
    company === null ||
    !segment ||
    !contact ||
    !(isPhone || isEmail) ||
    message === null ||
    !goal ||
    !interest ||
    budget === null ||
    input.consentContact !== true
  ) {
    return invalid;
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return { ok: false, error: "Muitas solicitações. Tente novamente em alguns minutos." };
  }

  try {
    const db = await getDb();
    await db.collection("quote_requests").insertOne({
      name,
      company,
      segment,
      contact,
      goal: goal.id,
      interest: interest.id,
      budget,
      message,
      consentContact: true,
      consentPromo: input.consentPromo === true,
      status: "novo",
      createdAt: new Date(),
      deleteAfter: new Date(Date.now() + RETENTION_DAYS * DAY_IN_MS),
    });
    return { ok: true };
  } catch (error) {
    console.error("Could not save the quote request.", error);
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente ou chame no WhatsApp." };
  }
}

export interface QuoteRecord {
  id: string;
  name: string;
  company: string;
  segment: string;
  contact: string;
  goal: string;
  interest: string;
  budget: string;
  message: string;
  consentPromo: boolean;
  status: string;
  createdAt: number;
}

export async function listQuoteRequests(): Promise<QuoteRecord[] | null> {
  if (!(await isAdmin())) return null;
  const db = await getDb();
  const docs = await db
    .collection("quote_requests")
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: String(doc.name ?? ""),
    company: String(doc.company ?? ""),
    segment: String(doc.segment ?? ""),
    contact: String(doc.contact ?? ""),
    goal: String(doc.goal ?? ""),
    interest: String(doc.interest ?? ""),
    budget: String(doc.budget ?? ""),
    message: String(doc.message ?? ""),
    consentPromo: doc.consentPromo === true,
    status: String(doc.status ?? "novo"),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.getTime() : 0,
  }));
}

export async function updateQuoteStatus(id: string, status: string) {
  if (
    !(await isAdmin()) ||
    !ObjectId.isValid(id) ||
    !(QUOTE_STATUSES as readonly string[]).includes(status)
  ) {
    throw new Error("Ação não autorizada.");
  }
  const db = await getDb();
  await db
    .collection("quote_requests")
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
}

export async function deleteQuoteRequest(id: string) {
  if (!(await isAdmin()) || !ObjectId.isValid(id)) {
    throw new Error("Ação não autorizada.");
  }
  const db = await getDb();
  await db.collection("quote_requests").deleteOne({ _id: new ObjectId(id) });
}
