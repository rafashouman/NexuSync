"use server";

import { headers } from "next/headers";
import { availability, bookingMessage, parseBooking, startsAt, type Availability, type BookingData, type FieldErrors } from "@/components/luzinete/agenda";
import { SITE } from "@/components/luzinete/data";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "luzinete_agendamentos";
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const attempts = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear();
  return recent.length > RATE_LIMIT;
}

async function bookedSlots(now: Date) {
  const db = await getDb();
  return db
    .collection(COLLECTION)
    .find<{ date: string; time: string }>(
      { active: true, startsAt: { $gt: now } },
      // Só dia e hora: nenhum dado de quem reservou sai daqui.
      { projection: { _id: 0, date: 1, time: 1 } },
    )
    .toArray();
}

/** Horários livres, ou `null` quando a agenda não pôde ser consultada. */
export async function getLuzineteSlots(): Promise<Availability | null> {
  try {
    const now = new Date();
    return availability(now, await bookedSlots(now));
  } catch (error) {
    console.error("Could not read the therapist's schedule.", error);
    return null;
  }
}

/**
 * Aviso automático pelo CallMeBot, ligado só quando as duas variáveis existem.
 * Falha no aviso não desfaz a reserva.
 */
async function notifyTherapist(data: BookingData) {
  const phone = process.env.LUZINETE_CALLMEBOT_PHONE;
  const apikey = process.env.LUZINETE_CALLMEBOT_KEY;
  if (!phone || !apikey) return false;
  const query = new URLSearchParams({ phone, apikey, text: bookingMessage(data, { withNote: false }) });
  try {
    const response = await fetch(`https://api.callmebot.com/whatsapp.php?${query}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) console.error(`CallMeBot answered ${response.status} for a new booking.`);
    return response.ok;
  } catch (error) {
    // Sem o erro completo: a URL leva dados do cliente e a chave.
    console.error("CallMeBot notification failed:", error instanceof Error ? error.name : "unknown error");
    return false;
  }
}

export type BookingResult =
  | { status: "ok"; data: BookingData; notified: boolean }
  | { status: "campos"; fields: FieldErrors }
  /** O horário foi reservado por outra pessoa ou deixou de estar disponível. */
  | { status: "tomado" }
  | { status: "duplicado" | "limite" | "erro" | "invalido" };

export async function bookLuzineteSession(input: {
  requestId: string;
  website: string;
  booking: unknown;
}): Promise<BookingResult> {
  if (!input || typeof input !== "object") return { status: "invalido" };
  // Campo oculto: robôs preenchem, pessoas não.
  if (typeof input.website === "string" && input.website.length > 0) return { status: "invalido" };
  if (typeof input.requestId !== "string" || !/^[a-z0-9-]{10,64}$/.test(input.requestId)) return { status: "invalido" };
  const parsed = parseBooking(input.booking);
  if (!parsed) return { status: "invalido" };
  const { data, errors } = parsed;
  if (Object.keys(errors).length > 0) return { status: "campos", fields: errors };

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) return { status: "limite" };

  try {
    const db = await getDb();
    const bookings = db.collection(COLLECTION);
    const now = new Date();

    // O mesmo `requestId` (rede que caiu na volta) devolve a reserva já feita.
    const mine = { requestId: input.requestId, date: data.date, time: data.time };
    if (await bookings.findOne(mine)) return { status: "ok", data, notified: false };

    const free = availability(now, await bookedSlots(now)).slots[data.date]?.[data.mode];
    if (!free?.includes(data.time)) return { status: "tomado" };

    // Uma sessão futura por número de WhatsApp.
    if (await bookings.findOne({ whatsapp: data.whatsapp, active: true, startsAt: { $gt: now } })) {
      return { status: "duplicado" };
    }

    const start = startsAt(data.date, data.time);
    try {
      await bookings.insertOne({
        requestId: input.requestId,
        ...data,
        startsAt: start,
        status: "pendente",
        // Para liberar o horário de uma sessão cancelada, mudar para `false` (ou apagar o registro).
        active: true,
        consentAt: now,
        createdAt: now,
        deleteAfter: new Date(start.getTime() + SITE.retentionDays * DAY_IN_MS),
      });
    } catch (error) {
      // Índice único: outra pessoa gravou este horário primeiro.
      if ((error as { code?: number }).code === 11000) return { status: "tomado" };
      throw error;
    }
    return { status: "ok", data, notified: await notifyTherapist(data) };
  } catch (error) {
    console.error("Could not save the therapy booking.", error);
    return { status: "erro" };
  }
}
