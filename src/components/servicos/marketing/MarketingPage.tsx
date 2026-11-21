import Link from "next/link";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { marketingFaqs } from "@/data/marketingFaqs";
import { marketingAddons, marketingMicrocopy, marketingPlans } from "@/data/marketingPlans";
import { publicPriceCents } from "@/lib/public-pricing";
import { waLink } from "@/lib/site-config";
import { Cta, StorySteps, type StoryStep } from "../parts";
import s from "../servico.module.css";
import { PlanCta } from "./PlanCta";
import { TrafegoWorld } from "./TrafegoWorld";

/** The scene tells the paid-traffic plan; its lines come from the real Aquisição Local features. */
const ads = marketingPlans.find((plan) => plan.id === "aquisicao-local")!;
const has = (item: string) => {
  if (!ads.features.includes(item)) throw new Error(`Feature not in Aquisição Local: ${item}`);
  return item;
};

const story: readonly StoryStep[] = [
  {
    tag: "Objetivo",
    title: "Primeiro, o que a campanha precisa trazer",
    text: "Conhecemos sua oferta, seu público e seu atendimento. Um objetivo claro vem antes de qualquer anúncio.",
    get: [has("Uma marca/unidade e uma plataforma (Meta Ads ou Google Ads)")],
  },
  {
    tag: "Direção",
    title: "Os canais certos para quem compra de você",
    text: "Escolhemos entre busca e redes conforme o objetivo, e definimos campanhas e variações de anúncio.",
    get: [has("Até 2 campanhas simultâneas"), has("Até 4 variações mensais de anúncios")],
  },
  {
    tag: "Campanha no ar",
    title: "Sua oferta para além de quem já conhece você",
    text: "Os anúncios levam pessoas com potencial de compra até o seu site ou WhatsApp, onde a conversa começa.",
    get: [has("Conversões compatíveis com o site existente")],
  },
  {
    tag: "Acompanhamento",
    title: "Ajustar com base no que acontece",
    text: "Revisamos as campanhas toda semana e mostramos o resultado do mês, com uma conversa para decidir os próximos passos.",
    get: [has("Revisão semanal e relatório mensal"), has("Reunião mensal de até 30 minutos")],
    note: "A verba de anúncios é paga diretamente à plataforma e fica fora da mensalidade. Resultados variam conforme mercado, oferta, investimento e atendimento.",
  },
];

const services = [
  ["Redes sociais", "Presença que faz sentido para sua marca.", "Planejamento, legendas, peças e agendamento para Instagram e Facebook conforme o plano. Atendimento de mensagens e produção de vídeos têm escopo separado.", "presenca-ativa"],
  ["SEO e presença local", "Sua empresa no caminho de quem procura.", "Diagnóstico e melhorias na estrutura do site, conteúdo e presença nas buscas. Prioridades e entregas definidas na proposta.", "seo-local"],
  ["Tráfego pago", "Sua oferta para além de quem já conhece você.", "Criamos e acompanhamos anúncios para alcançar pessoas com potencial de compra e facilitar o contato. A verba de mídia é separada da gestão.", "aquisicao-local"],
  ["Leads e automações", "Cada contato com um próximo passo.", "Organização de etapas e retornos conforme o plano. Integrações e automações passam por avaliação de compatibilidade.", "crescimento-integrado"],
] as const;

const flow = [
  ["01", "Descobrir", "Sua oferta encontra o público."],
  ["02", "Entender", "Uma página explica seu valor."],
  ["03", "Conversar", "O atendimento dá continuidade."],
] as const;

