import Link from "next/link";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { marketingAddons, marketingPlans } from "@/data/marketingPlans";
import { formatBRL, waLink } from "@/lib/site-config";
import { Cta, StorySteps, type StoryStep } from "../parts";
import s from "../servico.module.css";
import { PerfilWorld } from "./PerfilWorld";

/** Everything below comes from the real Presença Ativa plan, so the page never promises more than the proposal. */
export const socialPlan = marketingPlans.find((item) => item.id === "presenca-ativa")!;
const socialAddons = marketingAddons.slice(0, 2);
const has = (item: string) => {
  if (!socialPlan.features.includes(item)) throw new Error(`Feature not in Presença Ativa: ${item}`);
  return item;
};

const story: readonly StoryStep[] = [
  {
    tag: "Briefing e acessos",
    title: "Seu perfil com a cara da empresa",
    text: "Reunimos sua identidade visual, informações, fotos e os acessos necessários. O ponto de partida é o que você já é.",
    get: [has("Uma marca, Instagram e Facebook")],
  },
  {
    tag: "Calendário do mês",
    title: "Oito datas planejadas, não improvisadas",
    text: "Organizamos os temas e as datas das publicações para você aprovar antes de qualquer coisa ir ao ar.",
    get: [has("Legendas, calendário e agendamento")],
  },
  {
    tag: "Publicações e stories",
    title: "Constância que mantém você lembrado",
    text: "Criamos as artes e legendas, adaptamos para stories e agendamos. Quem já te conhece continua te vendo.",
    get: [has("8 publicações mensais (até 2 carrosséis de 5 páginas)"), has("8 adaptações para stories")],
  },
  {
    tag: "Relatório mensal",
    title: "O que foi feito, e o próximo mês",
    text: "Mostramos o que foi publicado e ajustamos o próximo ciclo com você.",
    get: [has("Relatório mensal"), has("Uma rodada consolidada de ajustes")],
    note: "Número de seguidores, alcance ou vendas não são prometidos: variam com mercado, oferta e atendimento.",
  },
];

const reasons = [
  ["Quem já te conhece olha", "Clientes e indicações costumam passar pelo seu perfil antes de chamar. Um perfil atualizado responde a primeira dúvida."],
  ["Constância mantém a empresa lembrada", "Publicar com frequência combinada evita meses de silêncio e mantém sua oferta à vista."],
  ["O conteúdo leva ao contato", "Cada publicação pode apresentar um serviço ou uma novidade e apontar para o site ou para o WhatsApp."],
] as const;

const notPromised = [
  "Número de seguidores, alcance ou vendas: variam com mercado, oferta e atendimento.",
  ...socialPlan.exclusions.map((item) => `${item} não fazem parte do plano.`),
];

export const socialFaqs = [
  ["O plano inclui responder mensagens e comentários?", "Não. O Presença Ativa inclui calendário, legendas e publicações para Instagram e Facebook. Atendimento de mensagens, respostas diárias a comentários, filmagem e edição de reels e anúncios não fazem parte desse plano."],
  ["Vocês gravam os vídeos?", "Não gravamos. O complemento de dois reels simples usa material enviado por você, com até 30 segundos cada e uma revisão."],
  ["O que eu preciso enviar?", "Identidade visual, informações sobre a empresa, fotos e as aprovações das publicações. Uma adaptação para stories não é uma criação inédita."],
  ["Posso contratar redes sociais sem ter site?", "Pode. Mas o site e o SEO são a base: é para lá que as publicações levam quem quer saber mais. Por isso trabalhamos a presença online primeiro e as redes em seguida."],
  ["Quando o trabalho começa?", `${socialPlan.onboardingTime}.`],
] as const;

const contactHref = `/contato?interest=${socialPlan.id}&source=other#orcamento`;

