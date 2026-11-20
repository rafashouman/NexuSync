import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import { AppPlayground, DesignPlayground } from "./CreativePlayground";
import { ChaosAppDirectory } from "./ChaosAppDirectory";
import { MotionSample } from "./MotionSample";
import { ServiceOffers } from "./ServiceOffers";
import { appFaqs } from "@/data/appFaqs";
import { designFaqs } from "@/data/designFaqs";
import s from "./SitesExperience.module.css";
import c from "./CreativeExperience.module.css";

const content = {
  apps: {
    label: "SISTEMAS WEB & AUTOMAÇÕES", kicker: "SEU NEGÓCIO CRESCEU.", title: "Sua rotina pode", accent: "ficar mais simples.",
    intro: "Horários para confirmar, pedidos para acompanhar e informações para localizar. Começamos pelo processo que toma seu tempo e definimos uma solução que sua equipe consiga usar no dia a dia.",
    cta: "Quero simplificar minha operação", interest: "automacoes", section: "apps", objective: "Qual parte da rotina", objectiveAccent: "precisa de organização?",
    pain: "Horários e confirmações dependem de mensagens e anotações. Sua equipe registra a mesma informação em mais de um lugar. É difícil saber o que está pendente e quem precisa de retorno.",
    formats: [
      ["Agendamentos", "Organize serviços e solicitações de horário. No plano básico, sua empresa confirma a solicitação; avisos automáticos dependem do escopo.", "/chronos", "Experimentar a agenda"],
      ["Gestão web", "Centralize cadastros, pedidos, tarefas e indicadores em uma aplicação feita para os processos definidos com você.", "/pulsemetrics", "Explorar um painel"],
      ["Mini Apps & Gamificação", "Experiências interativas que rodam no navegador para apresentar uma campanha, organizar a participação e divulgar ofertas ou cupons.", "/pulsespin", "Testar uma experiência"],
    ],
    steps: [
      ["Entendemos sua rotina", "Começamos pelo processo que toma seu tempo e pelo que sua equipe precisa realizar."],
      ["Definimos o fluxo", "Combinamos as funções, as integrações previstas e o que cada pessoa poderá acessar."],
      ["Criamos e testamos", "Apresentamos a solução para revisar o uso e realizar os ajustes contratados."],
      ["Publicamos e orientamos", "Configuramos a publicação e orientamos sua equipe sobre o fluxo entregue."],
    ],
  },
  design: {
    label: "DESIGN & IDENTIDADE VISUAL", kicker: "SUA EMPRESA MERECE SER VISTA E LEMBRADA.", title: "Personalidade que", accent: "ganha movimento.",
    intro: "Seu cliente precisa reconhecer sua marca e entender sua oferta. Motion graphics para dar vida a ela, além de identidade visual, peças digitais e interfaces, com entregas definidas antes de começarmos.",
    cta: "Quero valorizar minha marca", interest: "design", section: "media", objective: "O que sua comunicação", objectiveAccent: "precisa resolver agora?",
    pain: "Cada material parece pertencer a uma empresa diferente. Sua marca mudou e o visual ainda não acompanhou. As telas do seu projeto dificultam entender o próximo passo.",
    formats: [
      ["Motion graphics", "Sua marca em movimento. Animações para apresentar sua oferta, valorizar uma campanha e dar vida à sua identidade. Formatos, duração e aplicações definidos na proposta.", "#motion-graphics", "Ver um exemplo"],
      ["Identidade visual", "Logotipo, cores, tipografia e orientações de aplicação conforme o pacote. Para construir uma base consistente de marca.", "#portfolio-design", "Explorar aplicações"],
      ["Interfaces para sites e apps", "Organização das telas e dos caminhos de uso. Desenvolvimento e programação são definidos separadamente do projeto de design.", "/criacao-de-sites", "Conhecer o desenvolvimento web"],
    ],
    steps: [
      ["Entendemos sua marca", "Reunimos referências, objetivos e materiais existentes."],
      ["Definimos a direção", "Definimos peças, formatos e aplicações necessárias."],
      ["Criamos e apresentamos", "Apresentamos a criação e realizamos as revisões contratadas."],
      ["Entregamos os arquivos", "Entregamos os arquivos e orientações previstos no pacote."],
    ],
  },
} as const;

