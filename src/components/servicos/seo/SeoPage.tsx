import Link from "next/link";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon, SearchIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { marketingPlans } from "@/data/marketingPlans";
import { segments } from "@/data/segments";
import { sitePlans } from "@/data/sitePlans";
import { Cta, StorySteps, type StoryStep } from "../parts";
import s from "../servico.module.css";
import { MapaWorld } from "./MapaWorld";

/** Lines come straight from the real plan data, so this page can never promise more than the proposals do. */
export const seoService = marketingPlans.find((plan) => plan.id === "seo-local")!;
const inSitePlans = sitePlans.flatMap((plan) => {
  const feature = plan.features.find((item) => /seo/i.test(item));
  return feature ? [{ plan: plan.name, feature }] : [];
});
const has = (item: string) => {
  if (!seoService.features.includes(item)) throw new Error(`SEO feature not in marketingPlans: ${item}`);
  return item;
};

/** The four steps of the scene; "No serviço" lines are features of the SEO e presença local plan. */
const work: readonly StoryStep[] = [
  {
    tag: "Diagnóstico",
    title: "Primeiro, ver como você aparece hoje",
    text: "Avaliamos o site e a presença da empresa nas buscas para saber de onde partir. Sem achismo.",
    get: [has("Diagnóstico técnico do site")],
  },
  {
    tag: "Prioridades",
    title: "O que mais importa para o seu negócio",
    text: "Definimos as páginas e as melhorias que mais pesam para quem procura o que você faz, na sua cidade.",
    get: [has("Estrutura das páginas e conteúdo")],
  },
  {
    tag: "Ajustes",
    title: "Títulos, páginas e perfil no lugar",
    text: "Revisamos títulos, descrições, estrutura das páginas e conteúdo, e orientamos o Perfil da Empresa no Google.",
    get: [has("Revisão de títulos e descrições"), has("Orientações para o Perfil da Empresa no Google")],
  },
  {
    tag: "Acompanhamento",
    title: "Seguir o que foi combinado",
    text: "Acompanhamos os indicadores definidos na proposta e ajustamos a rota. Você sabe o que foi feito e por quê.",
    get: [has("Acompanhamento dos indicadores definidos na proposta")],
    note: "Não garantimos posição no Google: a proposta descreve entregas e indicadores, nunca um resultado garantido.",
  },
];

const journey = [
  ["Alguém procura", "Quem precisa do seu serviço pesquisa, muitas vezes com a cidade ou o bairro junto."],
  ["O Google mostra opções", "Título e descrição claros ajudam a pessoa a escolher qual resultado abrir."],
  ["O site responde", "Ele mostra o serviço, tira a dúvida e leva ao WhatsApp ou ao formulário."],
] as const;

const notPromised = [
  "Garantia de primeira posição ou de qualquer posição no Google.",
  "Prazo certo para aparecer: depende da concorrência e de como os buscadores avaliam o site.",
  "Volume de contatos ou de vendas, que varia com mercado, oferta e atendimento.",
  "Verba de anúncios e gestão de redes sociais, que são serviços separados.",
];

export const seoFaqs = [
  ["SEO é a mesma coisa que anúncio no Google?", "Não. Anúncio é pago e para quando a verba acaba. SEO trabalha o site e a presença da empresa para ela aparecer nos resultados orgânicos, sem pagar por clique. Os dois podem andar juntos, mas começamos pela base."],
  ["Meu site da NexuSync já vem com SEO?", "Os planos de site incluem a configuração de SEO descrita em cada proposta (no Presence, SEO básico para mecanismos de busca). Isso prepara o site para ser encontrado. Para um trabalho contínuo, existe o serviço de SEO e presença local, contratado à parte."],
  ["Vocês garantem a primeira posição no Google?", "Não, e desconfie de quem garante. A posição depende de concorrência, do conteúdo e de fatores dos buscadores. O que a proposta descreve são as entregas e os indicadores acompanhados."],
  ["Quanto custa o serviço de SEO e presença local?", "O valor é definido na proposta, depois do diagnóstico, porque as prioridades, as páginas e a frequência de acompanhamento mudam de empresa para empresa."],
  ["Posso contratar SEO se meu site não foi feito pela NexuSync?", "Sim. O serviço começa com o diagnóstico técnico do site que você já tem e define o que vale ajustar. Se o site precisar de mudanças maiores, a proposta diz isso com clareza."],
] as const;

const contactHref = "/contato?interest=seo&source=other#orcamento";

