import Link from "next/link";
import { ArrowUpRight, ArrowDown, Plus, Globe2, MousePointer2, Smartphone } from "lucide-react";
import { ExperienceVisual, type ExperienceKind } from "./ExperienceVisual";
import { SitesPlayground } from "./SitesPlayground";
import { SitesPlans } from "./SitesPlans";
import s from "./SitesExperience.module.css";

const formats = [
  ["01", "Landing pages", "Do anúncio ao pedido de orçamento.", "Anunciar não basta se o visitante sai sem entender sua oferta. Reunimos benefícios, respostas e botões de contato em uma página focada no próximo passo.", "landing-page"],
  ["02", "Sites institucionais", "Confiança antes da primeira conversa.", "Evite explicar tudo do zero a cada contato. Apresente sua empresa, seus serviços e diferenciais em um só lugar para o cliente chegar à conversa mais informado.", "institucional"],
  ["03", "Hotsites dinâmicos", "Sua campanha com um destino claro.", "Vai lançar um produto, divulgar um evento ou abrir inscrições? Dê à sua ação uma página própria, com informações e recursos definidos para o objetivo da campanha.", "hotsite"],
];
const faqs = [
  ["O site vai aparecer no Google?", "O projeto inclui a configuração de SEO descrita na proposta. Indexação e posições nas pesquisas dependem também dos mecanismos de busca, da concorrência e da continuidade do trabalho de conteúdo e divulgação."],
  ["Quanto custa e quanto tempo leva?", "Os planos apresentam preços e estimativas para os respectivos escopos. O prazo depende dos materiais e das aprovações. A proposta confirma as páginas, os recursos, as revisões e os custos recorrentes."],
  ["Posso atualizar o conteúdo depois?", "As possibilidades de edição e manutenção dependem da solução contratada. Combinamos quem fará as atualizações e quais recursos de administração serão entregues."],
  ["Vocês reformulam sites existentes?", "Sim. Primeiro avaliamos o site atual, seu conteúdo e as funcionalidades necessárias. A proposta define o que será aproveitado e quais páginas e recursos precisam ser refeitos."],
  ["Preciso fornecer textos, fotos e logotipo?", "Reunimos seus materiais no início e definimos o que você fornece. Produção de conteúdo, imagens, identidade visual, domínio e hospedagem precisam estar previstos na proposta."],
];
const steps = [
  ["Entendemos seu negócio", "Entendemos seus serviços e o público que você atende."],
  ["Definimos a proposta", "Definimos páginas, conteúdos, investimento e prazo."],
  ["Criamos e apresentamos", "Criamos a experiência para sua revisão e ajustes previstos."],
  ["Publicamos seu site", "Conferimos os recursos contratados e orientamos a publicação."],
];

const quote = (interest: string) => `/contato?interest=${interest}&source=sites#orcamento`;

