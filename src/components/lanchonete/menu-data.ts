/**
 * Cardápio de demonstração: lanchonete fictícia do Norte Fluminense.
 * Nome, itens, preços e fotos são ilustrativos. Para um cliente real, é este arquivo que muda.
 * Preços em centavos.
 */

export const STORE = {
  name: "Lanches da Restinga",
  tagline: "Churrasquinho, pastel e sanduíche no jeito do Norte Fluminense, do interior ao litoral.",
  basePath: "/templates/cardapio-lancheria",
  /** DDI + DDD + número: é para cá que o pedido vai. */
  whatsapp: "5522999549813",
  whatsappLabel: "(22) 99954-9813",
  deliveryFee: 500,
  /** Dias que o pedido fica no banco antes de ser apagado sozinho. */
  retentionDays: 30,
};

export type IconKey = "espeto" | "sanduiche" | "pastel" | "salgado" | "bebida" | "sobremesa";

export type Category = { slug: string; name: string; short: string; icon: IconKey };

export const CATEGORIES: Category[] = [
  { slug: "churrasquinho", name: "Churrasquinho no espeto", short: "Churrasquinho", icon: "espeto" },
  { slug: "sanduiches", name: "Sanduíches", short: "Sanduíches", icon: "sanduiche" },
  { slug: "pasteis", name: "Pastéis fritos na hora", short: "Pastéis", icon: "pastel" },
  { slug: "salgados", name: "Salgados e porções", short: "Salgados", icon: "salgado" },
  { slug: "bebidas", name: "Bebidas", short: "Bebidas", icon: "bebida" },
  { slug: "sobremesas", name: "Sobremesas", short: "Sobremesas", icon: "sobremesa" },
];

export type Choice = { label: string; options: string[] };
export type Addon = { id: string; name: string; price: number };

export type MenuItem = {
  slug: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  /** Escolhas obrigatórias, como o sabor. */
  choices?: Choice[];
  addons?: Addon[];
};

const photo = (name: string) => `/images/lanchonete/${name}.jpg`;

const ESPETO_ADDONS: Addon[] = [
  { id: "farofa", name: "Farofa", price: 0 },
  { id: "campanha", name: "Molho à campanha", price: 0 },
  { id: "pao-alho", name: "Pão de alho", price: 600 },
];

const SANDUICHE_ADDONS: Addon[] = [
  { id: "ovo", name: "Ovo", price: 300 },
  { id: "bacon", name: "Bacon", price: 500 },
  { id: "queijo", name: "Queijo extra", price: 400 },
  { id: "cheddar", name: "Cheddar", price: 400 },
  { id: "calabresa", name: "Calabresa", price: 500 },
];

const PASTEL_ADDONS: Addon[] = [
  { id: "queijo", name: "Queijo extra", price: 300 },
  { id: "requeijao", name: "Requeijão cremoso", price: 300 },
];

const PORCAO_ADDONS: Addon[] = [
  { id: "queijo-derretido", name: "Queijo derretido", price: 600 },
  { id: "bacon", name: "Bacon", price: 700 },
];

const ICE_CREAM = ["Creme", "Chocolate", "Morango", "Coco", "Flocos"];

