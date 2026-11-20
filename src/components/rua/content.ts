import { sitePlans } from "@/data/sitePlans";
import { waLink } from "@/lib/site-config";

export const presence = sitePlans.find((plan) => plan.name === "Presence")!;

/** Receipt lines must be real Presence features (src/data/sitePlans.ts), never hand-written. */
const RECEIPT_FEATURES = [
  "Site com múltiplas páginas",
  "Layout personalizado para sua marca",
  "Catálogo de produtos ou serviços",
  "Pedidos de delivery via WhatsApp",
  "SEO básico para mecanismos de busca",
  "Configuração de domínio próprio",
  "Orientação para atualização do conteúdo",
];
export const receiptItems = RECEIPT_FEATURES.filter((item) => presence.features.includes(item));

export const presenceWhatsApp = waLink(presence.waMessage);
export const contactWhatsApp = waLink("Olá! Vim pelo site da NexuSync e gostaria de falar sobre um projeto.");
export const EMAIL = "contato@nexusync.online";
export const WA_DISPLAY = "51 99358-3936";

export const go = sitePlans.find((plan) => plan.name === "Go")!;
export const pulse = sitePlans.find((plan) => plan.name === "Pulse")!;

/** Link do pedido de proposta (mesmo destino do antigo orçamento: formulário de contato). */
export function proposalHref(source: "header" | "hero" | "sites") {
  return `/contato?interest=institucional&source=${source}#orcamento`;
}

export const attempts = [
  { name: "Instagram", up: "desperta curiosidade e mantém sua marca presente.", down: "serviços, preços e detalhes se perdem no feed." },
  { name: "Perfil da Empresa no Google", up: "mostra endereço, horário e avaliações.", down: "não tem espaço para mostrar seu trabalho de verdade." },
  { name: "Construtor de sites", up: "você publica uma página sozinho.", down: "o modelo limita, e o seu tempo sai do negócio." },
  { name: "Site feito por IA", up: "sai do zero em minutos.", down: "fica parecido com mil outros, e o cliente percebe." },
  { name: "Cartão de visita", up: "quem já te conheceu guarda o contato.", down: "não mostra seu catálogo nem seus diferenciais." },
  { name: "WhatsApp", up: "conversa direta com quem quer comprar.", down: "você responde as mesmas perguntas o dia todo." },
] as const;

export const phases = [
  ["Entendemos seu negócio", "Conte o que sua empresa oferece, quem atende e o que quer que o visitante faça no site. Não precisa conhecer termos técnicos."],
  ["Definimos a proposta", "Você recebe o escopo, o investimento, o prazo e os materiais necessários antes de decidir."],
  ["Criamos e apresentamos", "Unimos design, conteúdo e interações e mostramos para sua revisão, com os ajustes previstos na proposta."],
  ["Publicamos e orientamos", "Depois da sua aprovação, colocamos o projeto no ar e explicamos os próximos passos."],
] as const;

export const pillars = [
  { title: "Estrutura e estratégia", text: "Cada informação no lugar certo, para o visitante entender sua proposta e achar o que procura.", tag: "Alicerce", href: "/criacao-de-sites", cta: "Como criamos sites" },
  { title: "Design e identidade", text: "Sua marca reconhecível em cada tela, e também em anúncios, motion graphics e vídeos.", href: "/design", cta: "Ver design e motion" },
  { title: "Interatividade", text: "Cardápios que montam o pedido, vitrines, jornadas guiadas e gamificação. Sempre com um objetivo.", href: "/templates", cta: "Experimentar as demonstrações" },
  { title: "Performance e SEO", text: "Leve até em celular com alguns anos de uso e organizado para os buscadores. Sem prometer posição no Google.", tag: "Em todos os andares", href: "/seo-para-negocios-locais", cta: "Como trabalhamos o SEO" },
] as const;

export const faqs = [
  ["Qual tipo de site é indicado para meu negócio?", "Uma landing page concentra uma oferta e facilita o contato. Um site institucional apresenta a empresa e seus serviços. Um hotsite atende uma campanha, evento ou lançamento. Ajudamos a escolher conforme seu objetivo."],
  ["Quanto custa criar meu site?", `Os planos de site vão de R$ ${go.price} (${go.name}) a R$ ${pulse.price} (${pulse.name}), e o que cada um inclui está descrito na página de criação de sites. Hotsites interativos, gamificação e recursos sob medida recebem proposta própria, com escopo, prazo e investimento antes de você decidir.`],
  ["Meu site pode ter animações, quiz ou gamificação?", "Sim. Animações, quizzes, escolhas guiadas e gamificação podem entrar quando ajudam o visitante a entender ou escolher. O tipo de interação é definido na proposta, sempre pensando em usabilidade e no desempenho no celular."],
  ["O site vai aparecer no Google?", "Os planos de site incluem a configuração de SEO descrita na proposta. No Presence, é o SEO básico para mecanismos de busca. Isso prepara o site, mas a indexação e a posição nas pesquisas dependem também dos mecanismos de busca, da concorrência e da continuidade do trabalho de conteúdo e divulgação, por isso não garantimos uma posição. Para um acompanhamento contínuo, existe o serviço de SEO e presença local, contratado à parte."],
  ["Preciso fornecer textos, fotos e logotipo?", "Reunimos as informações e os materiais disponíveis no início do projeto. A proposta define o que você fornece e se será necessário contratar produção de textos, imagens ou identidade visual."],
  ["Domínio e hospedagem estão incluídos?", "O registro do domínio e a hospedagem precisam ser confirmados no orçamento. Configurar um domínio não inclui automaticamente pagar seu registro ou suas renovações."],
  ["O site funciona no celular?", "Sim. Os sites são adaptados para celular, tablet e computador e pensados para carregar rápido mesmo em aparelhos mais simples, com atenção à leitura, à navegação e aos botões de contato."],
] as const;
