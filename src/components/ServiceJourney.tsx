import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { QuoteLink } from "@/components/QuoteLink";
import type { QuoteSection } from "@/lib/quote";

const journeys = {
  sites: {
    label: "Criação de sites profissionais", title: "Criação de sites", titleAccent: "para mostrar o valor da sua empresa.",
    intro: "Quando alguém recebe uma indicação e pesquisa sua empresa, encontra motivos para entrar em contato? Reunimos sua oferta, seus diferenciais e os caminhos de atendimento em um site pensado para o seu negócio.",
    interest: "institucional", section: "sites", cta: "Quero um site profissional",
    pain: "O cliente chega com dúvidas. Seu site pode ajudar a respondê-las.",
    situations: ["Seus serviços estão espalhados entre posts e mensagens.", "O site antigo já não representa a qualidade do seu trabalho.", "Quem visita pelo celular demora a encontrar como falar com você."],
    formats: [
      ["Site institucional", "Para apresentar sua empresa, explicar os serviços e transmitir confiança antes da primeira conversa."],
      ["Landing page", "Para concentrar uma oferta e levar o visitante de uma campanha ao pedido de orçamento."],
      ["Hotsite ou reformulação", "Para dar uma página própria a um lançamento ou atualizar um site que ficou para trás. Recursos definidos no escopo."],
    ],
    steps: ["Entendemos seus serviços e o público que você atende.", "Definimos páginas, conteúdos, investimento e prazo.", "Criamos a experiência para sua revisão e ajustes previstos.", "Conferimos os recursos contratados e orientamos a publicação."],
    examples: [["/templates", "Explore nossos exemplos de sites"], ["/quem-somos", "Conheça nosso jeito de trabalhar"]],
    next: ["/marketing", "Já tem site e precisa divulgá-lo? Conheça o marketing digital."],
  },
  shops: {
    label: "Lojas e catálogos", title: "Loja virtual e catálogo digital", titleAccent: "para seus produtos ficarem sempre à mostra.",
    intro: "Enviar fotos, preços e opções a cada conversa toma tempo. Uma loja ou catálogo reúne essas informações e ajuda o cliente a chegar ao atendimento sabendo o que quer.",
    interest: "loja-virtual", section: "sites", cta: "Quero minha loja ou catálogo",
    pain: "Menos perguntas repetidas. Mais clareza para escolher e pedir.",
    situations: ["Você envia as mesmas fotos e preços todos os dias.", "Os clientes têm dificuldade para encontrar os produtos disponíveis.", "Pedidos chegam incompletos e exigem várias mensagens de confirmação."],
    formats: [
      ["Catálogo digital", "Produtos organizados por categoria, com fotos e informações. Para quem prefere negociar e concluir o pedido pelo WhatsApp."],
      ["Loja virtual", "Uma jornada com carrinho e checkout. Pagamentos, frete, estoque e integrações dependem da plataforma e do escopo contratado."],
      ["Cardápio online", "Itens, preços e adicionais em um só link. O fluxo de pedido, retirada ou entrega acompanha a rotina do estabelecimento."],
    ],
    steps: ["Conhecemos seus produtos e a forma como você vende.", "Escolhemos entre catálogo, cardápio e loja com checkout.", "Organizamos categorias, materiais e o cadastro combinado.", "Validamos o pedido e explicamos a administração prevista."],
    examples: [["/templates/streetwear", "Experimentar uma vitrine de moda"], ["/templates/dog-e-acai", "Experimentar um cardápio digital"]],
    next: ["/apps", "Precisa organizar os pedidos depois da venda? Veja os sistemas web."],
  },
  apps: {
    label: "Sistemas web e automações", title: "Seu negócio cresceu. Sua rotina não precisa ficar mais complicada.",
    intro: "Horários para confirmar, pedidos para acompanhar e informações para localizar. Começamos pelo processo que toma seu tempo e definimos uma solução que sua equipe consiga usar no dia a dia.",
    interest: "automacoes", section: "apps", cta: "Quero simplificar minha operação",
    pain: "Qual parte da rotina mais precisa de organização?",
    situations: ["Horários e confirmações dependem de mensagens e anotações.", "Sua equipe registra a mesma informação em mais de um lugar.", "É difícil saber o que está pendente e quem precisa de retorno."],
    formats: [
      ["Agendamentos", "Organize serviços e solicitações de horário. No plano básico, sua empresa confirma a solicitação; avisos automáticos dependem do escopo."],
      ["Gestão web", "Centralize cadastros, pedidos, tarefas e indicadores em uma aplicação feita para os processos definidos com você."],
      ["Automações e integrações", "Conecte etapas que hoje exigem trabalho repetido. Primeiro verificamos permissões, APIs, custos e limites das ferramentas envolvidas."],
    ],
    steps: ["Mapeamos uma tarefa e o problema que ela causa.", "Verificamos a viabilidade das integrações necessárias.", "Definimos uma primeira entrega com critérios de funcionamento.", "Validamos o fluxo e combinamos implantação, orientação e suporte."],
    examples: [["/chronos", "Testar uma agenda demonstrativa"], ["/pulsemetrics", "Explorar um painel com dados demonstrativos"]],
    next: ["/visionsync", "Seu foco é acompanhar contatos no WhatsApp? Conheça o VisionSync."],
  },
  marketing: {
    label: "Marketing digital", title: "Marketing digital", titleAccent: "para as pessoas certas conhecerem seu negócio.",
    intro: "Você não precisa estar em todos os canais. Precisa mostrar sua oferta para as pessoas certas e acompanhar o que acontece depois do primeiro contato. Planejamos a divulgação conforme o objetivo e o momento da sua empresa.",
    interest: "trafego-pago", section: "other", cta: "Quero planejar minha divulgação",
    pain: "Publicar e anunciar fica mais útil quando existe um objetivo claro.",
    situations: ["As publicações saem sem frequência ou direção.", "Você quer anunciar, mas não sabe qual oferta priorizar.", "Os contatos chegam e falta um processo para acompanhar os retornos."],
    formats: [
      ["Conteúdo para redes sociais", "Planejamento, legendas e peças para Instagram e Facebook conforme o plano. Atendimento de mensagens e produção de vídeos são avaliados à parte."],
      ["Anúncios na Meta", "Campanhas no Facebook e Instagram com destinos como WhatsApp ou uma página de oferta. A verba de mídia é separada da gestão."],
      ["Acompanhamento de contatos", "Organização de etapas e retornos conforme o plano. Integrações e automações passam por avaliação de compatibilidade."],
    ],
    steps: ["Conhecemos sua oferta, seu público e seu atendimento.", "Escolhemos um objetivo e os canais adequados.", "Definimos materiais, entregas e investimentos separados.", "Acompanhamos os indicadores e ajustamos as ações contratadas."],
    examples: [["/design", "Ver projetos de identidade visual e peças"], ["/criacao-de-sites", "Conhecer as páginas para campanhas"]],
    next: ["/arcsync", "Prefere gerenciar as próprias publicações? Conheça o ArcSync."],
  },
  design: {
    label: "Identidade visual e design", title: "Uma marca fácil de reconhecer começa com uma apresentação coerente.",
    intro: "Da primeira impressão ao próximo anúncio, sua empresa precisa ser reconhecida. Criamos identidades, peças e interfaces com entregas definidas para a necessidade da sua marca.",
    interest: "design", section: "media", cta: "Quero valorizar minha marca",
    pain: "O que sua comunicação precisa resolver agora?",
    situations: ["Cada material parece pertencer a uma empresa diferente.", "Sua marca mudou e o visual ainda não acompanhou.", "As telas do seu projeto dificultam entender o próximo passo."],
    formats: [
      ["Identidade visual", "Logotipo, cores, tipografia e orientações de aplicação conforme o pacote. Para construir uma base consistente de marca."],
      ["Peças digitais", "Materiais para apresentar produtos, serviços e campanhas a partir da identidade existente. Quantidades e formatos definidos na proposta."],
      ["Interfaces para sites e apps", "Organização das telas e dos caminhos de uso. Desenvolvimento e programação são definidos separadamente do projeto de design."],
    ],
    steps: ["Reunimos referências, objetivos e materiais existentes.", "Definimos peças, formatos e aplicações necessárias.", "Apresentamos a criação e realizamos as revisões contratadas.", "Entregamos os arquivos e orientações previstos no pacote."],
    examples: [["/marketing", "Precisa também de publicação e divulgação?"], ["/criacao-de-sites", "Quer transformar o visual em um site publicado?"]],
    next: ["/marketing", "Criação de peças e gestão das redes são serviços diferentes. Conheça os planos de marketing."],
  },
} as const;

