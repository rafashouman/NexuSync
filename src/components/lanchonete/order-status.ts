/** Etapas de um pedido no painel, usadas no navegador e no servidor. */
import type { Customer } from "./order";

export const ORDER_STATUSES = ["novo", "preparo", "saiu", "concluido", "cancelado"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const isOpen = (status: OrderStatus) => status !== "concluido" && status !== "cancelado";

export function statusLabel(status: OrderStatus, mode: Customer["mode"]) {
  if (status === "saiu") return mode === "entrega" ? "Saiu para entrega" : "Pronto para retirar";
  return { novo: "Novo", preparo: "Em preparo", concluido: "Concluído", cancelado: "Cancelado" }[status];
}

/** Próximo passo de um pedido em aberto, com o texto do botão. */
export function nextStep(status: OrderStatus, mode: Customer["mode"]): { to: OrderStatus; label: string } | null {
  if (status === "novo") return { to: "preparo", label: "Começar a preparar" };
  if (status === "preparo") return { to: "saiu", label: mode === "entrega" ? "Saiu para entrega" : "Pronto para retirar" };
  if (status === "saiu") return { to: "concluido", label: "Concluir pedido" };
  return null;
}
