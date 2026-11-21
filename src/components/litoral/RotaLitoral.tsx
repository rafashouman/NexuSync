"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from "react";
import {
  STOPS,
  TOTAL_KM,
  buildScrollKeys,
  createSky,
  formatHour,
  rgbCss,
  skyAt,
  tAtScroll,
  type ScrollKey,
} from "./litoral-route";
import type { RouteState } from "./LitoralScene";
import { STATIONS, useRadio } from "./useRadio";
import s from "./litoral.module.css";

const LitoralScene = dynamic(() => import("./LitoralScene"), { ssr: false });

/** Se o WebGL falhar, fica só o céu em gradiente e o site continua inteiro. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function useLowPower() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(max-width: 767px)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4,
    () => false,
  );
}

const ROOMS = [
  {
    name: "Suíte Vista Mar",
    who: "Casal",
    capacity: 2,
    size: "28 m²",
    note: "Para acordar com o barulho das ondas.",
    features: ["Varanda com rede e vista para o mar", "Cama king e ar-condicionado", "Chuveiro com água quente"],
  },
  {
    name: "Chalé Jardim",
    who: "Pequenos grupos",
    capacity: 4,
    size: "36 m²",
    note: "Para quem prefere ficar mais dias, sem pressa.",
    features: ["Sala com cozinha compacta", "Deck privativo entre as palmeiras", "Quarto com cama queen e sofá-cama"],
  },
  {
    name: "Quarto Família",
    who: "Famílias",
    capacity: 5,
    size: "42 m²",
    note: "Todo mundo junto, cada um no seu canto.",
    features: ["Dois ambientes com porta", "Cama de casal e três de solteiro", "Ar-condicionado e frigobar"],
  },
];

const TOURS = [
  { id: "praia", name: "Praia deserta", meta: "2 h · leve", text: "Caminhada pela faixa de areia até a ponta, com parada para o banho." },
  { id: "trilha", name: "Trilha do farol", meta: "3 h · moderada", text: "Subida entre a mata de restinga até o mirante, de onde se vê a baía inteira." },
  { id: "surf", name: "Aula de surf", meta: "1h30 · todos os níveis", text: "Turma pequena para quem nunca pegou uma onda e para quem quer voltar à prancha." },
  { id: "barco", name: "Pôr do sol de barco", meta: "2 h · leve", text: "Saída no fim da tarde pela baía, com o farol acendendo ao fundo." },
];

const MEALS = [
  { id: "cafe", name: "Café da manhã", text: "Pães, frutas, geleias e café coado na hora, servidos na varanda." },
  { id: "petisco", name: "Petiscos do fim de tarde", text: "Porções para dividir enquanto o sol desce no mar." },
  { id: "jantar", name: "Jantar sob reserva", text: "Peixe do dia e opções vegetarianas, com mesa na varanda ou no salão." },
];

const WHATSAPP_BASE = "https://wa.me/?text=";

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function Cta({ children, solid, ...props }: { children: ReactNode; solid?: boolean } & ComponentProps<"a">) {
  return (
    <a className={`${s.btn} ${solid ? s.btnSolid : ""}`} {...props}>
      <span>{children}</span>
      <em aria-hidden="true">↗</em>
    </a>
  );
}

function Stepper({ label, value, min, max, onChange, unit }: { label: string; value: number; min: number; max: number; onChange: (next: number) => void; unit: string }) {
  return (
    <div className={s.field}>
      <span className={s.fieldLabel} id={`step-${label}`}>{label}</span>
      <div className={s.stepper} role="group" aria-labelledby={`step-${label}`}>
        <button type="button" className={s.arrowBtn} aria-label={`Diminuir ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>←</button>
        <output aria-live="polite">{value} {unit}</output>
        <button type="button" className={s.arrowBtn} aria-label={`Aumentar ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>→</button>
      </div>
    </div>
  );
}

export default function RotaLitoral() {
  const route = useRef<RouteState>({ t: 0 });
  const sections = useRef<(HTMLElement | null)[]>([]);
  const keys = useRef<ScrollKey[]>([[0, 0], [1, 1]]);
  const centers = useRef<number[]>([0]);
  const stage = useRef<HTMLDivElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const low = useLowPower();
  const radio = useRadio();

  const [showScene, setShowScene] = useState(false);
  const [active, setActive] = useState(0);
  const [room, setRoom] = useState(0);
  const [tours, setTours] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setShowScene(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const sky = createSky();
    let frameId = 0;
    let current = 0;

    const measure = () => {
      const viewport = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - viewport);
      const tops: number[] = [];
      const heights: number[] = [];
      sections.current.forEach((element) => {
        const box = element?.getBoundingClientRect();
        tops.push((box?.top ?? 0) + window.scrollY);
        heights.push(box?.height ?? viewport);
      });
      keys.current = buildScrollKeys(tops, heights, viewport, max);
      centers.current = tops.map((top, i) => Math.min(max, Math.max(0, top + heights[i] / 2 - viewport / 2)));
    };

    const update = () => {
      frameId = 0;
      const y = window.scrollY;
      const t = tAtScroll(keys.current, y);
      route.current.t = t;
      skyAt(t, sky);

      if (kmRef.current) kmRef.current.textContent = `KM ${(t * TOTAL_KM).toFixed(1).padStart(4, "0")}`;
      if (clockRef.current) clockRef.current.textContent = formatHour(sky.hour);
      if (fillRef.current) fillRef.current.style.width = `${t * 100}%`;
      stage.current?.style.setProperty("--sky-top", rgbCss(sky.top));
      stage.current?.style.setProperty("--sky-bottom", rgbCss(sky.horizon));

      let nearest = 0;
      let best = Infinity;
      centers.current.forEach((center, i) => {
        const distance = Math.abs(center - y);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      });
      if (periodRef.current) periodRef.current.textContent = STOPS[nearest].period;
      if (nearest !== current) {
        current = nearest;
        setActive(nearest);
      }
    };

    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const target = Math.max(0, Math.min(STOPS.length - 1, index));
    const element = sections.current[target];
    element?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: target === 0 ? "start" : "center" });
  }, [reduced]);

  const toggle = (id: string, set: Dispatch<SetStateAction<string[]>>) =>
    set((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));

  const selectedTours = TOURS.filter((tour) => tours.includes(tour.id));
  const selectedMeals = MEALS.filter((meal) => meals.includes(meal.id));
  const chosen = ROOMS[room];
  const overCapacity = guests > chosen.capacity;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const today = new Date().toLocaleDateString("sv-SE");
    if (date && date < today) {
      setError("Escolha uma data de check-in a partir de hoje.");
      return;
    }
    setError("");
    const lines = [
      "Olá! Quero planejar uma estadia na Pousada Maré Mansa.",
      name ? `Meu nome é ${name}.` : "",
      `Acomodação: ${chosen.name}.`,
      date ? `Check-in: ${formatDate(date)}.` : "Datas: ainda vou combinar.",
      `${nights} ${nights === 1 ? "noite" : "noites"} para ${guests} ${guests === 1 ? "hóspede" : "hóspedes"}.`,
      selectedTours.length ? `Passeios: ${selectedTours.map((tour) => tour.name).join(", ")}.` : "",
      selectedMeals.length ? `Refeições: ${selectedMeals.map((meal) => meal.name).join(", ")}.` : "",
    ].filter(Boolean);
    window.open(WHATSAPP_BASE + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  const station = STATIONS[radio.station];

  return (
    <div className={s.root}>
      <div className={s.stage} ref={stage} aria-hidden="true">
        {showScene && (
          <SceneBoundary>
            <LitoralScene route={route} still={reduced} low={low} />
          </SceneBoundary>
        )}
      </div>
      <div className={s.grain} aria-hidden="true" />
      <div className={s.vignette} aria-hidden="true" />

      <header className={s.top}>
        <a className={s.brand} href="#conteudo" onClick={(event) => { event.preventDefault(); goTo(0); }}>
          <span aria-hidden="true" className={s.brandMark} />
          Maré Mansa
        </a>
        <nav className={s.route} aria-label="Paradas da viagem">
          <span className={s.track} aria-hidden="true"><span ref={fillRef} /></span>
          <ol>
            {STOPS.map((stop, index) => (
              <li key={stop.id} style={{ left: `${stop.t * 100}%` }}>
                <button type="button" aria-current={index === active ? "step" : undefined} onClick={() => goTo(index)}>
                  <span className={s.dot} aria-hidden="true" />
                  <span className={s.stopText}><b>KM {stop.km}</b> {stop.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <Link className={s.exit} href="/templates">
          <span>Todos os templates</span> <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <main id="conteudo" className={s.content}>
        <section ref={(element) => { sections.current[0] = element; }} className={`${s.stop} ${s.hero}`} aria-labelledby="rota-partida">
          <div className={s.panel}>
            <p className={s.kicker}>Pousada · Litoral Sul de Santa Catarina</p>
            <h1 id="rota-partida">Chegue devagar.<br /><em>Fique até a maré virar.</em></h1>
            <p className={s.lead}>
              Uma pousada à beira-mar, com café da manhã, passeios e noites sem pressa. Role a página e dirija o dia inteiro, do amanhecer até a nossa porta.
            </p>
            <div className={s.actions}>
              <Cta solid href="#reserva" onClick={(event) => { event.preventDefault(); goTo(4); }}>Planejar minha estadia</Cta>
              <button type="button" className={s.textBtn} onClick={() => goTo(1)}>Começar a viagem ↓</button>
            </div>
            <p className={s.hint}>Role para dirigir. A luz muda conforme as horas passam.</p>
          </div>
        </section>

        <section ref={(element) => { sections.current[1] = element; }} className={s.stop} aria-labelledby="rota-quartos">
          <div className={s.panel}>
            <p className={s.kicker}>Km 10 · Manhã</p>
            <h2 id="rota-quartos">Acorde com o mar <em>na janela.</em></h2>
            <p className={s.lead}>Três jeitos de ficar. A acomodação que você escolher acompanha você até a reserva.</p>
            <article className={s.card} aria-live="polite">
              <p className={s.mono}>Acomodação {room + 1} de {ROOMS.length} · até {chosen.capacity} pessoas · {chosen.size}</p>
              <h3>{chosen.name}</h3>
              <p className={s.muted}>{chosen.note}</p>
              <ul className={s.list}>
                {chosen.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </article>
            <div className={s.actions}>
              <button type="button" className={s.arrowBtn} aria-label="Acomodação anterior" onClick={() => setRoom((room + ROOMS.length - 1) % ROOMS.length)}>←</button>
              <button type="button" className={s.arrowBtn} aria-label="Próxima acomodação" onClick={() => setRoom((room + 1) % ROOMS.length)}>→</button>
              <Cta href="#reserva" onClick={(event) => { event.preventDefault(); goTo(4); }}>Quero esta acomodação</Cta>
            </div>
          </div>
        </section>

        <section ref={(element) => { sections.current[2] = element; }} className={`${s.stop} ${s.right}`} aria-labelledby="rota-passeios">
          <div className={s.panel}>
            <p className={s.kicker}>Km 21 · Tarde</p>
            <h2 id="rota-passeios">A tarde é de quem <em>não tem pressa.</em></h2>
            <p className={s.lead}>Marque o que quiser fazer e monte o seu roteiro. Nada é obrigatório.</p>
            <ul className={s.choices}>
              {TOURS.map((tour) => {
                const on = tours.includes(tour.id);
                return (
                  <li key={tour.id}>
                    <button type="button" className={s.choice} aria-pressed={on} onClick={() => toggle(tour.id, setTours)}>
                      <span className={s.choiceHead}><b>{tour.name}</b><i>{on ? "✓ No roteiro" : "+ Adicionar"}</i></span>
                      <span className={s.mono}>{tour.meta}</span>
                      <span className={s.muted}>{tour.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className={s.hint} aria-live="polite">{tours.length ? `${tours.length} ${tours.length === 1 ? "passeio" : "passeios"} no seu roteiro.` : "Nenhum passeio escolhido ainda."}</p>
          </div>
        </section>

        <section ref={(element) => { sections.current[3] = element; }} className={s.stop} aria-labelledby="rota-mesa">
          <div className={s.panel}>
            <p className={s.kicker}>Km 31 · Entardecer</p>
            <h2 id="rota-mesa">O sol desce. <em>A mesa se enche.</em></h2>
            <p className={s.lead}>Da primeira xícara ao último petisco. Escolha o que entra na sua estadia.</p>
            <ul className={s.choices}>
              {MEALS.map((meal) => {
                const on = meals.includes(meal.id);
                return (
                  <li key={meal.id}>
                    <button type="button" className={s.choice} aria-pressed={on} onClick={() => toggle(meal.id, setMeals)}>
                      <span className={s.choiceHead}><b>{meal.name}</b><i>{on ? "✓ No roteiro" : "+ Adicionar"}</i></span>
                      <span className={s.muted}>{meal.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section ref={(element) => { sections.current[4] = element; }} id="reserva" className={s.stop} aria-labelledby="rota-reserva">
          <div className={`${s.panel} ${s.wide}`}>
            <p className={s.kicker}>Km 42 · Noite · Chegada</p>
            <h2 id="rota-reserva">O farol acendeu. <em>Falta só a sua reserva.</em></h2>
            <div className={s.planner}>
              <form onSubmit={submit} className={s.form}>
                <div className={s.field}>
                  <label className={s.fieldLabel} htmlFor="rota-nome">Seu nome</label>
                  <input id="rota-nome" name="name" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel} htmlFor="rota-data">Check-in</label>
                  <input id="rota-data" name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-describedby={error ? "rota-erro" : undefined} />
                </div>
                <div className={s.field}>
                  <label className={s.fieldLabel} htmlFor="rota-quarto">Acomodação</label>
                  <select id="rota-quarto" value={room} onChange={(event) => setRoom(Number(event.target.value))}>
                    {ROOMS.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
                  </select>
                </div>
                <div className={s.row}>
                  <Stepper label="Noites" value={nights} min={1} max={14} unit={nights === 1 ? "noite" : "noites"} onChange={setNights} />
                  <Stepper label="Hóspedes" value={guests} min={1} max={6} unit={guests === 1 ? "pessoa" : "pessoas"} onChange={setGuests} />
                </div>
                {overCapacity && <p className={s.warn}>{chosen.name} acomoda até {chosen.capacity} pessoas. Escolha outra acomodação ou converse com a pousada.</p>}
                {error && <p id="rota-erro" className={s.warn} role="alert">{error}</p>}
                <button type="submit" className={`${s.btn} ${s.btnSolid}`}>
                  <span>Enviar roteiro pelo WhatsApp</span>
                  <em aria-hidden="true">↗</em>
                </button>
              </form>
              <aside className={s.summary} aria-label="Resumo do seu roteiro">
                <p className={s.mono}>Seu roteiro</p>
                <dl>
                  <div><dt>Acomodação</dt><dd>{chosen.name}</dd></div>
                  <div><dt>Estadia</dt><dd>{nights} {nights === 1 ? "noite" : "noites"} · {guests} {guests === 1 ? "pessoa" : "pessoas"}</dd></div>
                  <div><dt>Check-in</dt><dd>{date ? formatDate(date) : "A combinar"}</dd></div>
                  <div><dt>Passeios</dt><dd>{selectedTours.length ? selectedTours.map((tour) => tour.name).join(", ") : "Nenhum ainda"}</dd></div>
                  <div><dt>Refeições</dt><dd>{selectedMeals.length ? selectedMeals.map((meal) => meal.name).join(", ") : "Nenhuma ainda"}</dd></div>
                </dl>
                <p className={s.muted}>A pousada responde pelo WhatsApp com disponibilidade e valores.</p>
              </aside>
            </div>
          </div>
        </section>

        <footer className={s.footer}>
          <p>Pousada Maré Mansa · Litoral Sul de SC · Conteúdo demonstrativo.</p>
          <Link href="/contato?interest=institucional&source=sites#orcamento">Quero um site assim para o meu negócio ↗</Link>
        </footer>
      </main>

      <aside className={s.radio} aria-label="Rádio da pousada">
        <button type="button" className={s.play} onClick={radio.toggle} aria-pressed={radio.playing} aria-label={radio.playing ? "Pausar a rádio" : "Ligar a rádio"}>
          {radio.playing ? "■" : "▶"}
        </button>
        <div className={s.radioText}>
          <span className={s.mono}>{radio.playing ? "No ar agora" : "Rádio da pousada"}</span>
          <b>{station.name} · {station.freq}</b>
          <span className={s.radioNote}>{station.note}</span>
        </div>
        <span className={s.eq} data-on={radio.playing} aria-hidden="true"><i /><i /><i /></span>
        <div className={s.tune}>
          <button type="button" className={s.arrowBtn} aria-label="Estação anterior" onClick={() => radio.tune(-1)}>←</button>
          <button type="button" className={s.arrowBtn} aria-label="Próxima estação" onClick={() => radio.tune(1)}>→</button>
        </div>
        <label className={s.volume}>
          <span className={s.srOnly}>Volume da rádio</span>
          <input type="range" min={0} max={1} step={0.05} value={radio.volume} onChange={(event) => radio.setVolume(Number(event.target.value))} />
        </label>
      </aside>

      <aside className={s.dash} aria-label="Painel da viagem">
        <div aria-hidden="true">
          <span ref={kmRef} className={s.km}>KM 00.0</span>
          <span ref={clockRef} className={s.clock}>06:06</span>
          <span ref={periodRef} className={s.period}>Amanhecer</span>
        </div>
        <div className={s.pager}>
          <button type="button" className={s.arrowBtn} aria-label="Parada anterior" disabled={active === 0} onClick={() => goTo(active - 1)}>↑</button>
          <span className={s.mono}>Parada {active + 1}/{STOPS.length}</span>
          <button type="button" className={s.arrowBtn} aria-label="Próxima parada" disabled={active === STOPS.length - 1} onClick={() => goTo(active + 1)}>↓</button>
        </div>
      </aside>
    </div>
  );
}
