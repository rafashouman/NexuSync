"use server";

import nodemailer from "nodemailer";
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

export interface CyberOregonLeadInput {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function saveCyberOregonLead(input: CyberOregonLeadInput) {
  const name = String(input?.name ?? "").trim();
  const company = String(input?.company ?? "").trim();
  const email = String(input?.email ?? "").trim();
  const phone = String(input?.phone ?? "").trim();
  const service = String(input?.service ?? "").trim();
  const message = String(input?.message ?? "").trim();

  if (
    name.length < 2 ||
    name.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 150 ||
    company.length > 120 ||
    phone.length > 30 ||
    !service ||
    service.length > 150 ||
    message.length > 1500
  ) {
    throw new Error("Preencha corretamente os campos obrigatórios.");
  }

  const db = await getDb();
  const createdAt = new Date();
  const result = await db.collection("cyber_oregon_leads").insertOne({
    name,
    company: company || null,
    email,
    phone: phone || null,
    service,
    message: message || null,
    createdAt,
    deleteAfter: retentionDate(),
    source: "landing_cyber_oregon",
    status: "novo",
  });

  const leadId = result.insertedId.toString();
  let emailSent = false;

  const smtpUser = process.env.HOSTINGER_SMTP_USER?.trim();
  const smtpPass = process.env.HOSTINGER_SMTP_PASS?.trim();
  const smtpHost = process.env.HOSTINGER_SMTP_HOST?.trim() || "smtp.hostinger.com";
  const smtpPort = Number(process.env.HOSTINGER_SMTP_PORT || "465");
  const notifyTo = process.env.CYBEROREGON_NOTIFY_EMAIL?.trim() || smtpUser;

  if (smtpUser && smtpPass && notifyTo) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const subject = `[CyberOregon] Nova solicitação de ${name}${company ? ` (${company})` : ""}`;
      const textBody = [
        "Nova solicitação recebida na landing page CyberOregon",
        "",
        `ID MongoDB: ${leadId}`,
        `Nome: ${name}`,
        `Empresa: ${company || "Não informada"}`,
        `E-mail: ${email}`,
        `Telefone: ${phone || "Não informado"}`,
        `Solução Desejada: ${service}`,
        `Detalhes do Escopo: ${message || "Não informado"}`,
        `Data: ${createdAt.toISOString()}`,
      ].join("\n");

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background:#020b1f; color:#e2e8f0; padding:24px; border-radius:12px;">
          <h2 style="color:#00eaff; margin-top:0;">Nova solicitação — CyberOregon</h2>
          <p style="font-size:14px; color:#94a3b8;">Registro salvo na collection <strong>cyber_oregon_leads</strong> (ID: ${escapeHtml(leadId)}).</p>
          <table style="width:100%; border-collapse:collapse; margin-top:16px; font-size:14px;">
            <tr><td style="padding:8px 0; color:#94a3b8;"><strong>Nome:</strong></td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8;"><strong>Empresa:</strong></td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(company || "Não informada")}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8;"><strong>E-mail:</strong></td><td style="padding:8px 0; color:#00eaff;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8;"><strong>Telefone:</strong></td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(phone || "Não informado")}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8;"><strong>Solução:</strong></td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(service)}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8; vertical-align:top;"><strong>Detalhes:</strong></td><td style="padding:8px 0; color:#ffffff;">${escapeHtml(message || "Não informado")}</td></tr>
          </table>
        </div>
      `;

      await transporter.sendMail({
        from: `"CyberOregon" <${smtpUser}>`,
        to: notifyTo,
        replyTo: email,
        subject,
        text: textBody,
        html: htmlBody,
      });

      emailSent = true;
      await db
        .collection("cyber_oregon_leads")
        .updateOne({ _id: result.insertedId }, { $set: { emailSent: true } });
    } catch (error) {
      console.error("Erro ao enviar e-mail via SMTP Hostinger:", error);
    }
  } else {
    console.warn(
      "HOSTINGER_SMTP_USER / HOSTINGER_SMTP_PASS não configurados; lead salvo apenas no MongoDB."
    );
  }

  return { id: leadId, emailSent };
}
