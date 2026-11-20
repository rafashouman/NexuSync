import Image from "next/image";
import Link from "next/link";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { AttemptCards } from "./AttemptCards";
import { contactWhatsApp, EMAIL, faqs, go, phases, pillars, presenceWhatsApp, proposalHref, WA_DISPLAY } from "./content";
import { ArrowIcon } from "./icons";
import { PlanReceipt } from "./PlanReceipt";
import { RuaEffects } from "./RuaEffects";
import { RuaText } from "./RuaText";
import { RuaWorld } from "./RuaWorld";
import { SearchSimulator } from "./SearchSimulator";
import { VideoModal } from "./VideoModal";
import s from "./rua.module.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-rua-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-rua-body", display: "optional" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-rua-mono", display: "optional" });

const MARQUEE = ["Sites sob medida", "Landing pages", "Hotsites interativos", "Catálogos digitais", "Gamificação", "SEO desde a base"];

function ProposalButton({ source, children, small }: { source: "header" | "hero" | "sites"; children: React.ReactNode; small?: boolean }) {
  return (
    <Link className={`${s.btn} ${s.btnAmber} ${small ? s.btnSm : ""}`} href={proposalHref(source)}>
      <span>{children}</span>
      <em aria-hidden="true"><ArrowIcon /></em>
    </Link>
  );
}

function WhatsAppButton({ href = presenceWhatsApp }: { href?: string }) {
  return (
    <a className={`${s.btn} ${s.btnLine}`} href={href} target="_blank" rel="noopener noreferrer"
      data-analytics-section="sites" data-analytics-interest="institucional">
      <span>Falar no WhatsApp</span>
      <em aria-hidden="true"><ArrowIcon /></em>
    </a>
  );
}

