import Image from "next/image";
import Link from "next/link";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { AttemptCards } from "./AttemptCards";
import { contactWhatsApp, EMAIL, faqs, phases, pillars, presence, presenceWhatsApp, quoteHref, receiptItems, WA_DISPLAY } from "./content";
import { ArrowIcon, SearchIcon } from "./icons";
import { RuaEffects } from "./RuaEffects";
import { RuaWorld } from "./RuaWorld";
import { SearchSimulator } from "./SearchSimulator";
import { VideoModal } from "./VideoModal";
import s from "./rua.module.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-rua-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-rua-body", display: "optional" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-rua-mono", display: "optional" });

const MARQUEE = ["Sites marcantes", "SEO orgânico", "Motion graphics", "Redes sociais", "Landing pages", "Hotsites"];

function QuoteButton({ source, children, small }: { source: "header" | "hero" | "sites"; children: React.ReactNode; small?: boolean }) {
  return (
    <Link className={`${s.btn} ${s.btnAmber} ${small ? s.btnSm : ""}`} href={quoteHref(source)}>
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

      <header className={s.nav}>
        <div className={`${s.wrap} ${s.pad} ${s.navInner}`}>
          <Link className={s.brand} href="/" aria-label="NexuSync, início">
            <Image src="/images/logo-text.png" width={517} height={91} sizes="150px" alt="NexuSync" priority />
          </Link>
          <nav className={s.navLinks} aria-label="Seções da página">
            <a href="#tentativas">O que não funciona</a>
            <a href="#metodo">Método</a>
            <a href="#praquem">Pra quem é</a>
            <a href="#entregaveis">Entregáveis</a>
            <a href="#pilares">Pilares</a>
          </nav>
          <QuoteButton source="header" small>
            <b className={s.long}>Quero ver meu orçamento</b>
            <b className={s.short}>Orçamento</b>
          </QuoteButton>
        </div>
      </header>

      {/* 01 hero */}
      <section className={`${s.hero} ${s.grab}`} id="top" data-key="0" data-rua-grab="">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>NexuSync · sites para negócios locais</p>
            <h1>
              O concorrente da sua rua <span id="rua-hl" className={s.hl} data-lit="false">já aparece no Google</span> quando alguém pesquisa o seu serviço.
            </h1>
            <p className={s.sub}>
              E quem não encontra você liga pra ele. A NexuSync acende a vitrine do seu negócio com um site marcante e SEO básico, sem depender de anúncio. Seu orçamento completo sai em 7 dias.
            </p>
            <ul className={s.bul}>
              <li><span>Quem pesquisa escolhe entre os primeiros resultados. <strong>Quem não aparece nem entra na disputa.</strong></span></li>
              <li><span>Instagram e indicação <strong>não aparecem quando alguém digita &quot;perto de mim&quot;.</strong></span></li>
              <li><span>Orçamento fechado em 7 dias, com <strong>preço, prazo e tudo o que está incluso.</strong></span></li>
            </ul>
            <div className={s.ctas}>
              <QuoteButton source="hero">Quero ver meu orçamento</QuoteButton>
              <VideoModal />
            </div>
          </div>
          <SearchSimulator />
          <p className={s.hint} aria-hidden="true"><b />role para acender a sua vitrine · arraste para girar a rua</p>
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
          <p className={s.eyebrow}>Você já viveu essa cena</p>
          <div className={s.beat}>
            <p className={s.beatN}>Cena 1 de 3 · A reunião</p>
            <h3>A reunião foi ótima. No dia seguinte, o cliente pesquisou o nome da sua empresa.</h3>
            <div className={s.mock} aria-label="Exemplo de busca sem resultado">
              <div className={s.mField}><SearchIcon /><span>sua empresa ltda</span></div>
              <p className={s.mNone}>Nenhum resultado encontrado para &quot;sua empresa ltda&quot;.</p>
              <p className={s.mSug}>Você quis dizer: <u>concorrente da sua rua</u>?</p>
            </div>
          </div>
          <div className={s.beat}>
            <p className={s.beatN}>Cena 2 de 3 · O Instagram</p>
            <h3>O Instagram que trazia clientes agora mal chega aos seus próprios seguidores.</h3>
            <div className={`${s.mock} ${s.mChart}`}>
              <div className={s.mCap}><span>Alcance dos posts</span><span>ilustrativo</span></div>
              <svg viewBox="0 0 320 120" role="img" aria-label="Linha de alcance caindo ao longo de seis meses">
                <g stroke="rgba(150,176,255,.16)" strokeWidth="1"><line x1="10" y1="20" x2="310" y2="20" /><line x1="10" y1="55" x2="310" y2="55" /><line x1="10" y1="90" x2="310" y2="90" /></g>
                <polyline points="10,26 70,22 130,38 190,52 250,74 310,92" fill="none" stroke="#5B97FF" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="310" cy="92" r="4.5" fill="#FFB547" />
                <g fill="#6A7694" fontSize="10" textAnchor="middle" style={{ fontFamily: "var(--mono)" }}>
                  <text x="10" y="114" textAnchor="start">jan</text><text x="70" y="114">fev</text><text x="130" y="114">mar</text><text x="190" y="114">abr</text><text x="250" y="114">mai</text><text x="310" y="114" textAnchor="end">jun</text>
                </g>
              </svg>
            </div>
          </div>
          <div className={s.beat}>
            <p className={s.beatN}>Cena 3 de 3 · O domingo</p>
            <h3>Num domingo, você abriu o Wix. Três horas depois, fechou a aba.</h3>
            <div className={`${s.mock} ${s.mEd}`}>
              <div className={s.mBar}><span>Editor · salvo há 3 h</span><button type="button" disabled>Publicar</button></div>
              <div className={s.mCanvas}>Arraste um elemento aqui</div>
            </div>
            <p className={s.closing}>Não falta esforço. <span>Falta estrutura.</span></p>
          </div>
        </div>
      </section>

      {/* 03 tentativas */}
      <section className={s.sec} id="tentativas" data-key="2">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.col}>
            <p className={s.eyebrow}>O que você já tentou</p>
            <h2>Seis jeitos de aparecer. Todos acendem por um tempo e apagam.</h2>
            <p className={s.lead}>Passe o mouse em cada um e veja a luz que ele dá ao seu negócio.</p>
          </div>
          <AttemptCards />
          <p className={s.triesFoot}>Cada um resolve um pedaço. Nenhum coloca você na frente de quem está procurando o seu serviço agora.</p>
        </div>
      </section>

      {/* 04 agora */}
      <section className={`${s.sec} ${s.now}`} id="agora" data-key="3">
        <div className={`${s.wrap} ${s.pad}`}>
          <h2>Você está nesta página há <span className={s.timer} id="rua-timer">0:00</span>.</h2>
          <p className={s.lead}>Quem pesquisa o seu serviço decide bem mais rápido que isso. E escolhe quem aparece primeiro.</p>
          <div className={s.ctas}>
            <QuoteButton source="sites">Quero ver meu orçamento</QuoteButton>
            <WhatsAppButton />
          </div>
          <span className={s.phone}>WhatsApp {WA_DISPLAY}</span>
        </div>
      </section>

      {/* 05 método */}
      <section id="metodo" data-key="4">
        <div className={s.sec} style={{ paddingBottom: 0 }}>
          <div className={`${s.wrap} ${s.pad}`}>
            <div className={s.drill}>
              <div className={s.col}>
                <p className={s.eyebrow}>O método</p>
                <h2>Ninguém compra uma furadeira porque quer uma furadeira.</h2>
                <p className={s.lead}>Compra porque quer o furo na parede. E quer o furo porque quer o quadro pendurado. Você não precisa de um site: precisa do telefone tocando. Por isso o nosso método começa pelo resultado e termina com um orçamento fechado.</p>
                <p className={s.chain} id="rua-chain"><span>furadeira</span>→<span>furo</span>→<span>quadro</span>→<span>telefone tocando</span></p>
              </div>
              <svg id="rua-drill" viewBox="0 0 560 320" role="img" aria-label="Uma furadeira faz um furo na parede, e um quadro com um telefone tocando é pendurado nele">
                <rect x="380" y="0" width="180" height="320" fill="#0C1428" />
                <g stroke="rgba(150,176,255,.16)" strokeWidth="1">
                  <line x1="380" y1="64" x2="560" y2="64" /><line x1="380" y1="128" x2="560" y2="128" /><line x1="380" y1="192" x2="560" y2="192" /><line x1="380" y1="256" x2="560" y2="256" />
                  <line x1="440" y1="0" x2="440" y2="64" /><line x1="500" y1="64" x2="500" y2="128" /><line x1="440" y1="128" x2="440" y2="192" /><line x1="500" y1="192" x2="500" y2="256" />
                </g>
                <line x1="380" y1="0" x2="380" y2="320" stroke="#9AA6C2" strokeWidth="1.5" />
                <circle id="rua-hole" cx="384" cy="120" r="0" fill="#060A14" stroke="#6A7694" strokeWidth="1" />
                <g id="rua-dust" fill="#9AA6C2" opacity="0"><circle cx="370" cy="112" r="2" /><circle cx="364" cy="128" r="1.5" /><circle cx="372" cy="134" r="1.8" /><circle cx="358" cy="118" r="1.2" /></g>
                <g id="rua-drill-g">
                  <rect x="140" y="98" width="170" height="44" rx="10" fill="none" stroke="#EDF0F7" strokeWidth="2" />
                  <path d="M180 142 L168 222 Q166 236 180 236 L212 236 Q224 236 222 222 L226 142" fill="none" stroke="#EDF0F7" strokeWidth="2" />
                  <line x1="196" y1="160" x2="214" y2="160" stroke="#FFB547" strokeWidth="3" strokeLinecap="round" />
                  <rect x="310" y="108" width="26" height="24" rx="3" fill="none" stroke="#EDF0F7" strokeWidth="2" />
                  <line id="rua-bit" x1="336" y1="120" x2="384" y2="120" stroke="#9AA6C2" strokeWidth="4" strokeDasharray="5 4" />
                  <g stroke="#6A7694" strokeWidth="1.5"><line x1="160" y1="112" x2="160" y2="128" /><line x1="170" y1="112" x2="170" y2="128" /><line x1="180" y1="112" x2="180" y2="128" /></g>
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
                <p className={s.mname}>Método Orçamento em 7 Dias</p>
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
            <p className={s.eyebrow}>Antes de pedir o orçamento</p>
            <h2>Pra quem é. E pra quem não é.</h2>
            <div className={s.who}>
              <div className={s.yes}>
                <h3>É pra você se</h3>
                <ul>
                  <li><span>seu negócio atende a sua cidade ou região e hoje vive de indicação;</span></li>
                  <li><span>você quer ser encontrado por quem ainda não te conhece;</span></li>
                  <li><span>você prefere decidir com preço e prazo na mão;</span></li>
                  <li><span>você responde rápido quando um cliente chama.</span></li>
                </ul>
              </div>
              <div className={s.no}>
                <h3>Não é pra você se</h3>
                <ul>
                  <li><span>você procura o site mais barato possível, de qualquer jeito;</span></li>
                  <li><span>você não tem tempo pra atender os contatos que chegarem;</span></li>
                  <li><span>você espera resultado sem mudar nada no atendimento.</span></li>
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
              <p className={s.eyebrow}>O que entra no seu orçamento</p>
              <h2>Sete entregas. Um preço fechado.</h2>
            </div>
            <div className={s.rcwrap}>
              <div className={s.receipt} id="rua-receipt">
                <div className={s.rcHead}>
                  <b>NEXUSYNC · ORÇAMENTO</b>
                  <span>Plano {presence.name} · {presence.badge?.toLowerCase()}</span>
                  <span>{presence.deliveryTime}</span>
                </div>
                <ol className={s.rcItems}>
                  {receiptItems.map((item) => (
                    <li key={item} className={s.rcLine} data-rua-line="" data-ink="false">
                      <span className={s.t}>{item}</span><span className={s.dots} /><span className={s.v}>incluso</span>
                    </li>
                  ))}
                </ol>
                <div className={s.rcTot}>
                  <div className={s.was}><span>De</span><s>R$ {presence.originalPrice}</s></div>
                  <div className={s.pay}><span>Seu investimento</span><span>R$ {presence.price}</span></div>
                </div>
                <p className={s.rcNote}>Registro de domínio e hospedagem são orçados à parte.</p>
                <div className={s.barcode} aria-hidden="true" />
                <p className={s.rcFoot}>obrigado por aparecer.</p>
              </div>
            </div>
            <div className={s.ctas}>
              <QuoteButton source="sites">Quero ver meu orçamento</QuoteButton>
            </div>
          </div>
        </div>
      </section>

      {/* 08 pilares */}
      <section className={s.sec} id="pilares" data-key="7">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.center}>
            <p className={s.eyebrow}>Os pilares da NexuSync</p>
            <h2>Primeiro a vitrine acende. Depois a rua inteira vê.</h2>
            <p className={s.lead}>Trabalhamos em quatro pilares, nessa ordem. Cada um se apoia no anterior: o anúncio pago é o último andar, nunca o alicerce.</p>
            <ol className={s.floors}>
              {pillars.map((pillar, i) => (
                <li key={pillar.title} className={`${s.floor} ${i === 0 ? s.base : ""}`}>
                  <span className={s.floorN}>{String(i + 1).padStart(2, "0")}</span>
                  <div><h3>{pillar.title}</h3><p>{pillar.text}</p>{"href" in pillar && <Link href={pillar.href} className={s.floorLink}>{pillar.cta} →</Link>}</div>
                  {"tag" in pillar && <span className={`${s.lvl} ${i === 0 ? "" : s.lvlDim}`}>{pillar.tag}</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className={s.sec} id="faq">
        <div className={`${s.wrap} ${s.pad}`}>
          <div className={s.center}>
            <p className={s.eyebrow}>Perguntas frequentes</p>
            <h2>Antes de decidir.</h2>
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
          <p className={s.eyebrow} style={{ justifyContent: "center" }}>A próxima busca</p>
          <h2>Na próxima busca, quem aparece é você.</h2>
          <div className={s.ctas}>
            <QuoteButton source="sites">Quero ver meu orçamento</QuoteButton>
            <WhatsAppButton href={contactWhatsApp} />
          </div>
          <p className={s.contact}><span>{EMAIL}</span><span>WhatsApp {WA_DISPLAY}</span></p>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.pad} ${s.footerInner}`}>
          <span>© NexuSync</span>
          <span>Sites, design, redes sociais e tráfego pago, nessa ordem.</span>
          <span><Link href="/quem-somos">Quem somos</Link> · <Link href="/privacidade">Privacidade</Link></span>
        </div>
      </footer>
    </div>
  );
}
