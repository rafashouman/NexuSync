import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SITE } from "@/components/luzinete/data";

/**
 * Acesso ao painel de sessões da terapeuta. Os dados são sensíveis: em produção não há senha padrão,
 * o painel só abre com LUZINETE_ADMIN_PASSWORD definida no servidor. A senha fixa vale só no `npm run dev`.
 */
const COOKIE = "luzinete_painel";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const user = () => process.env.LUZINETE_ADMIN_USER || "luzinete";
const password = () =>
  process.env.LUZINETE_ADMIN_PASSWORD || (process.env.NODE_ENV === "development" ? "ervadoce123" : "");

export const panelEnabled = () => password() !== "";

// Chave sorteada a cada início do servidor: nenhum cookie daqui vale em outro painel, e reiniciar encerra as sessões.
const globalState = globalThis as typeof globalThis & { __luzineteSessionKey?: Buffer };
const sessionKey = () => (globalState.__luzineteSessionKey ??= randomBytes(32));

const sign = (value: string) => createHmac("sha256", sessionKey()).update(value).digest();
const matches = (input: string, expected: string) => timingSafeEqual(sign(input), sign(expected));

export function checkCredentials(inputUser: string, inputPassword: string) {
  if (!panelEnabled()) return false;
  // Compara os dois sempre, para o tempo de resposta não revelar qual deles errou.
  const userOk = matches(inputUser, user());
  const passwordOk = matches(inputPassword, password());
  return userOk && passwordOk;
}

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.COOKIE_SECURE === "true",
  path: SITE.basePath,
});

export async function startSession() {
  const expires = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires).toString("base64url")}`, {
    ...cookieOptions(),
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}

export async function hasSession() {
  if (!panelEnabled()) return false;
  const [expires, signature] = (await cookies()).get(COOKIE)?.value.split(".") ?? [];
  if (!expires || !signature) return false;
  const received = Buffer.from(signature, "base64url");
  const expected = sign(expires);
  return received.length === expected.length && timingSafeEqual(received, expected) && Number(expires) > Date.now();
}