export type ServiceKind = keyof typeof journeys;

export function ServiceHero({
  kind,
  visual,
}: {
  kind: ServiceKind;
  visual?: ReactNode;
}) {
  const item = journeys[kind];
  const hasVisual = Boolean(visual);
  return <section id={`${kind}-intro`} className="container-luxe relative scroll-mt-32 pb-16 pt-36 sm:pt-44">
    <div aria-hidden className="pointer-events-none absolute -left-24 top-28 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-[100px]" />
    <div className={`grid gap-10 ${hasVisual ? "items-center lg:grid-cols-2" : "max-w-4xl"}`}>
      <div className="min-w-0">
        <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-300/20 bg-violet-400/[0.07] py-1.5 pl-2 pr-4 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-100">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-300/15 text-violet-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          </span>
          {item.label}
          <span aria-hidden className="h-1 w-1 rounded-full bg-violet-300/60" />
          <span className="text-white/45">NexuSync</span>
        </p>
        <h1 className="max-w-[15ch] font-display text-4xl font-bold leading-[1.06] tracking-[-0.04em] sm:text-6xl">
          {item.title}
          {"titleAccent" in item && (
            <span className="mt-2 block text-violet-gradient">{item.titleAccent}</span>
          )}
        </h1>
        <p className="mt-7 max-w-xl border-l-2 border-violet-300/35 pl-5 text-lg leading-8 text-muted-foreground">{item.intro}</p>
        <QuoteLink interest={item.interest} section={item.section as QuoteSection} className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-violet-gradient px-6 py-4 font-semibold text-white shadow-[0_12px_36px_-16px_rgba(139,92,246,.75)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300">{item.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden /></QuoteLink>
      </div>
      {visual && <div className="min-w-0">{visual}</div>}
    </div>
  </section>;
}

export function ServiceJourney({ kind }: { kind: ServiceKind }) {
  const item = journeys[kind];
  return <>
    <section id={`${kind}-necessidades`} className="scroll-mt-32 border-y border-border bg-white/[0.015] py-16 sm:py-24">
      <div className="container-luxe grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div><p className="text-xs font-bold uppercase tracking-widest text-violet-200">Reconhece essa rotina?</p><h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">{item.pain}</h2></div>
        <ul className="space-y-5">{item.situations.map(text => <li key={text} className="flex gap-4 border-b border-white/10 pb-5 text-lg leading-7 text-muted-foreground"><MessageCircle className="mt-1 h-5 w-5 shrink-0 text-violet-200" aria-hidden />{text}</li>)}</ul>
      </div>
    </section>
    <section id={`${kind}-formatos`} className="container-luxe scroll-mt-32 py-16 sm:py-24">
      <h2 className="font-display text-3xl sm:text-4xl">Uma solução para o que você precisa agora.</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{item.formats.map(([title, text], i) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"><span className="font-mono text-sm text-violet-200">0{i + 1}</span><h3 className="mt-6 font-display text-2xl">{title}</h3><p className="mt-4 leading-7 text-muted-foreground">{text}</p></article>)}</div>
      <div id={`${kind}-exemplos`} className="mt-10 flex scroll-mt-32 flex-wrap gap-4">{item.examples.map(([href, label]) => <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl border border-violet-300/25 px-5 py-3 text-sm font-semibold text-violet-200 hover:bg-violet-400/10">{label}<ArrowRight className="h-4 w-4" aria-hidden /></Link>)}</div>
    </section>
    <section id={`${kind}-processo`} className="scroll-mt-32 border-y border-border py-16 sm:py-24">
      <div className="container-luxe grid gap-10 lg:grid-cols-2">
        <div><h2 className="font-display text-3xl sm:text-4xl">Você acompanha cada etapa.</h2><p className="mt-5 max-w-lg leading-7 text-muted-foreground">Antes de começar, combinamos o que será entregue, o investimento, o prazo e o que precisamos de você.</p><QuoteLink interest={item.interest} section={item.section as QuoteSection} className="mt-6 inline-flex items-center gap-2 font-semibold text-violet-200 underline underline-offset-4">{item.cta}<ArrowRight className="h-4 w-4" aria-hidden /></QuoteLink></div>
        <ol className="space-y-5">{item.steps.map((text, i) => <li key={text} className="flex items-start gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-300/25 text-sm text-violet-200">{i + 1}</span><p className="pt-1 leading-7 text-muted-foreground">{text}</p></li>)}</ol>
      </div>
    </section>
    <aside className="container-luxe py-10"><Link href={item.next[0]} className="inline-flex items-start gap-3 text-sm leading-6 text-violet-200 hover:underline"><Check className="mt-1 h-4 w-4 shrink-0" aria-hidden />{item.next[1]}</Link></aside>
  </>;
}