export default function RuaHome() {
  return (
    <div className={`${s.rua} ${display.variable} ${body.variable} ${mono.variable}`} data-rua-root="">
      <RuaWorld />
      <RuaEffects />
      <RuaText />

      <header className={s.nav}>
        <div className={`${s.wrap} ${s.pad} ${s.navInner}`}>
          <Link className={s.brand} href="/" aria-label="NexuSync, início">
            <Image src="/images/logo-text.png" width={517} height={91} sizes="150px" alt="NexuSync" priority />
          </Link>
          <nav className={s.navLinks} aria-label="Seções da página">
            <a href="#tentativas">O que você já tentou</a>
            <a href="#metodo">Como funciona</a>
            <a href="#praquem">Pra quem é</a>
            <a href="#entregaveis">Planos</a>
            <Link href="/templates">Exemplos</Link>
          </nav>
          <ProposalButton source="header" small>
            <b className={s.long}>Pedir minha proposta</b>
            <b className={s.short}>Proposta</b>
          </ProposalButton>
        </div>
      </header>

      {/* 01 hero */}
      <section className={`${s.hero} ${s.grab}`} id="top" data-key="0" data-rua-grab="">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>NexuSync · sites sob medida e interativos</p>
            <h1>
              Seu negócio é único. <span id="rua-hl" className={s.hl} data-lit="false">Seu site também deveria ser.</span>
            </h1>
            <p className={s.sub}>
              A NexuSync cria sites, landing pages, hotsites e catálogos digitais sob medida, com interações que fazem o cliente explorar o que você oferece. Leves até no celular e com SEO desde a base. Planos a partir de R$ {go.price}.
            </p>
            <ul className={s.bul}>
              <li><span>Sem site, quem ouve falar de você <strong>não tem onde conhecer o seu trabalho.</strong></span></li>
              <li><span>Site lento ou desatualizado <strong>faz o cliente desistir antes de chamar você.</strong></span></li>
              <li><span>Proposta com <strong>preço, prazo e tudo o que está incluso</strong> antes de você decidir.</span></li>
            </ul>
            <div className={s.ctas}>
              <ProposalButton source="hero">Pedir minha proposta</ProposalButton>
              <VideoModal />
            </div>
            <Link href="/templates" className={s.floorLink}>ou experimente uma demonstração →</Link>
          </div>
          <SearchSimulator />
          <p className={s.hint} aria-hidden="true"><b />Role para ver como isso acontece ↓</p>
        </div>
      </section>

      <div className={s.marquee} aria-hidden="true">
        <div className={s.mq}>
          {[0, 1].map((copy) => (
            <div key={copy}>{MARQUEE.map((item) => <span key={item} style={{ display: "contents" }}><span>{item}</span><i /></span>)}</div>
          ))}
        </div>
      </div>

      {/* 02 dor */}
      <section className={s.sec} id="dor" data-key="1">
        <div className={`${s.wrap} ${s.pad}`}>
          <h2 className={s.scenesTitle} data-rua-type="">Talvez você já tenha vivido <span className={s.hi} data-hi="">uma destas situações.</span></h2>
          <div className={s.beat} data-rua-play="">
            <h3 data-rua-type="">Um cliente indicou você. Quando a pessoa foi conhecer seu trabalho, <span className={s.hi} data-hi="">não tinha nada para ver.</span></h3>
            <p className={s.beatN}>1 de 3</p>
            <div className={`${s.mock} ${s.mBrowser}`} role="img" aria-label="Navegador aberto em sua-empresa.com.br mostrando só uma página em construção">
              <div className={s.mUrl}><i /><i /><i /><span>sua-empresa.com.br</span></div>
              <div className={s.mLoad} />
              <div className={s.mEmpty}><b>Página em construção</b><span>volte em breve</span></div>
              <p className={s.mFoot}>A pessoa fechou e foi falar com outro.</p>
            </div>
          </div>
          <div className={s.beat} data-rua-play="">
            <h3 data-rua-type="">Seu Instagram é bonito. Mas o cliente ainda precisa <span className={s.hi} data-hi="">perguntar tudo por mensagem.</span></h3>
            <p className={s.beatN}>2 de 3</p>
            <div className={`${s.mock} ${s.mChat}`} role="img" aria-label="Três mensagens de clientes perguntando preço, horário e catálogo">
              <span className={s.mMsg}>Qual o preço?</span>
              <span className={s.mMsg}>Vocês abrem sábado?</span>
              <span className={s.mMsg}>Tem catálogo?</span>
              <span className={s.mTyping}><i /><i /><i /></span>
              <p className={s.mFoot}>…e as mesmas perguntas, todo dia.</p>
            </div>
          </div>
          <div className={s.beat} data-rua-play="">
            <h3 data-rua-type="">Você tentou fazer o site sozinho. <span className={s.hi} data-hi="">Ficou pela metade.</span></h3>
            <p className={s.beatN}>3 de 3</p>
            <div className={`${s.mock} ${s.mProg}`} role="img" aria-label="Seu site 30% pronto: modelo escolhido; textos, fotos e publicação pendentes">
              <div className={s.mProgHead}><span>Seu site</span><span><span data-rua-count="30">30</span>% pronto</span></div>
              <div className={s.mProgBar}><i /></div>
              <ul className={s.mList}>
                <li data-done="true">Escolher modelo</li>
                <li>Textos</li>
                <li>Fotos</li>
                <li>Publicar</li>
              </ul>
            </div>
            <p className={s.closing} data-rua-type="">Não falta esforço. <span>Falta um site à altura do seu trabalho.</span></p>
          </div>
        </div>
      </section>

      {/* 03 tentativas */}
      <section className={s.sec} id="tentativas" data-key="2">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.col}>
            <p className={s.eyebrow}>O que você já tentou</p>
            <h2 data-rua-type="">Você já tentou de tudo. Cada solução resolve <span className={s.hi} data-hi="">só um pedaço.</span></h2>
            <p className={s.lead} data-rua-words="">Instagram, WhatsApp, cartão, perfil no Google: todos ajudam. Mas nenhum mostra tudo o que seu negócio faz, num lugar só.</p>
            <p className={`${s.eyebrow} ${s.caption}`}>Toque ou passe o mouse em cada um</p>
          </div>
          <AttemptCards />
          <p className={s.triesFoot} data-rua-words="">Você não precisa abandonar nenhum deles. Precisa de um lugar que junte tudo e faça o visitante querer ficar: o seu site.</p>
        </div>
      </section>

      {/* 04 agora */}
      <section className={`${s.sec} ${s.now}`} id="agora" data-key="3">
        <div className={`${s.wrap} ${s.pad}`}>
          <h2>Você está nesta página há <span className={s.timer} id="rua-timer">0:00</span>.</h2>
          <p className={s.lead} data-rua-words="">Ninguém pediu para você ficar. Foi a curiosidade. É isso que o seu cliente deveria sentir no seu site.</p>
          <div className={s.ctas}>
            <ProposalButton source="sites">Quero um site assim</ProposalButton>
            <WhatsAppButton />
          </div>
        </div>
      </section>

      {/* 05 método */}
      <section id="metodo" data-key="4">
        <div className={s.sec} style={{ paddingBottom: 0 }}>
          <div className={`${s.wrap} ${s.pad}`}>
            <div className={s.drill}>
              <div className={s.col}>
                <p className={s.eyebrow}>Como funciona</p>
                <h2 data-rua-type="">Ninguém compra uma furadeira porque quer <span className={s.hi} data-hi="">uma furadeira.</span></h2>
                <p className={s.lead} data-rua-words="">Compra porque quer o furo na parede. E quer o furo porque quer o quadro pendurado. Com site é igual: você não precisa de páginas e botões. Precisa que as pessoas entendam o seu valor e chamem você. Por isso a gente começa pelo objetivo e só depois vai para a tela.</p>
                <p className={s.chain} id="rua-chain"><span>site novo</span>→<span>cliente entra</span>→<span>entende o que você faz</span>→<span>chama você</span></p>
              </div>
              <svg id="rua-drill" viewBox="0 0 560 320" role="img" aria-label="Uma furadeira faz um furo na parede, e um quadro com um telefone tocando é pendurado nele">
                <rect x="380" y="0" width="180" height="320" fill="#0C1428" />
                <g stroke="rgba(150,176,255,.16)" strokeWidth="1">
                  <line x1="380" y1="64" x2="560" y2="64" /><line x1="380" y1="128" x2="560" y2="128" /><line x1="380" y1="192" x2="560" y2="192" /><line x1="380" y1="256" x2="560" y2="256" />
                  <line x1="440" y1="0" x2="440" y2="64" /><line x1="500" y1="64" x2="500" y2="128" /><line x1="440" y1="128" x2="440" y2="192" /><line x1="500" y1="192" x2="500" y2="256" />
                </g>
                <line x1="380" y1="0" x2="380" y2="320" stroke="#9AA6C2" strokeWidth="1.5" />
                <circle id="rua-hole" cx="384" cy="120" r="0" fill="#060A14" stroke="#7885a5" strokeWidth="1" />
                <g id="rua-dust" fill="#9AA6C2" opacity="0"><circle cx="370" cy="112" r="2" /><circle cx="364" cy="128" r="1.5" /><circle cx="372" cy="134" r="1.8" /><circle cx="358" cy="118" r="1.2" /></g>
                <g id="rua-drill-g">
                  <rect x="140" y="98" width="170" height="44" rx="10" fill="none" stroke="#EDF0F7" strokeWidth="2" />
                  <path d="M180 142 L168 222 Q166 236 180 236 L212 236 Q224 236 222 222 L226 142" fill="none" stroke="#EDF0F7" strokeWidth="2" />
                  <line x1="196" y1="160" x2="214" y2="160" stroke="#FFB547" strokeWidth="3" strokeLinecap="round" />
                  <rect x="310" y="108" width="26" height="24" rx="3" fill="none" stroke="#EDF0F7" strokeWidth="2" />
                  <line id="rua-bit" x1="336" y1="120" x2="384" y2="120" stroke="#9AA6C2" strokeWidth="4" strokeDasharray="5 4" />
                  <g stroke="#7885a5" strokeWidth="1.5"><line x1="160" y1="112" x2="160" y2="128" /><line x1="170" y1="112" x2="170" y2="128" /><line x1="180" y1="112" x2="180" y2="128" /></g>
                </g>
                <g id="rua-frame" opacity="0">
                  <line x1="384" y1="120" x2="350" y2="150" stroke="#9AA6C2" strokeWidth="1.2" />
                  <line x1="384" y1="120" x2="418" y2="150" stroke="#9AA6C2" strokeWidth="1.2" />
                  <rect x="318" y="150" width="132" height="104" fill="#060A14" stroke="#EDF0F7" strokeWidth="3" />
                  <rect x="326" y="158" width="116" height="88" fill="none" stroke="rgba(150,176,255,.16)" strokeWidth="1" />
                  <path d="M370 222 q-8 -22 0 -40 l10 -2 l6 14 l-6 6 q2 8 10 14 l6 -6 l14 6 l-2 10 q-18 8 -38 -2z" fill="#FFB547" />
                  <g id="rua-rings" fill="none" stroke="#FFB547" strokeWidth="2" strokeLinecap="round"><path d="M412 186 q8 8 2 18" /><path d="M420 178 q14 14 4 32" /></g>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className={s.track} id="rua-track">
          <div className={s.stick}>
            <div className={`${s.wrap} ${s.pad}`}>
              <div className={s.mpanel}>
                <p className={s.mname} data-rua-type="">Como criamos o seu site</p>
                <p className={s.day}><span>Etapa <span id="rua-step">1</span></span><small>/ 4</small></p>
                <div className={s.segs} id="rua-segs" aria-hidden="true">{phases.map(([title], i) => <i key={title} data-on={String(i === 0)} />)}</div>
                <ol className={s.phases} id="rua-phases">
                  {phases.map(([title, text], i) => (
                    <li key={title} data-state={i === 0 ? "on" : "off"}>
                      <span className={s.phaseN}>{String(i + 1).padStart(2, "0")}</span>
                      <div><b>{title}</b><span>{text}</span></div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 pra quem */}
      <section className={s.sec} id="praquem" data-key="5">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.center}>
            <p className={s.eyebrow}>Antes de pedir sua proposta</p>
            <h2 data-rua-type="">Pra quem é. E <span className={s.hi} data-hi="">o que você recebe.</span></h2>
            <div className={s.who}>
              <div className={s.yes}>
                <h3>É pra você se</h3>
                <ul data-rua-stagger="">
                  <li><span>você ainda não tem site e depende do Instagram ou do WhatsApp;</span></li>
                  <li><span>seu site está lento, antigo ou não mostra o que você faz hoje;</span></li>
                  <li><span>você quer um site com a cara da sua marca;</span></li>
                  <li><span>você tem produtos ou serviços que merecem ser vistos com calma.</span></li>
                </ul>
              </div>
              <div className={s.get}>
                <h3>O que você recebe</h3>
                <ul data-rua-stagger="">
                  <li><span>preço, prazo e escopo antes de começar;</span></li>
                  <li><span>um site que abre rápido até em celular simples;</span></li>
                  <li><span>ajustes previstos na proposta;</span></li>
                  <li><span>orientação para atualizar depois.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 entregáveis */}
      <section className={s.sec} id="entregaveis" data-key="6">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.deliver}>
            <div>
              <p className={s.eyebrow}>Simule seu investimento</p>
              <h2 data-rua-type="">Escolha um plano e veja <span className={s.hi} data-hi="">o que vem incluso.</span></h2>
              <p className={s.lead} data-rua-words="">Preço, prazo e o que está incluso, antes de você decidir. Hotsites interativos e gamificação têm proposta sob medida.</p>
            </div>
            <PlanReceipt />
          </div>
        </div>
      </section>

      {/* 08 pilares */}
      <section className={s.sec} id="pilares" data-key="7">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.center}>
            <p className={s.eyebrow}>Os pilares da NexuSync</p>
            <h2 data-rua-type="">O que <span className={s.hi} data-hi="">todo site</span> da NexuSync tem.</h2>
            <p className={s.lead} data-rua-words="">Quatro cuidados, do primeiro rascunho à publicação.</p>
            <ol className={s.floors} id="rua-floors">
              {pillars.map((pillar, i) => (
                <li key={pillar.title} className={`${s.floor} ${i === 0 ? s.base : ""}`}>
                  <span className={s.floorN}>{String(i + 1).padStart(2, "0")}</span>
                  <div><h3>{pillar.title}</h3><p>{pillar.text}</p><Link href={pillar.href} className={s.floorLink}>{pillar.cta} →</Link></div>
                </li>
              ))}
            </ol>
            <p className={`${s.lead} ${s.alsoDesign}`} data-rua-words="">Também criamos design, motion graphics e vídeos para a sua marca. <Link href="/design" className={s.floorLink}>Ver design →</Link></p>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className={s.sec} id="faq">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.center}>
            <p className={s.eyebrow}>Perguntas frequentes</p>
            <h2 data-rua-type="">Antes de <span className={s.hi} data-hi="">decidir.</span></h2>
            <div className={s.faq}>
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* final */}
      <section className={`${s.final} ${s.grab}`} id="final" data-key="8" data-rua-grab="">
        <div className={`${s.wrap} ${s.pad}`}>
          <p className={s.eyebrow} style={{ justifyContent: "center" }}>Vamos começar?</p>
          <h2 data-rua-type="">Seu negócio já é único. Está na hora de o seu site <span className={s.hi} data-hi="">mostrar isso.</span></h2>
          <p className={`${s.lead} ${s.finalLead}`} data-rua-words="">Conte o que você faz. Você recebe preço, prazo e tudo o que entra no projeto antes de decidir.</p>
          <div className={s.ctas}>
            <ProposalButton source="sites">Pedir minha proposta</ProposalButton>
            <WhatsAppButton href={contactWhatsApp} />
          </div>
          <Link href="/templates" className={s.floorLink}>ou explore as demonstrações →</Link>
          <p className={s.contact}><span>{EMAIL}</span><span>WhatsApp {WA_DISPLAY}</span></p>
        </div>
      </section>

      <a className={s.waFloat} href={contactWhatsApp} target="_blank" rel="noopener noreferrer" aria-label="Falar com a NexuSync no WhatsApp"
        data-analytics-section="floating" data-analytics-interest="unspecified">
        <i>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
            <path d="M9.2 8.6c.2-.5.6-.6.9-.6h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.5 2.1 2.7 2.7l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.1.7-.6.9-.6.3-1.6.4-3-.3a8 8 0 0 1-3.5-3.5c-.7-1.4-.6-2.4-.3-3z" fill="currentColor" stroke="none" />
          </svg>
        </i>
        <span>Fale com a gente</span>
      </a>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.pad} ${s.footerInner}`}>
          <span>© NexuSync</span>
          <span>Sites sob medida e interativos. Design e motion graphics para a sua marca.</span>
          <span><Link href="/quem-somos">Quem somos</Link> · <Link href="/privacidade">Privacidade</Link></span>
        </div>
      </footer>
    </div>
  );
}
