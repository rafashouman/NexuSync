import Link from "next/link";
import { go } from "@/components/rua/content";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { ObraWorld } from "./ObraWorld";
import { Cta, StorySteps, type StoryStep } from "../parts";
import { PlansRua } from "../PlansRua";
import s from "../servico.module.css";

const quote = (interest: string) => `/contato?interest=${interest}&source=sites#orcamento`;

/** The five floors of the scene. "Nos planos" lines are copied from sitePlans.ts features, never invented. */
const floors: readonly StoryStep[] = [
  {
    tag: "Alicerce",
    title: "Estrutura e estratégia",
    text: "Antes do visual, definimos o que o visitante precisa encontrar: seus serviços, seus diferenciais e o caminho até o contato. Cada informação no lugar certo.",
    get: ["Estrutura de até 3 páginas ou seções principais", "Site com múltiplas páginas"],
  },
  {
    tag: "Fachada",
    title: "Design com a cara da sua marca",
    text: "Sua empresa reconhecível em cada tela, do celular ao computador. Nada de modelo pronto igual ao do vizinho.",
    get: ["Layout personalizado para sua marca", "Design responsivo para celular, tablet e desktop"],
  },
  {
    tag: "Vitrine",
    title: "Seus serviços à mostra",
    text: "O que você faz, para quem e como funciona, organizado para o cliente chegar à conversa já sabendo o que quer.",
    get: ["Páginas para serviços, produtos e informações", "Catálogo de produtos ou serviços"],
  },
  {
    tag: "Sinal",
    title: "Organizado para ser encontrado",
    text: "Leve até em celular com alguns anos de uso e preparado para os buscadores desde a base. Sem prometer posição no Google.",
    get: ["Configuração básica de SEO", "Integração com Google Analytics"],
  },
  {
    tag: "Porta aberta",
    title: "Um caminho curto até você",
    text: "Botões de contato nos lugares certos. Quem se interessa fala com você sem procurar, a qualquer hora.",
    get: ["Botão de contato pelo WhatsApp", "Formulário de contato"],
  },
];

const benefits = [
  ["Mostre por que escolher você", "Ajude o cliente a reconhecer o problema que você resolve e a entender o valor do seu serviço."],
  ["Encurte o caminho até o orçamento", "Botões visíveis de WhatsApp e formulário ajudam o visitante interessado a falar com você sem procurar."],
  ["Passe confiança desde o início", "Uma apresentação organizada ajuda quem ainda não conhece sua empresa a avaliar seus serviços com segurança."],
] as const;

const formats = [
  ["Landing pages", "Do anúncio ao pedido de orçamento.", "Anunciar não basta se o visitante sai sem entender sua oferta. Reunimos benefícios, respostas e botões de contato em uma página focada no próximo passo.", "landing-page"],
  ["Sites institucionais", "Confiança antes da primeira conversa.", "Evite explicar tudo do zero a cada contato. Apresente sua empresa, seus serviços e diferenciais em um só lugar para o cliente chegar à conversa mais informado.", "institucional"],
  ["Hotsites dinâmicos", "Sua campanha com um destino claro.", "Vai lançar um produto, divulgar um evento ou abrir inscrições? Dê à sua ação uma página própria, com informações e recursos definidos para o objetivo da campanha.", "hotsite"],
] as const;

const examples = [
  ["Gastronomia", "Kobra Burger Fire", "Cardápio digital com personalidade para apresentar as opções de uma hamburgueria.", "/templates/cardapio"],
  ["Moda", "Vortex Atelier", "Uma vitrine editorial para destacar uma coleção de moda.", "/templates/streetwear"],
  ["Automotivo", "Prime Motors", "Apresentar veículos e facilitar pedidos de informação ou visita.", "/templates/carros"],
] as const;

const steps = [
  ["Entendemos seu negócio", "Entendemos seus serviços e o público que você atende."],
  ["Definimos a proposta", "Definimos páginas, conteúdos, investimento e prazo."],
  ["Criamos e apresentamos", "Criamos a experiência para sua revisão e os ajustes previstos."],
  ["Publicamos seu site", "Conferimos os recursos contratados e orientamos a publicação."],
] as const;

export const sitesFaqs = [
  ["O site vai aparecer no Google?", "O projeto inclui a configuração de SEO descrita na proposta. Indexação e posições nas pesquisas dependem também dos mecanismos de busca, da concorrência e da continuidade do trabalho de conteúdo e divulgação."],
  ["Quanto custa e quanto tempo leva?", "Os planos apresentam preços e estimativas para os respectivos escopos. O prazo depende dos materiais e das aprovações. A proposta confirma as páginas, os recursos, as revisões e os custos recorrentes."],
  ["Posso atualizar o conteúdo depois?", "As possibilidades de edição e manutenção dependem da solução contratada. Combinamos quem fará as atualizações e quais recursos de administração serão entregues."],
  ["Vocês reformulam sites existentes?", "Sim. Primeiro avaliamos o site atual, seu conteúdo e as funcionalidades necessárias. A proposta define o que será aproveitado e quais páginas e recursos precisam ser refeitos."],
  ["Preciso fornecer textos, fotos e logotipo?", "Reunimos seus materiais no início e definimos o que você fornece. Produção de conteúdo, imagens, identidade visual, domínio e hospedagem precisam estar previstos na proposta."],
] as const;

