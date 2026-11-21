import { ruaFonts } from "@/components/rua/fonts";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { Cta } from "../parts";
import s from "../servico.module.css";
import { PillarTabs } from "./PillarTabs";

const values = [
  ["Contato próximo", "Conversa direta ao longo do projeto. Atendimento remoto para todo o Brasil."],
  ["Sua identidade", "Escolhas que partem da sua marca. Uma linguagem que conecta as peças e valoriza o que torna seu negócio único."],
  ["Etapas claras", "Entregas e prazos alinhados desde o início. Você acompanha o desenvolvimento e os ajustes previstos na proposta."],
] as const;

const steps = [
  ["Entendemos seu negócio", "Você compartilha informações sobre seu público, sua oferta e o objetivo do projeto."],
  ["Definimos a proposta", "Você recebe escopo, investimento, prazo e a lista de materiais necessários para começar."],
  ["Criamos e apresentamos", "Desenvolvemos o projeto para você revisar e solicitar os ajustes previstos na proposta."],
  ["Publicamos e orientamos", "Após a aprovação, preparamos a publicação e orientamos os próximos passos definidos no escopo."],
] as const;

const pillars = [
  ["01", "Presença online", "Sites, lojas, aplicativos e SEO", "/criacao-de-sites"],
  ["02", "Design", "Identidade, peças e motion graphics", "/design"],
  ["03", "Redes sociais", "Constância para ser lembrado", "/redes-sociais"],
  ["04", "Tráfego pago", "Por último, para ir além", "/marketing#marketing-aquisicao-local"],
] as const;

export default function SobrePage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      <section className={s.heroPlain}>
        <div className={`${r.wrap} ${r.pad} ${s.heroPlainGrid}`}>
          <div>
            <p className={r.eyebrow}>Quem somos · NexuSync</p>
            <h1>Seu negócio tem personalidade. <span className={r.hi}>Sua presença digital também.</span></h1>
            <p className={r.lead}>Somos a NexuSync. Aproximamos criação, tecnologia e marketing do que torna o seu negócio único. Gente de verdade, conversa de perto, atendimento em todo o Brasil.</p>
            <div className={r.ctas}>
              <Cta href="#nosso-jeito">Veja o que muda na prática</Cta>
              <Cta href="/contato" line>Vamos conversar</Cta>
            </div>
          </div>
          <div className={s.orbit} aria-hidden="true">
            <i /><i /><i />
            <b>N</b>
            <span>Criação</span><span>Tecnologia</span><span>Marketing</span>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`}>
        <div className={`${r.wrap} ${r.pad} ${s.statement}`}>
          <p className={r.eyebrow}>Você conhece sua empresa</p>
          <h2 data-rua-type="">Nós ajudamos a transformar essa essência <span className={r.hi} data-hi="">em uma experiência digital.</span></h2>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="nosso-jeito">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Diferentes soluções. Um mesmo cuidado.</p>
          <div className={s.split}>
            <h2 data-rua-type="">Conectamos o que <span className={r.hi} data-hi="">faz sentido para você.</span></h2>
            <p className={r.lead}>Sites, aplicativos, design e marketing se conectam ao objetivo do seu negócio. Explore o que muda na prática em cada área.</p>
          </div>
          <PillarTabs />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="pilares">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Na ordem certa</p>
          <div className={s.split}>
            <h2 data-rua-type="">Quatro pilares, <span className={r.hi} data-hi="">nessa ordem.</span></h2>
            <p className={r.lead}>Primeiro a base que faz você ser encontrado. Depois a marca, a constância nas redes e, por último, os anúncios.</p>
          </div>
          <div className={`${s.cards} ${s.cards4}`} data-rua-stagger="">
            {pillars.map(([n, title, text, href]) => (
              <a key={n} className={`${s.card} ${s.cardLink}`} href={href}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="valores">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Nosso jeito de trabalhar</p>
          <h2 data-rua-type="">Próximos de você. <span className={r.hi} data-hi="">Atentos ao seu negócio.</span></h2>
          <div className={`${s.cards} ${s.cardsTop}`} data-rua-stagger="">
            {values.map(([title, text], i) => (
              <article key={title} className={s.card}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="processo">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Do primeiro contato à entrega</p>
          <h2 data-rua-type="">Ouvir. Criar. <span className={r.hi} data-hi="">Colocar em movimento.</span></h2>
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

      <section className={`${r.sec} ${s.solid} ${s.final}`}>
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Nosso primeiro passo é ouvir</p>
          <h2 data-rua-type="">O que faz sentido <span className={r.hi} data-hi="">para o seu negócio?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte o seu momento e o que você quer melhorar.</p>
          <div className={r.ctas}>
            <Cta href="/contato?interest=nao-sei&source=other#orcamento">Pedir minha proposta</Cta>
            <Cta href="/templates" line>Ver exemplos</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
