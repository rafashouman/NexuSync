import { Palette, PenTool, CalendarCheck2 } from "lucide-react";

export const designPlans = [
  {
    id: "01",
    tag: "COMUNICAÇÃO SOCIAL",
    name: "Design Starter",
    price: "199,00",
    originalPrice: "249,00",
    promoKey: "design-starter" as const,
    deliveryTime: "3 a 5 dias úteis",
    idealFor: "Pequenos negócios e profissionais autônomos",
    description:
      "Sua oferta precisa ser entendida em poucos segundos. Criamos peças que destacam produtos, serviços e campanhas com a identidade da sua marca.",
    highlight: false,
    icon: Palette,
    deliverablesSummary: ["3 Artes Feed/Stories", "1 Banner Digital", "Guia de Cores & Fontes"],
    features: [
      "Briefing inicial de direção visual",
      "3 artes estratégicas para redes sociais",
      "1 banner digital ou peça promocional de campanha",
      "Definição de paleta de cores e tipografia de referência",
      "Adaptação visual à identidade existente",
      "Arquivos finais em alta resolução (PNG / JPG)",
      "1 rodada completa de ajustes",
    ],
    scope:
      "Indicado para marcas que já possuem logotipo básico. Não inclui criação de marca do zero ou arquivos editáveis abertos.",
    buttonText: "Solicitar Pack Starter",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do Design Starter e gostaria de melhorar a apresentação visual do meu negócio.",
  },
  {
    id: "02",
    tag: "IDENTIDADE VISUAL COMPLETA",
    name: "Design Profissional",
    price: "650,00",
    originalPrice: "799,00",
    promoKey: "design-profissional" as const,
    deliveryTime: "5 a 8 dias úteis",
    idealFor: "Marcas em estruturação ou reposicionamento",
    description:
      "Cada material parece de uma empresa diferente? Criamos logotipo, manual de identidade e kit digital para sua marca ser reconhecida em todos os canais.",
    highlight: true,
    badge: "Direção de Arte Recomendada",
    icon: PenTool,
    deliverablesSummary: [
      "Logotipo Exclusivo + Vetores",
      "Manual da Marca",
      "5 Artes + 1 Capa Digital",
    ],
    features: [
      "Briefing estratégico e conceito criativo de marca",
      "Criação de logotipo exclusivo com defesa conceitual",
      "Sistema oficial de cores (CMYK, RGB, HEX) e tipografia",
      "Mini manual de identidade visual e aplicação correta",
      "5 artes para redes sociais + 1 capa/banner digital",
      "Entrega de arquivos vetoriais (SVG, PDF, EPS) e PNG transparente",
      "2 rodadas completas de ajustes",
    ],
    scope:
      "Inclui proposta completa de identidade visual e aplicações digitais listadas. Registro no INPI e impressão gráfica física não estão incluídos.",
    buttonText: "Criar minha marca",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do Design Profissional para desenvolver ou fortalecer a identidade visual da minha marca.",
  },
  {
    id: "03",
    tag: "INTERFACES & EXPERIÊNCIA DO USUÁRIO",
    name: "Design UI/UX Premium",
    price: "1.490,00",
    originalPrice: "1.990,00",
    promoKey: "design-premium" as const,
    deliveryTime: "Definido conforme o projeto",
    idealFor: "SaaS, Startups, E-commerces e Aplicativos",
    description:
      "Facilite o caminho de quem navega até o contato ou a compra. Planejamos as telas, criamos um modelo navegável e entregamos um guia visual para o desenvolvimento.",
    highlight: false,
    icon: CalendarCheck2,
    deliverablesSummary: [
      "Até 3 Telas Principais (Desktop & Mobile)",
      "Wireframes & UI Kit",
      "Protótipo Navegável",
    ],
    features: [
      "Arquitetura da informação e mapeamento de jornada",
      "Wireframes estruturais das páginas principais",
      "Design UI de alta fidelidade (Desktop e Mobile)",
      "Projeto de até 3 páginas ou telas principais do produto",
      "Protótipo interativo navegável para validação",
      "Componentes visuais padronizados (botões, cards, estados)",
      "Entrega organizada para desenvolvedores + 2 rodadas de ajustes",
    ],
    scope:
      "Contempla exclusivamente o projeto visual e de interface (UI/UX). Caso deseje a programação completa, consulte nossos planos Web/Apps.",
    buttonText: "Orçar Projeto UI/UX",
    waMessage:
      "Olá! Tenho interesse na oferta de lançamento do Design Premium para desenvolver o design de um site, landing page ou aplicação web.",
  },
];