export default function SitesPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + a obra: the building is built while the five floors scroll by */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <ObraWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>Criação de sites · NexuSync</p>
          <h1>
            Seu negócio faz um bom trabalho. <span className={r.hi}>Seu site precisa mostrar isso.</span>
          </h1>
          <p className={r.lead}>
            Quando alguém recebe uma indicação e pesquisa sua empresa, encontra motivos para entrar em contato? Reunimos sua oferta, seus diferenciais e os caminhos de atendimento em um site pensado para o seu negócio. Planos a partir de R$ {go.price}.
          </p>
          <div className={r.ctas}>
            <Cta href={quote("institucional")}>Quero um site profissional</Cta>
            <Cta href="#planos" line>Ver os planos</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para ver seu site sendo construído</p>
        </div>

        <StorySteps steps={floors} label="Como um site é construído" prefix="Andar" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="sites-necessidades">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>O primeiro contato já começou</p>
          <div className={s.split}>
            <h2 data-rua-type="">O cliente chega com dúvidas. <span className={r.hi} data-hi="">Seu site responde.</span></h2>
            <p className={r.lead} data-rua-words="">Seus serviços estão espalhados entre posts e mensagens, o site antigo já não representa o seu trabalho e, no celular, demora para achar como falar com você. Facilite o caminho entre conhecer sua empresa e falar com você.</p>
          </div>
          <div className={s.cards} data-rua-stagger="">
            {benefits.map(([title, text], i) => (
              <article key={title} className={s.card}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="sites-formatos">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Um formato para cada objetivo</p>
          <h2 data-rua-type="">Não é só estar online. <span className={r.hi} data-hi="">É fazer sentido.</span></h2>
          <div className={s.formats} data-rua-stagger="">
            {formats.map(([title, sub, text, interest], i) => (
              <Link key={title} className={s.format} href={quote(interest)} aria-label={`Pedir proposta de ${title}`}>
                <span className={s.formatN}>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p className={s.formatSub}>{sub}</p>
                  <p>{text}</p>
                </div>
                <em aria-hidden="true"><ArrowIcon /></em>
              </Link>
            ))}
          </div>
          <aside className={s.cross}>
            <p><b>Vende produtos?</b> Catálogos, cardápios digitais e lojas virtuais têm uma página própria.</p>
            <Link href="/lojas-virtuais">Ver lojas virtuais e catálogos <ArrowIcon /></Link>
          </aside>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="templates">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Possibilidades na prática</p>
          <div className={s.split}>
            <h2 data-rua-type="">Explore. Interaja. <span className={r.hi} data-hi="">Imagine sua marca.</span></h2>
            <p className={r.lead}>Exemplos demonstrativos de sites. Experimente os formatos e encontre referências para o seu projeto.</p>
          </div>
          <div className={s.examples} data-rua-stagger="">
            {examples.map(([cat, title, text, href]) => (
              <Link key={href} href={href} className={s.example}>
                <div className={s.exampleTop} aria-hidden="true"><i /><i /><i /><span>{href.replace("/templates/", "nexusync.online/")}</span></div>
                <small>{cat} · demonstração</small>
                <h3>{title}</h3>
                <p>{text}</p>
                <b>Abrir a demonstração <ArrowIcon /></b>
              </Link>
            ))}
          </div>
          <Link className={s.textLink} href="/templates">Conhecer todos os exemplos <ArrowIcon /></Link>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="sites-processo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Do primeiro contato ao site publicado</p>
          <h2 data-rua-type="">Com etapas claras. <span className={r.hi} data-hi="">Do início ao lançamento.</span></h2>
          <ol className={s.steps} data-rua-stagger="">
            {steps.map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="planos">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Investimento em projetos avulsos</p>
          <div className={s.split}>
            <h2 data-rua-type="">Escolha a estrutura <span className={r.hi} data-hi="">para o seu negócio.</span></h2>
            <p className={r.lead}>Confira as opções e o que está incluído. O formato, a quantidade de páginas e os recursos do seu site são definidos na proposta antes do início.</p>
          </div>
          <PlansRua />
          <aside className={s.custom}>
            <div>
              <h3>Hotsite dinâmico sob medida</h3>
              <p>Para campanhas, eventos e lançamentos que precisam de uma experiência própria. Recursos interativos, investimento e prazo são definidos após entender seu projeto.</p>
            </div>
            <Cta href={quote("hotsite")} line>Conversar sobre meu projeto</Cta>
          </aside>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="faq">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Antes de começar</p>
            <h2 data-rua-type="">Sem dúvidas. <span className={r.hi} data-hi="">Com direção.</span></h2>
            <p className={r.lead}>A proposta define as entregas e as condições antes de começarmos.</p>
          </div>
          <div className={r.faq}>
            {sitesFaqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.final}`}>
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Seu próximo objetivo merece um começo</p>
          <h2 data-rua-type="">Vamos colocar <span className={r.hi} data-hi="">sua marca no ar?</span></h2>
          <div className={r.ctas}>
            <Cta href={quote("institucional")}>Pedir minha proposta</Cta>
            <Cta href="/seo-para-negocios-locais" line>Já tenho site: quero aparecer no Google</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