export const ITEMS: MenuItem[] = [
  // Churrasquinho
  { slug: "espeto-carne", category: "churrasquinho", name: "Churrasquinho de carne", price: 1000, image: photo("espeto-carne"), addons: ESPETO_ADDONS,
    description: "Cubos de carne temperados no sal grosso e assados na brasa." },
  { slug: "espeto-frango", category: "churrasquinho", name: "Churrasquinho de frango", price: 900, image: photo("espeto-frango"), addons: ESPETO_ADDONS,
    description: "Frango marinado no alho e limão, com pimentão, direto da brasa." },
  { slug: "espeto-linguica", category: "churrasquinho", name: "Churrasquinho de linguiça", price: 900, image: photo("espeto-linguica"), addons: ESPETO_ADDONS,
    description: "Linguiça toscana tostada por fora e suculenta por dentro." },
  { slug: "espeto-coracao", category: "churrasquinho", name: "Espeto de coração", price: 1100, addons: ESPETO_ADDONS,
    description: "Coração de frango temperado e assado até dourar." },
  { slug: "queijo-coalho", category: "churrasquinho", name: "Queijo coalho na brasa", price: 1000,
    addons: [{ id: "melado", name: "Melado de cana", price: 200 }, { id: "oregano", name: "Orégano", price: 0 }],
    description: "Queijo coalho dourado na churrasqueira, macio no meio." },

  // Sanduíches
  { slug: "x-burguer", category: "sanduiches", name: "X-burguer", price: 1600, image: photo("x-burguer"), addons: SANDUICHE_ADDONS,
    description: "Pão, hambúrguer bovino, queijo derretido e molho da casa." },
  { slug: "x-salada", category: "sanduiches", name: "X-salada", price: 1800, image: photo("x-salada"), addons: SANDUICHE_ADDONS,
    description: "Hambúrguer, queijo, alface, tomate e maionese da casa." },
  { slug: "x-frango", category: "sanduiches", name: "X-frango", price: 1900, addons: SANDUICHE_ADDONS,
    description: "Filé de frango na chapa, queijo, alface, tomate e maionese." },
  { slug: "x-tudo", category: "sanduiches", name: "X-tudo da Restinga", price: 2800, image: photo("x-tudo"), addons: SANDUICHE_ADDONS,
    description: "O podrão completo: hambúrguer, ovo, bacon, calabresa, presunto, queijo, milho, batata palha e salada." },
  { slug: "cachorro-quente", category: "sanduiches", name: "Cachorro-quente completo", price: 1400, image: photo("cachorro-quente"),
    addons: [{ id: "salsicha", name: "Salsicha extra", price: 400 }, { id: "cheddar", name: "Cheddar", price: 400 }, { id: "bacon", name: "Bacon", price: 500 }],
    description: "Salsicha no molho, milho, ervilha, vinagrete, queijo ralado e batata palha." },
  { slug: "misto-quente", category: "sanduiches", name: "Misto quente", price: 1000, image: photo("misto-quente"),
    addons: [{ id: "ovo", name: "Ovo", price: 300 }, { id: "queijo", name: "Queijo extra", price: 400 }],
    description: "Presunto e queijo no pão de forma tostado na chapa." },
  { slug: "sanduiche-pernil", category: "sanduiches", name: "Sanduíche de pernil", price: 1800, image: photo("sanduiche-pernil"),
    addons: [{ id: "queijo", name: "Queijo extra", price: 400 }, { id: "abacaxi", name: "Abacaxi na chapa", price: 300 }],
    description: "Pernil desfiado no molho com cebola, no pão francês." },
  { slug: "sanduiche-natural", category: "sanduiches", name: "Sanduíche natural de frango", price: 1300, image: photo("sanduiche-natural"),
    description: "Pão integral, frango desfiado, cenoura ralada e pasta leve." },

  // Pastéis
  { slug: "pastel-carne", category: "pasteis", name: "Pastel de carne", price: 1000, image: photo("pastel-carne"), addons: PASTEL_ADDONS,
    description: "Carne moída temperada com azeitona e cheiro-verde." },
  { slug: "pastel-queijo", category: "pasteis", name: "Pastel de queijo", price: 1000, image: photo("pastel-carne"), addons: PASTEL_ADDONS,
    description: "Muçarela derretida e uma pitada de orégano." },
  { slug: "pastel-frango", category: "pasteis", name: "Pastel de frango com requeijão", price: 1100, image: photo("pastel-frango"), addons: PASTEL_ADDONS,
    description: "Frango desfiado bem temperado com requeijão cremoso." },
  { slug: "pastel-camarao", category: "pasteis", name: "Pastel de camarão", price: 1400, image: photo("pastel-frango"), addons: PASTEL_ADDONS,
    description: "Camarão refogado com tomate e coentro, gosto de praia." },
  { slug: "pastel-siri", category: "pasteis", name: "Pastel de siri", price: 1500, image: photo("pastel-frango"), addons: PASTEL_ADDONS,
    description: "Carne de siri catada, refogada com leite de coco e temperos." },
  { slug: "pastel-palmito", category: "pasteis", name: "Pastel de palmito", price: 1100, image: photo("pastel-carne"), addons: PASTEL_ADDONS,
    description: "Palmito cremoso com ervas, opção sem carne." },

  // Salgados e porções
  { slug: "coxinha", category: "salgados", name: "Coxinha de frango", price: 800, image: photo("coxinha"),
    description: "Massa macia, recheio de frango desfiado e casquinha crocante." },
  { slug: "joelho", category: "salgados", name: "Joelho de presunto e queijo", price: 900,
    description: "Massa assada e fofinha com presunto, queijo, tomate e orégano." },
  { slug: "bolinho-aipim", category: "salgados", name: "Bolinho de aipim com carne-seca", price: 1800,
    description: "Seis bolinhos de aipim recheados com carne-seca desfiada." },
  { slug: "batata-frita", category: "salgados", name: "Porção de batata frita", price: 1800, image: photo("batata-frita"), addons: PORCAO_ADDONS,
    description: "Porção para dividir, sequinha e salgada na medida." },
  { slug: "aipim-frito", category: "salgados", name: "Porção de aipim frito", price: 2000, addons: PORCAO_ADDONS,
    description: "Aipim cozido e frito, crocante por fora e macio por dentro." },
  { slug: "isca-peixe", category: "salgados", name: "Isca de peixe frito", price: 3800, image: photo("isca-peixe"),
    addons: [{ id: "aipim", name: "Aipim frito para acompanhar", price: 1200 }, { id: "tartaro", name: "Molho tártaro", price: 300 }],
    description: "Porção de peixe empanado e frito, servida com limão." },

  // Bebidas
  { slug: "suco-natural", category: "bebidas", name: "Suco natural 400 ml", price: 1000, image: photo("suco-natural"),
    choices: [{ label: "Fruta", options: ["Laranja", "Acerola", "Maracujá", "Abacaxi com hortelã", "Manga"] }, { label: "Açúcar", options: ["Com açúcar", "Pouco açúcar", "Sem açúcar"] }],
    description: "Feito na hora com a fruta que você escolher." },
  { slug: "refrigerante-lata", category: "bebidas", name: "Refrigerante em lata", price: 600,
    choices: [{ label: "Sabor", options: ["Cola", "Cola zero", "Guaraná", "Laranja", "Limão"] }],
    description: "Lata de 350 ml bem gelada." },
  { slug: "refrigerante-2l", category: "bebidas", name: "Refrigerante 2 litros", price: 1400,
    choices: [{ label: "Sabor", options: ["Cola", "Cola zero", "Guaraná", "Laranja"] }],
    description: "Garrafa gelada para a mesa ou para levar." },
  { slug: "mate-limao", category: "bebidas", name: "Mate gelado com limão", price: 700, image: photo("mate-limao"),
    description: "Copo de 400 ml, do jeito que se toma na praia." },
  { slug: "caldo-cana", category: "bebidas", name: "Caldo de cana", price: 800,
    choices: [{ label: "Preferência", options: ["Puro", "Com limão", "Com abacaxi"] }],
    description: "Moído na hora, copo de 400 ml com gelo." },

  // Sobremesas
  { slug: "pudim-leite", category: "sobremesas", name: "Pudim de leite", price: 900, image: photo("pudim-leite"),
    description: "Fatia de pudim de leite condensado com calda de caramelo." },
  { slug: "sorvete-duas-bolas", category: "sobremesas", name: "Sorvete de duas bolas", price: 1000, image: photo("sorvete-duas-bolas"),
    choices: [{ label: "Primeira bola", options: ICE_CREAM }, { label: "Segunda bola", options: ICE_CREAM }],
    addons: [{ id: "calda", name: "Calda de chocolate", price: 200 }, { id: "granulado", name: "Granulado", price: 100 }],
    description: "Duas bolas na taça, com os sabores que você escolher." },
  { slug: "chuvisco", category: "sobremesas", name: "Chuvisco de Campos", price: 1200,
    description: "Doce de gemas em calda, tradição de Campos dos Goytacazes. Porção individual." },
  { slug: "mousse-maracuja", category: "sobremesas", name: "Mousse de maracujá", price: 900, image: photo("mousse-maracuja"),
    description: "Mousse cremosa com sementes da fruta por cima." },
  { slug: "acai-tigela", category: "sobremesas", name: "Açaí na tigela 300 ml", price: 1800, image: photo("acai-tigela"),
    addons: [{ id: "banana", name: "Banana", price: 200 }, { id: "granola", name: "Granola", price: 200 }, { id: "leite-po", name: "Leite em pó", price: 300 }, { id: "pacoca", name: "Paçoca", price: 200 }],
    description: "Açaí batido bem grosso. Monte com os acompanhamentos." },
];

const bySlug = new Map(ITEMS.map((item) => [item.slug, item]));

export const getItem = (slug: string) => bySlug.get(slug);
export const getCategory = (slug: string) => CATEGORIES.find((category) => category.slug === slug);
export const itemPath = (item: MenuItem) => `${STORE.basePath}/item/${item.slug}`;
export const orderPath = `${STORE.basePath}/pedido`;
export const painelPath = `${STORE.basePath}/painel`;

export function money(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
