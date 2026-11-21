import Link from "next/link";
import { presence } from "@/components/rua/content";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { shopFaqs } from "@/data/shopFaqs";
import { Cta, StorySteps, type StoryStep } from "../parts";
import { PlansRua } from "../PlansRua";
import s from "../servico.module.css";
import { VitrineWorld } from "./VitrineWorld";

const quote = (interest = "loja-virtual") => `/contato?interest=${interest}&source=sites#orcamento`;

/** The four steps of the scene. "Nos planos" lines are copied from sitePlans.ts features (Presence and Pulse). */
const journey: readonly StoryStep[] = [
  {
    tag: "Vitrine",
    title: "Seus produtos organizados",
    text: "Produtos por categoria, com fotos e informações. O cliente escolhe sem precisar pedir foto e preço a cada conversa.",
    get: ["Catálogo de produtos ou serviços", "Cardápio ou menu digital"],
  },
  {
    tag: "Pedido",
    title: "Um caminho claro até o pedido",
    text: "O cliente monta o pedido e envia pelo WhatsApp, ou coloca no carrinho, conforme o formato da sua loja.",
    get: ["Pedidos de delivery via WhatsApp", "Configuração de categorias e páginas de produto"],
  },
  {
    tag: "Pagamento e entrega",
    title: "Pagar e receber sem complicação",
    text: "Na loja virtual, pagamento online e frete entram conforme a plataforma e o escopo. No catálogo, o pedido segue pelo canal que você já usa.",
    get: ["Integração com meios de pagamento compatíveis", "Configuração de frete ou entrega, quando aplicável"],
    note: "Catálogos e menus não incluem automaticamente estoque, checkout ou pagamentos online. Esses recursos são definidos na proposta.",
  },
  {
    tag: "Você no controle",
    title: "Sua vitrine sempre em dia",
    text: "Depois da entrega, você sabe como cadastrar produtos e acompanhar pedidos. A loja continua aberta sem depender de ninguém.",
    get: ["Orientação para administrar produtos e pedidos", "Testes de navegação e compra"],
  },
];

const formats = [
  ["Catálogo digital", "Escolher com mais informação.", "Produtos organizados por categoria, com fotos e informações. Para quem prefere negociar e concluir o pedido pelo WhatsApp.", "Produtos · consulta · contato"],
  ["Loja virtual", "Uma jornada até a compra.", "Uma jornada com carrinho e checkout. Pagamentos, frete, estoque e integrações dependem da plataforma e do escopo contratado.", "Vitrine · carrinho · checkout"],
  ["Cardápio online", "Do seu sabor ao pedido.", "Itens, preços e adicionais em um só link. O fluxo de pedido, retirada ou entrega acompanha a rotina do estabelecimento.", "Cardápio · adicionais · pedido"],
] as const;

const compare = [
  ["Apresentação", "Produtos e informações", "Produtos, categorias e páginas", "Itens, preços e adicionais"],
  ["Pedido", "Contato pelo canal combinado", "Carrinho e checkout conforme escopo", "Entrega ou retirada conforme fluxo"],
  ["Pagamento online", "Avaliado separadamente", "Conforme plataforma e proposta", "Avaliado separadamente"],
  ["Administração", "Definida na proposta", "Orientação conforme solução contratada", "Definida na proposta"],
] as const;

const examples = [
  ["Moda e e-commerce", "Vortex Atelier", "Uma vitrine editorial para destacar uma coleção de moda.", "/templates/streetwear"],
  ["Cardápio e delivery", "Kobra Burger Fire", "Monte um hambúrguer e teste a comanda digital.", "/templates/cardapio"],
  ["Delivery e retirada", "Dog & Açaí", "Monte um cachorro-quente, escolha seu açaí e confira o pedido.", "/templates/dog-e-acai"],
] as const;

const steps = [
  ["Conhecemos sua venda", "Conhecemos seus produtos e a forma como você vende."],
  ["Definimos o formato", "Escolhemos entre catálogo, cardápio e loja com checkout."],
  ["Organizamos sua vitrine", "Organizamos categorias, materiais e o cadastro combinado."],
  ["Validamos e orientamos", "Validamos o pedido e explicamos a administração prevista."],
] as const;