export default function SeoPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + o mapa: the rival already has a pin; diagnosis, priorities and adjustments put you on the map too */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <MapaWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>SEO para negócios locais · NexuSync</p>
          <h1>
            Quem procura o seu serviço <span className={r.hi}>precisa te encontrar.</span>
          </h1>
          <p className={r.lead}>
            Um site bonito que ninguém acha não traz cliente. Preparamos seu site e sua presença nas buscas para o seu negócio aparecer quando alguém pesquisa o que você faz. Sem depender de anúncio e sem prometer posição.
          </p>
          <div className={r.ctas}>
            <Cta href={contactHref}>Quero avaliar meu SEO</Cta>
            <Cta href="#como-trabalhamos" line>Ver como trabalhamos</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para colocar sua empresa no mapa</p>
        </div>
        <StorySteps id="como-trabalhamos" steps={work} label="Como trabalhamos o SEO" getLabel="No serviço" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="como-o-cliente-te-encontra">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Como o cliente te encontra</p>
          <div className={s.split}>
            <h2 data-rua-type="">Três passos entre a busca <span className={r.hi} data-hi="">e o seu WhatsApp.</span></h2>
            <p className={r.lead}>O SEO trabalha cada um deles, do que aparece no Google até o que o visitante encontra ao chegar.</p>
          </div>
          <div className={s.journey}>
            <div className={s.cards} data-rua-stagger="">
              {journey.map(([name, text], i) => (
                <article key={name} className={s.card}>
                  <span>0{i + 1}</span>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className={s.serp} aria-hidden="true">
              <span className={s.serpTag}>Exemplo ilustrativo de busca</span>
              <div className={s.serpQuery}><SearchIcon />serviço perto de mim</div>
              <div className={s.serpResult}><span>concorrente.com.br</span><b>Empresa do concorrente | Serviço na sua cidade</b><p>Descrição que diz o que faz e para quem.</p></div>
              <div className={s.serpResult} data-you=""><span>suaempresa.com.br</span><b>Sua empresa | Serviço na sua cidade</b><p>Título e descrição claros fazem a pessoa abrir o seu resultado.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="duas-formas">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Duas formas de trabalhar</p>
          <div className={s.split}>
            <h2 data-rua-type="">SEO que já vem no site <span className={r.hi} data-hi="">e SEO contínuo.</span></h2>
            <p className={r.lead}>Começamos pela base. Depois, quem quer acompanhamento contratado separado tem o serviço dedicado.</p>
          </div>
          <div className={s.ways} data-rua-stagger="">
            <article className={s.way} data-main="true">
              <small>Já vem nos planos de site</small>
              <h3>Site preparado para buscas</h3>
              <p>Todo plano de site da NexuSync inclui uma configuração de SEO, no nível descrito em cada proposta.</p>
              <ul className={s.feats}>
                {inSitePlans.map(({ plan, feature }) => <li key={plan}><span><b>{plan}:</b> {feature}</span></li>)}
              </ul>
              <p className={s.wayNote}>Isso prepara o site para ser encontrado. Não garante posição.</p>
            </article>
            <article className={s.way}>
              <small>Serviço à parte</small>
              <h3>{seoService.name}</h3>
              <p>{seoService.description}</p>
              <ul className={s.feats}>
                {seoService.features.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={s.wayNote}>Valor definido na proposta, depois do diagnóstico.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="o-que-nao-prometemos">
        <div className={`${r.wrap} ${r.pad} ${s.nots}`}>
          <div>
            <p className={r.eyebrow}>Transparência</p>
            <h2 data-rua-type="">O que a gente <span className={r.hi} data-hi="">não promete.</span></h2>
            <p className={r.lead}>SEO honesto começa por dizer o que ele não faz. A proposta descreve entregas e indicadores, nunca um resultado garantido.</p>
          </div>
          <ul className={s.notList} data-rua-stagger="">
            {notPromised.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="por-segmento">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Por segmento</p>
          <div className={s.split}>
            <h2 data-rua-type="">Seu tipo de negócio <span className={r.hi} data-hi="">tem página própria.</span></h2>
            <p className={r.lead}>Veja o que as pessoas pesquisam e o que o site precisa ter em cada segmento.</p>
          </div>
          <nav className={s.segs} aria-label="Sites por segmento" data-rua-stagger="">
            {segments.map((segment) => <Link key={segment.slug} href={`/sites-para/${segment.slug}`}>Sites para {segment.plural} <ArrowIcon /></Link>)}
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
            {seoFaqs.map(([q, a]) => (
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
          <h2 data-rua-type="">Vamos ver como <span className={r.hi} data-hi="">você aparece hoje?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte seu negócio e a cidade onde atende. Voltamos com uma proposta clara.</p>
          <div className={r.ctas}>
            <Cta href={contactHref}>Quero avaliar meu SEO</Cta>
            <Cta href="/criacao-de-sites" line>Ainda não tenho site</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
