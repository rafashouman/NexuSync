import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "fp_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not configured.");
  return process.env.AUTH_SECRET || password;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const key = Buffer.from("fp-pw-compare");
  const hash = (v: string) => createHmac("sha256", key).update(v).digest("base64url");
  return safeEqual(hash(input), hash(expected));
}

export function createAdminToken() {
  const payload = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${payload}.${sign(payload)}`;
}

function isValidToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  return Number(payload) > Date.now();
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  return isValidToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;
