import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import s from "@/components/home/SitesExperience.module.css";
import c from "@/components/home/SeoPages.module.css";
import { marketingAddons, marketingPlans } from "@/data/marketingPlans";
import { breadcrumbs, faqSchema, serviceSchema } from "@/lib/seo";
import { formatBRL, waLink } from "@/lib/site-config";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/redes-sociais";
const title = "Gestão de Redes Sociais para Pequenas Empresas | NexuSync";

/** Everything below comes from the real Presença Ativa plan, so the page never promises more than the proposal. */
const plan = marketingPlans.find((item) => item.id === "presenca-ativa")!;
const socialAddons = marketingAddons.slice(0, 2);

const description = "Organizamos conteúdo, legendas e publicações para Instagram e Facebook com o plano Presença Ativa: calendário, artes, stories e relatório mensal, sem prometer alcance.";

export const metadata = nexuSyncMetadata({ title, description, path });

const reasons = [
  ["Quem já te conhece olha", "Clientes e indicações costumam passar pelo seu perfil antes de chamar. Um perfil atualizado responde a primeira dúvida."],
  ["Constância mantém a empresa lembrada", "Publicar com frequência combinada evita meses de silêncio e mantém sua oferta à vista."],
  ["O conteúdo leva ao contato", "Cada publicação pode apresentar um serviço ou uma novidade e apontar para o site ou para o WhatsApp."],
] as const;

const steps = [
  ["Briefing e acessos", "Reunimos sua identidade visual, informações, fotos e os acessos necessários."],
  ["Calendário do mês", "Organizamos os temas e as datas das publicações para você aprovar."],
  ["Publicações e stories", "Criamos as artes e legendas, adaptamos para stories e agendamos."],
  ["Relatório mensal", "Mostramos o que foi publicado e ajustamos o próximo ciclo."],
] as const;

const notPromised = [
  "Número de seguidores, alcance ou vendas: variam com mercado, oferta e atendimento.",
  ...plan.exclusions.map((item) => `${item} não fazem parte do plano.`),
];

const faqs = [
  ["O plano inclui responder mensagens e comentários?", "Não. O Presença Ativa inclui calendário, legendas e publicações para Instagram e Facebook. Atendimento de mensagens, respostas diárias a comentários, filmagem e edição de reels e anúncios não fazem parte desse plano."],
  ["Vocês gravam os vídeos?", "Não gravamos. O complemento de dois reels simples usa material enviado por você, com até 30 segundos cada e uma revisão."],
  ["O que eu preciso enviar?", "Identidade visual, informações sobre a empresa, fotos e as aprovações das publicações. Uma adaptação para stories não é uma criação inédita."],
  ["Posso contratar redes sociais sem ter site?", "Pode. Mas o site e o SEO são a base: é para lá que as publicações levam quem quer saber mais. Por isso trabalhamos a presença online primeiro e as redes em seguida."],
  ["Quando o trabalho começa?", `${plan.onboardingTime}.`],
] as const;

const contactHref = `/contato?interest=${plan.id}&source=other#orcamento`;

