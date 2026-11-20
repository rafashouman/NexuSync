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

export function quoteHref(source: "header" | "hero" | "sites") {
  return `/contato?interest=institucional&source=${source}#orcamento`;
}

export const attempts = [
  { name: "Instagram", up: "quem já te segue lembra de você.", down: "quem pesquisa no Google não te encontra lá." },
  { name: "Google Meu Negócio sem site", up: "você aparece no mapa.", down: "sem site, o cliente não tem onde conferir serviço, preço e confiança." },
  { name: "Wix ou Hostinger por conta própria", up: "você tem uma página no ar.", down: "site que vende exige método, e o seu tempo rende mais no seu negócio." },
  { name: "Site feito por IA", up: "sai do zero em minutos.", down: "fica igual a mil outros, e o cliente percebe." },
  { name: "Cartão impresso", up: "quem já te conheceu guarda o contato.", down: "não aparece em nenhuma busca." },
  { name: "Grupo de WhatsApp", up: "você fala com quem já é cliente.", down: "não traz ninguém novo." },
] as const;

export const phases = [
  ["Entendemos seu negócio", "Conte o que sua empresa oferece, quem atende e o que quer melhorar. Não precisa conhecer termos técnicos."],
  ["Definimos a proposta", "Você recebe o escopo, o investimento, o prazo e os materiais necessários antes de decidir."],
  ["Criamos e apresentamos", "Desenvolvemos o projeto e mostramos para sua revisão, com os ajustes previstos na proposta."],
  ["Publicamos e orientamos", "Depois da sua aprovação, colocamos o projeto no ar e explicamos os próximos passos."],
] as const;

export const pillars = [
  { title: "Presença online", text: "Sites marcantes e SEO orgânico para você aparecer pra quem já está procurando o seu serviço.", tag: "Alicerce", href: "/seo-para-negocios-locais", cta: "Como trabalhamos o SEO" },
  { title: "Design e motion graphics", text: "Identidade visual e movimento para a sua marca ser lembrada, não só vista." },
  { title: "Gestão de redes sociais", text: "Constância nas redes para manter perto quem já te conhece." },
  { title: "Tráfego pago", text: "Acelera o que já funciona, depois que a base está de pé.", tag: "Último andar" },
] as const;

export const faqs = [
  ["Qual tipo de site é indicado para meu negócio?", "Uma landing page concentra uma oferta e facilita o contato. Um site institucional apresenta a empresa e seus serviços. Um hotsite atende uma campanha, evento ou lançamento. Ajudamos a escolher conforme seu objetivo."],
  ["O site vai aparecer no Google?", "Os planos de site incluem a configuração de SEO descrita na proposta. No Presence, é o SEO básico para mecanismos de busca. Isso prepara o site, mas a indexação e a posição nas pesquisas dependem também dos mecanismos de busca, da concorrência e da continuidade do trabalho de conteúdo e divulgação, por isso não garantimos uma posição. Para um acompanhamento contínuo, existe o serviço de SEO e presença local, contratado à parte."],
  ["Preciso fornecer textos, fotos e logotipo?", "Reunimos as informações e os materiais disponíveis no início do projeto. A proposta define o que você fornece e se será necessário contratar produção de textos, imagens ou identidade visual."],
  ["Domínio e hospedagem estão incluídos?", "O registro do domínio e a hospedagem precisam ser confirmados no orçamento. Configurar um domínio não inclui automaticamente pagar seu registro ou suas renovações."],
  ["O site funciona no celular?", "Sim. Os sites são adaptados para celular, tablet e computador, com atenção à leitura, à navegação e aos botões de contato."],
] as const;
