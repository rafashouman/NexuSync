/**
 * Dados do template de catálogo para ferragem / casa e construção (pasta `ferragem-total`).
 * Marca e logo da Total Lar usados com autorização do cliente, para a apresentação.
 * Preços e fichas são ilustrativos e servem só para demonstração.
 *
 * Para usar com outro cliente:
 * - troque STORE (nome, logo, domínio, WhatsApp, endereço). `city`, `address` e `hours`
 *   são opcionais: sem valor, somem do cabeçalho e do rodapé (não invente dados da loja);
 * - cadastre os produtos em PRODUCTS. Cada produto tem três preços:
 *   `listPrice` (preço "de", opcional), `cashPrice` (à vista) e `cardPrice` (total no cartão).
 *   O número de parcelas é calculado por `installmentsFor()`, a partir de STORE.maxInstallments
 *   e STORE.minInstallment;
 * - `image` aceita o caminho de uma foto (ex.: "/images/ferragem/martelo.webp").
 *   Sem foto, o card mostra o ícone da categoria.
 */

type Store = {
  name: string;
  tagline: string;
  /** Logo (PNG/SVG em /public). Sem logo, o cabeçalho mostra um ícone e o nome. */
  logo?: { src: string; width: number; height: number };
  /** Domínio mostrado no simulador de endereço. */
  demoDomain: string;
  /** Base real das rotas desta demo. */
  basePath: string;
  whatsapp: string;
  city?: string;
  address?: string;
  hours?: string;
  maxInstallments: number;
  /** Valor mínimo de cada parcela, em centavos. */
  minInstallment: number;
};

export const STORE: Store = {
  name: "Total Lar",
  tagline: "Casa e construção",
  logo: { src: "/images/ferragem/totallar-logo.png", width: 181, height: 53 },
  demoDomain: "www.totallar.com",
  basePath: "/templates/ferragem-total",
  // WhatsApp da NexuSync enquanto for demonstração.
  whatsapp: "5551993583936",
  maxInstallments: 10,
  minInstallment: 1500,
};

export type IconKey =
  | "hammer" | "wrench" | "ruler" | "drill" | "zap" | "plug" | "cable" | "lightbulb"
  | "shower" | "droplets" | "paint" | "brush" | "spray" | "brick" | "shovel" | "construction"
  | "bolt" | "lock" | "key" | "sprout" | "scissors" | "toolbox" | "fan" | "lamp" | "container" | "layers";

export type Category = {
  slug: string;
  name: string;
  short: string;
  icon: IconKey;
  /** Cor de fundo do card quando não há foto. */
  tone: string;
};

export const CATEGORIES: Category[] = [
  { slug: "ferramentas-manuais", name: "Ferramentas manuais", short: "Manuais", icon: "hammer", tone: "#f3e3cf" },
  { slug: "ferramentas-eletricas", name: "Ferramentas elétricas", short: "Elétricas", icon: "drill", tone: "#e1e7ef" },
  { slug: "material-eletrico", name: "Material elétrico", short: "Elétrico", icon: "plug", tone: "#f1ebcb" },
  { slug: "hidraulica", name: "Hidráulica", short: "Hidráulica", icon: "droplets", tone: "#d9e8ef" },
  { slug: "tintas", name: "Tintas e pintura", short: "Tintas", icon: "paint", tone: "#efdcd6" },
  { slug: "construcao", name: "Construção", short: "Construção", icon: "brick", tone: "#e6e1da" },
  { slug: "fixacao", name: "Fixação e ferragens", short: "Fixação", icon: "bolt", tone: "#e3e5e8" },
  { slug: "jardim-e-casa", name: "Jardim e casa", short: "Jardim", icon: "sprout", tone: "#dfe9d8" },
];

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  icon: IconKey;
  unit: string;
  /** Preço "de", em centavos. Opcional. */
  listPrice?: number;
  /** Preço à vista (Pix ou dinheiro), em centavos. */
  cashPrice: number;
  /** Preço total no cartão, em centavos. */
  cardPrice: number;
  summary: string;
  specs: [string, string][];
  badge?: string;
  image?: string;
};

