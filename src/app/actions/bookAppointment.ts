"use server";

import { getDb } from "@/lib/mongodb";
import { parsePlayerToken } from "@/lib/player-server";

import { futureSalonSlot, salonHours, salonServices, salonToday } from "@/lib/salon";

export interface BookingPayload {
  date: string; // Formato: YYYY-MM-DD
  timeSlot: string; // Formato: HH:mm
  serviceName: string; // Ex: "Balcão do Chef (Fornalha) • 4 Pessoas"
  venue?: "salon";
  guests?: number;
  seatingZone?: string;
}

const ALLOWED_SLOTS = new Set([
  "09:00",
  "10:30",
  "14:00",
  "15:30",
  "17:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]);

function isValidDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export async function bookAppointment(data: BookingPayload, idToken: string) {
  if (
    !data ||
    typeof data.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    !isValidDate(data.date) ||
    data.date < (data.venue === "salon" ? salonToday() : new Date().toISOString().slice(0, 10)) ||
    typeof data.timeSlot !== "string" ||
    !ALLOWED_SLOTS.has(data.timeSlot) ||
    typeof data.serviceName !== "string" ||
    data.serviceName.trim().length === 0 ||
    data.serviceName.length > 140 ||
    typeof idToken !== "string" ||
    idToken.length === 0 ||
    idToken.length > 10_000
  ) {
    return { success: false, error: "Dados da reserva inválidos." };
  }

  if (data.venue === "salon" && (!salonServices.some(s => s.name === data.serviceName)
    || !salonHours.some(hour => hour === data.timeSlot) || !futureSalonSlot(data.date, data.timeSlot))) {
    return { success: false, error: "Escolha um serviço e um horário futuro da agenda." };
  }
  const player = parsePlayerToken(idToken);
  if (!player) {
    return { success: false, error: "Defina um apelido para confirmar a reserva." };
  }

  const sanitizedSlot = data.timeSlot.replace(":", "-");
  const slotDocId = `${data.venue === "salon" ? "salon" : "slot"}_${data.date}_${sanitizedSlot}`;

  try {
    const db = await getDb();
    // _id único garante o lock atômico do horário.
    await db.collection<{ _id: string } & Record<string, unknown>>("appointments").insertOne({
      _id: slotDocId,
      uid: player.id,
      clientName: player.name,
      date: data.date,
      timeSlot: data.timeSlot,
      serviceName: data.serviceName,
      ...(data.venue === "salon" ? { venue: "salon" } : {
        guests: data.guests ?? 2,
        seatingZone: data.seatingZone ?? "Salão Principal",
      }),
      status: "CONFIRMED",
      createdAt: new Date(),
    });

    return { success: true, bookingId: slotDocId };
  } catch (error) {
    if ((error as { code?: number })?.code === 11000) {
      return {
        success: false,
        error:
          "Esta janela acabou de ser reservada por outro cliente. Escolha outro horário.",
      };
    }
    console.error("Unable to reserve appointment slot.", error);
    return {
      success: false,
      error: "Não foi possível processar a reserva. Tente novamente.",
    };
  }
}
export async function occupiedSalonHours(date: string): Promise<string[] | null> {
  if (!isValidDate(date)) return null;
  try {
    const db = await getDb();
    return await db.collection<{ timeSlot: string; date: string; venue: string }>("appointments")
      .distinct("timeSlot", { venue: "salon", date });
  } catch {
    return null;
  }
}
