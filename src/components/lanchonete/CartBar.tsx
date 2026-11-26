"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { money, orderPath } from "./menu-data";
import { countItems, subtotal } from "./order";
import { useCart } from "./cart-store";
import s from "./lanchonete.module.css";

/** Barra fixa no rodapé, visível quando há itens na sacola. */
export function CartBar() {
  const { lines } = useCart();
  if (lines.length === 0) return null;
  const count = countItems(lines);
  return (
    <>
      {/* Reserva o espaço para a barra não cobrir o fim da página. */}
      <div className={s.cartSpace} aria-hidden="true" />
      <div className={s.cartBar}>
        <Link href={orderPath} className={s.cartLink}>
          <ShoppingBag size={20} aria-hidden="true" />
          <span>Ver pedido · {count} {count === 1 ? "item" : "itens"}</span>
          <strong>{money(subtotal(lines))}</strong>
        </Link>
      </div>
    </>
  );
}
