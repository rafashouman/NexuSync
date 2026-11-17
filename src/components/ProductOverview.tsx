import { ProductDemo } from "@/components/home/ProductDemo";
import s from "@/components/home/SitesExperience.module.css";
import c from "@/components/home/ProductExperience.module.css";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site-config";

const products = {
  arcsync: {
    name: "ArcSync", category: "Planejamento e publicação de conteúdo",
    title: "Mais tempo criando. Mais clareza para publicar.",
    description: "Rascunhos, horários e aprovações fazem parte do trabalho de quem cuida das redes sociais. O ArcSync reúne essa rotina para você planejar conteúdos e acompanhar suas publicações em um só lugar.",
    url: "https://arcsync.nexusync.online/",
    audience: "Para social medias, agências e equipes que cuidam da comunicação de uma ou mais marcas.",
    features: [["Planeje", "Organize rascunhos, legendas e mídias antes de definir a publicação."], ["Agende", "Acompanhe os conteúdos no calendário e programe horários de envio."], ["Acompanhe", "Veja aprovações, histórico e o resultado dos envios para identificar o que precisa de atenção."]],
    note: "Conexões, formatos de conteúdo e permissões variam por rede social. Confira no aplicativo as opções disponíveis para suas contas.",
    faq: [["O ArcSync substitui um serviço de social media?", "Ele organiza o trabalho de publicação. Planejamento estratégico, criação das peças e atendimento continuam dependendo de quem cuida da comunicação."], ["Posso publicar em qualquer rede ou formato?", "As opções dependem das integrações, das permissões das contas e dos formatos apresentados no editor. Confira a compatibilidade antes de definir seu fluxo."], ["Como conheço as condições de acesso?", "Acesse o aplicativo ou converse com a NexuSync para confirmar as condições atuais, sem pressupor teste gratuito ou um plano específico."]],
    alternative: ["/marketing", "Prefere contar com alguém para planejar e executar sua divulgação? Conheça os serviços de tráfego pago e SEO."],
  },
  visionsync: {
    name: "VisionSync", category: "CRM e organização do atendimento",
    title: "Cada contato tem uma história. Fica mais fácil acompanhar quando ela está organizada.",
    description: "Informações importantes não precisam se perder entre conversas e anotações. O VisionSync organiza contatos, etapas e próximos retornos em um painel, com uma extensão para apoiar o trabalho no WhatsApp Web.",
    url: "https://visionsync.nexusync.online/",
    audience: "Para pequenos negócios e profissionais que precisam acompanhar contatos e manter os próximos passos do atendimento visíveis.",
    features: [["Centralize", "Consulte contatos, notas e informações de atendimento em um painel."], ["Organize", "Use etiquetas e etapas para visualizar o andamento dos contatos."], ["Dê continuidade", "Acompanhe lembretes e utilize respostas rápidas com o apoio da extensão para WhatsApp Web."]],
    note: "O uso no WhatsApp Web depende da instalação e conexão da extensão compatível. Recursos, integrações e condições de acesso devem ser conferidos na versão disponível.",
    faq: [["Preciso usar a extensão para acessar o painel?", "O painel é acessado pelo navegador. A extensão é utilizada para os recursos que apoiam o atendimento dentro do WhatsApp Web."], ["Toda a equipe compartilha os mesmos contatos?", "Não presuma compartilhamento entre contas. Confirme com a NexuSync as opções de acesso e colaboração antes de contratar para uma equipe."], ["É uma ferramenta de envio em massa?", "A apresentação do VisionSync aqui é de organização de contatos e acompanhamento do atendimento. Não oferecemos nesta página disparos em massa ou automações não confirmadas."]],
    alternative: ["/apps", "Precisa de um processo específico para sua empresa? Veja o desenvolvimento de sistemas sob medida."],
  },
} as const;

export function ProductOverview({ product }: { product: keyof typeof products }) {
  const item = products[product];
  return <div className={`${s.page} ${c.product}`}>
    <section className={s.section}>
      <div className={s.eyebrow}><Link href="/apps">NEXUSYNC / PRODUTOS</Link><span>{item.name.toUpperCase()}</span><span>{item.category.toUpperCase()}</span></div>
      <div className={c.hero}><div><p className={s.kicker}>{item.category}</p><span className={c.wordmark}>{item.name}<i>↗</i></span><h1>{item.title}</h1><p>{item.description}</p><div className={s.actions}><a href={item.url} target="_blank" rel="noopener noreferrer" className={s.button}>Acessar o {item.name}<ArrowUpRight size={18} /></a><a href="#recursos" className={s.textLink}>Explore a rotina ↓</a></div><small>O aplicativo abre em uma nova aba.</small></div><ProductDemo product={product} /></div>
    </section>
    <section className={c.audience}><span>FEITO PARA SUA ROTINA.</span><p>{item.audience}</p><ArrowUpRight size={45} aria-hidden="true" /></section>
    <section className={s.section} id="recursos"><p className={s.kicker}>01 / DA IDEIA AO PRÓXIMO PASSO</p><div className={s.heading}><h2>Uma rotina mais fácil<br /><em>de acompanhar.</em></h2><p>{item.note}</p></div><div className={c.features}>{item.features.map(([title, description], index) => <article key={title}><span>0{index + 1}<Check size={19} /></span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className={`${s.section} ${s.faq}`}><div><p className={s.kicker}>02 / ANTES DE COMEÇAR</p><h2>Boas perguntas.<br /><em>Escolhas claras.</em></h2><p>Entenda como o {item.name} se encaixa no seu dia a dia.</p></div><div>{item.faq.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    <section className={s.finalCta}><div><p className={s.kicker}>VAMOS CONECTAR AS IDEIAS?</p><h2>Seu próximo passo.<br /><em>Com mais clareza.</em></h2><Link href={item.alternative[0]} className={s.textLink}>{item.alternative[1]}<ArrowUpRight size={18} /></Link></div><a href={waLink(`Olá! Quero conhecer o ${item.name} e confirmar as condições de acesso para meu negócio.`)} target="_blank" rel="noopener noreferrer" aria-label={`Conversar sobre o ${item.name}`}><MessageCircle size={55} /></a></section>
  </div>;
}
