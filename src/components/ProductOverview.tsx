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
    alternative: ["/marketing", "Prefere contar com alguém para planejar e executar sua divulgação? Conheça os serviços de marketing."],
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
  return <>
    <section className="container-luxe pb-20 pt-36 sm:pt-44">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="min-w-0"><p className="mb-5 text-xs font-bold uppercase tracking-widest text-violet-200">{item.name} · {item.category}</p><h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{item.name}: {item.title}</h1><p className="mt-6 text-lg leading-8 text-muted-foreground">{item.description}</p><a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-violet-gradient px-6 py-4 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300">Acessar o {item.name}<ArrowUpRight className="h-5 w-5" aria-hidden /></a><p className="mt-3 text-xs text-muted-foreground">Abre o aplicativo em uma nova aba.</p></div>
        <aside className="rounded-3xl border border-violet-300/20 bg-violet-400/[0.04] p-6 sm:p-10"><span className="font-display text-4xl text-violet-200">{item.name}</span><h2 className="mt-8 text-xl font-semibold">Faz sentido para sua rotina?</h2><p className="mt-4 leading-7 text-muted-foreground">{item.audience}</p><p className="mt-6 border-t border-white/10 pt-6 text-sm leading-7 text-muted-foreground">{item.note}</p></aside>
      </div>
    </section>
    <section className="border-y border-border py-16 sm:py-24"><div className="container-luxe"><h2 className="font-display text-3xl sm:text-4xl">Uma rotina mais fácil de acompanhar.</h2><div className="mt-10 grid gap-8 md:grid-cols-3">{item.features.map(([title, description]) => <article key={title} className="border-l border-violet-300/25 pl-6"><Check className="h-5 w-5 text-violet-200" aria-hidden /><h3 className="mt-5 text-2xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{description}</p></article>)}</div></div></section>
    <section className="container-luxe py-16 sm:py-24"><h2 className="font-display text-3xl">Antes de começar</h2><div className="mt-8 max-w-4xl space-y-3">{item.faq.map(([q, a]) => <details key={q} className="rounded-2xl border border-white/10 p-5"><summary className="cursor-pointer font-semibold text-violet-100">{q}</summary><p className="mt-4 leading-7 text-muted-foreground">{a}</p></details>)}</div><a href={waLink(`Olá! Quero conhecer o ${item.name} e confirmar as condições de acesso para meu negócio.`)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-violet-300/30 px-5 py-3 font-semibold text-violet-200"><MessageCircle className="h-4 w-4" aria-hidden />Conversar sobre o {item.name}</a><p className="mt-8 max-w-3xl text-sm leading-7 text-muted-foreground"><Link href={item.alternative[0]} className="text-violet-200 underline underline-offset-4">{item.alternative[1]}</Link></p></section>
  </>;
}
