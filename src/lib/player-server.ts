import "server-only";

export interface PlayerIdentity {
  id: string;
  name: string;
}

export function parsePlayerToken(token: unknown): PlayerIdentity | null {
  if (typeof token !== "string" || token.length === 0 || token.length > 500) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    const id = typeof parsed?.id === "string" ? parsed.id.trim() : "";
    const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
    if (id.length < 8 || id.length > 64 || name.length < 2 || name.length > 24) {
      return null;
    }
    return { id, name };
  } catch {
    return null;
  }
}
