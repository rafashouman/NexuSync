import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { STORE } from "@/components/ferragem/catalog-data";

/**
 * Acesso simples ao painel de pedidos da Total Lar: um login e uma senha, sem cadastro de usuários.
 * Provisório até termos um acesso de verdade. Para trocar sem mexer no código, defina
 * FERRAGEM_ADMIN_USER e FERRAGEM_ADMIN_PASSWORD no servidor.
 */
const COOKIE = "totallar_painel";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const user = () => process.env.FERRAGEM_ADMIN_USER || "totallar";
const password = () => process.env.FERRAGEM_ADMIN_PASSWORD || "total321";

// Chave sorteada a cada início do servidor: nenhum cookie daqui vale em outro painel, e reiniciar encerra as sessões.
const globalState = globalThis as typeof globalThis & { __ferragemSessionKey?: Buffer };
const sessionKey = () => (globalState.__ferragemSessionKey ??= randomBytes(32));

const sign = (value: string) => createHmac("sha256", sessionKey()).update(value).digest();
const matches = (input: string, expected: string) => timingSafeEqual(sign(input), sign(expected));

export function checkCredentials(inputUser: string, inputPassword: string) {
  // Compara os dois sempre, para o tempo de resposta não revelar qual deles errou.
  const userOk = matches(inputUser.toLowerCase(), user().toLowerCase());
  const passwordOk = matches(inputPassword, password());
  return userOk && passwordOk;
}

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.COOKIE_SECURE === "true",
  path: STORE.basePath,
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
  const [expires, signature] = (await cookies()).get(COOKIE)?.value.split(".") ?? [];
  if (!expires || !signature) return false;
  const received = Buffer.from(signature, "base64url");
  const expected = sign(expires);
  return received.length === expected.length && timingSafeEqual(received, expected) && Number(expires) > Date.now();
}