export default function SitesExperience() {
  return <div className={s.page}>
    <section className={s.hero}>
      <div className={s.eyebrow}><Link href="/">NEXUSYNC</Link><span>/ CRIAÇÃO DE SITES</span><span>01 — PRESENÇA DIGITAL</span></div>
      <div className={s.heroGrid}><div><p className={s.kicker}>SEU NEGÓCIO FAZ UM BOM TRABALHO.</p><h1>Seu site precisa<br /><em>mostrar isso.</em></h1><p className={s.intro}>Quando alguém recebe uma indicação e pesquisa sua empresa, encontra motivos para entrar em contato? Reunimos sua oferta, seus diferenciais e os caminhos de atendimento em um site pensado para o seu negócio.</p><div className={s.actions}><Link className={s.button} href={quote("institucional")}>Quero um site profissional <ArrowUpRight size={20} /></Link><a className={s.textLink} href="#sites-formatos">Encontrar meu formato <ArrowDown size={16} /></a></div></div><SitesPlayground /></div>
      <div className={s.attributes}><span><Globe2 />Sua marca, na internet</span><span><Smartphone />Design responsivo</span><span><MousePointer2 />Caminhos claros para o contato</span></div>
    </section>
    <nav className={s.sectionNav} aria-label="Nesta página"><a href="#sites-necessidades">Seu objetivo</a><a href="#sites-formatos">Formatos</a><a href="#lojas-virtuais">Lojas virtuais</a><a href="#templates">Exemplos</a><a href="#sites-processo">Processo</a><a href="#planos">Planos e valores</a><a href="#faq">Dúvidas</a></nav>

    <section className={s.section} id="sites-necessidades"><p className={s.kicker}>01 / O PRIMEIRO CONTATO JÁ COMEÇOU.</p><div className={s.heading}><h2>O cliente chega<br />com dúvidas.<br /><em>Seu site responde.</em></h2><div><p>Seus serviços estão espalhados entre posts e mensagens. O site antigo já não representa a qualidade do seu trabalho. Quem visita pelo celular demora a encontrar como falar com você.</p><p>Facilite o caminho entre conhecer sua empresa e falar com você.</p></div></div><div className={s.benefits}>{[["Mostre por que escolher você", "Ajude o cliente a reconhecer o problema que você resolve e a entender o valor do seu serviço."], ["Encurte o caminho até o orçamento", "Botões visíveis de WhatsApp e formulário ajudam o visitante interessado a falar com você sem procurar."], ["Passe confiança desde o início", "Uma apresentação organizada ajuda quem ainda não conhece sua empresa a avaliar seus serviços com segurança."]].map(([title, text], i) => <article key={title}><span>0{i + 1} <ArrowUpRight size={18} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className={s.formatsSection} id="sites-formatos"><div className={s.section}><p className={s.kicker}>02 / UM FORMATO PARA CADA OBJETIVO</p><h2>Não é só estar online.<br /><em>É fazer sentido.</em></h2><div className={s.formats}>{formats.map(([n, title, subtitle, text, interest]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><h4>{subtitle}</h4><p>{text}</p></div><Link href={quote(interest)} aria-label={`Solicitar orçamento de ${title}`}><ArrowUpRight /></Link></article>)}</div></div></section>

    <section className={s.shop} id="lojas-virtuais"><div><p className={s.kicker}>LOJAS VIRTUAIS / CATÁLOGOS / CARDÁPIOS</p><h2>Uma vitrine própria.<br /><em>Sempre à mostra.</em></h2><p>Reúna produtos, preços e formas de pedido em um catálogo, cardápio digital ou loja virtual. O formato depende de como sua empresa vende e atende os clientes.</p><Link className={s.button} href="/lojas-virtuais">Ver opções de loja virtual <ArrowUpRight size={20} /></Link></div><div className={s.shopArt}><ExperienceVisual kind="burger" /></div></section>

    <section className={s.section} id="templates"><div className={s.heading}><div><p className={s.kicker}>03 / POSSIBILIDADES NA PRÁTICA</p><h2>Explore. Interaja.<br /><em>Imagine sua marca.</em></h2></div><p>Exemplos demonstrativos de sites. Experimente os formatos e encontre referências para o seu projeto.</p></div><div className={s.examples}>{([["GASTRONOMIA", "Kobra Burger Fire", "Cardápio digital com personalidade para apresentar opções de uma hamburgueria.", "/templates/cardapio", "burger"], ["E-COMMERCE & MODA", "Vortex Atelier", "Uma vitrine editorial para destacar uma coleção de moda.", "/templates/streetwear", "fashion"], ["AUTOMOTIVO", "Prime Motors", "Apresentar veículos e facilitar pedidos de informação ou visita.", "/templates/carros", "motors"]] as [string, string, string, string, ExperienceKind][]).map(([category, title, text, href, art]) => <Link href={href} key={href}><div className={s.exampleArt}><ExperienceVisual kind={art} /></div><small>{category} / DEMONSTRAÇÃO</small><h3>{title}<ArrowUpRight size={22} /></h3><p>{text}</p></Link>)}</div><Link className={s.textLink} href="/templates">Conhecer todos os exemplos <ArrowUpRight size={18} /></Link></section>

    <section className={s.section} id="sites-processo"><p className={s.kicker}>04 / DO PRIMEIRO CONTATO AO SITE PUBLICADO</p><h2>Com etapas claras.<br /><em>Do início ao lançamento.</em></h2><ol className={s.steps}>{steps.map(([title, text], i) => <li key={title}><span>0{i + 1}<ArrowUpRight size={20} /></span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

    <section className={s.plansSection} id="planos"><div className={s.section}><p className={s.kicker}>05 / INVESTIMENTO EM PROJETOS AVULSOS</p><div className={s.heading}><h2>Escolha a estrutura<br /><em>para o seu negócio.</em></h2><p>Confira as opções e o que está incluído. O formato, a quantidade de páginas e os recursos do seu site são definidos na proposta antes do início.</p></div><SitesPlans /><aside className={s.customPlan}><div><h3>Hotsite dinâmico sob medida</h3><p>Para campanhas, eventos e lançamentos que precisam de uma experiência própria. Recursos interativos, investimento e prazo são definidos após entender seu projeto.</p></div><Link href={quote("hotsite")} className={s.textLink}>Conversar sobre meu projeto <ArrowUpRight size={20} /></Link></aside></div></section>

    <section className={`${s.section} ${s.faq}`} id="faq"><div><p className={s.kicker}>06 / ANTES DE COMEÇAR</p><h2>Sem dúvidas.<br /><em>Com direção.</em></h2><p>A proposta define as entregas e as condições antes de começarmos.</p></div><div>{faqs.map(([q, a]) => <details key={q}><summary>{q}<Plus size={18} /></summary><p>{a}</p></details>)}</div></section>
    <section className={s.finalCta}><p className={s.kicker}>SEU PRÓXIMO OBJETIVO MERECE UM COMEÇO.</p><Link href={quote("institucional")}><h2>Vamos colocar<br /><em>sua marca no ar?</em></h2><ArrowUpRight /></Link><p>Já tem site e precisa divulgá-lo? <Link href="/marketing">Conheça o tráfego pago e SEO ↗</Link></p></section>
  </div>;
}
