export const PUBLIC_PRICE_LIMIT = 900;

export function isPublicPrice(price: string) {
  const value = Number(price.replace(/\./g, "").replace(",", "."));
  return price.trim() !== "" && Number.isFinite(value) && value >= 0 && value <= PUBLIC_PRICE_LIMIT;
}

export function publicPriceCents(cents: number | null) {
  if (cents === null || !Number.isFinite(cents) || cents < 0 || cents > PUBLIC_PRICE_LIMIT * 100) return "Sob consulta";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