export default function LojasPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + a vitrine: a shop fills its shelves and sends an order while the four steps scroll by */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <VitrineWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>Lojas virtuais e catálogos · NexuSync</p>
          <h1>
            Seus produtos. <span className={r.hi}>Sua vitrine.</span>
          </h1>
          <p className={r.lead}>
            Enviar fotos, preços e opções a cada conversa toma tempo. Uma loja ou catálogo reúne essas informações e ajuda o cliente a chegar ao atendimento sabendo o que quer. Catálogo e cardápio digital estão no plano {presence.name}, por R$ {presence.price}.
          </p>
          <div className={r.ctas}>
            <Cta href={quote()}>Quero minha loja ou catálogo</Cta>
            <Cta href="#formatos" line>Escolher o formato</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para ver um pedido acontecer</p>
        </div>
        <StorySteps steps={journey} label="Do produto na vitrine ao pedido entregue" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="formatos">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Como seus clientes escolhem e compram?</p>
          <div className={s.split}>
            <h2 data-rua-type="">Menos perguntas repetidas. <span className={r.hi} data-hi="">Mais clareza para pedir.</span></h2>
            <p className={r.lead} data-rua-words="">Reúna produtos, preços e formas de pedido em um catálogo, cardápio digital ou loja virtual. O formato depende de como sua empresa vende e atende os clientes.</p>
          </div>
          <div className={s.cards} data-rua-stagger="">
            {formats.map(([title, sub, text, label], i) => (
              <article key={title} className={s.card}>
                <span>0{i + 1} · {label}</span>
                <h3>{title}</h3>
                <p className={s.formatSub}>{sub}</p>
                <p>{text}</p>
                <Link className={s.textLink} href={quote()}>Conversar sobre esse formato <ArrowIcon /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="comparar">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Cada formato tem um caminho</p>
          <div className={s.split}>
            <h2 data-rua-type="">Escolha pelo jeito <span className={r.hi} data-hi="">que você vende.</span></h2>
            <p className={r.lead}>O cadastro inicial, os recursos e as integrações são definidos antes de começar. Organizar uma vitrine não inclui automaticamente estoque ou pagamentos online.</p>
          </div>
          <div className={s.compareWrap}>
            <table className={s.compare}>
              <caption>O que muda entre catálogo, loja virtual e cardápio online</caption>
              <thead>
                <tr><th scope="col">Na prática</th><th scope="col">Catálogo</th><th scope="col">Loja virtual</th><th scope="col">Cardápio</th></tr>
              </thead>
              <tbody>
                {compare.map(([label, ...values]) => (
                  <tr key={label}><th scope="row">{label}</th>{values.map((v, i) => <td key={i}>{v}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="exemplos">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Veja o fluxo em ação</p>
          <div className={s.split}>
            <h2 data-rua-type="">Abra. Escolha. <span className={r.hi} data-hi="">Experimente.</span></h2>
            <p className={r.lead}>Exemplos demonstrativos para explorar a apresentação dos produtos e o caminho até o pedido.</p>
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
          <Link className={s.textLink} href="/templates">Explorar todos os exemplos <ArrowIcon /></Link>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="processo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Da escolha do formato à entrega</p>
          <h2 data-rua-type="">Sua operação primeiro. <span className={r.hi} data-hi="">A solução acompanha.</span></h2>
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
          <p className={r.eyebrow}>Estrutura e investimento na medida certa</p>
          <div className={s.split}>
            <h2 data-rua-type="">Da vitrine digital <span className={r.hi} data-hi="">à loja completa.</span></h2>
            <p className={r.lead}>Confira o que cada plano inclui. Catálogos e menus não incluem automaticamente estoque, checkout ou pagamentos online; esses recursos são definidos na proposta.</p>
          </div>
          <PlansRua kind="commerce" />
          <aside className={s.cross}>
            <p><b>Só precisa apresentar serviços?</b> Sites institucionais e landing pages começam no plano Go.</p>
            <Link href="/criacao-de-sites#planos">Ver os planos de sites <ArrowIcon /></Link>
          </aside>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="faq">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Antes de começar</p>
            <h2 data-rua-type="">Cada recurso. <span className={r.hi} data-hi="">Bem combinado.</span></h2>
            <p className={r.lead}>Entenda o que muda entre os formatos e quais recursos precisam estar previstos na proposta.</p>
          </div>
          <div className={r.faq}>
            {shopFaqs.map(({ q, a }) => (
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
          <p className={r.eyebrow}>Seus produtos podem ter uma vitrine própria</p>
          <h2 data-rua-type="">Vamos abrir <span className={r.hi} data-hi="">a sua loja?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte como você vende e o que precisa simplificar.</p>
          <div className={r.ctas}>
            <Cta href={quote()}>Pedir minha proposta</Cta>
            <Cta href="/templates" line>Ver as demonstrações</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
