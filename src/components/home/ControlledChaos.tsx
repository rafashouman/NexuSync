"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChaosHeader, ChaosFooter } from "./ChaosChrome";
import { ReactiveField } from "./ReactiveField";
import { ExperienceVisual, type ExperienceKind } from "./ExperienceVisual";
import { HomePlans } from "./HomePlans";
import { heroScreenshots, type HeroDeviceMode } from "./hero-templates";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Plus,
  Pause,
  Play,
  Smartphone,
  Laptop,
  Minimize2,
} from "lucide-react";
import { waLink } from "@/lib/site-config";
import s from "./ControlledChaos.module.css";

const Scene = dynamic(() => import("./ChaosScene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode; onReady?: (ready: boolean) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onReady?.(false);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
const contact = "/contato?interest=nao-sei&source=hero#orcamento";
const services = [
  {
    n: "01",
    title: "Sites que conectam.",
    copy: "Seu negócio faz um bom trabalho. Seu site precisa mostrar isso.",
    text: "Criamos sites modernos, responsivos e fáceis de navegar para apresentar seus serviços com clareza e transmitir confiança desde o primeiro contato.",
    href: "/criacao-de-sites",
    tag: "SITES / LANDING PAGES / E-COMMERCE",
    art: "web",
  },
  {
    n: "02",
    title: "Menos tarefas. Mais tempo.",
    copy: "Seu tempo vale mais do que tarefas repetitivas.",
    text: "Desenvolvemos sistemas web e automações para tornar sua operação mais prática e organizada.",
    href: "/apps",
    tag: "APLICATIVOS / SISTEMAS / AUTOMAÇÕES",
    art: "app",
  },
  {
    n: "03",
    title: "Design em movimento.",
    copy: "Sua empresa merece ser vista e lembrada.",
    text: "Seu cliente precisa reconhecer sua marca e entender sua oferta. Identidade visual, interfaces e motion graphics para valorizar sua marca.",
    href: "/design",
    tag: "IDENTIDADE / MOTION GRAPHICS / UI",
    art: "motion",
  },
  {
    n: "04",
    title: "Sua marca vai mais longe.",
    copy: "Receba mais visitas, conquiste mais clientes!",
    text: "Da presença online à performance, unimos tecnologia, estratégia e design para gerar crescimento.",
    href: "/marketing",
    tag: "TRÁFEGO PAGO / REDES SOCIAIS / SEO",
    art: "growth",
  },
];
const steps = [
  [
    "Entendemos seu negócio",
    "Conte o que sua empresa oferece, quem atende e o que quer melhorar. Não precisa conhecer termos técnicos.",
  ],
  [
    "Definimos a proposta",
    "Você recebe o escopo, o investimento, o prazo e os materiais necessários antes de decidir.",
  ],
  [
    "Criamos e apresentamos",
    "Desenvolvemos o projeto e mostramos para sua revisão, com os ajustes previstos na proposta.",
  ],
  [
    "Publicamos e orientamos",
    "Depois da sua aprovação, colocamos o projeto no ar e explicamos os próximos passos previstos no escopo.",
  ],
];
const faqs = [
  [
    "Qual tipo de site é indicado para meu negócio?",
    "Uma landing page concentra uma oferta e facilita o contato. Um site institucional apresenta a empresa e seus serviços. Um hotsite atende uma campanha, evento ou lançamento. Ajudamos a escolher conforme seu objetivo.",
  ],
  [
    "Preciso fornecer textos, fotos e logotipo?",
    "Reunimos as informações e os materiais disponíveis no início do projeto. A proposta define o que você fornece e se será necessário contratar produção de textos, imagens ou identidade visual.",
  ],
  [
    "Domínio e hospedagem estão incluídos?",
    "O registro do domínio e a hospedagem precisam ser confirmados no orçamento. Configurar um domínio não inclui automaticamente pagar seu registro ou suas renovações.",
  ],
  [
    "O site funciona no celular?",
    "Sim. Os sites são adaptados para celular, tablet e computador, com atenção à leitura, à navegação e aos botões de contato.",
  ],
];

function ServiceArt({ kind }: { kind: string }) {
  const scene: ExperienceKind = kind === "motion" ? "design" : kind === "growth" ? "marketing" : kind === "app" ? "app" : "web";
  return <div className={s.serviceArt}><ExperienceVisual kind={scene} /></div>;
}

export default function ControlledChaos() {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [render3d, setRender3d] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [device, setDevice] = useState<HeroDeviceMode>("notebook");
  const [desktop, setDesktop] = useState(false);
  const [devicesMaximized, setDevicesMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateHintPosition, setTemplateHintPosition] = useState({ x: 0, y: 0 });
  const deviceMode = desktop ? device : "phone";
  const fallbackScreenshots = heroScreenshots(deviceMode).slice(
    0,
    deviceMode === "phone" ? 6 : 4,
  );
  const hero = useRef<HTMLDivElement>(null);
  const heroVisual = useRef<HTMLDivElement>(null);
  const heroPointer = useRef({
    x: 0,
    y: 0,
    inside: false,
    dragging: false,
    dragDelta: 0,
    throwVelocity: 0,
    throwRevision: 0,
  });
  const dragState = useRef({
    active: false,
    pointerId: -1,
    lastX: 0,
    startY: 0,
    lastTime: 0,
    velocity: 0,
  });
  useEffect(() => {
    if (!devicesMaximized) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDevicesMaximized(false);
        setSelectedTemplate(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [devicesMaximized]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 761px)");
    const updateDesktop = () => setDesktop(desktopQuery.matches);
    updateDesktop();
    desktopQuery.addEventListener("change", updateDesktop);
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      setPaused(preference.matches);
      if (preference.matches) setRender3d(false);
      else timer = setTimeout(() => setRender3d(true), 500);
    };
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    if (hero.current) observer.observe(hero.current);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", update);
      desktopQuery.removeEventListener("change", updateDesktop);
      observer.disconnect();
    };
  }, []);
  return (
    <div className={s.home} data-paused={paused}>
      <ChaosHeader />

      <div className={s.heroStage}>
        <Image
          src="/images/hero-backdrop.webp"
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          className={s.heroBackdrop}
        />
        <section
          className={s.hero}
          ref={hero}
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse" || paused) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            heroPointer.current.x = Math.max(
              -1,
              Math.min(
                1,
                ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
              ),
            );
            heroPointer.current.y = Math.max(
              -1,
              Math.min(
                1,
                1 - ((event.clientY - bounds.top) / bounds.height) * 2,
              ),
            );
            heroPointer.current.inside = true;
          }}
          onPointerLeave={() => {
            if (!heroPointer.current.dragging) {
              heroPointer.current.x = 0;
              heroPointer.current.y = 0;
              heroPointer.current.inside = false;
            }
          }}
        >
          <div className={s.heroGrid} aria-hidden="true" />
          <div className={s.heroTop}>
            <span>
              <i /> AGÊNCIA DIGITAL / NEXUSYNC
            </span>
            <span>ESTRATÉGIA. DESIGN. TECNOLOGIA.</span>
          </div>
          <div className={s.heroCopy}>
            <h1>
              Seu negócio
              <br />
              merece{" "}
              <span>
                ir mais
                <br />
                <em>longe.</em>
                <svg viewBox="0 0 310 26" aria-hidden="true">
                  <path d="M3 20Q155 -7 305 10" />
                </svg>
              </span>
            </h1>
            <p>
              Sites, aplicativos e estratégias para atrair mais clientes,
              fortalecer sua marca e gerar resultados reais no digital.
            </p>
            <div className={s.heroActions}>
              <Link href={contact} className={s.primary}>
                Tirar meu projeto do papel <ArrowUpRight size={20} />
              </Link>
              <a href="#servicos" className={s.textLink}>
                Conhecer soluções <ArrowDown size={16} />
              </a>
            </div>
          </div>
          <div
            className={s.heroVisual}
            ref={heroVisual}
            id="hero-devices"
            data-device={deviceMode}
            data-maximized={devicesMaximized}
            data-dragging={isDragging}
            data-template-selected={selectedTemplate ? "true" : undefined}
            onPointerDown={(event) => {
              if (paused || (event.target as HTMLElement).closest("button")) return;
              dragState.current = {
                active: true,
                pointerId: event.pointerId,
                lastX: event.clientX,
                startY: event.clientY,
                lastTime: performance.now(),
                velocity: 0,
              };
              heroPointer.current.dragging = true;
              heroPointer.current.inside = true;
              setIsDragging(true);
            }}
            onPointerMove={(event) => {
              if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              const now = performance.now();
              const dx = event.clientX - dragState.current.lastX;
              const dtSec = Math.max(0.008, (now - dragState.current.lastTime) / 1000);
              const rad = (dx / Math.max(bounds.width, 280)) * Math.PI * 1.45;
              heroPointer.current.dragDelta += rad;
              heroPointer.current.x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
              heroPointer.current.y = Math.max(-1, Math.min(1, 1 - ((event.clientY - bounds.top) / bounds.height) * 2));
              const instantVel = rad / dtSec;
              dragState.current.velocity = dragState.current.velocity * 0.45 + instantVel * 0.55;
              dragState.current.lastX = event.clientX;
              dragState.current.lastTime = now;
            }}
            onPointerUp={(event) => {
              if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;
              const fling = dragState.current.velocity;
              if (selectedTemplate && event.clientY - dragState.current.startY < -55) {
                router.push(`/templates/${selectedTemplate}`);
              }
              if (Math.abs(fling) > 0.08) {
                heroPointer.current.throwVelocity = Math.max(-7.5, Math.min(7.5, fling * 1.35));
                heroPointer.current.throwRevision += 1;
              }
              dragState.current.active = false;
              heroPointer.current.dragging = false;
              setIsDragging(false);
            }}
            onPointerCancel={(event) => {
              if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;
              dragState.current.active = false;
              heroPointer.current.dragging = false;
              setIsDragging(false);
            }}
          >
            <div className={s.coreHalo} aria-hidden="true" />
            <div
              className={s.templateFallback}
              data-ready={sceneReady}
              data-device={deviceMode}
              aria-hidden="true"
            >
              {fallbackScreenshots.map((src, i) => {
                const deg = (i * 360) / fallbackScreenshots.length;
                return (
                  <div
                    key={src}
                    style={{
                      transform: `rotateY(${deg}deg) translateZ(${deviceMode === "phone" ? 155 : 175}px) rotateY(${-deg}deg)`,
                    }}
                  >
                    <Image
                      src={src}
                      fill
                      sizes={deviceMode === "phone" ? "110px" : "180px"}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
            {render3d && (
              <div className={s.canvas} data-ready={sceneReady}>
                <SceneBoundary onReady={setSceneReady}>
                  <Scene
                    active={inView && !paused}
                    mode={deviceMode}
                    maximized={devicesMaximized}
                    onReady={setSceneReady}
                    input={heroPointer}
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={(slug, point) => {
                      setSelectedTemplate(slug);
                      if (slug && point && heroVisual.current) {
                        const bounds = heroVisual.current.getBoundingClientRect();
                        setTemplateHintPosition({
                          x: Math.max(140, Math.min(bounds.width - 140, point.x - bounds.left)),
                          y: Math.max(54, point.y - bounds.top - 18),
                        });
                      }
                    }}
                  />
                </SceneBoundary>
              </div>
            )}
            {selectedTemplate && (
              <div
                className={s.templateLaunchHint}
                style={{ left: templateHintPosition.x, top: templateHintPosition.y }}
              >
                <Link href={`/templates/${selectedTemplate}`} aria-label={`Abrir template ${selectedTemplate}`}>
                  <ArrowUp size={18} />
                  Veja o template<br />
                  Clique e arraste para cima
                </Link>
                <button type="button" aria-label="Fechar template ampliado" onClick={() => setSelectedTemplate(null)}>
                  ×
                </button>
              </div>
            )}
            <span className={s.visualTag} aria-hidden="true">
              PROJETOS EM ÓRBITA.
              <br />
              <b>SUA MARCA NO PRÓXIMO.</b>
            </span>
            <span className={s.cross} aria-hidden="true">+</span>
            <span className={s.verticalLabel} aria-hidden="true">CREATIVE SYSTEM / 001</span>
            <button
              type="button"
              className={s.heroSticker}
              aria-pressed={devicesMaximized}
              aria-label={
                devicesMaximized
                  ? "Minimizar dispositivos na tela"
                  : "Maximizar dispositivos na tela"
              }
              onClick={() => {
                setDevicesMaximized((prev) => !prev);
                setRender3d(true);
              }}
            >
              {devicesMaximized ? (
                <>
                  RESTAURAR
                  <br />
                  TELA. <Minimize2 />
                </>
              ) : (
                <>
                  FORA
                  <br />
                  DO ÓBVIO. <ArrowUpRight />
                </>
              )}
            </button>
          </div>
          <div className={s.heroBottom}>
            <span>
              Tecnologia de ponta <i /> Design estratégico <i /> Foco em
              resultados
            </span>
            <div
              className={s.deviceControls}
              role="group"
              aria-label="Formato dos mockups"
            >
              <button
                type="button"
                aria-pressed={device === "phone"}
                aria-controls="hero-devices"
                onClick={() => {
                  setSelectedTemplate(null);
                  if (device !== "phone") {
                    setSceneReady(false);
                    setDevice("phone");
                  }
                }}
              >
                <Smartphone size={14} />
                Smartphones
              </button>
              <button
                type="button"
                aria-pressed={device === "notebook"}
                aria-controls="hero-devices"
                onClick={() => {
                  setSelectedTemplate(null);
                  if (device !== "notebook") {
                    setSceneReady(false);
                    setDevice("notebook");
                  }
                }}
              >
                <Laptop size={15} />
                Notebooks
              </button>
            </div>
            <button
              onClick={() => {
                setPaused(!paused);
                setRender3d(true);
              }}
              aria-label={paused ? "Ativar animações" : "Pausar animações"}
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}{" "}
              {paused ? "Ativar movimento" : "Pausar movimento"}
            </button>
          </div>
        </section>
      </div>

      <nav className={s.solutionIndex} aria-label="Acessos rápidos às soluções">
        <span>
          ESCOLHA O SEU <br />
          PRÓXIMO PASSO.
        </span>
        <div>
          {[
            ["Sites & lojas", "/criacao-de-sites"],
            ["Apps & automações", "/apps"],
            ["Design & motion", "/design"],
            ["Tráfego & SEO", "/marketing"],
          ].map(([label, href], i) => (
            <Link key={href} href={href}>
              <small>0{i + 1}</small>
              <span>{label}</span>
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
      </nav>

      <section className={s.section} id="servicos">
        <div className={s.sectionLabel}>
          <span>01 / O QUE FAZEMOS</span>
          <span>CRIATIVIDADE COM DIREÇÃO ↘</span>
        </div>
        <div className={s.sectionHeading}>
          <h2>
            Sua próxima fase.
            <br />
            <span>Começa aqui.</span>
          </h2>
          <p>
            Soluções digitais completas para o seu negócio. Da presença online à
            performance, unimos tecnologia, estratégia e design para gerar
            crescimento.
          </p>
        </div>
        <div className={s.serviceGrid}>
          {services.map((service) => (
            <Link href={service.href} className={s.serviceCard} key={service.n}>
              <ServiceArt kind={service.art} />
              <div className={s.serviceInfo}>
                <div className={s.serviceMeta}>
                  <span>
                    {service.n} / {service.tag}
                  </span>
                  <ArrowUpRight />
                </div>
                <h3>{service.title}</h3>
                <h4>{service.copy}</h4>
                <p>{service.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={s.manifesto} id="manifesto" data-cursor-tone="ink">
        <span className={s.sectionLabel}>
          PRESENÇA É MAIS DO QUE ESTAR ONLINE.
        </span>
        <h2>
          Seu negócio tem
          <br />
          <span className={s.manifestoBlue}>personalidade.</span>
          <br />
          <span className={s.manifestoGreen}>Sua presença digital</span>
          <br />
          também <em>precisa ter.</em>
          <ArrowUpRight />
        </h2>
        <div>
          <p>
            Facilite o caminho entre conhecer sua empresa e falar com você. Um
            bom site combina informação, confiança e caminhos claros para o
            cliente dar o próximo passo.
          </p>
          <Link href="/templates" className={s.darkButton}>
            Explore nossos projetos <ArrowUpRight size={20} />
          </Link>
        </div>
        <span className={s.manifestoField}>
          <ReactiveField paused={paused} />
        </span>
      </section>

      <section className={s.section} id="como-funciona">
        <div className={s.sectionLabel}>
          <span>02 / DA IDEIA AO MUNDO</span>
          <span>SEM COMPLICAÇÃO.</span>
        </div>
        <div className={s.sectionHeading}>
          <h2>
            Processo claro.
            <br />
            <span>Próximo passo certo.</span>
          </h2>
          <p>
            Do primeiro contato ao site publicado, com etapas claras. Você sabe
            o que acontece em cada fase e o que precisamos para tirar o projeto
            do papel.
          </p>
        </div>
        <ol className={s.steps}>
          {steps.map(([title, body], i) => (
            <li key={title}>
              <span>
                0{i + 1}
                <ArrowUpRight />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <HomePlans />

      <section className={`${s.section} ${s.faq}`} id="faq">
        <div>
          <span className={s.sectionLabel}>04 / VAMOS SIMPLIFICAR</span>
          <h2>
            Boas perguntas.
            <br />
            <span>Respostas claras.</span>
          </h2>
          <p>
            Confira prazos, investimento e o que cada serviço inclui. A proposta
            define as entregas e as condições antes de começarmos.
          </p>
        </div>
        <div>
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={20} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
          <Link href="/contato" className={s.textLink}>
            Ainda tem uma dúvida? Fale com a gente <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className={s.contact} id="contato">
        <ReactiveField
          shape="weave"
          paused={paused}
          className={s.contactField}
        />
        <span className={s.sectionLabel}>
          A PRÓXIMA CONEXÃO COMEÇA COM UMA CONVERSA.
        </span>
        <Link href={contact}>
          <h2>
            Vamos criar
            <br />
            <em>algo grande?</em>
          </h2>
          <span className={s.contactArrow}>
            <ArrowUpRight />
          </span>
        </Link>
        <div>
          <p>O que falta para seu cliente chamar você?</p>
          <a
            href={waLink(
              "Olá! Vim pelo site da NexuSync e gostaria de falar sobre um projeto.",
            )}
          >
            Fale pelo WhatsApp <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <ChaosFooter />
    </div>
  );
}
