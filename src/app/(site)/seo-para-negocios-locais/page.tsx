import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import s from "@/components/home/SitesExperience.module.css";
import c from "@/components/home/SeoPages.module.css";
import { marketingPlans } from "@/data/marketingPlans";
import { segments } from "@/data/segments";
import { sitePlans } from "@/data/sitePlans";
import { breadcrumbs, faqSchema, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

const path = "/seo-para-negocios-locais";
const title = "SEO para Negócios Locais: Seja Encontrado no Google | NexuSync";
const description =
  "Quem procura o seu serviço no Google precisa te encontrar. A NexuSync entrega SEO básico em todos os sites e um serviço de SEO e presença local, sem prometer posição.";

export const metadata = nexuSyncMetadata({ title, description, path });

/** Lines come straight from the real plan data, so this page can never promise more than the proposals do. */
const seoService = marketingPlans.find((plan) => plan.id === "seo-local")!;
const inSitePlans = sitePlans.flatMap((plan) => {
  const feature = plan.features.find((item) => /seo/i.test(item));
  return feature ? [{ plan: plan.name, feature }] : [];
});

const journey = [
  ["Alguém procura", "Quem precisa do seu serviço pesquisa, muitas vezes com a cidade ou o bairro junto."],
  ["O Google mostra opções", "Título e descrição claros ajudam a pessoa a escolher qual resultado abrir."],
  ["O site responde", "Ele mostra o serviço, tira a dúvida e leva ao WhatsApp ou ao formulário."],
] as const;

const steps = [
  ["Diagnóstico técnico", "Avaliamos o site e a presença da empresa nas buscas para saber de onde partir."],
  ["Prioridades", "Definimos as páginas e as melhorias que mais importam para o seu negócio."],
  ["Ajustes", "Revisamos títulos, descrições, estrutura das páginas e conteúdo."],
  ["Acompanhamento", "Seguimos os indicadores combinados na proposta e orientamos o Perfil da Empresa no Google."],
] as const;

const notPromised = [
  "Garantia de primeira posição ou de qualquer posição no Google.",
  "Prazo certo para aparecer: depende da concorrência e de como os buscadores avaliam o site.",
  "Volume de contatos ou de vendas, que varia com mercado, oferta e atendimento.",
  "Verba de anúncios e gestão de redes sociais, que são serviços separados.",
];

const faqs = [
  ["SEO é a mesma coisa que anúncio no Google?", "Não. Anúncio é pago e para quando a verba acaba. SEO trabalha o site e a presença da empresa para ela aparecer nos resultados orgânicos, sem pagar por clique. Os dois podem andar juntos, mas começamos pela base."],
  ["Meu site da NexuSync já vem com SEO?", "Os planos de site incluem a configuração de SEO descrita em cada proposta (no Presence, SEO básico para mecanismos de busca). Isso prepara o site para ser encontrado. Para um trabalho contínuo, existe o serviço de SEO e presença local, contratado à parte."],
  ["Vocês garantem a primeira posição no Google?", "Não, e desconfie de quem garante. A posição depende de concorrência, do conteúdo e de fatores dos buscadores. O que a proposta descreve são as entregas e os indicadores acompanhados."],
  ["Quanto custa o serviço de SEO e presença local?", "O valor é definido na proposta, depois do diagnóstico, porque as prioridades, as páginas e a frequência de acompanhamento mudam de empresa para empresa."],
  ["Posso contratar SEO se meu site não foi feito pela NexuSync?", "Sim. O serviço começa com o diagnóstico técnico do site que você já tem e define o que vale ajustar. Se o site precisar de mudanças maiores, a proposta diz isso com clareza."],
] as const;

const contactHref = "/contato?interest=seo&source=other#orcamento";

export default function SeoPage() {
  return (
    <div className={s.page}>
      <JsonLd data={serviceSchema({ name: "SEO e presença local", path, serviceType: "SEO para negócios locais", description: seoService.description })} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbs(["SEO para negócios locais", path])} />

      <header className={s.hero}>
        <div className={s.eyebrow}><Link href="/">NEXUSYNC</Link><span>/ SEO PARA NEGÓCIOS LOCAIS</span><span>SITES SOB MEDIDA E INTERATIVOS.</span></div>
        <div className={s.heroGrid}>
          <div>
            <p className={s.kicker}>SEO ORGÂNICO, SEM DEPENDER DE ANÚNCIO.</p>
            <h1>Quem procura o seu serviço<br /><em>precisa te encontrar.</em></h1>
            <p className={s.intro}>Um site bonito que ninguém acha não traz cliente. Preparamos seu site e sua presença nas buscas para o seu negócio aparecer quando alguém pesquisa o que você faz.</p>
            <div className={s.actions}>
              <Link className={s.button} href={contactHref}>Quero avaliar meu SEO <ArrowUpRight size={18} /></Link>
              <a className={s.textLink} href="#como-trabalhamos">Ver como trabalhamos</a>
            </div>
          </div>
          <div className={c.mock} aria-hidden="true">
            <span className={c.mockTag}>EXEMPLO ILUSTRATIVO DE BUSCA</span>
            <div className={c.result}><span className={c.url}>concorrente.com.br</span><span className={c.resultTitle}>Empresa do concorrente | Serviço na sua cidade</span><p className={c.resultText}>Descrição que diz o que faz e para quem.</p></div>
            <div className={c.result} data-you="true"><span className={c.url}>suaempresa.com.br</span><span className={c.resultTitle}>Sua empresa | Serviço na sua cidade</span><p className={c.resultText}>Título e descrição claros fazem a pessoa abrir o seu resultado.</p></div>
          </div>
        </div>
      </header>

      <section className={s.section} id="como-o-cliente-te-encontra">
        <div className={s.heading}>
          <div><p className={s.kicker}>COMO O CLIENTE TE ENCONTRA</p><h2>Três passos entre a busca <em>e o seu WhatsApp.</em></h2></div>
          <p>O SEO trabalha cada um deles, do que aparece no Google até o que o visitante encontra ao chegar.</p>
        </div>
        <div className={s.benefits}>
          {journey.map(([name, text], index) => (
            <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className={`${s.section} ${c.proof}`} id="duas-formas">
        <div className={s.heading}>
          <div><p className={s.kicker}>DUAS FORMAS DE TRABALHAR</p><h2>SEO que já vem no site <em>e SEO contínuo.</em></h2></div>
          <p>Começamos pela base. Depois, quem quer acompanhamento contratado separado tem o serviço dedicado.</p>
        </div>
        <div className={c.ways}>
          <article className={c.way} data-main="true">
            <small>JÁ VEM NOS PLANOS DE SITE</small>
            <h3>Site preparado para buscas</h3>
            <p>Todo plano de site da NexuSync inclui uma configuração de SEO, no nível descrito em cada proposta.</p>
            <ul>{inSitePlans.map(({ plan, feature }) => <li key={plan}><Check size={15} /><span><b>{plan}:</b> {feature}</span></li>)}</ul>
            <p className={c.note}>Isso prepara o site para ser encontrado. Não garante posição.</p>
          </article>
          <article className={c.way}>
            <small>SERVIÇO À PARTE</small>
            <h3>{seoService.name}</h3>
            <p>{seoService.description}</p>
            <ul>{seoService.features.map((item) => <li key={item}><Check size={15} /><span>{item}</span></li>)}</ul>
            <p className={c.note}>Valor definido na proposta, depois do diagnóstico.</p>
          </article>
        </div>
      </section>

      <section className={s.section} id="como-trabalhamos">
        <div className={s.heading}>
          <div><p className={s.kicker}>COMO TRABALHAMOS</p><h2>Do diagnóstico <em>ao acompanhamento.</em></h2></div>
        </div>
        <ol className={s.steps}>
          {steps.map(([name, text], index) => (
            <li key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className={`${s.section} ${c.proof}`} id="o-que-nao-prometemos">
        <div className={c.nots}>
          <div>
            <p className={s.kicker}>TRANSPARÊNCIA</p>
            <h2 style={{ margin: "24px 0" }}>O que a gente <em>não promete.</em></h2>
            <p>SEO honesto começa por dizer o que ele não faz. A proposta descreve entregas e indicadores, nunca um resultado garantido.</p>
          </div>
          <ul>{notPromised.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className={s.section} id="por-segmento">
        <div className={s.heading}>
          <div><p className={s.kicker}>POR SEGMENTO</p><h2>Seu tipo de negócio <em>tem página própria.</em></h2></div>
          <p>Veja o que as pessoas pesquisam e o que o site precisa ter em cada segmento.</p>
        </div>
        <nav className={c.others} aria-label="Sites por segmento">
          {segments.map((segment) => <Link key={segment.slug} href={`/sites-para/${segment.slug}`}>Sites para {segment.plural}</Link>)}
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
        <Link href={contactHref}><h2>Vamos ver como<br /><em>você aparece hoje?</em></h2><ArrowUpRight aria-hidden="true" /></Link>
        <p>Conte seu negócio e a cidade onde atende. Voltamos com uma proposta clara.</p>
      </section>
    </div>
  );
}
