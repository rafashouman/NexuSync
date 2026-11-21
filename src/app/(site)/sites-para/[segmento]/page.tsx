import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import s from "@/components/home/SitesExperience.module.css";
import c from "@/components/home/SeoPages.module.css";
import { getSegment, planOf, segments } from "@/data/segments";
import { breadcrumbs, faqSchema, serviceSchema } from "@/lib/seo";
import { nexuSyncMetadata } from "@/lib/site-metadata";

/** Search results show about 160 characters: use the fullest version of the text that still fits. */
function segmentDescription(intro: string, plural: string) {
  const options = [
    `${intro} Site e SEO básico para ${plural}, sem prometer posição no Google.`,
    `${intro} Site e SEO básico para ${plural}, sem prometer posição.`,
    `${intro} Site e SEO básico, sem prometer posição.`,
    intro,
  ];
  const fits = options.find((text) => text.length <= 160);
  if (fits) return fits;
  // the intro alone is longer than a result snippet: cut at the last full word
  return `${intro.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

type Props = { params: Promise<{ segmento: string }> };

export function generateStaticParams() {
  return segments.map((segment) => ({ segmento: segment.slug }));
}

export async function generateMetadata({ params }: Props) {
  const segment = getSegment((await params).segmento);
  if (!segment) return {};
  const label = segment.plural.charAt(0).toUpperCase() + segment.plural.slice(1);
  return nexuSyncMetadata({
    title: `Site para ${label} com SEO Local | NexuSync`,
    description: segmentDescription(segment.intro, segment.plural),
    path: `/sites-para/${segment.slug}`,
  });
}

export default async function SegmentPage({ params }: Props) {
  const segment = getSegment((await params).segmento);
  if (!segment) notFound();

  const path = `/sites-para/${segment.slug}`;
  const contactHref = "/contato?interest=institucional&source=sites#orcamento";
  const others = segments.filter((item) => item.slug !== segment.slug);

  return (
    <div className={s.page}>
      <JsonLd data={serviceSchema({ name: `Site com SEO para ${segment.plural}`, path, serviceType: `Criação de sites e SEO básico para ${segment.plural}`, description: segment.intro })} />
      <JsonLd data={faqSchema(segment.faqs)} />
      <JsonLd data={breadcrumbs(["Criação de sites", "/criacao-de-sites"], [`Sites para ${segment.plural}`, path])} />

      <header className={s.hero}>
        <div className={s.eyebrow}><Link href="/">NEXUSYNC</Link><span>/ SITES PARA {segment.plural.toUpperCase()}</span><span>SITES SOB MEDIDA E INTERATIVOS.</span></div>
        <div className={s.heroGrid}>
          <div>
            <p className={s.kicker}>SITE E SEO PARA {segment.plural.toUpperCase()}</p>
            <h1>{segment.headline}<br /><em>{segment.accent}</em></h1>
            <p className={s.intro}>{segment.intro}</p>
            <div className={s.actions}>
              <Link className={s.button} href={contactHref}>Quero meu site <ArrowUpRight size={18} /></Link>
              <a className={s.textLink} href="#o-que-o-site-tem">Ver o que o site tem</a>
            </div>
          </div>
          <div className={c.mock} aria-hidden="true">
            <span className={c.mockTag}>EXEMPLO ILUSTRATIVO · BUSCA: “{segment.mockSearch.toUpperCase()}”</span>
            <div className={c.result} data-you="true"><span className={c.url}>seunegocio.com.br</span><span className={c.resultTitle}>{segment.mockTitle}</span><p className={c.resultText}>Título e descrição claros fazem a pessoa abrir o seu resultado.</p></div>
          </div>
        </div>
      </header>

      <section className={s.section} id="o-que-procuram">
        <div className={s.heading}>
          <div><p className={s.kicker}>O QUE AS PESSOAS PESQUISAM</p><h2>Buscas que <em>podem levar até você.</em></h2></div>
          <p>Exemplos de pesquisas comuns do segmento. Não são dados de volume: servem para mostrar o que o site precisa responder.</p>
        </div>
        <ul className={c.searches}>{segment.searches.map((term) => <li key={term}>{term}</li>)}</ul>
      </section>

      <section className={`${s.section} ${c.proof}`} id="o-que-querem-saber">
        <div className={s.heading}>
          <div><p className={s.kicker}>ANTES DE ENTRAR EM CONTATO</p><h2>O que o cliente <em>quer saber.</em></h2></div>
        </div>
        <div className={s.benefits}>
          {segment.wants.map(([name, text], index) => (
            <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className={s.section} id="paginas">
        <div className={s.heading}>
          <div><p className={s.kicker}>ESTRUTURA DO SITE</p><h2>Páginas que o site <em>precisa ter.</em></h2></div>
          <p>A estrutura final é definida na proposta, conforme o plano e o seu negócio.</p>
        </div>
        <ol className={s.steps}>
          {segment.pages.map(([name, text], index) => (
            <li key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className={`${s.section} ${c.proof}`} id="o-que-o-site-tem">
        <div className={c.nots}>
          <div>
            <p className={s.kicker}>NOS PLANOS DE SITE</p>
            <h2 style={{ margin: "24px 0" }}>O que o site <em>já tem.</em></h2>
            <p>Recursos reais dos planos da NexuSync que atendem a este segmento. O SEO básico prepara o site para ser encontrado, mas não garante posição no Google.</p>
            {segment.note && <p className={c.note}>{segment.note}</p>}
            <div className={s.actions}>
              <Link className={s.textLink} href="/criacao-de-sites#planos">Ver planos e valores <ArrowUpRight size={16} /></Link>
            </div>
          </div>
          <ul>{segment.features.map((feature) => <li key={feature}><span className={c.tag}>A PARTIR DO {planOf(feature)?.toUpperCase()}</span>{feature}</li>)}</ul>
        </div>
      </section>

      <section className={s.section} id="perguntas">
        <div className={s.faq}>
          <div><p className={s.kicker}>PERGUNTAS FREQUENTES</p><h2>Antes de decidir.</h2><p>Quer ir além do site? Veja como trabalhamos o <Link href="/seo-para-negocios-locais" style={{ color: "var(--lime)" }}>SEO para negócios locais</Link>.</p></div>
          <div>{segment.faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} /></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className={s.finalCta}>
        <p className={s.kicker}>PRÓXIMO PASSO</p>
        <Link href={contactHref}><h2>Vamos colocar<br /><em>seu negócio na busca?</em></h2><ArrowUpRight aria-hidden="true" /></Link>
        <p>Conte o que você faz e a cidade onde atende. Voltamos com uma proposta clara.</p>
        <nav className={c.others} aria-label="Outros segmentos">
          {others.map((item) => <Link key={item.slug} href={`/sites-para/${item.slug}`}>Sites para {item.plural}</Link>)}
        </nav>
      </section>
    </div>
  );
}
