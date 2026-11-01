"use server";

import { getDb } from "@/lib/mongodb";
import {
  PILOT_MODALITIES,
  type PilotLeadData,
  type TarotLeadData,
} from "@/lib/pilot";

const LEAD_RETENTION_DAYS = 180;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function retentionDate() {
  return new Date(Date.now() + LEAD_RETENTION_DAYS * DAY_IN_MS);
}

const isString = (value: unknown, max: number) =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;

export async function saveContactRequest(input: {
  name: string;
  company: string;
  message: string;
  projectType: string;
  plan: string;
  route: string;
}) {
  if (
    !input ||
    !isString(input.name, 100) ||
    typeof input.company !== "string" ||
    input.company.length > 150 ||
    !isString(input.message, 2000) ||
    !isString(input.projectType, 120) ||
    typeof input.plan !== "string" ||
    input.plan.length > 120 ||
    typeof input.route !== "string" ||
    input.route.length > 200
  ) {
    throw new Error("Os dados do contato estão incompletos ou inválidos.");
  }

  const db = await getDb();
  await db.collection("leads").insertOne({
    name: input.name.trim(),
    company: input.company.trim(),
    message: input.message.trim(),
    projectType: input.projectType,
    plan: input.plan,
    route: input.route,
    consent: true,
    createdAt: new Date(),
    deleteAfter: retentionDate(),
  });
}

export async function saveTarotLead(input: TarotLeadData) {
  const name = String(input?.name ?? "").trim();
  const whatsapp = String(input?.whatsapp ?? "").trim();
  const question = String(input?.question ?? "").trim();
  const drawnCards = Array.isArray(input?.drawnCards)
    ? input.drawnCards.map((card) => String(card).trim())
    : [];

  if (
    !name ||
    name.length > 100 ||
    !/^[0-9+() -]{8,24}$/.test(whatsapp) ||
    !["obsidian", "mercury", "gold"].includes(input.chosenDeck) ||
    !question ||
    question.length > 600 ||
    drawnCards.length !== 3 ||
    drawnCards.some((card) => !card || card.length > 100) ||
    input.consent !== true
  ) {
    throw new Error("Os dados da leitura estão incompletos ou inválidos.");
  }

  const db = await getDb();
  const result = await db.collection("tarot_leads").insertOne({
    name,
    whatsapp,
    chosenDeck: input.chosenDeck,
    question,
    drawnCards,
    consent: true,
    createdAt: new Date(),
    deleteAfter: retentionDate(),
    source: "hotsite_3_montes",
    status: "novo",
  });

  return { id: result.insertedId.toString() };
}

export async function savePilotLead(input: PilotLeadData) {
  const name = String(input?.name ?? "").trim();
  const whatsapp = String(input?.whatsapp ?? "").trim();

  if (
    !name ||
    name.length > 100 ||
    !/^[0-9+() -]{8,24}$/.test(whatsapp) ||
    !PILOT_MODALITIES.includes(input.modality) ||
    !Number.isInteger(input.capitalInsured) ||
    input.capitalInsured < 100000 ||
    input.capitalInsured > 5000000 ||
    input.consent !== true
  ) {
    throw new Error("Os dados da cotação estão incompletos ou inválidos.");
  }

  const db = await getDb();
  const result = await db.collection("pilot_leads").insertOne({
    name,
    whatsapp,
    modality: input.modality,
    capitalInsured: input.capitalInsured,
    consent: true,
    createdAt: new Date(),
    deleteAfter: retentionDate(),
    source: "hotsite_seguro_pilotos",
    status: "novo",
  });

  return { id: result.insertedId.toString() };
}

export async function saveDaemonRunLog(data: {
  spreadReached: string;
  finalScore: number;
  creditsEarned: number;
  victory: boolean;
}) {
  try {
    if (
      !isString(data?.spreadReached, 100) ||
      !Number.isFinite(data.finalScore) ||
      !Number.isFinite(data.creditsEarned) ||
      typeof data.victory !== "boolean"
    ) {
      return;
    }

    const db = await getDb();
    await db.collection("daemon_runs").insertOne({
      spreadReached: data.spreadReached,
      finalScore: data.finalScore,
      creditsEarned: data.creditsEarned,
      victory: data.victory,
      createdAt: new Date(),
      deleteAfter: retentionDate(),
    });
  } catch (error) {
    console.error("Erro ao registrar telemetria no MongoDB:", error);
  }
}