export default function CreativeExperience({ kind }: { kind: keyof typeof content }) {
  const item = content[kind];
  const apps = kind === "apps";
  const quote = `/contato?interest=${item.interest}&source=${item.section}#orcamento`;
  const faqs = apps ? appFaqs : designFaqs;
  const offersId = apps ? "aplicacoes" : "midias-digitais";
  return <div className={`${s.page} ${c.creative}`}>
    <section className={s.hero}>
      <div className={s.eyebrow}><Link href="/">NEXUSYNC</Link><span>/ {item.label}</span><span>CRIATIVIDADE COM DIREÇÃO ↘</span></div>
      <div className={s.heroGrid}><div><p className={s.kicker}>{item.kicker}</p><h1>{item.title}<br /><em>{item.accent}</em></h1><p className={s.intro}>{item.intro}</p><div className={s.actions}><Link href={quote} className={s.button}>{item.cta}<ArrowUpRight size={18} /></Link><a href={apps ? "#todos-os-aplicativos" : "#motion-graphics"} className={s.textLink}>{apps ? "Experimentar as soluções" : "Explorar possibilidades"}<ArrowDown size={15} /></a></div></div>{apps ? <AppPlayground /> : <DesignPlayground />}</div>
      <div className={s.attributes}><span>01 / {apps ? "Aplicações no navegador" : "Motion graphics"}</span><span>02 / {apps ? "Adaptadas ao celular" : "Identidade com personalidade"}</span><span>03 / {apps ? "Feitas para sua rotina" : "Interfaces para sites e apps"}</span></div>
    </section>
    <nav className={s.sectionNav} aria-label="Nesta página"><a href="#objetivo">Seu objetivo</a><a href="#solucoes">{apps ? "Soluções" : "Possibilidades"}</a><a href={apps ? "#todos-os-aplicativos" : "#portfolio-design"}>{apps ? "Aplicativos e demos" : "Portfólio"}</a><a href="#processo">Processo</a><a href={`#${offersId}`}>Planos e entregas</a><a href="#faq">Dúvidas</a></nav>
    <section className={s.section} id="objetivo"><p className={s.kicker}>01 / COMEÇAMOS PELO QUE IMPORTA</p><div className={s.heading}><h2>{item.objective}<br /><em>{item.objectiveAccent}</em></h2><div><p>{item.pain}</p><p>{apps ? "Desenvolvemos sistemas web e automações para tornar sua operação mais prática e organizada." : "Design para valorizar sua marca e sua oferta."}</p></div></div></section>
    <section className={s.formatsSection} id="solucoes"><div className={s.section}><p className={s.kicker}>02 / {apps ? "MENOS TAREFAS REPETITIVAS. MAIS POSSIBILIDADES." : "COERÊNCIA EM CADA PONTO DE CONTATO."}</p><h2>{apps ? "Do atendimento" : "Da primeira impressão"}<br /><em>{apps ? "à operação." : "à marca que fica."}</em></h2><div className={c.solutionRows}>{item.formats.map(([title, text, href, label], i) => <article key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><Link href={href}>{label}<ArrowUpRight size={18} /></Link></article>)}</div></div></section>
    {apps ? <section className={s.section} id="todos-os-aplicativos"><div className={s.heading}><div><p className={s.kicker}>03 / EXPERIMENTE ANTES DE IMAGINAR O SEU</p><h2>Ideias que você<br /><em>pode testar.</em></h2></div><p>Todos os aplicativos e demonstrações em um só lugar. Abra uma experiência, explore o fluxo e compartilhe a referência para o seu projeto.</p></div><ChaosAppDirectory /></section> : <>
      <section className={c.motionSection} id="motion-graphics"><div><p className={s.kicker}>MOVIMENTO COM PROPÓSITO</p><h2>Sua marca<br />entra em cena.<br /><em>E deixa sua impressão.</em></h2><p>Uma identidade pode ganhar ritmo, transições e novas formas de se apresentar. Criamos motion graphics para aplicações digitais, campanhas e apresentações.</p><Link href="/contato?interest=design&source=media#orcamento" className={s.button}>Conversar sobre uma animação<ArrowUpRight size={18} /></Link><small>Formato, duração, som, revisões e arquivos finais definidos na proposta. Orçamento sob medida.</small></div><MotionSample /></section>
      <section className={s.section} id="portfolio-design"><div className={s.heading}><div><p className={s.kicker}>03 / DESIGN APLICADO</p><h2>Uma linguagem.<br /><em>Muitas possibilidades.</em></h2></div><p>Identidades e aplicações visuais do portfólio. A direção de cada projeto parte da personalidade da marca e do que ela precisa comunicar.</p></div><div className={c.portfolio}>{[["/images/port-iv/bela-juba-com-bg.jpg", "Bela Juba", "Identidade visual"], ["/images/port-dg/aw-cartao.jpg", "Aheadworks", "Aplicação de marca"], ["/images/port-dg/bargento-cardapio.jpg", "Bargento", "Design de cardápio"]].map(([src, name, category]) => <figure key={src}><div><Image src={src} alt={`${name} — ${category}`} width={800} height={600} sizes="(max-width: 760px) 100vw, 33vw" /></div><figcaption><span>{category}</span><h3>{name}</h3></figcaption></figure>)}</div></section>
    </>}
    <section className={s.section} id="processo"><p className={s.kicker}>04 / DO PRIMEIRO CONTATO À ENTREGA</p><h2>Uma direção clara.<br /><em>Em cada etapa.</em></h2><ol className={s.steps}>{item.steps.map(([title, text], i) => <li key={title}><span>0{i + 1}<ArrowUpRight size={20} /></span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
    <section className={s.plansSection} id={offersId}><div className={s.section}><p className={s.kicker}>05 / ESCOPO CLARO. ENTREGAS DEFINIDAS.</p><div className={s.heading}><h2>{apps ? "Soluções para" : "Design para"}<br /><em>{apps ? "o seu próximo passo." : "a sua próxima fase."}</em></h2><p>{apps ? "O formato e as funções são definidos conforme o processo que sua empresa precisa melhorar." : "Escolha entre peças digitais, identidade visual e telas para sites e aplicativos, com entregas definidas em cada pacote. Motion graphics recebe orçamento próprio."}</p></div><ServiceOffers kind={kind} /></div></section>
    <section className={`${s.section} ${s.faq}`} id="faq"><div><p className={s.kicker}>06 / ANTES DE COMEÇAR</p><h2>Perguntas claras.<br /><em>Decisões melhores.</em></h2><p>Confira o que cada formato pode incluir. A proposta confirma as entregas, os prazos e as condições antes de começarmos.</p></div><div>{faqs.map(({ q, a }) => <details key={q}><summary>{q}<Plus size={18} /></summary><p>{a}</p></details>)}</div></section>
    <section className={s.finalCta}><p className={s.kicker}>A PRÓXIMA CONEXÃO COMEÇA COM UMA CONVERSA.</p><Link href={quote}><h2>{apps ? "Vamos simplificar" : "Vamos dar vida"}<br /><em>{apps ? "sua operação?" : "à sua marca?"}</em></h2><ArrowUpRight /></Link><p>{apps ? "Tem uma rotina que precisa melhorar? Conte como ela funciona." : "Conte sua ideia, suas referências e o que sua marca precisa comunicar."}</p></section>
  </div>;
}
