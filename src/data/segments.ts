import { sitePlans } from "./sitePlans";

export type Segment = {
  slug: string;
  /** Plural noun used in titles ("Site para dentistas"). */
  plural: string;
  headline: string;
  accent: string;
  intro: string;
  /** Example searches people make. Illustrative, never presented as statistics. */
  searches: readonly string[];
  /** What the visitor wants to know before getting in touch. */
  wants: readonly (readonly [title: string, text: string])[];
  pages: readonly (readonly [title: string, text: string])[];
  /** Must match real plan features in sitePlans.ts; anything else is dropped at load time. */
  features: readonly string[];
  note?: string;
  faqs: readonly (readonly [question: string, answer: string])[];
  mockSearch: string;
  mockTitle: string;
};

const rawSegments: readonly Segment[] = [
  {
    slug: "dentistas",
    plural: "dentistas",
    headline: "Paciente novo pesquisa antes de ligar.",
    accent: "Seu consultório precisa estar lá.",
    intro: "Quem procura dentista costuma pesquisar o bairro, ler sobre o tratamento e só então chamar. O site faz esse caminho até o agendamento.",
    searches: ["dentista perto de mim", "dentista no meu bairro", "clareamento dental", "aparelho ortodôntico", "implante dentário", "dentista de urgência"],
    wants: [
      ["O que o consultório trata", "Uma página por tratamento explica o procedimento em linguagem simples e responde às dúvidas mais comuns."],
      ["Onde fica e quando atende", "Endereço, horários e mapa à vista evitam a ligação feita só para perguntar o básico."],
      ["Como marcar a consulta", "Botão de WhatsApp e formulário na tela do celular tiram o atrito do agendamento."],
    ],
    pages: [
      ["Início", "Apresenta o consultório, os tratamentos principais e o caminho para agendar."],
      ["Tratamentos", "Uma página para cada tratamento, com o que é, para quem serve e como funciona."],
      ["Equipe", "Quem atende, formação e a forma de trabalhar, para dar segurança antes da primeira consulta."],
      ["Contato e localização", "Endereço, horários, mapa e botões de WhatsApp e formulário."],
    ],
    features: ["Site com múltiplas páginas", "Páginas para serviços, produtos e informações", "Agendamento pelo WhatsApp", "Formulário de contato", "Design responsivo para celular, tablet e desktop", "SEO básico para mecanismos de busca"],
    note: "Publicidade de saúde segue regras do conselho profissional. O conteúdo do site precisa respeitá-las, e você nos informa o que pode ou não constar.",
    faqs: [
      ["O site pode mostrar antes e depois de tratamentos?", "Depende das regras do seu conselho profissional, que limitam esse tipo de divulgação. Confirme o que é permitido e informe na proposta: o conteúdo segue o que você aprovar."],
      ["Preciso de uma página para cada tratamento?", "Ajuda, porque cada página pode responder a uma pesquisa específica. A quantidade de páginas é definida na proposta, conforme o plano escolhido."],
    ],
    mockSearch: "dentista perto de mim",
    mockTitle: "Seu consultório | Dentista no seu bairro",
  },
  {
    slug: "pizzarias",
    plural: "pizzarias",
    headline: "Quem está com fome não folheia nada.",
    accent: "Pesquisa, vê o cardápio e pede.",
    intro: "Na hora do pedido, quem encontra o cardápio e o jeito de pedir rápido fecha com quem está à frente. O site deixa isso a um toque do cliente.",
    searches: ["pizzaria perto de mim", "pizza delivery no meu bairro", "cardápio de pizzaria", "pizzaria aberta agora", "pedir pizza pelo WhatsApp", "pizza meio a meio"],
    wants: [
      ["Cardápio e preços", "Sabores, tamanhos e valores em uma página, sem pedir foto de cardápio no WhatsApp."],
      ["Entrega e horários", "Bairros atendidos e horário de funcionamento visíveis evitam pedidos que não podem ser atendidos."],
      ["Como pedir", "Um botão leva ao WhatsApp da pizzaria com o pedido encaminhado."],
    ],
    pages: [
      ["Início", "Mostra a pizzaria, os destaques e o botão de pedir."],
      ["Cardápio digital", "Sabores, tamanhos e preços organizados para consultar no celular."],
      ["Como pedir e entrega", "Formas de pedido, bairros atendidos e horários."],
      ["Contato e localização", "Endereço, mapa e WhatsApp."],
    ],
    features: ["Cardápio ou menu digital", "Pedidos de delivery via WhatsApp", "Botão de contato pelo WhatsApp", "Mini catálogo ou mini cardápio", "Design responsivo para celular, tablet e desktop", "SEO básico para mecanismos de busca"],
    note: "Os pedidos chegam pelo WhatsApp. Estoque, checkout, pagamento online e gestão de pedidos não estão incluídos e são avaliados à parte.",
    faqs: [
      ["O site recebe pedido com pagamento online?", "Não automaticamente. Nos planos de site, o pedido de delivery é encaminhado pelo WhatsApp. Checkout e pagamento online são avaliados à parte, na proposta."],
      ["Consigo atualizar o cardápio sozinho?", "O plano Presence inclui orientação para você atualizar o conteúdo. Mudanças maiores entram na proposta."],
    ],
    mockSearch: "pizzaria delivery no meu bairro",
    mockTitle: "Sua pizzaria | Cardápio e pedido pelo WhatsApp",
  },
  {
    slug: "eletricistas",
    plural: "eletricistas",
    headline: "Quando a luz cai, ninguém indica.",
    accent: "A pessoa pesquisa e chama o primeiro que inspira confiança.",
    intro: "Quem precisa de um eletricista pesquisa na hora e quer saber o que você faz, se atende na região e como chamar. O site responde a isso em segundos.",
    searches: ["eletricista perto de mim", "eletricista residencial", "instalação de chuveiro elétrico", "troca de quadro de luz", "eletricista de emergência", "eletricista na minha cidade"],
    wants: [
      ["Que serviços você faz", "Lista clara de serviços residenciais e comerciais para a pessoa saber se você resolve o problema dela."],
      ["Em quais regiões atende", "Cidades e bairros atendidos evitam contatos fora da sua área."],
      ["Como chamar agora", "Um botão de WhatsApp sempre à vista, principalmente no celular."],
    ],
    pages: [
      ["Início", "Diz o que você faz, onde atende e como chamar."],
      ["Serviços", "Cada tipo de serviço descrito de forma simples, com o que está incluso."],
      ["Região de atendimento", "Cidades e bairros em que você trabalha."],
      ["Contato", "WhatsApp, formulário e horários de atendimento."],
    ],
    features: ["Landing pages para divulgação de serviços ou campanhas", "Catálogo de produtos ou serviços", "Botão de contato pelo WhatsApp", "Design responsivo para celular, tablet e desktop", "Configuração básica de SEO"],
    faqs: [
      ["Uma landing page basta ou preciso de um site completo?", "Para começar, uma landing page concentra serviços e contato em uma única página. Quem atende áreas diferentes ou quer detalhar cada serviço se beneficia de um site com mais páginas."],
      ["Isso me coloca no Google Maps?", "O site é um complemento. As orientações para o Perfil da Empresa no Google fazem parte do serviço de SEO e presença local, contratado à parte."],
    ],
    mockSearch: "eletricista perto de mim",
    mockTitle: "Seu nome | Eletricista residencial na sua cidade",
  },
  {
    slug: "advogados",
    plural: "advogados",
    headline: "Antes de marcar uma consulta,",
    accent: "o cliente pesquisa em quem confiar.",
    intro: "Quem busca um advogado costuma pesquisar a área do problema e a cidade, e compara quem explica melhor. Um site claro apresenta o escritório e facilita o primeiro contato.",
    searches: ["advogado trabalhista", "advogado de família na minha cidade", "escritório de advocacia", "advogado previdenciário", "advogado para inventário", "consulta jurídica"],
    wants: [
      ["Em quais áreas você atua", "Uma página por área de atuação explica quando procurar ajuda e o que esperar do atendimento."],
      ["Quem vai atendê-lo", "Formação, áreas e forma de trabalhar apresentadas com sobriedade."],
      ["Como é a primeira conversa", "Formulário e WhatsApp deixam claro como entrar em contato."],
    ],
    pages: [
      ["Início", "Apresenta o escritório e as áreas de atuação."],
      ["Áreas de atuação", "Uma página para cada área, com linguagem acessível."],
      ["Sobre o escritório", "Quem atende, formação e jeito de trabalhar."],
      ["Contato", "Endereço, formulário, WhatsApp e horários."],
    ],
    features: ["Sites institucionais compactos", "Site com múltiplas páginas", "Layout personalizado para sua marca", "Páginas para serviços, produtos e informações", "Formulário de contato", "SEO básico para mecanismos de busca"],
    note: "A advocacia tem regras próprias de publicidade. O site é informativo, segue o que você aprovar e não promete captação de clientes.",
    faqs: [
      ["O site pode mostrar casos ganhos e resultados?", "As regras de publicidade da advocacia restringem esse tipo de divulgação. Confirme o que é permitido com a sua seccional e informe na proposta: o conteúdo segue o que você aprovar."],
      ["Quantas áreas de atuação cabem no site?", "Depende do plano. O Go cobre até 3 páginas ou seções principais, e o Presence tem múltiplas páginas, com uma para cada área. A proposta confirma a estrutura."],
    ],
    mockSearch: "advogado trabalhista na minha cidade",
    mockTitle: "Seu escritório | Advocacia trabalhista",
  },
  {
    slug: "pet-shops",
    plural: "pet shops",
    headline: "O dono do pet pesquisa,",
    accent: "compara e marca o banho no mesmo celular.",
    intro: "Quem cuida de um pet quer saber o que a loja oferece, quanto custa e como marcar. O site reúne serviços, produtos e o caminho para agendar.",
    searches: ["pet shop perto de mim", "banho e tosa", "agendar banho e tosa", "ração para cachorro", "pet shop delivery", "acessórios para pets"],
    wants: [
      ["Serviços do pet shop", "Banho, tosa e outros serviços descritos com o que cada um inclui."],
      ["Produtos da loja", "Um catálogo mostra o que a loja vende, sem depender de fotos soltas no WhatsApp."],
      ["Como agendar", "O cliente chama no WhatsApp já com o serviço escolhido."],
    ],
    pages: [
      ["Início", "Apresenta a loja, os serviços principais e o botão de agendar."],
      ["Banho e tosa", "Serviços, orientações e como marcar horário."],
      ["Produtos", "Catálogo organizado por categoria."],
      ["Contato e localização", "Endereço, horários e WhatsApp."],
    ],
    features: ["Agendamento pelo WhatsApp", "Mini catálogo ou mini cardápio", "Catálogo de produtos ou serviços", "Pedidos de delivery via WhatsApp", "Botão de contato pelo WhatsApp", "SEO básico para mecanismos de busca"],
    note: "O catálogo não inclui estoque, checkout nem pagamentos online. Essas funções são avaliadas à parte.",
    faqs: [
      ["Dá para vender online pelo site?", "O catálogo mostra os produtos e os pedidos seguem pelo WhatsApp. Uma loja virtual com checkout é outro serviço, que você encontra em lojas virtuais e catálogos."],
      ["O agendamento é automático?", "Nos planos de site, o agendamento é feito pelo WhatsApp. Uma agenda automática é um sistema à parte, avaliado em aplicativos e automações."],
    ],
    mockSearch: "pet shop banho e tosa perto de mim",
    mockTitle: "Seu pet shop | Banho e tosa com horário marcado",
  },
  {
    slug: "barbearias",
    plural: "barbearias",
    headline: "O corte começa na tela do celular.",
    accent: "Antes de entrar, o cliente confere o trabalho.",
    intro: "Quem escolhe uma barbearia olha o trabalho, os serviços e os horários antes de aparecer. O site mostra isso e leva direto ao agendamento.",
    searches: ["barbearia perto de mim", "corte de cabelo masculino", "barba e bigode", "barbearia com horário marcado", "barbearia aberta hoje", "barbearia no meu bairro"],
    wants: [
      ["Serviços e valores", "Cortes, barba e combos com preços claros, sem precisar perguntar no WhatsApp."],
      ["O trabalho da casa", "Fotos do ambiente e dos resultados passam o estilo da barbearia."],
      ["Como marcar horário", "Um botão leva ao WhatsApp para combinar o horário."],
    ],
    pages: [
      ["Início", "Apresenta a barbearia, o estilo e o botão de agendar."],
      ["Serviços e valores", "Lista de serviços com o que cada um inclui."],
      ["Galeria", "Fotos do ambiente e dos trabalhos."],
      ["Contato e horários", "Endereço, horários de funcionamento e WhatsApp."],
    ],
    features: ["Agendamento pelo WhatsApp", "Portfólios profissionais", "Catálogo de produtos ou serviços", "Layout personalizado para sua marca", "Botão de contato pelo WhatsApp", "SEO básico para mecanismos de busca"],
    faqs: [
      ["Posso mostrar fotos dos cortes?", "Sim, o portfólio faz parte dos planos. Você fornece as fotos e confirma que quem aparece nelas autorizou o uso."],
      ["Tem agenda online?", "Nos planos de site, o agendamento é pelo WhatsApp. Uma agenda automática com horários livres é um sistema à parte, avaliado em aplicativos e automações."],
    ],
    mockSearch: "barbearia com horário marcado",
    mockTitle: "Sua barbearia | Corte e barba com horário marcado",
  },
];

/** Plan that actually carries a feature, so tags on the page match the real plan data. */
const planFeatures = sitePlans.flatMap((plan) => plan.features.map((feature) => [feature, plan.name] as const));
export const planOf = (feature: string) => planFeatures.find(([item]) => item === feature)?.[1];

/** Only features that exist in sitePlans.ts survive, so a segment page can never promise more than the plans do. */
export const segments: readonly Segment[] = rawSegments.map((segment) => ({
  ...segment,
  features: segment.features.filter((feature) => planOf(feature) !== undefined),
}));

export const getSegment = (slug: string) => segments.find((segment) => segment.slug === slug);
