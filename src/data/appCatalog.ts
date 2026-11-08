export const appCatalog = [
  {
    slug: "chronos", name: "Chronos · Agenda de beleza", category: "Agendamentos",
    path: "/chronos",
    description: "Marque corte, barba ou escova e consulte os horários do salão.",
  },
  {
    slug: "pulsemetrics", name: "PulseMetrics", category: "Indicadores de negócio",
    path: "/pulsemetrics",
    description: "Explore a receita e os eventos de uma campanha com dados demonstrativos.",
  },
  {
    slug: "pulsespin", name: "PulseSpin · Roleta de cupons", category: "Campanhas promocionais",
    path: "/pulsespin",
    description: "Teste uma roleta de cupons para ações promocionais.",
  },
  {
    slug: "memory", name: "Memory Matrix 3D", category: "Jogo de memória",
    path: "/memory",
    description: "Encontre pares de cartas e acompanhe seu desempenho.",
  },
  {
    slug: "images-blend", name: "Image Blend Studio", category: "Criação visual",
    path: "/images-blend",
    description: "Combine camadas e leve a composição para seu site.",
  },
  {
    slug: "arknoid", name: "Arknoid Physics Lab", category: "Laboratório de jogos",
    path: "/arknoid",
    description: "Experimente o movimento da bola e a resposta da barra.",
  },
  {
    slug: "voxelvaders", name: "VoxelVaders 3D", category: "Arcade",
    path: "/voxelvaders",
    description: "Pilote sua nave contra ondas de invasores.",
  },
  {
    slug: "pulse-arkanoid", name: "Pulse Arkanoid", category: "Arcade",
    path: "/pulse-arkanoid",
    description: "Quebre os blocos no cartucho do PulseDeck.",
  },
  {
    slug: "cyber-tarot", name: "Cyber Tarot", category: "Arcade",
    path: "/cyber-tarot",
    description: "Enfrente M0IRA-8 em uma sequência de tiragens.",
  },
  {
    slug: "arcade", name: "PulseDeck Arcade Hub", category: "Fliperama",
    path: "/arcade",
    description: "Troque de cartucho e teste os jogos do gabinete.",
  },
  {
    slug: "cardapio", name: "Kobra Burger Fire", category: "Delivery",
    path: "/templates/cardapio",
    description: "Monte um hambúrguer e teste a comanda digital.",
  },
  {
    slug: "dog-e-acai", name: "Dog & Açaí", category: "Delivery",
    path: "/templates/dog-e-acai",
    description: "Monte um cachorro-quente, escolha seu açaí e confira o pedido.",
  },
  {
    slug: "reservas", name: "Kobra Fire Reservas", category: "Operação de restaurante",
    path: "/templates/reservas",
    description: "Conheça o atendimento de mesas e o fluxo da cozinha.",
  },
  {
    slug: "connection", name: "Oráculo Connection", category: "Tarot interativo",
    path: "/templates/connection",
    description: "Experimente uma leitura de cartas no navegador.",
  },
  {
    slug: "bluemoon", name: "Blue Moon", category: "Jogo de cartas",
    path: "/templates/bluemoon",
    description: "Explore o desafio de combinações de cartas.",
  },
  {
    slug: "academias", name: "PulseFit Lab", category: "Academias",
    path: "/templates/academias",
    description: "Explore a apresentação e o atendimento de uma academia.",
  },
  {
    slug: "carros", name: "Prime Motors", category: "Veículos",
    path: "/templates/carros",
    description: "Explore o estoque e simule o interesse em um veículo.",
  },
  {
    slug: "miniaturas", name: "Alchemist Voxel", category: "Orçamentos",
    path: "/templates/miniaturas",
    description: "Configure uma miniatura sob medida.",
  },
  {
    slug: "seguro-piloto", name: "Seguro Piloto", category: "Atendimento",
    path: "/templates/seguro-piloto",
    description: "Conheça o seguro e o fluxo de solicitação para pilotos.",
  },
  {
    slug: "streetwear", name: "Vortex Atelier", category: "Loja virtual",
    path: "/templates/streetwear",
    description: "Explore as peças e monte uma sacola.",
  },
  {
    slug: "imobiliaria", name: "Pátio Imóveis", category: "Imobiliárias", path: "/templates/imobiliaria",
    description: "Compare imóveis para compra e aluguel por bairro em Porto Alegre.",
  },
  {
    slug: "arquitetura", name: "Ateliê Vão", category: "Arquitetura", path: "/templates/arquitetura",
    description: "Explore um portfólio residencial com plantas baixas em 3D.",
  },
] as const;

export type CatalogApp = (typeof appCatalog)[number];
