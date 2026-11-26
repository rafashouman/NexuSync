/**
 * Mini Cardápio NexuSync: o produto para quem vende poucos itens.
 * O dono cadastra até MAX_PRODUCTS produtos e o pedido sai pronto para o WhatsApp da loja.
 *
 * Nesta demonstração (Dog & Açaí, loja fictícia) os produtos editados no "modo dono" ficam salvos
 * só no navegador de quem testa. Preços e itens de exemplo são ilustrativos.
 * Preços em centavos.
 */

export const STORE = {
  name: "Dog & Açaí",
  tagline: "Cachorro-quente na chapa e açaí bem gelado. Escolha, toque em pedir e a conversa abre pronta no WhatsApp.",
  /** DDI + DDD + número: é para cá que o pedido vai. */
  whatsapp: "555193583936",
  whatsappLabel: "(51) 9358-3936",
  basePath: "/templates/dog-e-acai",
};

export const MAX_PRODUCTS = 12;
export const NAME_MAX = 40;
export const DESCRIPTION_MAX = 120;
export const TAG_MAX = 16;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Caminho em /public ou foto enviada pelo dono (data URL). */
  image?: string;
  /** Agrupa os botões de filtro. Opcional. */
  tag?: string;
  soldOut?: boolean;
};

export const EXAMPLE_PRODUCTS: Product[] = [
  {
    id: "dog-tradicional",
    name: "Dog tradicional",
    description: "Pão na chapa, salsicha, molho da casa, milho, queijo derretido e batata palha.",
    price: 1490,
    image: "/images/dog-acai/dog.webp",
    tag: "Dogs",
  },
  {
    id: "dog-duplo-bacon",
    name: "Dog duplo bacon",
    description: "Duas salsichas, bacon crocante, cheddar cremoso e batata palha.",
    price: 2190,
    tag: "Dogs",
  },
  {
    id: "combo-esquina",
    name: "Combo da esquina",
    description: "Dog tradicional + açaí 300 ml. O lanche e a sobremesa de uma vez.",
    price: 2790,
    image: "/images/dog-acai/cardapio.webp",
    tag: "Combos",
  },
  {
    id: "acai-300",
    name: "Açaí 300 ml",
    description: "Açaí cremoso com banana, morango e granola.",
    price: 1590,
    image: "/images/dog-acai/acai.webp",
    tag: "Açaí",
  },
  {
    id: "acai-500",
    name: "Açaí 500 ml",
    description: "Açaí cremoso com banana, morango, granola e leite condensado.",
    price: 2290,
    tag: "Açaí",
  },
  {
    id: "refri-lata",
    name: "Refri lata 350 ml",
    description: "Gelado. Diga o sabor na observação do pedido.",
    price: 600,
    tag: "Bebidas",
  },
];

export function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "16,90", "16.90", "R$ 16" → centavos. Inválido → null. */
export function parsePrice(text: string) {
  const clean = text.replace(/[^\d,.]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!clean) return null;
  const value = Math.round(Number(clean) * 100);
  return Number.isFinite(value) && value > 0 && value <= 9_999_99 ? value : null;
}

export function priceInput(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export type Order = {
  name: string;
  mode: "entrega" | "retirada";
  address: string;
  payment: "Pix" | "Cartão" | "Dinheiro";
  change: string;
  note: string;
};

export function orderMessage(lines: { product: Product; qty: number }[], order: Order) {
  const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const rows = lines.map(({ product, qty }) => `• ${qty}x ${product.name} — ${money(product.price * qty)}`);
  const parts = [
    `*Pedido pelo cardápio — ${STORE.name}*`,
    "",
    ...rows,
    "",
    `*Total: ${money(total)}*`,
    "",
    `Nome: ${order.name.trim()}`,
    order.mode === "entrega" ? `Entrega em: ${order.address.trim()}` : "Vou retirar no balcão",
    `Pagamento: ${order.payment}${order.payment === "Dinheiro" && order.change.trim() ? ` (troco para ${order.change.trim()})` : ""}`,
  ];
  if (order.note.trim()) parts.push(`Observação: ${order.note.trim()}`);
  return parts.join("\n");
}

export function whatsappLink(message: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