export default function MarketingPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + o tráfego: cars pass by, ads make some of them stop at your door */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <TrafegoWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>Marketing e tráfego pago · NexuSync</p>
          <h1>
            Sua oferta merece <span className={r.hi}>ser encontrada.</span>
          </h1>
          <p className={r.lead}>
            Fortaleça sua presença, atraia oportunidades ou conecte toda a operação. Entregas definidas, acompanhamento próximo e investimento transparente.
          </p>
          <div className={r.ctas}>
            <Cta href="/contato?interest=trafego-pago&source=other#orcamento">Quero divulgar meu negócio</Cta>
            <Cta href="#planos-marketing" line>Ver planos e valores</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para ver uma campanha no ar</p>
        </div>
        <StorySteps id="marketing-processo" steps={story} label="Como funciona uma campanha" getLabel="No plano Aquisição Local" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="servicos-marketing">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>O canal certo começa com o objetivo certo</p>
          <div className={s.split}>
            <h2 data-rua-type="">Estar presente. <span className={r.hi} data-hi="">Fazer conexão.</span></h2>
            <p className={r.lead}>Gestão de redes sociais, anúncios no Google e na Meta, SEO e presença local para sua empresa. Conheça as entregas e escolha o próximo passo.</p>
          </div>
          <div className={s.formats} data-rua-stagger="">
            {services.map(([title, sub, text, id], i) => (
              <a key={id} className={s.format} href={`#marketing-${id}`}>
                <span className={s.formatN}>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p className={s.formatSub}>{sub}</p>
                  <p>{text}</p>
                </div>
                <em aria-hidden="true"><ArrowIcon /></em>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="conexao">
        <div className={`${r.wrap} ${r.pad} ${s.journey}`}>
          <div>
            <p className={r.eyebrow}>O anúncio é parte do caminho</p>
            <h2 data-rua-type="">Entre conhecer sua empresa <span className={r.hi} data-hi="">e chamar você.</span></h2>
            <p className={r.lead}>Quando o cliente não entende sua oferta ou não encontra como falar com você, a oportunidade pode passar. Um bom site combina informação, confiança e caminhos claros para o cliente dar o próximo passo.</p>
            <div className={r.ctas} style={{ marginTop: 26 }}>
              <Cta href="/criacao-de-sites">Conhecer páginas para campanhas</Cta>
            </div>
          </div>
          <div className={s.flow} data-rua-stagger="">
            {flow.map(([n, title, text]) => (
              <div key={n}><b>{n}</b><div><strong>{title}</strong><p>{text}</p></div></div>
            ))}
            <Link className={s.textLink} href="/design">Sua marca também precisa de uma nova apresentação? Explore o design <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="planos-marketing">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Planos mensais para pequenos e médios negócios</p>
          <div className={s.split}>
            <h2 data-rua-type="">Seu próximo passo <span className={r.hi} data-hi="">começa com um plano.</span></h2>
            <p className={r.lead}>Fortaleça sua presença, atraia oportunidades ou conecte toda a operação. Entregas definidas, acompanhamento próximo e investimento transparente.</p>
          </div>
          <div className={`${s.plans} ${s.plans4}`}>
            {marketingPlans.map((plan) => (
              <article key={plan.id} id={`marketing-${plan.id}`} className={s.plan} data-featured={plan.highlight}>
                <header>
                  <span>{plan.idealFor}</span>
                  {plan.badge && <span className={s.badge}>{plan.badge}</span>}
                </header>
                <h3>{plan.name}</h3>
                <p className={s.planDesc}>{plan.description}</p>
                <div className={s.price}>
                  <small>Gestão mensal</small>
                  <strong>{publicPriceCents(plan.monthlyPriceCents)}{plan.monthlyPriceCents !== null && plan.monthlyPriceCents <= 90000 && <small> /mês</small>}</strong>
                  <span>{plan.setupPriceCents === null ? "Implantação sob consulta" : `+ ${publicPriceCents(plan.setupPriceCents)} de implantação única`}</span>
                  <span>{plan.onboardingTime}</span>
                </div>
                <ul className={s.feats}>
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <details className={s.scopeBox}>
                  <summary>Detalhes e limites do escopo</summary>
                  {plan.details.map((detail) => <p key={detail}>{detail}</p>)}
                  <h4>Não inclui</h4>
                  <ul>{plan.exclusions.map((item) => <li key={item}>{item}</li>)}</ul>
                </details>
                <PlanCta id={plan.id} featured={plan.highlight}>{plan.buttonText}</PlanCta>
                <a className={s.planWa} href={waLink(plan.waMessage)} target="_blank" rel="noopener noreferrer" data-analytics-section="planos-marketing" data-analytics-interest={plan.id}>
                  Conversar pelo WhatsApp <ArrowIcon />
                </a>
              </article>
            ))}
          </div>
          <p className={s.micro}>{marketingMicrocopy}</p>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="complementos">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Complementos conforme sua necessidade</p>
          <div className={s.split}>
            <h2 data-rua-type="">Conecte o que falta. <span className={r.hi} data-hi="">Na medida certa.</span></h2>
            <p className={r.lead}>Combine serviços conforme o objetivo do projeto. Cada complemento tem entregas e investimento definidos no próprio escopo.</p>
          </div>
          <div className={s.addons} data-rua-stagger="">
            {marketingAddons.map((addon) => (
              <article key={addon.name}>
                <div><h3>{addon.name}</h3><p>{addon.scope}</p></div>
                <span>{addon.price}</span>
              </article>
            ))}
          </div>
          <aside className={s.custom}>
            <div>
              <h3>Prefere gerenciar as próprias publicações?</h3>
              <p>Conheça o ArcSync e explore uma solução para organizar sua presença digital.</p>
            </div>
            <Cta href="/arcsync" line>Conhecer o ArcSync</Cta>
          </aside>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="faq">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Antes de começar</p>
            <h2 data-rua-type="">Investimento claro. <span className={r.hi} data-hi="">Expectativas alinhadas.</span></h2>
            <p className={r.lead}>Entenda a gestão de redes sociais, os anúncios, as melhorias de SEO e o acompanhamento das campanhas.</p>
          </div>
          <div className={r.faq}>
            {marketingFaqs.map(({ q, a }) => (
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
          <h2 data-rua-type="">Vamos encontrar <span className={r.hi} data-hi="">seu próximo caminho?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte sobre sua oferta, seu público e o que quer melhorar no digital.</p>
          <div className={r.ctas}>
            <Cta href="/contato?interest=nao-sei&source=other#orcamento">Pedir minha proposta</Cta>
            <Cta href="/seo-para-negocios-locais" line>Começar pelo SEO</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
