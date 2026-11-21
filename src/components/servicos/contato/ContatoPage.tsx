import { ruaFonts } from "@/components/rua/fonts";
import { ArrowIcon } from "@/components/rua/icons";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { Contact } from "@/components/Contact";
import { EMAIL } from "@/components/rua/content";
import { WA_NUMBER } from "@/lib/site-config";
import { Cta } from "../parts";
import s from "../servico.module.css";
import { CopyEmail } from "./CopyEmail";

const steps = [
  "Conversamos sobre seu negócio e sua dificuldade",
  "Você recebe escopo, valor e prazo para avaliar",
  "Com a proposta aprovada, começamos a criação",
] as const;

export default function ContatoPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      <section className={s.heroPlain}>
        <div className={`${r.wrap} ${r.pad} ${s.heroPlainGrid}`}>
          <div>
            <p className={r.eyebrow}>Contato e orçamento · NexuSync</p>
            <h1>Seu próximo projeto <span className={r.hi}>começa com uma conversa.</span></h1>
            <p className={r.lead}>Escolha o assunto, conte o que precisa e fale com a gente pelo canal que preferir: formulário, e-mail ou WhatsApp.</p>
            <div className={r.ctas}>
              <Cta href="#orcamento">Conte sua ideia</Cta>
              <a className={`${r.btn} ${r.btnLine}`} href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <span>Chamar no WhatsApp</span>
                <em aria-hidden="true"><ArrowIcon /></em>
              </a>
            </div>
          </div>
          <div className={s.chat} aria-hidden="true">
            <p className={s.bubbleIn} style={{ ["--d" as string]: "0.3s" }}>Quero que mais gente conheça meu negócio.</p>
            <p className={s.typing} style={{ ["--d" as string]: "1.5s" }}><i /><i /><i /></p>
            <p className={s.bubbleOut} style={{ ["--d" as string]: "2.8s" }}>Vamos entender o seu momento.</p>
            <p className={s.bubbleOut} style={{ ["--d" as string]: "4.2s" }}>Você recebe escopo, valor e prazo.</p>
            <p className={s.bubbleDone} style={{ ["--d" as string]: "5.6s" }}>Proposta a caminho ✓</p>
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`}>
        <div className={`${r.wrap} ${r.pad} ${s.contactGrid}`}>
          <Contact />

          <aside className={s.contactAside} aria-label="Contato direto">
            <div className={s.contactCard}>
              <div className={s.cardHead}>
                <h2>Contato direto</h2>
                <span className={s.liveTag}><i aria-hidden="true" />Atendimento pelo WhatsApp</span>
              </div>
              <a className={s.channel} href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <div><small>WhatsApp comercial</small><b>(51) 99358-3936</b></div>
                <ArrowIcon />
              </a>
              <div className={s.channel}>
                <a href={`mailto:${EMAIL}`}><small>E-mail oficial</small><b>{EMAIL}</b></a>
                <CopyEmail email={EMAIL} />
              </div>
              <div className={s.channel} data-static="">
                <div><small>Operação digital</small><b>100% remoto para todo o Brasil</b></div>
              </div>
            </div>

            <div className={s.contactCard}>
              <p className={s.steps3Title}>Próximos passos</p>
              <ol className={s.steps3}>
                {steps.map((text, i) => (
                  <li key={text}><span>0{i + 1}</span>{text}</li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
