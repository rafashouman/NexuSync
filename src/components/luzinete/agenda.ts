/** Regras da agenda, usadas no navegador e no servidor. Datas "AAAA-MM-DD" e horas "HH:MM" no horário de Brasília. */
import { AGENDA, BLOCKS, MODE_LABEL, WEEKLY, type Mode } from "./data";

export const NOTE_MAX = 300;
export const NAME_MAX = 80;

export type Booked = { date: string; time: string };
/** Horários livres por dia e modalidade; dia sem nenhum horário não aparece. */
export type Slots = Record<string, Record<Mode, string[]>>;
export type Availability = { firstDay: string; lastDay: string; slots: Slots };

const HOUR = 3_600_000;
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
const clock = (total: number) => `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;

export const startsAt = (date: string, time: string) => new Date(`${date}T${time}:00${AGENDA.utcOffset}`);

/** Aritmética de calendário sem fuso: o texto da data é tratado como UTC. */
export const utcDate = (date: string) => new Date(`${date}T00:00:00Z`);
export const addDays = (date: string, days: number) =>
  new Date(utcDate(date).getTime() + days * 24 * HOUR).toISOString().slice(0, 10);

/** Data de hoje em Brasília. */
export const todayIn = (now: Date) => {
  const sign = AGENDA.utcOffset.startsWith("-") ? -1 : 1;
  return new Date(now.getTime() + sign * minutes(AGENDA.utcOffset.slice(1)) * 60_000).toISOString().slice(0, 10);
};

/** Grade semanal menos bloqueios, sessões já reservadas e horários em cima da hora. */
export function availability(now: Date, booked: Booked[]): Availability {
  const firstDay = todayIn(now);
  const lastDay = addDays(firstDay, AGENDA.windowDays);
  const earliest = now.getTime() + AGENDA.noticeHours * HOUR;
  const span = AGENDA.durationMin + AGENDA.gapMin;
  const slots: Slots = {};

  for (let date = firstDay; date <= lastDay; date = addDays(date, 1)) {
    const weekday = utcDate(date).getUTCDay();
    const day: Record<Mode, Set<string>> = { presencial: new Set(), online: new Set() };
    for (const window of WEEKLY) {
      if (!window.weekdays.includes(weekday)) continue;
      for (let at = minutes(window.start); at + AGENDA.durationMin <= minutes(window.end); at += span) {
        const time = clock(at);
        if (startsAt(date, time).getTime() < earliest) continue;
        const blocked = BLOCKS.some(
          (block) =>
            block.date === date &&
            at < minutes(block.end ?? "24:00") &&
            at + AGENDA.durationMin > minutes(block.start ?? "00:00"),
        );
        // A terapeuta é uma só: a reserva ocupa o horário nas duas modalidades.
        const taken = booked.some((item) => item.date === date && Math.abs(minutes(item.time) - at) < span);
        if (!blocked && !taken) window.modes.forEach((mode) => day[mode].add(time));
      }
    }
    if (day.presencial.size || day.online.size) {
      slots[date] = { presencial: [...day.presencial].sort(), online: [...day.online].sort() };
    }
  }
  return { firstDay, lastDay, slots };
}

const format = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", { ...options, timeZone: "UTC" }).format(utcDate(date));

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Quinta, 3 de dezembro" */
export const longDate = (date: string) =>
  `${capitalize(format(date, { weekday: "long" }).replace("-feira", ""))}, ${format(date, { day: "numeric", month: "long" })}`;
/** "Dezembro de 2026" */
export const monthLabel = (date: string) => capitalize(format(date, { month: "long", year: "numeric" }));
export const shortDate = (date: string) => date.split("-").reverse().join("/");

const digits = (value: string) => value.replace(/\D/g, "");

/** Máscara (00) 00000-0000. */
export function maskPhone(value: string) {
  const d = digits(value).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const split = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`;
}

export type BookingData = {
  date: string;
  time: string;
  mode: Mode;
  name: string;
  whatsapp: string;
  email: string;
  firstSession: boolean;
  note: string;
};

export type FieldErrors = Partial<Record<"name" | "whatsapp" | "email" | "firstSession" | "consent", string>>;

const line = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/[*_~`]/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Valida o formulário. `null` quando data, hora ou modalidade não fazem sentido. */
export function parseBooking(input: unknown): { data: BookingData; errors: FieldErrors } | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  if (typeof raw.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) return null;
  if (typeof raw.time !== "string" || !/^\d{2}:\d{2}$/.test(raw.time)) return null;
  if (raw.mode !== "presencial" && raw.mode !== "online") return null;

  const name = line(raw.name, NAME_MAX);
  const phone = digits(typeof raw.whatsapp === "string" ? raw.whatsapp : "");
  const email = line(raw.email, 120);
  const errors: FieldErrors = {};
  if (name.split(" ").length < 2) errors.name = "Escreva seu nome e sobrenome.";
  if (!/^[1-9]{2}\d{8,9}$/.test(phone)) errors.whatsapp = "Informe o WhatsApp com DDD, por exemplo (11) 98765-4321.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Confira o e-mail ou deixe o campo vazio.";
  if (typeof raw.firstSession !== "boolean") errors.firstSession = "Diga se é a sua primeira sessão.";
  if (raw.consent !== true) errors.consent = "Para agendar, aceite a Política de Privacidade.";

  return {
    data: {
      date: raw.date,
      time: raw.time,
      mode: raw.mode,
      name,
      whatsapp: maskPhone(phone),
      email,
      firstSession: raw.firstSession === true,
      note: line(raw.note, NOTE_MAX),
    },
    errors,
  };
}

/** Aviso para a terapeuta. A observação só entra na mensagem que a própria pessoa envia. */
export function bookingMessage(data: BookingData, { saved = true, withNote = true } = {}) {
  return [
    saved ? "🌿 *Novo agendamento*" : "🌿 *Pedido de agendamento* (ainda não reservado no site)",
    `👤 ${data.name}`,
    `📅 ${shortDate(data.date)} às ${data.time}`,
    `📍 ${MODE_LABEL[data.mode]}`,
    `📱 ${data.whatsapp}`,
    data.firstSession ? "✨ Primeira sessão" : "",
    withNote && data.note ? `📝 ${data.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Arquivo para "Adicionar ao calendário". */
export function calendarFile(data: Pick<BookingData, "date" | "time" | "mode">, now: Date) {
  const stamp = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const start = startsAt(data.date, data.time);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NexuSync//Luzinete Terapeuta//PT-BR",
    "BEGIN:VEVENT",
    `UID:${stamp(start)}-luzinete@nexusync.online`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(new Date(start.getTime() + AGENDA.durationMin * 60_000))}`,
    "SUMMARY:Sessão de TRG com Luzinete",
    `DESCRIPTION:Atendimento ${MODE_LABEL[data.mode].toLowerCase()}.`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