export default function SocialPage() {
  return (
    <div className={s.page}>
      <JsonLd data={serviceSchema({ name: "Gestão de redes sociais", path, serviceType: "Gestão de Instagram e Facebook para pequenas empresas", description })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbs(["Marketing", "/marketing"], ["Gestão de redes sociais", path])} />

      <header className={s.hero}>
        <div className={s.eyebrow}><Link href="/">NEXUSYNC</Link><span>/ REDES SOCIAIS</span><span>CONSTÂNCIA QUE MANTÉM VOCÊ LEMBRADO.</span></div>
        <div className={s.heroGrid}>
          <div>
            <p className={s.kicker}>GESTÃO DE REDES SOCIAIS</p>
            <h1>Perfil parado parece<br /><em>empresa parada.</em></h1>
            <p className={s.intro}>Falta tempo para manter as redes atualizadas? Organizamos conteúdo, legendas e publicações para apresentar sua oferta com frequência e clareza.</p>
            <div className={s.actions}>
              <Link className={s.button} href={contactHref}>Quero minha marca presente <ArrowUpRight size={18} /></Link>
              <a className={s.textLink} href="#plano">Ver o que está incluído</a>
            </div>
          </div>
          <div className={c.mock} aria-hidden="true">
            <span className={c.mockTag}>EXEMPLO ILUSTRATIVO · 8 PUBLICAÇÕES NO MÊS</span>
            <div className={c.calendar}>
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className={c.calendarCell} data-carousel={index === 2 || index === 5}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {(index === 2 || index === 5) && <i>carrossel</i>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className={s.section} id="por-que-manter">
        <div className={s.heading}>
          <div><p className={s.kicker}>POR QUE MANTER AS REDES</p><h2>O perfil é a vitrine <em>de quem já te conhece.</em></h2></div>
          <p>As redes não substituem o site nem o SEO. Elas mantêm perto quem já ouviu falar de você.</p>
        </div>
        <div className={s.benefits}>
          {reasons.map(([name, text], index) => (
            <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className={`${s.section} ${c.proof}`} id="plano">
        <div className={s.heading}>
          <div><p className={s.kicker}>O PLANO</p><h2>{plan.name}, <em>com entregas definidas.</em></h2></div>
          <p>{plan.idealFor}. O escopo completo é confirmado na proposta antes de começarmos.</p>
        </div>
        <div className={c.ways}>
          <article className={c.way} data-main="true">
            <small>PLANO MENSAL</small>
            <h3>{plan.name}</h3>
            <p><b style={{ color: "var(--paper)", fontSize: 28, fontWeight: 550 }}>{formatBRL(plan.monthlyPriceCents ?? 0)}/mês</b><br />mais {formatBRL(plan.setupPriceCents ?? 0)} de implantação</p>
            <ul>{plan.features.map((item) => <li key={item}><Check size={15} /><span>{item}</span></li>)}</ul>
            <p className={c.note}>{plan.onboardingTime}.</p>
            <div className={s.actions}>
              <a className={s.button} href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer" data-analytics-section="redes-sociais" data-analytics-interest={plan.id}>{plan.buttonText} <ArrowUpRight size={18} /></a>
              <Link className={s.textLink} href={contactHref}>Prefiro o formulário</Link>
            </div>
          </article>
          <article className={c.way}>
            <small>COMPLEMENTOS</small>
            <h3>Se precisar de mais</h3>
            <p>Itens opcionais, contratados junto do plano.</p>
            <ul>{socialAddons.map((addon) => <li key={addon.name}><Check size={15} /><span><b>{addon.name}</b> ({addon.price}). {addon.scope}</span></li>)}</ul>
            <p className={c.note}>Importante: {plan.details.join(" ")}</p>
          </article>
        </div>
      </section>

      <section className={s.section} id="como-trabalhamos">
        <div className={s.heading}>
          <div><p className={s.kicker}>COMO TRABALHAMOS</p><h2>Do briefing <em>ao relatório do mês.</em></h2></div>
        </div>
        <ol className={s.steps}>
          {steps.map(([name, text], index) => (
            <li key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className={`${s.section} ${c.proof}`} id="o-que-nao-esta-incluido">
        <div className={c.nots}>
          <div>
            <p className={s.kicker}>TRANSPARÊNCIA</p>
            <h2 style={{ margin: "24px 0" }}>O que o plano <em>não inclui.</em></h2>
            <p>Dizer o que fica de fora evita surpresa. A proposta descreve entregas e indicadores, nunca um resultado garantido.</p>
          </div>
          <ul>{notPromised.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className={s.section} id="pilares">
        <div className={s.heading}>
          <div><p className={s.kicker}>NA ORDEM CERTA</p><h2>As redes funcionam melhor <em>com a base pronta.</em></h2></div>
          <p>Trabalhamos em quatro pilares, nessa ordem. As redes são o terceiro: vêm depois da presença online e do design, e antes do tráfego pago.</p>
        </div>
        <nav className={c.others} aria-label="Outros pilares">
          <Link href="/seo-para-negocios-locais">1. Presença online e SEO</Link>
          <Link href="/design">2. Design e motion graphics</Link>
          <Link href="/marketing#marketing-aquisicao-local">4. Tráfego pago</Link>
        </nav>
      </section>

      <section className={s.section} id="perguntas">
        <div className={s.faq}>
          <div><p className={s.kicker}>PERGUNTAS FREQUENTES</p><h2>Antes de decidir.</h2><p>Se a sua dúvida não estiver aqui, pergunte pelo WhatsApp ou pelo formulário.</p></div>
          <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} /></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className={s.finalCta}>
        <p className={s.kicker}>PRÓXIMO PASSO</p>
        <Link href={contactHref}><h2>Vamos manter sua marca<br /><em>sempre à vista?</em></h2><ArrowUpRight aria-hidden="true" /></Link>
        <p>Conte o que sua empresa oferece e onde você já publica. Voltamos com uma proposta clara.</p>
      </section>
    </div>
  );
}
