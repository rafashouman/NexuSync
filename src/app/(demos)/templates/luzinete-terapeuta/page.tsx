import {
  CloudRain,
  Feather,
  HeartPulse,
  Lock,
  MapPin,
  Plus,
  Repeat,
  Route,
  Shield,
  Sprout,
  TrendingUp,
  Video,
  Wind,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Booking } from "@/components/luzinete/Booking";
import { AGENDA, FAQ, PAINS, PILLARS, SITE, STEPS, sectionPath } from "@/components/luzinete/data";
import { ModeButton } from "@/components/luzinete/ModeButton";
import { Umbel } from "@/components/luzinete/Umbel";
import s from "@/components/luzinete/luzinete.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Luzinete Terapeuta | Terapia TRG presencial e online",
  description:
    "Terapia de Reprocessamento Generativo para ansiedade, pânico, traumas e luto. Atendimento acolhedor, presencial e online. Agende sua sessão.",
  path: SITE.basePath,
  noindex: true,
  image: `${SITE.images}/compartilhar.jpg`,
});

const PAIN_ICONS = [Wind, HeartPulse, Shield, Feather, CloudRain, Repeat];
const PILLAR_ICONS = [Route, Lock, TrendingUp];

/** Atraso da entrada ao rolar. */
const order = (index: number) => ({ "--i": index }) as CSSProperties;

