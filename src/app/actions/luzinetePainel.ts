"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { AGENDA, type Mode } from "@/components/luzinete/data";
import { checkCredentials, endSession, hasSession, panelEnabled, startSession } from "@/lib/luzinete-auth";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "luzinete_agendamentos";
const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 5 * 60 * 1000;
const LIST_LIMIT = 500;

const failures = new Map<string, number[]>();

export type PanelSession = {
  id: string;
  date: string;
  time: string;
  startsAt: number;
  mode: Mode;
  name: string;
  whatsapp: string;
  email: string;
  firstSession: boolean;
  note: string;
  createdAt: number;
  cancelled: boolean;
};

/** `now` é a hora do servidor, que separa as próximas sessões das anteriores. */
export type PanelAgenda = { now: number; sessions: PanelSession[] };

/** `expirou`: o acesso terminou. `indisponivel`: a sessão já foi cancelada, apagada ou já passou. */
export type CancelResult = "ok" | "expirou" | "indisponivel";

export async function loginLuzinete(user: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!panelEnabled()) {
    return { ok: false, error: "Painel desligado: falta definir a senha (LUZINETE_ADMIN_PASSWORD) no servidor." };
  }
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

export async function logoutLuzinete() {
  await endSession();
}

/** Devolve `null` sem acesso válido; lança erro se o banco não responder. */
export async function listLuzineteSessions(): Promise<PanelAgenda | null> {
  if (!(await hasSession())) return null;

  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).sort({ startsAt: -1 }).limit(LIST_LIMIT).toArray();

  return {
    now: Date.now(),
    sessions: docs.map((doc) => ({
      id: doc._id.toString(),
      date: String(doc.date),
      time: String(doc.time),
      startsAt: (doc.startsAt as Date).getTime(),
      mode: doc.mode === "online" ? "online" : "presencial",
      name: String(doc.name),
      whatsapp: String(doc.whatsapp),
      email: String(doc.email ?? ""),
      firstSession: doc.firstSession === true,
      note: String(doc.note ?? ""),
      createdAt: (doc.createdAt as Date).getTime(),
      cancelled: doc.active !== true,
    })),
  };
}

/** Cancela e libera o horário no site. O registro fica guardado até o prazo de retenção. */
export async function cancelLuzineteSession(id: string): Promise<CancelResult> {
  if (!(await hasSession())) return "expirou";
  if (typeof id !== "string" || !ObjectId.isValid(id)) return "indisponivel";
  const db = await getDb();
  const now = new Date();
  const result = await db.collection(COLLECTION).updateOne(
    // Só o que ainda não terminou.
    { _id: new ObjectId(id), active: true, startsAt: { $gt: new Date(now.getTime() - AGENDA.durationMin * 60_000) } },
    { $set: { active: false, status: "cancelado", cancelledAt: now } },
  );
  return result.matchedCount ? "ok" : "indisponivel";
}
