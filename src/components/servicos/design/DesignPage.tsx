import Link from "next/link";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { designFaqs } from "@/data/designFaqs";
import { designPlans } from "@/data/designPlans";
import { Cta, StorySteps, type StoryStep } from "../parts";
import { PlansRua } from "../PlansRua";
import s from "../servico.module.css";
import { MarcaWorld } from "./MarcaWorld";
import { MotionRua } from "./MotionRua";
import { PortfolioRua } from "./PortfolioRua";

const quote = "/contato?interest=design&source=media#orcamento";

/** Checks every "Nos pacotes" line against designPlans.ts, so the page never lists a feature that does not exist. */
const has = (item: string) => {
  if (!designPlans.some((plan) => (plan.features as readonly string[]).includes(item))) throw new Error(`Design feature not in designPlans: ${item}`);
  return item;
};

const story: readonly StoryStep[] = [
  {
    tag: "Identidade",
    title: "Uma marca que se reconhece",
    text: "Logotipo, cores e tipografia definidos a partir do que torna seu negócio único. A base para todo o resto.",
    get: [has("Criação de logotipo exclusivo com defesa conceitual"), has("Sistema oficial de cores (CMYK, RGB, HEX) e tipografia")],
  },
  {
    tag: "Peças",
    title: "Peças que falam a mesma língua",
    text: "Artes para redes sociais e banners com a mesma linguagem. Sua oferta entendida em poucos segundos.",
    get: [has("3 artes estratégicas para redes sociais"), has("1 banner digital ou peça promocional de campanha")],
  },
  {
    tag: "Interfaces",
    title: "Telas que levam ao próximo passo",
    text: "Planejamos as telas do site ou do app, do celular ao computador, e validamos o caminho antes de programar.",
    get: [has("Wireframes estruturais das páginas principais"), has("Protótipo interativo navegável para validação")],
  },
  {
    tag: "Motion",
    title: "Sua marca em movimento",
    text: "Animações para apresentar sua oferta, valorizar uma campanha e dar vida à identidade, em vídeo ou no site.",
    get: [],
    note: "Motion graphics tem orçamento próprio: formato, duração, áudio e entregas são definidos na proposta.",
  },
];

const formats = [
  ["Motion graphics", "Sua marca em movimento. Animações para apresentar sua oferta, valorizar uma campanha e dar vida à sua identidade. Formatos, duração e aplicações definidos na proposta.", "#motion-graphics", "Ver um exemplo"],
  ["Identidade visual", "Logotipo, cores, tipografia e orientações de aplicação conforme o pacote. Para construir uma base consistente de marca.", "#portfolio-design", "Explorar aplicações"],
  ["Interfaces para sites e apps", "Organização das telas e dos caminhos de uso. Desenvolvimento e programação são definidos separadamente do projeto de design.", "/criacao-de-sites", "Conhecer o desenvolvimento web"],
] as const;

const steps = [
  ["Entendemos sua marca", "Reunimos referências, objetivos e materiais existentes."],
  ["Definimos a direção", "Definimos peças, formatos e aplicações. Em motion graphics, também a duração e onde a animação será usada."],
  ["Criamos e apresentamos", "Apresentamos a criação e realizamos as revisões contratadas."],
  ["Entregamos os arquivos", "Entregamos os arquivos e orientações previstos no pacote ou na proposta."],
] as const;

