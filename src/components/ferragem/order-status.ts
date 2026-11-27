/** Situações de um pedido no painel da loja, usadas no navegador e no servidor. */

export const ORDER_STATUSES = ["novo", "andamento", "pendencia", "pronto", "entregue", "cancelado"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderMode = "entrega" | "retirada";

export const isOpen = (status: OrderStatus) => status !== "entregue" && status !== "cancelado";

export function statusLabel(status: OrderStatus, mode: OrderMode) {
  if (status === "pronto") return mode === "entrega" ? "Saiu para entrega" : "Pronto para retirar";
  if (status === "entregue") return mode === "entrega" ? "Entregue" : "Retirado";
  return { novo: "Novo", andamento: "Em andamento", pendencia: "Com pendência", cancelado: "Cancelado" }[status];
}

/** O que cada situação quer dizer, para quem está atendendo. */
export function statusHint(status: OrderStatus, mode: OrderMode) {
  return {
    novo: "Chegou agora. Ninguém mexeu ainda.",
    andamento: "Pedido confirmado e sendo separado.",
    pendencia: "Falta algo: estoque, pagamento, endereço ou resposta do cliente.",
    pronto: mode === "entrega" ? "Está a caminho do cliente." : "Separado no balcão esperando o cliente.",
    entregue: mode === "entrega" ? "Cliente recebeu." : "Cliente retirou.",
    cancelado: "Não vai sair.",
  }[status];
}

/** Próximo passo de um pedido em aberto, com o texto do botão. */
export function nextStep(status: OrderStatus, mode: OrderMode): { to: OrderStatus; label: string } | null {
  if (status === "novo" || status === "pendencia") return { to: "andamento", label: status === "novo" ? "Confirmar e separar" : "Pendência resolvida" };
  if (status === "andamento") return { to: "pronto", label: mode === "entrega" ? "Saiu para entrega" : "Pronto para retirar" };
  if (status === "pronto") return { to: "entregue", label: mode === "entrega" ? "Marcar como entregue" : "Marcar como retirado" };
  return null;
}

export const NOTE_PANEL_MAX = 400;
