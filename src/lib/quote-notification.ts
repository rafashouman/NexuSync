import nodemailer from "nodemailer";

export async function notifyQuote(input: {
  id: string;
  name: string;
  company: string;
  contact: string;
  segment: string;
  interest: string;
  goal: string;
  budget: string;
  message: string;
  channel: "email" | "whatsapp";
}) {
  const user = process.env.HOSTINGER_SMTP_USER?.trim();
  const pass = process.env.HOSTINGER_SMTP_PASS?.trim();
  if (!user || !pass) return false;
  const port = Number(process.env.HOSTINGER_SMTP_PORT || "465");
  let transport: ReturnType<typeof nodemailer.createTransport> | undefined;
  try {
    transport = nodemailer.createTransport({
    host: process.env.HOSTINGER_SMTP_HOST?.trim() || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    });
    await transport.sendMail({
      from: { name: "NexuSync", address: user },
      to: process.env.NEXUSYNC_NOTIFY_EMAIL?.trim() || "contato@nexusync.online",
      ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact) ? { replyTo: input.contact } : {}),
      subject: `[NexuSync] Novo lead: ${input.interest}`,
      text: [
        `Lead: ${input.id}`, `Nome: ${input.name}`, `Empresa: ${input.company || "Não informada"}`,
        `Contato: ${input.contact}`, `Segmento: ${input.segment}`, `Assunto: ${input.interest}`,
        `Objetivo: ${input.goal}`, `Orçamento: ${input.budget || "A definir"}`,
        `Canal escolhido: ${input.channel}`, `Mensagem: ${input.message || "Não informada"}`,
      ].join("\n"),
    });
    return true;
  } catch {
    console.error("Quote notification delivery failed; lead remains saved.");
    return false;
  } finally {
    transport?.close();
  }
}