export default function LuzinetePage() {
  const portrait = `${SITE.images}/retrato.webp`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "pt-BR",
          mainEntity: FAQ.filter((item) => !item.pending).map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <section id="inicio" className={s.hero}>
        <div className={`${s.container} ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className={s.kicker}>Terapia de Reprocessamento Generativo (TRG)</p>
            <h1>Quem tem dor tem pressa.</h1>
            <p className={s.lead}>
              Uma terapia breve e acolhedora para aliviar ansiedade, traumas e dores emocionais na raiz, sem precisar contar
              tudo o que aconteceu.
            </p>
            <div className={s.actions}>
              <a href={sectionPath("agendar")} className={s.button}>
                Agendar minha sessão
              </a>
              <a href={sectionPath("trg")} className={`${s.button} ${s.buttonOutline}`}>
                Conhecer a TRG
              </a>
            </div>
            <p className={s.badge}>Atendimento presencial e online</p>
          </div>
          <div className={s.portrait}>
            <span className={s.blob} aria-hidden="true" />
            <Image
              src={portrait}
              alt={`Retrato de ${SITE.name} sorrindo`}
              width={514}
              height={524}
              priority
              sizes="(min-width: 1024px) 420px, 80vw"
            />
            <Umbel className={s.heroUmbel} />
          </div>
        </div>
      </section>

      <section id="dores" className={`${s.section} ${s.wave} ${s.white}`}>
        <div className={s.container}>
          <h2 data-reveal>Talvez você esteja carregando mais peso do que precisa</h2>
          <ul className={s.pains}>
            {PAINS.map((pain, index) => {
              const Icon = PAIN_ICONS[index];
              return (
                <li key={pain} data-reveal style={order(index % 3)}>
                  <span aria-hidden="true">
                    <Icon />
                  </span>
                  {pain}
                </li>
              );
            })}
          </ul>
          <p className={s.closing} data-reveal>
            Você não precisa atravessar isso sozinho(a).
          </p>
        </div>
      </section>

      <section id="trg" className={`${s.section} ${s.wave} ${s.mist}`}>
        <div className={`${s.container} ${s.split}`}>
          <div data-reveal>
            <h2>O que é a Terapia de Reprocessamento Generativo</h2>
            <p className={s.lead}>
              A TRG é uma abordagem terapêutica breve, criada no Brasil por Jair Soares, que reprocessa memórias traumáticas,
              dores emocionais e padrões disfuncionais. Ela atua na raiz das emoções para promover alívio dos sintomas e
              fortalecimento emocional.
            </p>
          </div>
          <ul className={s.pillars}>
            {PILLARS.map((pillar, index) => {
              const Icon = PILLAR_ICONS[index];
              return (
                <li key={pillar.title} data-reveal style={order(index)}>
                  <Icon aria-hidden="true" />
                  <div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="como-funciona" className={`${s.section} ${s.wave} ${s.beige}`}>
        <div className={s.container}>
          <h2 data-reveal>Um caminho em etapas, no seu tempo</h2>
          <ol className={s.timeline}>
            {STEPS.map((item, index) => (
              <li key={item.title} data-reveal style={order(index)}>
                <span aria-hidden="true">{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="sobre" className={`${s.section} ${s.wave} ${s.white}`}>
        <div className={`${s.container} ${s.about}`}>
          <div data-reveal>
            <h2>Prazer, eu sou a Luzinete</h2>
            <p className={s.lead}>
              Acredito que ninguém precisa carregar sozinho o peso do que viveu. No meu consultório, você encontra escuta,
              acolhimento e um método estruturado para transformar dor em força.
            </p>
            {SITE.credentials ? (
              <p>{SITE.credentials}</p>
            ) : (
              <p className={s.pending}>Formação, certificação em TRG e tempo de atuação: a confirmar.</p>
            )}
            <p className={s.signature}>
              <Image src={portrait} alt="" width={64} height={64} />
              <span>
                <strong>Luzinete</strong>
                {SITE.role}
              </span>
            </p>
          </div>
          <ul className={s.beliefs}>
            <li data-reveal>
              <Sprout aria-hidden="true" />
              <h3>Autoconfiança</h3>
              <p>Autoconfiança não é luxo: é fundamental e necessária para viver com leveza.</p>
            </li>
            <li data-reveal style={order(1)}>
              <Feather aria-hidden="true" />
              <h3>Perdão</h3>
              <p>O perdão, a si e ao outro, é um caminho para aliviar o peso da alma.</p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="lz-mola" className={`${s.section} ${s.wave} ${s.dark}`}>
        <div className={`${s.container} ${s.impact}`}>
          {/* A mola: comprimida ao entrar na tela, solta conforme a rolagem sobe a frase. */}
          <svg className={s.spring} viewBox="0 0 120 150" fill="none" aria-hidden="true">
            <path d="M14 140h92M26 128c0 10 68 10 68 0s-68-14-68-24 68-4 68-14-68-14-68-24 68-4 68-14-68-14-68-24c0-6 20-10 34-10" />
            <circle cx="60" cy="12" r="6" />
          </svg>
          <h2 id="lz-mola">No fundo do poço existe uma mola.</h2>
          <p>Toda queda pode virar impulso. Vamos dar o primeiro passo juntos?</p>
          <a href={sectionPath("agendar")} className={`${s.button} ${s.buttonLight}`}>
            Agendar minha sessão
          </a>
        </div>
      </section>

      <section id="atendimento" className={`${s.section} ${s.wave} ${s.mist}`}>
        <div className={s.container}>
          <h2 data-reveal>Atendimento do jeito que couber na sua vida</h2>
          <div className={s.care}>
            <article data-reveal>
              <MapPin aria-hidden="true" />
              <h3>Presencial</h3>
              <p>Em consultório próprio, um espaço tranquilo e reservado.</p>
              <p className={SITE.contact.address ? undefined : s.pending}>{SITE.contact.address || "Endereço: a confirmar."}</p>
              <ModeButton mode="presencial" label="Agendar presencial" />
            </article>
            <article data-reveal style={order(1)}>
              <Video aria-hidden="true" />
              <h3>Online</h3>
              <p>Por videochamada, com o mesmo cuidado, de onde você estiver.</p>
              <p>Basta internet estável e um lugar reservado.</p>
              <ModeButton mode="online" label="Agendar online" />
            </article>
          </div>
          <p className={s.duration}>Cada sessão dura {AGENDA.durationMin} minutos.</p>
        </div>
      </section>

      <section id="agendar" className={`${s.section} ${s.wave} ${s.beige}`}>
        <div className={`${s.container} ${s.narrow}`}>
          <h2>Escolha o melhor dia e horário para você</h2>
          <p className={s.lead}>Em poucos passos sua sessão fica reservada e eu recebo o aviso.</p>
          <Booking />
        </div>
      </section>

      <section id="faq" className={`${s.section} ${s.wave} ${s.white}`}>
        <div className={`${s.container} ${s.narrow}`}>
          <h2 data-reveal>Perguntas frequentes</h2>
          <div className={s.faq}>
            {FAQ.map((item) => (
              <details key={item.question} name="faq">
                <summary>
                  {item.question}
                  <Plus aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