export default function RedesPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + o perfil: the profile is built on the facade, posts fly to the neighbors who already know you */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <PerfilWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>Gestão de redes sociais · NexuSync</p>
          <h1>
            Perfil parado parece <span className={r.hi}>empresa parada.</span>
          </h1>
          <p className={r.lead}>
            Falta tempo para manter as redes atualizadas? Organizamos conteúdo, legendas e publicações para apresentar sua oferta com frequência e clareza. {socialPlan.name} por {formatBRL(socialPlan.monthlyPriceCents ?? 0)}/mês.
          </p>
          <div className={r.ctas}>
            <Cta href={contactHref}>Quero minha marca presente</Cta>
            <Cta href="#plano" line>Ver o que está incluído</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para ver um mês de publicações</p>
        </div>
        <StorySteps id="como-trabalhamos" steps={story} label="Do briefing ao relatório do mês" getLabel="No plano" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="por-que-manter">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Por que manter as redes</p>
          <div className={s.split}>
            <h2 data-rua-type="">O perfil é a vitrine <span className={r.hi} data-hi="">de quem já te conhece.</span></h2>
            <p className={r.lead}>As redes não substituem o site nem o SEO. Elas mantêm perto quem já ouviu falar de você.</p>
          </div>
          <div className={s.cards} data-rua-stagger="">
            {reasons.map(([name, text], i) => (
              <article key={name} className={s.card}>
                <span>0{i + 1}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="plano">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>O plano</p>
          <div className={s.split}>
            <h2 data-rua-type="">{socialPlan.name}, <span className={r.hi} data-hi="">com entregas definidas.</span></h2>
            <p className={r.lead}>{socialPlan.idealFor}. O escopo completo é confirmado na proposta antes de começarmos.</p>
          </div>
          <div className={s.ways} data-rua-stagger="">
            <article className={s.way} data-main="true">
              <small>Plano mensal</small>
              <h3>{socialPlan.name}</h3>
              <div className={s.price}>
                <strong>{formatBRL(socialPlan.monthlyPriceCents ?? 0)}/mês</strong>
                <span>mais {formatBRL(socialPlan.setupPriceCents ?? 0)} de implantação</span>
              </div>
              <ul className={s.feats}>
                {socialPlan.features.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={s.wayNote}>{socialPlan.onboardingTime}.</p>
              <div className={r.ctas}>
                <a className={`${r.btn} ${r.btnAmber}`} href={waLink(socialPlan.waMessage)} target="_blank" rel="noopener noreferrer" data-analytics-section="redes-sociais" data-analytics-interest={socialPlan.id}>
                  <span>{socialPlan.buttonText}</span>
                  <em aria-hidden="true"><ArrowIcon /></em>
                </a>
                <Link className={s.textLink} href={contactHref} style={{ marginTop: 0 }}>Prefiro o formulário <ArrowIcon /></Link>
              </div>
            </article>
            <article className={s.way}>
              <small>Complementos</small>
              <h3>Se precisar de mais</h3>
              <p>Itens opcionais, contratados junto do plano.</p>
              <ul className={s.feats}>
                {socialAddons.map((addon) => <li key={addon.name}><span><b>{addon.name}</b> ({addon.price}). {addon.scope}</span></li>)}
              </ul>
              <p className={s.wayNote}>Importante: {socialPlan.details.join(" ")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="o-que-nao-esta-incluido">
        <div className={`${r.wrap} ${r.pad} ${s.nots}`}>
          <div>
            <p className={r.eyebrow}>Transparência</p>
            <h2 data-rua-type="">O que o plano <span className={r.hi} data-hi="">não inclui.</span></h2>
            <p className={r.lead}>Dizer o que fica de fora evita surpresa. A proposta descreve entregas e indicadores, nunca um resultado garantido.</p>
          </div>
          <ul className={s.notList} data-rua-stagger="">
            {notPromised.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="pilares">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Na ordem certa</p>
          <div className={s.split}>
            <h2 data-rua-type="">As redes funcionam melhor <span className={r.hi} data-hi="">com a base pronta.</span></h2>
            <p className={r.lead}>Trabalhamos em quatro pilares, nessa ordem. As redes são o terceiro: vêm depois da presença online e do design, e antes do tráfego pago.</p>
          </div>
          <nav className={s.segs} aria-label="Outros pilares" data-rua-stagger="">
            <Link href="/seo-para-negocios-locais">1. Presença online e SEO <ArrowIcon /></Link>
            <Link href="/design">2. Design e motion graphics <ArrowIcon /></Link>
            <Link href="/marketing#marketing-aquisicao-local">4. Tráfego pago <ArrowIcon /></Link>
          </nav>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="perguntas">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Perguntas frequentes</p>
            <h2 data-rua-type="">Antes de <span className={r.hi} data-hi="">decidir.</span></h2>
            <p className={r.lead}>Se a sua dúvida não estiver aqui, pergunte pelo WhatsApp ou pelo formulário.</p>
          </div>
          <div className={r.faq}>
            {socialFaqs.map(([q, a]) => (
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
          <p className={r.eyebrow}>Próximo passo</p>
          <h2 data-rua-type="">Vamos manter sua marca <span className={r.hi} data-hi="">sempre à vista?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte o que sua empresa oferece e onde você já publica. Voltamos com uma proposta clara.</p>
          <div className={r.ctas}>
            <Cta href={contactHref}>Quero minha marca presente</Cta>
            <Cta href="/design" line>Ver design e motion</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
