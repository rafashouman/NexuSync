export type MarketingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPriceCents: number | null;
  setupPriceCents: number | null;
  idealFor: string;
  features: string[];
  details: string[];
  exclusions: string[];
  onboardingTime: string;
  highlight: boolean;
  badge?: string;
  buttonText: string;
  waMessage: string;
};

export const marketingPlans: MarketingPlan[] = [
  {
    id: "presenca-ativa",
    name: "Presença Ativa",
    description: "Falta tempo para manter as redes atualizadas? Organizamos conteúdo, legendas e publicações para apresentar sua oferta com frequência e clareza.",
    monthlyPriceCents: 69000,
    setupPriceCents: 29000,
    idealFor: "Empresa que precisa manter as redes organizadas",
    features: [
      "Uma marca, Instagram e Facebook",
      "8 publicações mensais (até 2 carrosséis de 5 páginas)",
      "8 adaptações para stories",
      "Legendas, calendário e agendamento",
      "Uma rodada consolidada de ajustes",
      "Relatório mensal",
    ],
    details: ["O cliente fornece identidade visual, informações, fotos e aprovações.", "Uma adaptação para stories não é uma criação inédita."],
    exclusions: ["Filmagem e edição de reels", "Atendimento de mensagens e respostas diárias a comentários", "Anúncios"],
    onboardingTime: "Início previsto em 5 a 10 dias úteis após briefing, acessos e aprovações",
    highlight: false,
    buttonText: "Quero minha marca presente",
    waMessage: "Olá! Tenho interesse no Presença Ativa da NexuSync, por R$ 690/mês mais R$ 290 de implantação. Quero apresentar meu negócio.",
  },
  {
    id: "seo-local",
    name: "SEO e presença local",
    description: "Ajude quem procura seus serviços a encontrar sua empresa. Avaliamos seu site e sua presença nas buscas para definir as melhorias prioritárias.",
    monthlyPriceCents: null,
    setupPriceCents: null,
    idealFor: "Empresas que querem melhorar a visibilidade nas buscas",
    features: ["Diagnóstico técnico do site", "Revisão de títulos e descrições", "Estrutura das páginas e conteúdo", "Orientações para o Perfil da Empresa no Google", "Acompanhamento dos indicadores definidos na proposta"],
    details: ["As prioridades, as páginas e a frequência de acompanhamento são definidas após o diagnóstico."],
    exclusions: ["Verba de anúncios", "Gestão de redes sociais", "Garantia de posição no Google"],
    onboardingTime: "Prazo definido após avaliação do site e dos acessos",
    highlight: false,
    buttonText: "Quero avaliar meu SEO",
    waMessage: "Olá! Quero uma proposta de SEO e presença local para minha empresa.",
  },
  {
    id: "aquisicao-local",
    name: "Aquisição Local",
    description:
      "Quer divulgar além de quem já conhece sua empresa? Criamos e acompanhamos anúncios para alcançar pessoas com potencial de compra e facilitar o contato.",
    monthlyPriceCents: 89000,
    setupPriceCents: 49000,
    idealFor: "Negócio que busca contatos por campanhas",
    features: [
      "Uma marca/unidade e uma plataforma (Meta Ads ou Google Ads)",
      "Até 2 campanhas simultâneas",
      "Até 4 variações mensais de anúncios",
      "Conversões compatíveis com o site existente",
      "Revisão semanal e relatório mensal",
      "Reunião mensal de até 30 minutos",
    ],
    details: [
      "As variações são peças estáticas e textos, sem vídeo produzido.",
      "A verba de mídia e a complexidade das campanhas são definidas na proposta.",
      "A verba é paga diretamente à plataforma pelo cliente.",
    ],
    exclusions: ["Landing page", "Redes sociais orgânicas", "CRM"],
    onboardingTime:
      "Início previsto em 5 a 10 dias úteis após briefing, acessos e aprovações",
    highlight: false,
    buttonText: "Quero gerar oportunidades",
    waMessage:
      "Olá! Tenho interesse no Aquisição Local da NexuSync, por R$ 890/mês mais R$ 490 de implantação, com anúncios pagos à parte.",
  },
  {
    id: "crescimento-integrado",
    name: "Crescimento Integrado",
    description:
      "Os contatos chegam, mas o acompanhamento se perde? Integramos conteúdo, anúncios e organização comercial para sua equipe saber quem precisa de retorno.",
    monthlyPriceCents: 179000,
    setupPriceCents: 99000,
    idealFor: "Empresa que quer combinar conteúdo, anúncios e acompanhamento de leads",
    features: [
      "Tudo de Presença Ativa e Aquisição Local",
      "Funil de CRM com até 5 etapas e 3 usuários",
      "Conexão de uma fonte de leads",
      "Um fluxo de automação (1 gatilho, até 3 ações)",
      "Acompanhamento mensal",
      "Até 1 h mensal de ajustes no fluxo",
    ],
    details: [
      "A implantação inclui uma landing page simples de até 5 seções, sobre modelo, com um formulário e uma rodada de ajustes, mais até 1 h mensal de atualização.",
      "Fluxo inicial: formulário recebido, contato no CRM, aviso ao responsável e tarefa de retorno.",
      "Mensagens automáticas ao consumidor dependem de canal compatível, configuração e autorização apropriada.",
    ],
    exclusions: [
      "Checkout, área de clientes ou aplicação personalizada",
      "Licenças, hospedagem, domínio, créditos de mensagens e mídia",
    ],
    onboardingTime:
      "Início previsto em 10 a 15 dias úteis após briefing, acessos e aprovações",
    highlight: true,
    badge: "Recomendado",
    buttonText: "Quero integrar conteúdo e anúncios",
    waMessage:
      "Olá! Quero uma proposta do Crescimento Integrado para conectar conteúdo, anúncios e acompanhamento de contatos.",
  },
];

export const marketingAddons = [
  {
    name: "Quatro publicações estáticas adicionais",
    price: "+ R$ 290/mês",
    scope: "Artes e legendas, com uma rodada consolidada de ajustes.",
  },
  {
    name: "Dois reels simples",
    price: "+ R$ 350/mês",
    scope: "Até 30 segundos cada, com material enviado pelo cliente e uma revisão. Sem gravação.",
  },
  {
    name: "Captação e organização de leads",
    price: "Implantação sob consulta + R$ 290/mês",
    scope:
      "Uma landing page de modelo, um formulário e um funil com cinco etapas. A mensalidade cobre revisão do fluxo e até 1 h de ajustes.",
  },
  {
    name: "Automação Essencial",
    price: "A partir de R$ 790 de implantação + R$ 190/mês",
    scope:
      "Um fluxo, um gatilho, até três ações e duas ferramentas com integração disponível. Mensalidade inclui revisão e até 1 h de ajustes.",
  },
  {
    name: "Segunda plataforma de anúncios",
    price: "+ R$ 590/mês e R$ 290 de configuração",
    scope: "Até duas campanhas adicionais. Verba de mídia separada.",
  },

];

export const marketingMicrocopy =
  "Mensalidade referente aos serviços descritos. Implantação cobrada uma vez. Verba de anúncios, licenças e custos de terceiros são separados e apresentados na proposta. Resultados variam conforme mercado, oferta, investimento e atendimento.";