export default function DesignPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + a marca: shapes become an emblem, pieces, screens and motion on a billboard */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <MarcaWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>Design e motion graphics · NexuSync</p>
          <h1>
            Sua empresa merece ser vista e lembrada. <span className={r.hi}>Personalidade que ganha movimento.</span>
          </h1>
          <p className={r.lead}>
            Seu cliente precisa reconhecer sua marca e entender sua oferta. Motion graphics para dar vida a ela, além de identidade visual, peças digitais e interfaces, com entregas definidas antes de começarmos.
          </p>
          <div className={r.ctas}>
            <Cta href={quote}>Quero valorizar minha marca</Cta>
            <Cta href="#motion-graphics" line>Ver um exemplo em vídeo</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para ver sua marca tomar forma</p>
        </div>
        <StorySteps steps={story} label="Do logotipo ao movimento" getLabel="Nos pacotes" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="objetivo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Começamos pelo que importa</p>
          <div className={s.split}>
            <h2 data-rua-type="">O que sua comunicação <span className={r.hi} data-hi="">precisa resolver agora?</span></h2>
            <p className={r.lead} data-rua-words="">Cada material parece pertencer a uma empresa diferente. Sua marca mudou e o visual ainda não acompanhou. As telas do seu projeto dificultam entender o próximo passo.</p>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="solucoes">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Coerência em cada ponto de contato</p>
          <h2 data-rua-type="">Da primeira impressão <span className={r.hi} data-hi="">à marca que fica.</span></h2>
          <div className={s.formats} data-rua-stagger="">
            {formats.map(([title, text, href, label], i) => (
              <Link key={title} className={s.format} href={href}>
                <span className={s.formatN}>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p className={s.formatSub}>{label}</p>
                  <p>{text}</p>
                </div>
                <em aria-hidden="true"><ArrowIcon /></em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="motion-graphics">
        <div className={`${r.wrap} ${r.pad} ${s.motionGrid}`}>
          <div>
            <p className={r.eyebrow}>Movimento com propósito</p>
            <h2 data-rua-type="">Sua marca entra em cena. <span className={r.hi} data-hi="">E deixa sua impressão.</span></h2>
            <p className={r.lead}>Uma identidade pode ganhar ritmo, transições e novas formas de se apresentar. Criamos motion graphics para aplicações digitais, campanhas e apresentações.</p>
            <div className={r.ctas} style={{ marginTop: 26 }}>
              <Cta href={quote}>Conversar sobre uma animação</Cta>
            </div>
            <small className={s.small}>Formato, duração, som, revisões e arquivos finais definidos na proposta. Orçamento sob medida.</small>
          </div>
          <MotionRua />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="portfolio-design">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Design aplicado</p>
          <div className={s.split}>
            <h2 data-rua-type="">Uma linguagem. <span className={r.hi} data-hi="">Muitas possibilidades.</span></h2>
            <p className={r.lead}>Trabalhos do portfólio, de logotipos a cartões, cardápios e panfletos. A direção de cada projeto parte da personalidade da marca e do que ela precisa comunicar.</p>
          </div>
          <PortfolioRua />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="processo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Do primeiro contato à entrega</p>
          <h2 data-rua-type="">Uma direção clara. <span className={r.hi} data-hi="">Em cada etapa.</span></h2>
          <ol className={s.steps} data-rua-stagger="">
            {steps.map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <ul className={s.strip} aria-label="Prazo e entregas por formato">
            {designPlans.map((plan) => (
              <li key={plan.id}><span>{plan.name}</span><b>{plan.deliveryTime}</b>{plan.deliverablesSummary.join(", ")}</li>
            ))}
            <li><span>Motion graphics</span><b>Prazo definido na proposta</b>Formato, duração, áudio, revisões e arquivos finais conforme o projeto.</li>
          </ul>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="midias-digitais">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Escopo claro. Entregas definidas.</p>
          <div className={s.split}>
            <h2 data-rua-type="">Design para <span className={r.hi} data-hi="">a sua próxima fase.</span></h2>
            <p className={r.lead}>Escolha entre peças digitais, identidade visual e telas para sites e aplicativos, com entregas definidas em cada pacote. Motion graphics recebe orçamento próprio.</p>
          </div>
          <PlansRua kind="design" />
          <aside className={s.custom}>
            <div>
              <h3>Motion graphics sob medida</h3>
              <p>Animações para apresentar sua oferta, valorizar uma campanha ou dar movimento à sua identidade. Formato, duração, direção visual, áudio quando aplicável, revisões e arquivos de entrega são definidos na proposta, e o valor é orçado separadamente dos pacotes.</p>
            </div>
            <Cta href={quote} line>Pedir orçamento de animação</Cta>
          </aside>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="faq">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Antes de começar</p>
            <h2 data-rua-type="">Perguntas claras. <span className={r.hi} data-hi="">Decisões melhores.</span></h2>
            <p className={r.lead}>Confira o que cada formato pode incluir. A proposta confirma as entregas, os prazos e as condições antes de começarmos.</p>
          </div>
          <div className={r.faq}>
            {designFaqs.map(({ q, a }) => (
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
          <p className={r.eyebrow}>A próxima conexão começa com uma conversa</p>
          <h2 data-rua-type="">Vamos dar vida <span className={r.hi} data-hi="">à sua marca?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte sua ideia, suas referências e o que sua marca precisa comunicar.</p>
          <div className={r.ctas}>
            <Cta href={quote}>Pedir minha proposta</Cta>
            <Cta href="/redes-sociais" line>Levar a marca para as redes</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