// Marcas fictícias. Produtos com foto de fabricante usam a marca que aparece na foto.
const B = { forte: "Fortex", volt: "Voltaro", aqua: "Aquaplus", cor: "Corlar", obra: "ObraMax", fixa: "Fixabem", verde: "Verdejar" };

export const PRODUCTS: Product[] = [
  // ——— Ferramentas manuais
  { slug: "martelo-unha-27mm", image: "/images/ferragem/martelo-unha-27mm.webp", name: "Martelo de unha 27 mm", brand: "Tramontina", category: "ferramentas-manuais", sku: "FM-1001", icon: "hammer", unit: "unidade", listPrice: 5990, cashPrice: 4490, cardPrice: 4790, badge: "Mais procurado",
    summary: "Cabeça forjada e cabo de madeira. Para pregar e arrancar pregos com firmeza.", specs: [["Cabeça", "Aço forjado 27 mm"], ["Cabo", "Madeira"]] },
  { slug: "jogo-chaves-combinadas-8-pecas", image: "/images/ferragem/jogo-chaves-combinadas-8-pecas.webp", name: "Jogo de chaves combinadas 8 peças", brand: "Würth", category: "ferramentas-manuais", sku: "FM-1002", icon: "wrench", unit: "jogo", listPrice: 11990, cashPrice: 8990, cardPrice: 9590,
    summary: "Boca e estria de 8 a 19 mm em aço cromo-vanádio, com suporte organizador.", specs: [["Medidas", "8 a 19 mm"], ["Material", "Cromo-vanádio"], ["Acompanha", "Suporte organizador"]] },
  { slug: "alicate-universal-8", image: "/images/ferragem/alicate-universal-8.webp", name: "Alicate universal 8\"", brand: B.forte, category: "ferramentas-manuais", sku: "FM-1003", icon: "wrench", unit: "unidade", cashPrice: 3290, cardPrice: 3490,
    summary: "Corta, prende e dobra fios. Cabo isolado para trabalhos elétricos leves.", specs: [["Tamanho", "8\" (200 mm)"], ["Cabo", "Isolado"], ["Uso", "Corte e aperto"]] },
  { slug: "trena-5m", image: "/images/ferragem/trena-5m.webp", name: "Trena 5 m com trava", brand: "B-Max", category: "ferramentas-manuais", sku: "FM-1004", icon: "ruler", unit: "unidade", listPrice: 2990, cashPrice: 1990, cardPrice: 2190,
    summary: "Fita de aço com trava e clipe de cinto. Leitura em centímetros e polegadas.", specs: [["Comprimento", "5 m"], ["Largura da fita", "25 mm"], ["Trava", "Sim"]] },
  { slug: "nivel-aluminio-40cm", image: "/images/ferragem/nivel-aluminio-40cm.webp", name: "Nível de alumínio 40 cm", brand: B.forte, category: "ferramentas-manuais", sku: "FM-1005", icon: "ruler", unit: "unidade", cashPrice: 3990, cardPrice: 4290,
    summary: "Três bolhas para prumo, nível e 45°. Perfil leve de alumínio.", specs: [["Comprimento", "40 cm"], ["Bolhas", "3"], ["Material", "Alumínio"]] },
  { slug: "jogo-chaves-fenda-philips-6", image: "/images/ferragem/jogo-chaves-fenda-philips-6.webp", name: "Jogo de chaves fenda e Philips 6 peças", brand: B.forte, category: "ferramentas-manuais", sku: "FM-1006", icon: "wrench", unit: "jogo", listPrice: 4990, cashPrice: 3490, cardPrice: 3690,
    summary: "Três de fenda e três Philips com ponta imantada e cabo anatômico.", specs: [["Peças", "6"], ["Ponta", "Imantada"], ["Haste", "Cromo-vanádio"]] },
  { slug: "serrote-16", image: "/images/ferragem/serrote-16.webp", name: "Serrote 16\" para madeira", brand: "Tramontina", category: "ferramentas-manuais", sku: "FM-1007", icon: "construction", unit: "unidade", cashPrice: 4490, cardPrice: 4790,
    summary: "Dentes temperados para corte rápido em madeira e compensado.", specs: [["Lâmina", "16\" (400 mm)"], ["Dentes", "7 por polegada"], ["Cabo", "Madeira"]] },

  // ——— Ferramentas elétricas
  { slug: "furadeira-impacto-650w", image: "/images/ferragem/furadeira-impacto-650w.webp", name: "Furadeira de impacto 650 W", brand: "Black+Decker", category: "ferramentas-eletricas", sku: "FE-2001", icon: "drill", unit: "unidade", listPrice: 28990, cashPrice: 22990, cardPrice: 24990, badge: "Oferta",
    summary: "Fura madeira, metal e alvenaria. Mandril de 1/2\", velocidade variável e reversível.", specs: [["Potência", "650 W"], ["Mandril", "1/2\" (13 mm)"], ["Tensão", "127 V ou 220 V"], ["Garantia", "12 meses"]] },
  { slug: "parafusadeira-bateria-12v", image: "/images/ferragem/parafusadeira-bateria-12v.webp", name: "Parafusadeira a bateria 12 V", brand: B.volt, category: "ferramentas-eletricas", sku: "FE-2002", icon: "drill", unit: "kit", listPrice: 39990, cashPrice: 32990, cardPrice: 35490,
    summary: "Leve, com duas baterias e carregador. Ideal para montagem de móveis e pequenos reparos.", specs: [["Bateria", "12 V Li-ion (2 un.)"], ["Torque", "25 N·m"], ["Acompanha", "Maleta e 10 bits"]] },
  { slug: "esmerilhadeira-angular-850w", image: "/images/ferragem/esmerilhadeira-angular-850w.webp", name: "Esmerilhadeira angular 4.1/2\" 850 W", brand: "Bosch", category: "ferramentas-eletricas", sku: "FE-2003", icon: "zap", unit: "unidade", cashPrice: 24990, cardPrice: 26990,
    summary: "Corte e desbaste de metal e cerâmica, com empunhadura lateral e protetor de disco.", specs: [["Potência", "850 W"], ["Disco", "4.1/2\" (115 mm)"], ["Rotação", "11.000 rpm"]] },
  { slug: "serra-tico-tico-500w", image: "/images/ferragem/serra-tico-tico-500w.webp", name: "Serra tico-tico 500 W", brand: "DeWalt", category: "ferramentas-eletricas", sku: "FE-2004", icon: "zap", unit: "unidade", listPrice: 31990, cashPrice: 26990, cardPrice: 28990,
    summary: "Cortes retos e curvos em madeira, MDF e PVC, com base inclinável até 45°.", specs: [["Potência", "500 W"], ["Corte em madeira", "Até 65 mm"], ["Base", "Inclinável 45°"]] },
  { slug: "lixadeira-orbital-200w", image: "/images/ferragem/lixadeira-orbital-200w.webp", name: "Lixadeira orbital 200 W", brand: "Vonder", category: "ferramentas-eletricas", sku: "FE-2005", icon: "layers", unit: "unidade", cashPrice: 21990, cardPrice: 23490,
    summary: "Acabamento em madeira e massa, com coletor de pó acoplado.", specs: [["Potência", "200 W"], ["Base", "1/4 de folha"], ["Coletor de pó", "Sim"]] },
  { slug: "soprador-termico-2000w", name: "Soprador térmico 2000 W", brand: B.volt, category: "ferramentas-eletricas", sku: "FE-2006", icon: "fan", unit: "unidade", cashPrice: 17990, cardPrice: 19290,
    summary: "Remove tinta, molda PVC e encolhe termo-retrátil. Duas temperaturas.", specs: [["Potência", "2000 W"], ["Temperatura", "350 °C e 550 °C"], ["Bicos", "2"]] },

  // ——— Material elétrico
  { slug: "cabo-flexivel-2-5mm-100m", name: "Cabo flexível 2,5 mm² rolo 100 m", brand: B.volt, category: "material-eletrico", sku: "ME-3001", icon: "cable", unit: "rolo", listPrice: 34990, cashPrice: 28990, cardPrice: 30990, badge: "Mais procurado",
    summary: "Para circuitos de tomadas de uso geral. Isolação 750 V antichama.", specs: [["Seção", "2,5 mm²"], ["Comprimento", "100 m"], ["Isolação", "750 V"], ["Cores", "Azul, preto, verde, vermelho"]] },
  { slug: "disjuntor-bipolar-32a", name: "Disjuntor bipolar 32 A", brand: B.volt, category: "material-eletrico", sku: "ME-3002", icon: "zap", unit: "unidade", cashPrice: 3990, cardPrice: 4290,
    summary: "Curva C, para trilho DIN. Proteção de circuitos de chuveiro e ar-condicionado.", specs: [["Corrente", "32 A"], ["Polos", "2"], ["Curva", "C"]] },
  { slug: "tomada-2p-t-10a", name: "Tomada 2P+T 10 A com placa", brand: B.volt, category: "material-eletrico", sku: "ME-3003", icon: "plug", unit: "unidade", cashPrice: 1290, cardPrice: 1390,
    summary: "Padrão brasileiro, módulo e placa 4×2 na cor branca.", specs: [["Corrente", "10 A"], ["Placa", "4×2 branca"], ["Padrão", "NBR 14136"]] },
  { slug: "lampada-led-9w-kit-10", name: "Lâmpada LED bulbo 9 W kit com 10", brand: B.volt, category: "material-eletrico", sku: "ME-3004", icon: "lightbulb", unit: "kit", listPrice: 6990, cashPrice: 4990, cardPrice: 5390, badge: "Oferta",
    summary: "Luz branca 6500 K, bivolt, soquete E27. Substitui a incandescente de 60 W.", specs: [["Potência", "9 W"], ["Cor da luz", "6500 K"], ["Soquete", "E27"], ["Tensão", "Bivolt"]] },
  { slug: "extensao-5m-3-tomadas", name: "Extensão 5 m com 3 tomadas", brand: B.volt, category: "material-eletrico", sku: "ME-3005", icon: "plug", unit: "unidade", cashPrice: 3490, cardPrice: 3690,
    summary: "Cabo de 5 m e régua com três tomadas no padrão novo.", specs: [["Comprimento", "5 m"], ["Tomadas", "3"], ["Corrente", "10 A"]] },
  { slug: "fita-isolante-20m", name: "Fita isolante 20 m", brand: B.volt, category: "material-eletrico", sku: "ME-3006", icon: "cable", unit: "unidade", cashPrice: 890, cardPrice: 950,
    summary: "Antichama, para emendas e isolamento de fios até 750 V.", specs: [["Comprimento", "20 m"], ["Largura", "19 mm"], ["Cor", "Preta"]] },
  { slug: "plafon-led-18w", image: "/images/ferragem/plafon-led-18w.webp", name: "Luminária plafon LED 18 W", brand: B.volt, category: "material-eletrico", sku: "ME-3007", icon: "lamp", unit: "unidade", listPrice: 4990, cashPrice: 3690, cardPrice: 3990,
    summary: "Sobrepor, quadrado, luz branca. Instalação direta no teto.", specs: [["Potência", "18 W"], ["Formato", "Quadrado 22 cm"], ["Tensão", "Bivolt"]] },

  // ——— Hidráulica
  { slug: "torneira-cozinha-bica-alta", image: "/images/ferragem/torneira-cozinha-bica-alta.webp", name: "Torneira de cozinha bica alta", brand: B.aqua, category: "hidraulica", sku: "HI-4001", icon: "droplets", unit: "unidade", listPrice: 18990, cashPrice: 14990, cardPrice: 15990,
    summary: "Metal cromado com bica móvel e arejador. Para mesa ou bancada.", specs: [["Material", "Metal cromado"], ["Bica", "Alta, móvel"], ["Instalação", "Mesa"]] },
  { slug: "chuveiro-eletrico-5500w", image: "/images/ferragem/chuveiro-eletrico-5500w.webp", name: "Chuveiro elétrico 5500 W", brand: B.aqua, category: "hidraulica", sku: "HI-4002", icon: "shower", unit: "unidade", listPrice: 12990, cashPrice: 9990, cardPrice: 10790, badge: "Mais procurado",
    summary: "Quatro temperaturas e espalhador amplo. Versão 127 V ou 220 V.", specs: [["Potência", "5500 W"], ["Temperaturas", "4"], ["Tensão", "127 V ou 220 V"]] },
  { slug: "registro-gaveta-3-4", name: "Registro de gaveta 3/4\"", brand: B.aqua, category: "hidraulica", sku: "HI-4003", icon: "wrench", unit: "unidade", cashPrice: 4290, cardPrice: 4590,
    summary: "Base em bronze para água fria e quente, com acabamento opcional.", specs: [["Bitola", "3/4\""], ["Material", "Bronze"], ["Uso", "Água fria e quente"]] },
  { slug: "tubo-pvc-soldavel-25mm-6m", name: "Tubo PVC soldável 25 mm barra 6 m", brand: B.aqua, category: "hidraulica", sku: "HI-4004", icon: "container", unit: "barra", cashPrice: 2490, cardPrice: 2690,
    summary: "Para instalações de água fria. Barra de 6 metros.", specs: [["Diâmetro", "25 mm"], ["Comprimento", "6 m"], ["Uso", "Água fria"]] },
  { slug: "caixa-dagua-500l", name: "Caixa d'água 500 L com tampa", brand: B.aqua, category: "hidraulica", sku: "HI-4005", icon: "container", unit: "unidade", listPrice: 42990, cashPrice: 36990, cardPrice: 39490,
    summary: "Polietileno com proteção UV, leve e fácil de instalar.", specs: [["Capacidade", "500 L"], ["Material", "Polietileno"], ["Acompanha", "Tampa"]] },
  { slug: "mangueira-jardim-15m", image: "/images/ferragem/mangueira-jardim-15m.webp", name: "Mangueira de jardim 15 m com esguicho", brand: B.aqua, category: "hidraulica", sku: "HI-4006", icon: "droplets", unit: "kit", cashPrice: 6990, cardPrice: 7490,
    summary: "Trançada, antitorção, com engates e esguicho de 3 jatos.", specs: [["Comprimento", "15 m"], ["Diâmetro", "1/2\""], ["Esguicho", "3 jatos"]] },
  { slug: "fita-veda-rosca-18mm", name: "Fita veda-rosca 18 mm × 25 m", brand: B.aqua, category: "hidraulica", sku: "HI-4007", icon: "layers", unit: "unidade", cashPrice: 590, cardPrice: 650,
    summary: "Para vedação de conexões roscáveis de água.", specs: [["Largura", "18 mm"], ["Comprimento", "25 m"]] },

  // ——— Tintas
  { slug: "tinta-acrilica-fosca-18l", image: "/images/ferragem/tinta-acrilica-fosca-18l.webp", name: "Tinta acrílica fosca 18 L", brand: B.cor, category: "tintas", sku: "TI-5001", icon: "paint", unit: "lata", listPrice: 38990, cashPrice: 31990, cardPrice: 34490, badge: "Oferta",
    summary: "Para paredes internas e externas. Rende até 380 m² por demão.", specs: [["Volume", "18 L"], ["Acabamento", "Fosco"], ["Rendimento", "Até 380 m²/demão"], ["Cor", "Branco neve"]] },
  { slug: "esmalte-sintetico-900ml", name: "Esmalte sintético brilhante 900 ml", brand: B.cor, category: "tintas", sku: "TI-5002", icon: "paint", unit: "lata", cashPrice: 4990, cardPrice: 5390,
    summary: "Para madeira e metal. Secagem rápida e alto brilho.", specs: [["Volume", "900 ml"], ["Superfície", "Madeira e metal"], ["Acabamento", "Brilhante"]] },
  { slug: "rolo-la-23cm", image: "/images/ferragem/rolo-la-23cm.webp", name: "Rolo de lã 23 cm com cabo", brand: B.cor, category: "tintas", sku: "TI-5003", icon: "brush", unit: "unidade", cashPrice: 2490, cardPrice: 2690,
    summary: "Lã sintética para tinta acrílica e látex em paredes lisas.", specs: [["Largura", "23 cm"], ["Pelo", "Médio"], ["Acompanha", "Cabo"]] },
  { slug: "kit-pinceis-3-pecas", image: "/images/ferragem/kit-pinceis-3-pecas.webp", name: "Kit de pincéis 3 peças", brand: B.cor, category: "tintas", sku: "TI-5004", icon: "brush", unit: "kit", cashPrice: 2190, cardPrice: 2390,
    summary: "Tamanhos 1\", 2\" e 3\" com cerdas gris para acabamento.", specs: [["Tamanhos", "1\", 2\" e 3\""], ["Cerdas", "Gris"]] },
  { slug: "massa-corrida-25kg", name: "Massa corrida PVA 25 kg", brand: B.cor, category: "tintas", sku: "TI-5005", icon: "layers", unit: "balde", listPrice: 8990, cashPrice: 6990, cardPrice: 7490,
    summary: "Nivela e corrige imperfeições de paredes internas antes da pintura.", specs: [["Peso", "25 kg"], ["Uso", "Interno"], ["Base", "PVA"]] },
  { slug: "fita-crepe-48mm", image: "/images/ferragem/fita-crepe-48mm.webp", name: "Fita crepe 48 mm × 50 m", brand: B.cor, category: "tintas", sku: "TI-5006", icon: "layers", unit: "unidade", cashPrice: 1290, cardPrice: 1390,
    summary: "Protege rodapés, vidros e batentes durante a pintura.", specs: [["Largura", "48 mm"], ["Comprimento", "50 m"]] },
  { slug: "spray-multiuso-400ml", name: "Tinta spray multiuso 400 ml", brand: B.cor, category: "tintas", sku: "TI-5007", icon: "spray", unit: "unidade", cashPrice: 2290, cardPrice: 2490,
    summary: "Para metal, madeira, cerâmica e plástico. Várias cores.", specs: [["Volume", "400 ml"], ["Secagem", "Ao toque em 30 min"]] },

  // ——— Construção
  { slug: "cimento-cp-ii-50kg", name: "Cimento CP II 50 kg", brand: B.obra, category: "construcao", sku: "CO-6001", icon: "brick", unit: "saco", cashPrice: 3890, cardPrice: 4190, badge: "Mais procurado",
    summary: "Uso geral em concreto, reboco e contrapiso.", specs: [["Peso", "50 kg"], ["Tipo", "CP II"]] },
  { slug: "argamassa-ac2-20kg", name: "Argamassa AC II 20 kg", brand: B.obra, category: "construcao", sku: "CO-6002", icon: "brick", unit: "saco", cashPrice: 2690, cardPrice: 2890,
    summary: "Para assentar pisos e revestimentos em áreas internas e externas.", specs: [["Peso", "20 kg"], ["Tipo", "AC II"], ["Uso", "Interno e externo"]] },
  { slug: "carrinho-de-mao-60l", name: "Carrinho de mão 60 L", brand: B.obra, category: "construcao", sku: "CO-6003", icon: "construction", unit: "unidade", listPrice: 32990, cashPrice: 27990, cardPrice: 29990,
    summary: "Caçamba metálica reforçada e pneu com câmara.", specs: [["Capacidade", "60 L"], ["Caçamba", "Aço"], ["Pneu", "Com câmara"]] },
  { slug: "pa-de-bico", name: "Pá de bico com cabo de madeira", brand: B.obra, category: "construcao", sku: "CO-6004", icon: "shovel", unit: "unidade", cashPrice: 4990, cardPrice: 5390,
    summary: "Aço carbono temperado, cabo de 71 cm.", specs: [["Lâmina", "Aço carbono"], ["Cabo", "Madeira 71 cm"]] },
  { slug: "colher-pedreiro-8", name: "Colher de pedreiro 8\"", brand: B.obra, category: "construcao", sku: "CO-6005", icon: "shovel", unit: "unidade", cashPrice: 2190, cardPrice: 2390,
    summary: "Formato oval com cabo de madeira envernizado.", specs: [["Tamanho", "8\""], ["Formato", "Oval"]] },
  { slug: "rejunte-flexivel-1kg", name: "Rejunte flexível 1 kg", brand: B.obra, category: "construcao", sku: "CO-6006", icon: "layers", unit: "pacote", cashPrice: 1290, cardPrice: 1390,
    summary: "Para juntas de 2 a 10 mm em pisos e azulejos. Cinza platina.", specs: [["Peso", "1 kg"], ["Juntas", "2 a 10 mm"], ["Cor", "Cinza platina"]] },
  { slug: "impermeabilizante-18kg", name: "Impermeabilizante acrílico 18 kg", brand: B.obra, category: "construcao", sku: "CO-6007", icon: "paint", unit: "balde", listPrice: 34990, cashPrice: 28990, cardPrice: 30990,
    summary: "Manta líquida para lajes, telhados e marquises.", specs: [["Peso", "18 kg"], ["Uso", "Lajes e telhados"], ["Cor", "Branco"]] },

  // ——— Fixação e ferragens
  { slug: "kit-parafusos-buchas-200", image: "/images/ferragem/kit-parafusos-buchas-200.webp", name: "Kit parafusos e buchas 200 peças", brand: B.fixa, category: "fixacao", sku: "FX-7001", icon: "bolt", unit: "kit", cashPrice: 2990, cardPrice: 3190,
    summary: "Buchas 6, 8 e 10 com parafusos correspondentes, em caixa organizadora.", specs: [["Peças", "200"], ["Buchas", "6, 8 e 10 mm"]] },
  { slug: "fechadura-externa-cromada", image: "/images/ferragem/fechadura-externa-cromada.webp", name: "Fechadura externa cromada", brand: B.fixa, category: "fixacao", sku: "FX-7002", icon: "lock", unit: "unidade", listPrice: 11990, cashPrice: 8990, cardPrice: 9690,
    summary: "Para portas de entrada, com três chaves e maçaneta tipo alavanca.", specs: [["Uso", "Porta externa"], ["Chaves", "3"], ["Acabamento", "Cromado"]] },
  { slug: "cadeado-40mm", name: "Cadeado latão 40 mm", brand: B.fixa, category: "fixacao", sku: "FX-7003", icon: "lock", unit: "unidade", cashPrice: 3290, cardPrice: 3490,
    summary: "Corpo de latão maciço e haste de aço temperado. Duas chaves.", specs: [["Tamanho", "40 mm"], ["Corpo", "Latão"], ["Chaves", "2"]] },
  { slug: "dobradica-3-kit-3", name: "Dobradiça 3\" kit com 3", brand: B.fixa, category: "fixacao", sku: "FX-7004", icon: "key", unit: "kit", cashPrice: 1990, cardPrice: 2190,
    summary: "Aço zincado com parafusos, para portas internas.", specs: [["Tamanho", "3\""], ["Unidades", "3"], ["Acompanha", "Parafusos"]] },
  { slug: "silicone-acetico-280g", name: "Silicone acético incolor 280 g", brand: B.fixa, category: "fixacao", sku: "FX-7005", icon: "layers", unit: "tubo", cashPrice: 1890, cardPrice: 1990,
    summary: "Veda box, pias, vidros e esquadrias. Resistente a umidade.", specs: [["Peso", "280 g"], ["Cor", "Incolor"]] },
  { slug: "adesivo-epoxi-23g", name: "Adesivo epóxi 23 g", brand: B.fixa, category: "fixacao", sku: "FX-7006", icon: "layers", unit: "unidade", cashPrice: 1590, cardPrice: 1690,
    summary: "Cola metal, cerâmica, madeira e vidro. Cura em 10 minutos.", specs: [["Peso", "23 g"], ["Cura", "10 min"]] },

  // ——— Jardim e casa
  { slug: "tesoura-de-poda", image: "/images/ferragem/tesoura-de-poda.webp", name: "Tesoura de poda 8\"", brand: B.verde, category: "jardim-e-casa", sku: "JC-8001", icon: "scissors", unit: "unidade", cashPrice: 3990, cardPrice: 4290,
    summary: "Lâmina de aço com trava e mola, corta galhos de até 20 mm.", specs: [["Tamanho", "8\""], ["Corte", "Até 20 mm"]] },
  { slug: "regador-10l", image: "/images/ferragem/regador-10l.webp", name: "Regador 10 L", brand: B.verde, category: "jardim-e-casa", sku: "JC-8002", icon: "droplets", unit: "unidade", cashPrice: 2990, cardPrice: 3190,
    summary: "Plástico resistente com bico removível.", specs: [["Capacidade", "10 L"], ["Bico", "Removível"]] },
  { slug: "kit-jardinagem-3-pecas", image: "/images/ferragem/kit-jardinagem-3-pecas.webp", name: "Kit jardinagem 3 peças", brand: B.verde, category: "jardim-e-casa", sku: "JC-8003", icon: "sprout", unit: "kit", listPrice: 3990, cashPrice: 2790, cardPrice: 2990,
    summary: "Pá, garfo e ancinho de mão para vasos e canteiros.", specs: [["Peças", "3"], ["Material", "Aço com cabo plástico"]] },
  { slug: "escada-aluminio-5-degraus", image: "/images/ferragem/escada-aluminio-5-degraus.webp", name: "Escada de alumínio 5 degraus", brand: B.verde, category: "jardim-e-casa", sku: "JC-8004", icon: "construction", unit: "unidade", listPrice: 29990, cashPrice: 24990, cardPrice: 26990, badge: "Oferta",
    summary: "Dobrável, com degraus antiderrapantes e bandeja para ferramentas.", specs: [["Degraus", "5"], ["Carga", "Até 120 kg"], ["Material", "Alumínio"]] },
  { slug: "caixa-ferramentas-16", image: "/images/ferragem/caixa-ferramentas-16.webp", name: "Caixa de ferramentas 16\"", brand: B.verde, category: "jardim-e-casa", sku: "JC-8005", icon: "toolbox", unit: "unidade", cashPrice: 4990, cardPrice: 5390,
    summary: "Plástica com bandeja removível e fecho metálico.", specs: [["Tamanho", "16\" (40 cm)"], ["Bandeja", "Removível"]] },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function productPath(product: Pick<Product, "slug">) {
  return `${STORE.basePath}/produto/${product.slug}`;
}

/** Parcelas sem juros: no máximo STORE.maxInstallments, sem parcela abaixo de STORE.minInstallment. */
export function installmentsFor(cardPrice: number) {
  const count = Math.max(1, Math.min(STORE.maxInstallments, Math.floor(cardPrice / STORE.minInstallment)));
  return { count, value: Math.round(cardPrice / count) };
}

export function discountPercent(product: Product) {
  if (!product.listPrice || product.listPrice <= product.cashPrice) return 0;
  return Math.round((1 - product.cashPrice / product.listPrice) * 100);
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function money(cents: number) {
  return brl.format(cents / 100).replace(/ /g, " ");
}

/** Texto do parcelamento, igual em card, página e mensagem. */
export function installmentLabel(product: Product) {
  const { count, value } = installmentsFor(product.cardPrice);
  return count > 1 ? `${count}x de ${money(value)} sem juros` : `${money(product.cardPrice)} no cartão`;
}

/** Link de WhatsApp da loja com mensagem pronta. */
export function storeWhatsApp(message: string) {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Mensagem pronta para compartilhar o produto. */
export function shareMessage(product: Product, url: string) {
  const lines = [
    `*${product.name}*`,
    product.listPrice ? `De ${money(product.listPrice)}` : null,
    `${money(product.cashPrice)} à vista no Pix`,
    `ou ${installmentLabel(product)}`,
    "",
    `Veja no catálogo da ${STORE.name}: ${url}`,
  ];
  return lines.filter((line) => line !== null).join("\n");
}
