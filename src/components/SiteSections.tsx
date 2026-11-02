import { QuoteLink } from "@/components/QuoteLink";
import { waLink } from "@/lib/site-config";

const solutions = [
  {
    title: "Landing pages",
    subtitle: "Para divulgar uma oferta e receber contatos",
    description:
      "Uma página dedicada ao seu serviço, produto ou campanha. Apresente os benefícios, responda às principais dúvidas e facilite o pedido de orçamento.",
    interest: "landing-page",
    whatsapp: "Olá! Quero conversar sobre uma landing page para meu negócio.",
    cta: "Quero uma landing page",
  },
  {
    title: "Hotsites dinâmicos",
    subtitle: "Para campanhas, eventos e lançamentos",
    description:
      "Um espaço com identidade própria para uma ação do seu negócio. Inscrições, galerias e recursos interativos são definidos conforme o objetivo e o escopo do projeto.",
    interest: "hotsite",
    whatsapp: "Olá! Quero um orçamento para um hotsite dinâmico.",
    cta: "Quero um hotsite",
  },
  {
    title: "Sites institucionais",
    subtitle: "Para apresentar sua empresa e seus serviços",
    description:
      "Organize as informações que ajudam o cliente a conhecer sua empresa, entender o que você oferece e entrar em contato com confiança.",
    interest: "institucional",
    whatsapp: "Olá! Quero conversar sobre um site institucional para minha empresa.",
    cta: "Quero um site institucional",
  },
] as const;

export function SiteSolutions() {
  return (
    <section
      id="servicos"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="container-luxe">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-violet-300">
          Criação de sites para profissionais e empresas
        </p>
        <h2 className="max-w-3xl font-display text-3xl sm:text-5xl">
          Um site pensado para o seu{" "}
          <span className="text-violet-gradient">próximo objetivo.</span>
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution.title}
              className="flex flex-col rounded-3xl border border-violet-300/20 bg-white/[0.025] p-7"
            >
              <h3 className="font-display text-2xl">{solution.title}</h3>
              <p className="mt-3 font-semibold text-violet-200">
                {solution.subtitle}
              </p>
              <p className="mt-4 flex-1 leading-7 text-muted-foreground">
                {solution.description}
              </p>
              <QuoteLink
                interest={solution.interest}
                section="sites"
                className="mt-7 rounded-xl bg-violet-gradient px-5 py-3 text-center font-semibold text-white"
              >
                {solution.cta}
              </QuoteLink>
              <a
                data-analytics-section="sites"
                data-analytics-interest={solution.interest}
                className="mt-4 text-center text-sm font-semibold text-violet-200 underline-offset-4 hover:underline"
                href={waLink(solution.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar pelo WhatsApp
              </a>
            </article>
          ))}
        </div>
        <p className="mt-7 text-muted-foreground">
          Ainda não sabe qual escolher?{" "}
          <QuoteLink
            interest="nao-sei"
            section="sites"
            className="text-violet-200 underline underline-offset-4"
          >
            Conte seu objetivo e ajudamos a definir o formato.
          </QuoteLink>
        </p>
      </div>
    </section>
  );
}

export function SiteBenefits() {
  const items = [
    [
      "Explique sua oferta com clareza",
      "Mostre o que você faz, para quem e quais problemas ajuda a resolver.",
    ],
    [
      "Apresente seu negócio com profissionalismo",
      "Organize serviços, imagens e informações em uma experiência alinhada à sua marca.",
    ],
    [
      "Torne o contato simples",
      "Ofereça chamadas visíveis para orçamento, WhatsApp ou formulário nos momentos certos.",
    ],
    [
      "Atenda bem quem acessa pelo celular",
      "Tenha uma apresentação adaptada às diferentes telas usadas pelos seus clientes.",
    ],
  ];

  return (
    <section className="border-t border-border py-20">
      <div className="container-luxe">
        <h2 className="max-w-3xl font-display text-3xl sm:text-4xl">
          Facilite o caminho entre conhecer sua empresa e falar com você.
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {items.map(([title, body]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold text-violet-200">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteProcess() {
  const steps = [
    [
      "Entendemos seu negócio",
      "Você compartilha informações sobre seu público, sua oferta e o objetivo do site. Alinhamos o que precisa ser apresentado.",
    ],
    [
      "Definimos a proposta",
      "Você recebe escopo, investimento, prazo e a lista de materiais necessários para começar.",
    ],
    [
      "Criamos e apresentamos",
      "Desenvolvemos o projeto para você revisar e solicitar os ajustes previstos na proposta. Você fornece os conteúdos combinados.",
    ],
    [
      "Publicamos seu site",
      "Após a aprovação, preparamos a publicação e orientamos os próximos passos definidos no escopo.",
    ],
  ];

  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-t border-border bg-violet-500/[0.04] py-20"
    >
      <div className="container-luxe">
        <h2 className="max-w-3xl font-display text-3xl sm:text-4xl">
          Do primeiro contato ao site publicado, com etapas claras.
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], index) => (
            <li key={title}>
              <span className="text-sm font-bold text-violet-300">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
