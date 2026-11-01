"use server";

import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  checkAdminPassword,
  createAdminToken,
  isAdmin,
} from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";

const STATUSES = ["novo", "contatado", "cotado", "fechado", "perdido"];

export interface PilotLeadRecord {
  id: string;
  name: string;
  whatsapp: string;
  modality: string;
  capitalInsured: number;
  status: string;
  createdAt: number;
  deleteAfter: number;
}

let failedAttempts = 0;
let lockedUntil = 0;

export async function adminSession() {
  return { authenticated: await isAdmin() };
}

export async function adminLogin(password: string) {
  if (!process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "Painel não configurado (ADMIN_PASSWORD)." };
  }
  if (Date.now() < lockedUntil) {
    return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." };
  }
  if (typeof password !== "string" || !checkAdminPassword(password)) {
    failedAttempts += 1;
    if (failedAttempts >= 5) {
      failedAttempts = 0;
      lockedUntil = Date.now() + 5 * 60 * 1000;
    }
    return { ok: false, error: "Senha incorreta." };
  }

  failedAttempts = 0;
  (await cookies()).set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return { ok: true };
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function listPilotLeads(): Promise<PilotLeadRecord[] | null> {
  if (!(await isAdmin())) return null;

  const db = await getDb();
  const docs = await db
    .collection("pilot_leads")
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: String(doc.name ?? ""),
    whatsapp: String(doc.whatsapp ?? ""),
    modality: String(doc.modality ?? ""),
    capitalInsured: Number(doc.capitalInsured ?? 0),
    status: String(doc.status ?? "novo"),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.getTime() : 0,
    deleteAfter: doc.deleteAfter instanceof Date ? doc.deleteAfter.getTime() : 0,
  }));
}

export async function updatePilotLeadStatus(id: string, status: string) {
  if (!(await isAdmin()) || !ObjectId.isValid(id) || !STATUSES.includes(status)) {
    throw new Error("Ação não autorizada.");
  }
  const db = await getDb();
  await db
    .collection("pilot_leads")
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
}

export async function deletePilotLead(id: string) {
  if (!(await isAdmin()) || !ObjectId.isValid(id)) {
    throw new Error("Ação não autorizada.");
  }
  const db = await getDb();
  await db.collection("pilot_leads").deleteOne({ _id: new ObjectId(id) });
}
