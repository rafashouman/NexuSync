import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { STORE } from "@/components/lanchonete/menu-data";

/**
 * Acesso ao painel de pedidos do cardápio de demonstração, separado do admin da NexuSync.
 * O login padrão é só para demonstrar: com cliente real, defina LANCHONETE_ADMIN_USER e
 * LANCHONETE_ADMIN_PASSWORD no servidor.
 */
const COOKIE = "lanche_painel";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const user = () => process.env.LANCHONETE_ADMIN_USER || "euadmin";
const password = () => process.env.LANCHONETE_ADMIN_PASSWORD || "coxinha123";

// Chave sorteada a cada início do servidor: nenhum cookie daqui vale em outro painel, e reiniciar encerra as sessões.
const globalState = globalThis as typeof globalThis & { __lancheSessionKey?: Buffer };
const sessionKey = () => (globalState.__lancheSessionKey ??= randomBytes(32));

const sign = (value: string) => createHmac("sha256", sessionKey()).update(value).digest();
const matches = (input: string, expected: string) => timingSafeEqual(sign(input), sign(expected));

export function checkCredentials(inputUser: string, inputPassword: string) {
  // Compara os dois sempre, para o tempo de resposta não revelar qual deles errou.
  const userOk = matches(inputUser, user());
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
