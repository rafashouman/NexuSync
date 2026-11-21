import Link from "next/link";
import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { appFaqs } from "@/data/appFaqs";
import { appPlans } from "@/data/appPlans";
import { Cta, StorySteps, type StoryStep } from "../parts";
import { PlansRua } from "../PlansRua";
import s from "../servico.module.css";
import { AppsDirectory } from "./AppsDirectory";
import { RotinaWorld } from "./RotinaWorld";

const quote = `/contato?interest=automacoes&source=apps#orcamento`;
const cheapest = [...appPlans].sort((a, b) => parseFloat(a.price.replace(".", "").replace(",", ".")) - parseFloat(b.price.replace(".", "").replace(",", ".")))[0];

/** The four steps of the scene. "Nos planos" lines are copied from appPlans.ts features. */
const routine: readonly StoryStep[] = [
  {
    tag: "Agenda",
    title: "Horários sem troca de mensagens",
    text: "O cliente escolhe serviço, data e horário. Sua equipe vê as solicitações em um painel e confirma, sem caçar recado no WhatsApp.",
    get: ["Fluxo de agendamento online passo a passo", "Visualização e aprovação das solicitações recebidas"],
    note: "No plano básico, a empresa confirma cada solicitação. Notificações automáticas dependem do escopo.",
  },
  {
    tag: "Painel",
    title: "Tudo o que está pendente, num lugar só",
    text: "Pedidos, clientes, comandas e tarefas organizados em um painel com login. Filtros e indicadores mostram o que precisa de atenção.",
    get: ["Painel administrativo privado com login seguro", "Busca instantânea, filtros por status e indicadores"],
  },
  {
    tag: "Campanha",
    title: "Uma campanha que o cliente quer jogar",
    text: "Roletas, quizzes e desafios que rodam no navegador para divulgar uma oferta e captar contatos, direto do celular.",
    get: ["Roletas de descontos, quizzes ou desafios de memória", "Botão de resgate de prêmio direto no WhatsApp"],
  },
  {
    tag: "Equipe",
    title: "Sua equipe usando no dia a dia",
    text: "Publicamos a solução e orientamos quem vai usar. Funciona no celular, no tablet e no computador, no balcão ou na rua.",
    get: ["Interface 100% responsiva (Celular, Tablet e PC)", "Configuração inicial, publicação e treinamento"],
  },
];

const solutions = [
  ["Agendamentos", "Organize serviços e solicitações de horário. No plano básico, sua empresa confirma a solicitação; avisos automáticos dependem do escopo.", "/chronos", "Experimentar a agenda"],
  ["Gestão web", "Centralize cadastros, pedidos, tarefas e indicadores em uma aplicação feita para os processos definidos com você.", "/pulsemetrics", "Explorar um painel"],
  ["Mini apps e gamificação", "Experiências interativas que rodam no navegador para apresentar uma campanha, organizar a participação e divulgar ofertas ou cupons.", "/pulsespin", "Testar uma experiência"],
] as const;

const steps = [
  ["Entendemos sua rotina", "Começamos pelo processo que toma seu tempo e pelo que sua equipe precisa realizar."],
  ["Definimos o fluxo", "Combinamos as funções, as integrações previstas e o que cada pessoa poderá acessar."],
  ["Criamos e testamos", "Apresentamos a solução para revisar o uso e realizar os ajustes contratados."],
  ["Publicamos e orientamos", "Configuramos a publicação e orientamos sua equipe sobre o fluxo entregue."],
] as const;

export default function AppsPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      {/* hero + a rotina: loose notes become an agenda, a dashboard and a campaign on a giant phone */}
      <section className={s.story} data-stage-root="" data-step="-1">
        <RotinaWorld />
        <div className={`${r.wrap} ${r.pad} ${s.hero}`}>
          <p className={r.eyebrow}>Aplicativos e automações · NexuSync</p>
          <h1>
            Seu negócio cresceu. <span className={r.hi}>Sua rotina pode ficar mais simples.</span>
          </h1>
          <p className={r.lead}>
            Horários para confirmar, pedidos para acompanhar e informações para localizar. Começamos pelo processo que toma seu tempo e definimos uma solução que sua equipe consiga usar no dia a dia. Projetos a partir de R$ {cheapest.price}.
          </p>
          <div className={r.ctas}>
            <Cta href={quote}>Quero simplificar minha operação</Cta>
            <Cta href="#todos-os-aplicativos" line>Experimentar as soluções</Cta>
          </div>
          <p className={s.scrollHint} aria-hidden="true"><i />Role para ver a rotina se organizar</p>
        </div>
        <StorySteps steps={routine} label="Como uma aplicação organiza a rotina" />
      </section>

      <section className={`${r.sec} ${s.solid}`} id="objetivo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Começamos pelo que importa</p>
          <div className={s.split}>
            <h2 data-rua-type="">Qual parte da rotina <span className={r.hi} data-hi="">precisa de organização?</span></h2>
            <p className={r.lead} data-rua-words="">Horários e confirmações dependem de mensagens e anotações. Sua equipe registra a mesma informação em mais de um lugar. É difícil saber o que está pendente e quem precisa de retorno.</p>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="solucoes">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Menos tarefas repetitivas. Mais possibilidades.</p>
          <h2 data-rua-type="">Do atendimento <span className={r.hi} data-hi="">à operação.</span></h2>
          <div className={s.formats} data-rua-stagger="">
            {solutions.map(([title, text, href, label], i) => (
              <Link key={title} className={s.format} href={href}>
                <span className={s.formatN}>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p className={s.formatSub}>{label}</p>
                  <p>{text}</p>
                </div>
                <em aria-hidden="true"><ArrowIcon /></em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="todos-os-aplicativos">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Experimente antes de imaginar o seu</p>
          <div className={s.split}>
            <h2 data-rua-type="">Ideias que você <span className={r.hi} data-hi="">pode testar.</span></h2>
            <p className={r.lead}>Todos os aplicativos e demonstrações em um só lugar. Abra uma experiência, explore o fluxo e compartilhe a referência para o seu projeto.</p>
          </div>
          <AppsDirectory />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="processo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Do primeiro contato à entrega</p>
          <h2 data-rua-type="">Uma direção clara. <span className={r.hi} data-hi="">Em cada etapa.</span></h2>
          <ol className={s.steps} data-rua-stagger="">
            {steps.map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="aplicacoes">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Escopo claro. Entregas definidas.</p>
          <div className={s.split}>
            <h2 data-rua-type="">Soluções para <span className={r.hi} data-hi="">o seu próximo passo.</span></h2>
            <p className={r.lead}>O formato e as funções são definidos conforme o processo que sua empresa precisa melhorar.</p>
          </div>
          <PlansRua kind="apps" />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="faq">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Antes de começar</p>
            <h2 data-rua-type="">Sem surpresas. <span className={r.hi} data-hi="">Com escopo.</span></h2>
            <p className={r.lead}>A proposta descreve as funções, as integrações e o que cada pessoa poderá acessar.</p>
          </div>
          <div className={r.faq}>
            {appFaqs.map(({ q, a }) => (
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
          <h2 data-rua-type="">Vamos simplificar <span className={r.hi} data-hi="">sua operação?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Tem uma rotina que precisa melhorar? Conte como ela funciona.</p>
          <div className={r.ctas}>
            <Cta href={quote}>Pedir minha proposta</Cta>
            <Cta href="/criacao-de-sites" line>Ver criação de sites</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
