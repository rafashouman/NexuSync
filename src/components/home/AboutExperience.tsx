import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  Fingerprint,
  HeartHandshake,
  Check,
} from "lucide-react";
import { AboutFocus } from "./AboutFocus";
import s from "./SitesExperience.module.css";
import c from "./StudioExperience.module.css";

export function StudioMark() {
  return (
    <div className={c.studioMark} aria-hidden="true">
      <span className={c.markCaption}>
        NEXUSYNC / CONECTANDO POSSIBILIDADES
      </span>
      <div className={c.markStage}>
        <div className={c.markCore}>
          <i />
          <i />
          <i />
          <i />
        </div>
        <svg viewBox="0 0 400 400" fill="none">
          <circle
            cx="200"
            cy="200"
            r="170"
            stroke="currentColor"
            strokeDasharray="3 12"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="180"
            ry="80"
            stroke="currentColor"
            transform="rotate(-35 200 200)"
          />
          <path d="M30 200H370M200 30V370" stroke="currentColor" opacity=".3" />
        </svg>
      </div>
      <span className={c.markWord}>
        Ideias diferentes.
        <br />
        <b>Uma direção em comum.</b>
      </span>
      <span className={c.markTag}>
        CRIAÇÃO ×<br />
        TECNOLOGIA ×<br />
        MARKETING
      </span>
    </div>
  );
}

/** On /contato the page already has its own h1, so this block renders its title as an h2. */
export default function AboutExperience({ headingTag: Heading = "h1" }: { headingTag?: "h1" | "h2" }) {
  return (
    <div className={`${s.page} ${c.studio}`}>
      <section className={s.hero}>
        <div className={s.eyebrow}>
          <Link href="/">NEXUSYNC</Link>
          <span>/ QUEM SOMOS</span>
          <span>FORA DO ÓBVIO. PERTO DE VOCÊ.</span>
        </div>
        <div className={s.heroGrid}>
          <div>
            <p className={s.kicker}>GENTE DE VERDADE. CONVERSA DE PERTO.</p>
            <Heading className={c.aboutTitle}>
              Seu negócio tem
              <br />
              personalidade.
              <br />
              <em>
                Sua presença
                <br />
                digital também.
              </em>
            </Heading>
            <p className={s.intro}>
              Somos a NexuSync. Aproximamos criação, tecnologia e marketing do
              que torna o seu negócio único.
            </p>
            <div className={s.actions}>
              <a href="#nosso-jeito" className={s.button}>
                Veja o que muda na prática
                <ArrowDown size={17} />
              </a>
              <Link href="/contato" className={s.textLink}>
                Vamos conversar
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <StudioMark />
        </div>
        <div className={s.attributes}>
          <span>Primeiro, o seu negócio.</span>
          <span>Depois, a solução.</span>
          <span>Atendimento em todo o Brasil.</span>
        </div>
      </section>
      <section className={c.statement}>
        <p className={s.kicker}>VOCÊ CONHECE SUA EMPRESA.</p>
        <h2>
          Nós ajudamos a transformar
          <br />
          essa essência em uma
          <br />
          <em>experiência digital.</em>
        </h2>
        <p>
          Seu negócio tem personalidade. Sua presença digital também precisa
          ter.
        </p>
        <span aria-hidden="true">↗</span>
      </section>
      <section className={s.section} id="nosso-jeito">
        <div className={s.heading}>
          <div>
            <p className={s.kicker}>
              01 / DIFERENTES SOLUÇÕES. UM MESMO CUIDADO.
            </p>
            <h2>
              Conectamos o que
              <br />
              <em>faz sentido para você.</em>
            </h2>
          </div>
          <p>
            Sites, aplicativos, design e marketing se conectam ao objetivo do
            seu negócio. Explore o que muda na prática em cada área.
          </p>
        </div>
        <AboutFocus />
      </section>
      <section className={c.values}>
        <div className={s.section}>
          <p className={s.kicker}>02 / NOSSO JEITO DE TRABALHAR</p>
          <h2>
            Próximos de você.
            <br />
            <em>Atentos ao seu negócio.</em>
          </h2>
          <div className={s.benefits}>
            {[
              {
                icon: HeartHandshake,
                title: "Contato próximo",
                text: "Conversa direta ao longo do projeto. Atendimento remoto para todo o Brasil.",
              },
              {
                icon: Fingerprint,
                title: "Sua identidade",
                text: "Escolhas que partem da sua marca. Uma linguagem que conecta as peças e valoriza o que torna seu negócio único.",
              },
              {
                icon: Check,
                title: "Etapas claras",
                text: "Entregas e prazos alinhados desde o início. Você acompanha o desenvolvimento e os ajustes previstos na proposta.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <article key={title}>
                <span>
                  0{i + 1}
                  <Icon size={23} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={s.section} id="processo">
        <p className={s.kicker}>03 / DO PRIMEIRO CONTATO À ENTREGA</p>
        <h2>
          Ouvir. Criar.
          <br />
          <em>Colocar em movimento.</em>
        </h2>
        <ol className={s.steps}>
          {[
            [
              "Entendemos seu negócio",
              "Você compartilha informações sobre seu público, sua oferta e o objetivo do projeto.",
            ],
            [
              "Definimos a proposta",
              "Você recebe escopo, investimento, prazo e a lista de materiais necessários para começar.",
            ],
            [
              "Criamos e apresentamos",
              "Desenvolvemos o projeto para você revisar e solicitar os ajustes previstos na proposta.",
            ],
            [
              "Publicamos e orientamos",
              "Após a aprovação, preparamos a publicação e orientamos os próximos passos definidos no escopo.",
            ],
          ].map(([title, text], i) => (
            <li key={title}>
              <span>
                0{i + 1}
                <ArrowUpRight size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.finalCta}>
        <p className={s.kicker}>NOSSO PRIMEIRO PASSO É OUVIR.</p>
        <Link href="/contato?interest=nao-sei&source=other#orcamento">
          <h2>
            O que faz sentido
            <br />
            <em>para o seu negócio?</em>
          </h2>
          <ArrowUpRight />
        </Link>
        <p>Conte o seu momento e o que você quer melhorar.</p>
      </section>
    </div>
  );
}
