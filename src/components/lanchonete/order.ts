/**
 * Regras do pedido, usadas no navegador (sacola) e no servidor (gravação).
 * O servidor nunca confia no preço enviado pelo cliente: tudo é recalculado a partir do cardápio.
 */
import { STORE, getItem, money } from "./menu-data";

export const MAX_QTY = 20;
export const MAX_LINES = 30;
export const NOTE_MAX = 140;

export type CartLine = { slug: string; qty: number; choices: string[]; addons: string[]; note: string };

export const PAYMENTS = [
  { id: "pix", label: "Pix" },
  { id: "cartao", label: "Cartão na entrega ou retirada" },
  { id: "dinheiro", label: "Dinheiro" },
] as const;

export type Customer = {
  name: string;
  phone: string;
  mode: "entrega" | "retirada";
  street: string;
  number: string;
  district: string;
  reference: string;
  payment: (typeof PAYMENTS)[number]["id"];
  changeFor: string;
  note: string;
};

export type CustomerErrors = Partial<Record<keyof Customer, string>>;

/** Texto de uma linha, sem quebras nem asteriscos: ninguém forja linhas ou negrito na mensagem do WhatsApp. */
function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\*/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "";
}

/** Valida uma linha da sacola contra o cardápio. Devolve `null` se o item não existir mais ou faltar escolha. */
export function parseLine(raw: unknown): CartLine | null {
  if (!raw || typeof raw !== "object") return null;
  const line = raw as Partial<Record<keyof CartLine, unknown>>;
  const item = typeof line.slug === "string" ? getItem(line.slug) : undefined;
  if (!item) return null;
  const qty = Number(line.qty);
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;

  const groups = item.choices ?? [];
  const choices = Array.isArray(line.choices) ? line.choices : [];
  if (choices.length !== groups.length || !groups.every((group, i) => group.options.includes(choices[i] as string))) return null;

  const wanted: unknown[] = Array.isArray(line.addons) ? line.addons : [];
  // Na ordem do cardápio e sem repetição, para linhas iguais terem a mesma chave.
  const addons = (item.addons ?? []).filter((addon) => wanted.includes(addon.id)).map((addon) => addon.id);

  return { slug: item.slug, qty, choices: choices as string[], addons, note: clean(line.note, NOTE_MAX) };
}

export const lineKey = (line: CartLine) => [line.slug, line.choices.join(","), line.addons.join(","), line.note].join("|");

export function lineDetails(line: CartLine) {
  const item = getItem(line.slug)!;
  const addons = (item.addons ?? []).filter((addon) => line.addons.includes(addon.id));
  const unit = item.price + addons.reduce((sum, addon) => sum + addon.price, 0);
  const choices = (item.choices ?? []).map((group, i) => `${group.label}: ${line.choices[i]}`);
  return { item, addons, choices, unit, total: unit * line.qty };
}

export const countItems = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.qty, 0);
export const subtotal = (lines: CartLine[]) => lines.reduce((sum, line) => sum + lineDetails(line).total, 0);
export const deliveryFee = (mode: Customer["mode"]) => (mode === "entrega" ? STORE.deliveryFee : 0);

/** "50", "50,00", "R$ 1.050,5" → centavos. Devolve `null` se não for um valor. */
export function parseMoney(text: string) {
  const value = text.replace(/R\$|\s/g, "");
  if (!/^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/.test(value)) return null;
  return Math.round(Number(value.replace(/\./g, "").replace(",", ".")) * 100);
}

export function parseCustomer(raw: unknown, total: number): { ok: true; customer: Customer } | { ok: false; errors: CustomerErrors } {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof Customer, unknown>>;
  const mode = data.mode === "retirada" ? "retirada" : "entrega";
  const delivery = mode === "entrega";
  const payment = PAYMENTS.find((option) => option.id === data.payment)?.id;
  const customer: Customer = {
    name: clean(data.name, 80),
    phone: clean(data.phone, 20),
    mode,
    street: delivery ? clean(data.street, 120) : "",
    number: delivery ? clean(data.number, 15) : "",
    district: delivery ? clean(data.district, 80) : "",
    reference: delivery ? clean(data.reference, 120) : "",
    payment: payment ?? "pix",
    changeFor: payment === "dinheiro" ? clean(data.changeFor, 15) : "",
    note: clean(data.note, 240),
  };

  const errors: CustomerErrors = {};
  if (customer.name.length < 2) errors.name = "Escreva seu nome.";
  const digits = customer.phone.replace(/\D/g, "");
  if (!/^[0-9+() -]+$/.test(customer.phone) || digits.length < 10 || digits.length > 13) errors.phone = "Informe o telefone com DDD, como (22) 99999-0000.";
  if (delivery) {
    if (customer.street.length < 2) errors.street = "Informe a rua.";
    if (!customer.number) errors.number = "Informe o número ou escreva s/n.";
    if (customer.district.length < 2) errors.district = "Informe o bairro.";
  }
  if (!payment) errors.payment = "Escolha a forma de pagamento.";
  if (customer.changeFor) {
    const change = parseMoney(customer.changeFor);
    if (change === null) errors.changeFor = "Use só o valor, como 50,00.";
    else if (change < total) errors.changeFor = `O valor precisa ser pelo menos ${money(total)}.`;
    else customer.changeFor = money(change);
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, customer };
}

/** Mensagem que chega no WhatsApp da lanchonete. Sem `code`, o pedido não foi registrado no banco. */
export function orderMessage(code: string | null, lines: CartLine[], customer: Customer) {
  const fee = deliveryFee(customer.mode);
  const sum = subtotal(lines);
  const items = lines.flatMap((line) => {
    const { item, addons, choices, total } = lineDetails(line);
    return [
      `${line.qty}x ${item.name}: ${money(total)}`,
      ...choices.map((choice) => `   ${choice}`),
      ...(addons.length ? [`   Adicionais: ${addons.map((addon) => addon.name).join(", ")}`] : []),
      ...(line.note ? [`   Obs.: ${line.note}`] : []),
    ];
  });
  const address = [`${customer.street}, ${customer.number}`, customer.district].join(", ");

  return [
    code ? `*Pedido ${code}* (${STORE.name})` : `*Pedido pelo cardápio* (${STORE.name})`,
    "",
    ...items,
    "",
    `Subtotal: ${money(sum)}`,
    ...(fee ? [`Taxa de entrega: ${money(fee)}`] : []),
    `*Total: ${money(sum + fee)}*`,
    "",
    customer.mode === "entrega" ? "*Entrega*" : "*Retirada no balcão*",
    `Nome: ${customer.name}`,
    `Telefone: ${customer.phone}`,
    ...(customer.mode === "entrega" ? [`Endereço: ${address}`] : []),
    ...(customer.reference ? [`Referência: ${customer.reference}`] : []),
    `Pagamento: ${PAYMENTS.find((option) => option.id === customer.payment)!.label}${customer.changeFor ? ` (troco para ${customer.changeFor})` : ""}`,
    ...(customer.note ? [`Observações: ${customer.note}`] : []),
  ].join("\n");
}
