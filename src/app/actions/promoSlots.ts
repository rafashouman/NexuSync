"use server";

import { getDb } from "@/lib/mongodb";
import { isAdmin } from "@/lib/admin-auth";
import {
  MAX_PROMO_SLOTS,
  PROMO_KEYS,
  PROMO_SLOTS,
  type PromoKey,
  type PromoRemaining,
} from "@/lib/promo-slots";

// Sem documento no banco, a vaga vale o total padrão definido em PROMO_SLOTS.
export async function getPromoSlots(): Promise<PromoRemaining> {
  const db = await getDb();
  const docs = await db
    .collection<{ _id: string; remaining: number }>("promo_slots")
    .find({})
    .toArray();
  const stored = new Map(docs.map((d) => [d._id, d.remaining]));

  return Object.fromEntries(
    PROMO_KEYS.map((key) => {
      const value = stored.get(key);
      return [key, typeof value === "number" ? value : PROMO_SLOTS[key].total];
    })
  ) as PromoRemaining;
}

export async function setPromoSlot(key: string, remaining: number) {
  if (
    !(await isAdmin()) ||
    !PROMO_KEYS.includes(key as PromoKey) ||
    !Number.isInteger(remaining) ||
    remaining < 0 ||
    remaining > MAX_PROMO_SLOTS
  ) {
    throw new Error("Ação não autorizada.");
  }
  const db = await getDb();
  await db
    .collection<{ _id: string; remaining: number; updatedAt: Date }>("promo_slots")
    .updateOne(
      { _id: key },
      { $set: { remaining, updatedAt: new Date() } },
      { upsert: true }
    );
}
