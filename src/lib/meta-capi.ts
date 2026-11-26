// API de Conversões da Meta (somente servidor): repete o `Lead` do navegador com o
// mesmo event_id, para a Meta contar uma vez só.
import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "@/lib/meta";

const GRAPH_VERSION = "v27.0";
const SITE_HOSTS = ["nexusync.online", "localhost"];
const FALLBACK_URL = "https://nexusync.online/contato";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

/** Telefone só com dígitos e DDI. Sem DDD não há como completar, então é omitido. */
export function normalizePhone(raw: string): string | null {
  const international = raw.trim().startsWith("+");
  let digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  if (!international) {
    if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
    else if (!(digits.startsWith("55") && (digits.length === 12 || digits.length === 13))) return null;
  }
  return digits.length >= 8 ? digits : null;
}

/** Valida o que veio do navegador. Só existe quando o visitante aceitou os cookies. */
export function parseTracking(value: unknown): { eventId: string; sourceUrl: string } | null {
  if (!value || typeof value !== "object") return null;
  const { eventId, sourceUrl } = value as { eventId?: unknown; sourceUrl?: unknown };
  if (typeof eventId !== "string" || !/^[A-Za-z0-9-]{8,64}$/.test(eventId)) return null;
  let url = FALLBACK_URL;
  if (typeof sourceUrl === "string" && sourceUrl.length <= 2000) {
    try {
      if (SITE_HOSTS.includes(new URL(sourceUrl).hostname)) url = sourceUrl;
    } catch {
      // URL inválida: fica a página de contato.
    }
  }
  return { eventId, sourceUrl: url };
}

export interface MetaLead {
  eventId: string;
  sourceUrl: string;
  interest: string;
  name: string;
  contact: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

function userData(lead: MetaLead) {
  const contact = lead.contact.trim().toLowerCase();
  const isEmail = contact.includes("@");
  const phone = isEmail ? null : normalizePhone(contact);
  const names = lead.name
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.replace(/[!-/:-@[-`{-~]/g, ""))
    .filter(Boolean);
  // Clique em anúncio: sem o cookie _fbc, montamos o identificador a partir do fbclid do link.
  const fbclid = new URL(lead.sourceUrl).searchParams.get("fbclid");
  const fbc = lead.fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  return {
    ...(isEmail && { em: [hash(contact)] }),
    ...(phone && { ph: [hash(phone)] }),
    ...(names.length > 0 && { fn: [hash(names[0])] }),
    ...(names.length > 1 && { ln: [hash(names[names.length - 1])] }),
    ...(lead.ip && { client_ip_address: lead.ip }),
    ...(lead.userAgent && { client_user_agent: lead.userAgent }),
    ...(lead.fbp && { fbp: lead.fbp }),
    ...(fbc && { fbc }),
  };
}

/** Nunca lança erro: o pedido de orçamento já está salvo quando isto roda. */
export async function sendMetaLead(lead: MetaLead): Promise<boolean> {
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!token) {
    console.warn("Meta CAPI: META_CAPI_ACCESS_TOKEN ausente; Lead enviado só pelo navegador.");
    return false;
  }
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  try {
    const body = new URLSearchParams({
      access_token: token,
      data: JSON.stringify([{
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.sourceUrl,
        user_data: userData(lead),
        custom_data: { content_name: lead.interest },
      }]),
      ...(testCode && { test_event_code: testCode }),
    });
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events`, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      const detail = (await response.json().catch(() => null)) as { error?: { code?: number; message?: string } } | null;
      console.error(`Meta CAPI: Lead recusado (HTTP ${response.status}, código ${detail?.error?.code ?? "?"}): ${detail?.error?.message ?? "sem detalhe"}`);
      return false;
    }
    console.info(`Meta CAPI: Lead aceito${testCode ? " (modo de teste)" : ""}.`);
    return true;
  } catch {
    console.error("Meta CAPI: falha de rede ao enviar o Lead.");
    return false;
  }
}
