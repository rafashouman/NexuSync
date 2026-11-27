"use client";

import { CalendarPlus, Check, ChevronLeft, ChevronRight, MapPin, MessageCircle, Video } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { bookLuzineteSession, getLuzineteSlots, type BookingResult } from "@/app/actions/luzineteAgenda";
import {
  NAME_MAX,
  NOTE_MAX,
  addDays,
  bookingMessage,
  calendarFile,
  longDate,
  maskPhone,
  monthLabel,
  parseBooking,
  utcDate,
  type Availability,
  type BookingData,
  type FieldErrors,
} from "./agenda";
import { MODE_LABEL, SITE, greetingUrl, privacyPath, whatsappUrl, type Mode } from "./data";
import { MODE_EVENT } from "./ModeButton";
import s from "./luzinete.module.css";

const STEP_NAMES = ["Modalidade", "Dia", "Horário", "Seus dados"];
const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const MODES = [
  { id: "presencial" as const, icon: MapPin, text: "No consultório, em um espaço tranquilo e reservado." },
  { id: "online" as const, icon: Video, text: "Por videochamada, de onde você estiver." },
];

const EMPTY_FORM = {
  name: "",
  whatsapp: "",
  email: "",
  firstSession: null as boolean | null,
  note: "",
  consent: false,
};

type Done = { data: BookingData; notified: boolean };
type Problem = { text: string; url?: string };

/** Identifica a tentativa: reenviar não cria uma segunda reserva. */
const newRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
const monthStart = (date: string) => `${date.slice(0, 7)}-01`;
const shiftMonth = (date: string, delta: number) => {
  const value = utcDate(monthStart(date));
  value.setUTCMonth(value.getUTCMonth() + delta);
  return value.toISOString().slice(0, 10);
};
const slotCount = (count: number) =>
  count === 0 ? "sem horários" : count === 1 ? "1 horário livre" : `${count} horários livres`;

export function Booking() {
  const [agenda, setAgenda] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode | null>(null);
  const [month, setMonth] = useState("");
  /** Dia com o foco do teclado no calendário. */
  const [cursor, setCursor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [problem, setProblem] = useState<Problem | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  const requestId = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  /** Só muda o foco depois de uma ação da pessoa, nunca no carregamento da página. */
  const moveFocus = useRef(false);
  const moveCursor = useRef(false);

  const load = useCallback(async () => {
    try {
      setAgenda(await getLuzineteSlots());
    } catch {
      setAgenda(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    getLuzineteSlots()
      .catch(() => null)
      .then((result) => {
        if (!active) return;
        setAgenda(result);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const go = useCallback((next: number) => {
    moveFocus.current = true;
    setStep(next);
  }, []);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    heading.current?.focus({ preventScroll: true });
    const box = heading.current?.getBoundingClientRect();
    if (box && (box.top < 90 || box.top > window.innerHeight * 0.6)) heading.current?.scrollIntoView({ block: "start" });
  }, [step, done]);

  useEffect(() => {
    if (!moveCursor.current) return;
    moveCursor.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus();
  }, [cursor, month]);

  const freeTimes = (day: string) => (mode ? (agenda?.slots[day]?.[mode] ?? []) : []);
  const firstFreeDay = (forMode: Mode) =>
    Object.keys(agenda?.slots ?? {}).sort().find((day) => agenda!.slots[day][forMode].length > 0);

  const chooseMode = useCallback(
    (next: Mode) => {
      setMode(next);
      setDate("");
      setTime("");
      setMonth("");
      setProblem(null);
      setDone(null);
      go(2);
    },
    [go],
  );

  useEffect(() => {
    const onMode = (event: Event) => chooseMode((event as CustomEvent<Mode>).detail);
    window.addEventListener(MODE_EVENT, onMode);
    return () => window.removeEventListener(MODE_EVENT, onMode);
  }, [chooseMode]);

  // Mês mostrado: o escolhido ou, na falta dele, o do primeiro dia com vaga.
  const startDay = (mode && firstFreeDay(mode)) || agenda?.firstDay || "";
  const shownMonth = month || (startDay ? monthStart(startDay) : "");
  const focusDay = cursor && monthStart(cursor) === shownMonth ? cursor : monthStart(startDay) === shownMonth ? startDay : "";
  const inWindow = (day: string) => !!agenda && day >= agenda.firstDay && day <= agenda.lastDay;

  const monthDays: string[] = [];
  if (shownMonth) {
    for (let day = shownMonth; monthStart(day) === shownMonth; day = addDays(day, 1)) monthDays.push(day);
  }
  const blanks = shownMonth ? utcDate(shownMonth).getUTCDay() : 0;
  const cells: (string | null)[] = [...Array<null>(blanks).fill(null), ...monthDays];
  while (cells.length % 7) cells.push(null);
  const tabDay = focusDay || monthDays.find(inWindow) || "";
  const monthHasSlots = monthDays.some((day) => freeTimes(day).length > 0);

  function pickDay(day: string) {
    setCursor(day);
    setDate(day);
    setTime("");
    setProblem(null);
    setStep(freeTimes(day).length ? 3 : 2);
  }

  function onGridKey(event: KeyboardEvent) {
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const from = (event.target as HTMLElement).dataset.date;
    if (!from) return;
    const next = addDays(from, delta);
    if (!inWindow(next)) return;
    moveCursor.current = true;
    setMonth(monthStart(next));
    setCursor(next);
  }

  function pickTime(value: string) {
    setTime(value);
    setProblem(null);
    requestId.current = newRequestId();
    go(4);
  }

  function field<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function showErrors(next: FieldErrors) {
    setErrors(next);
    const first = (["name", "whatsapp", "email", "firstSession", "consent"] as const).find((key) => next[key]);
    if (first) document.getElementById(`lz-${first}`)?.focus();
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending) return;
    const booking = { date, time, mode, ...form };
    const parsed = parseBooking(booking);
    if (!parsed) return;
    if (Object.keys(parsed.errors).length) return showErrors(parsed.errors);

    setSending(true);
    setProblem(null);
    let result: BookingResult;
    try {
      result = await bookLuzineteSession({ requestId: requestId.current, website, booking });
    } catch {
      result = { status: "erro" };
    }
    setSending(false);

    if (result.status === "ok") {
      moveFocus.current = true;
      setDone({ data: result.data, notified: result.notified });
      setForm(EMPTY_FORM);
      void load();
    } else if (result.status === "campos") {
      showErrors(result.fields);
    } else if (result.status === "tomado") {
      setProblem({ text: "Esse horário acabou de ser reservado. Escolha outro, por favor." });
      setTime("");
      await load();
      go(3);
    } else if (result.status === "duplicado") {
      setProblem({
        text: "Já existe uma sessão futura neste WhatsApp. Para remarcar ou marcar outra, fale pelo WhatsApp.",
        url: greetingUrl,
      });
    } else {
      setProblem({
        text:
          result.status === "limite"
            ? "Muitas tentativas em pouco tempo. Aguarde alguns minutos ou fale pelo WhatsApp."
            : "Não consegui concluir agora. Tente de novo ou me chame no WhatsApp.",
        url: whatsappUrl(bookingMessage(parsed.data, { saved: false })),
      });
    }
  }

  function downloadCalendar(data: BookingData) {
    const url = URL.createObjectURL(new Blob([calendarFile(data, new Date())], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `sessao-${data.date}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function restart() {
    setDone(null);
    setMode(null);
    setDate("");
    setTime("");
    go(1);
  }

  const problemBox = problem && (
    <div className={s.problem}>
      <p>{problem.text}</p>
      {problem.url && (
        <a href={problem.url} target="_blank" rel="noopener noreferrer" className={`${s.button} ${s.buttonOutline}`}>
          <MessageCircle aria-hidden="true" /> Falar pelo WhatsApp
        </a>
      )}
    </div>
  );

  if (done) {
    return (
      <div className={s.booking}>
        <div className={s.success}>
          <span className={s.successMark} aria-hidden="true">
            <Check />
          </span>
          <h3 ref={heading} tabIndex={-1}>
            Pronto! Sua sessão foi reservada.
          </h3>
          <p>
            {longDate(done.data.date)} às {done.data.time}, atendimento {MODE_LABEL[done.data.mode].toLowerCase()}. Em
            breve entrarei em contato pelo WhatsApp para confirmar os detalhes.
          </p>
          {done.notified ? (
            <p>O aviso já foi enviado para a Luzinete.</p>
          ) : (
            <p>
              <strong>Falta um passo:</strong> toque no botão abaixo e envie a mensagem para avisar a Luzinete.
            </p>
          )}
          <div className={s.successActions}>
            <a
              href={whatsappUrl(bookingMessage(done.data))}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.button} ${done.notified ? s.buttonOutline : ""}`}
            >
              <MessageCircle aria-hidden="true" />
              {done.notified ? "Enviar uma mensagem" : "Avisar pelo WhatsApp"}
            </a>
            <button type="button" className={`${s.button} ${s.buttonOutline}`} onClick={() => downloadCalendar(done.data)}>
              <CalendarPlus aria-hidden="true" /> Adicionar ao calendário
            </button>
          </div>
          <button type="button" className={s.textButton} onClick={restart}>
            Voltar ao início da agenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.booking}>
      <ol className={s.progress} aria-label="Etapas do agendamento">
        {STEP_NAMES.map((name, index) => (
          <li key={name} aria-current={step === index + 1 ? "step" : undefined} data-done={step > index + 1}>
            <span>{index + 1}</span>
            {name}
          </li>
        ))}
      </ol>

      {step > 1 && (
        <button type="button" className={s.back} onClick={() => go(step === 4 ? 3 : 1)}>
          <ChevronLeft aria-hidden="true" /> Voltar
        </button>
      )}

      <div aria-live="polite">{problemBox}</div>

      {loading ? (
        <div className={s.skeleton} role="status">
          <p>Buscando horários disponíveis…</p>
          <div aria-hidden="true">
            {Array.from({ length: 21 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
      ) : !agenda ? (
        <div className={s.problem} role="alert">
          <p>Não consegui concluir agora. Tente de novo ou me chame no WhatsApp.</p>
          <div className={s.successActions}>
            <button
              type="button"
              className={s.button}
              onClick={() => {
                setLoading(true);
                void load();
              }}
            >
              Tentar de novo
            </button>
            <a href={greetingUrl} target="_blank" rel="noopener noreferrer" className={`${s.button} ${s.buttonOutline}`}>
              <MessageCircle aria-hidden="true" /> Falar pelo WhatsApp
            </a>
          </div>
        </div>
      ) : step === 1 || !mode ? (
        <>
          <h3 ref={heading} tabIndex={-1}>
            Como você prefere ser atendido(a)?
          </h3>
          <div className={s.modes}>
            {MODES.map(({ id, icon: Icon, text }) => (
              <button key={id} type="button" aria-pressed={mode === id} onClick={() => chooseMode(id)}>
                <Icon aria-hidden="true" />
                <strong>{MODE_LABEL[id]}</strong>
                <span>{text}</span>
              </button>
            ))}
          </div>
        </>
      ) : step < 4 ? (
        <>
          <h3 ref={heading} tabIndex={-1}>
            Escolha o dia e o horário
          </h3>
          {!firstFreeDay(mode) || !monthHasSlots ? (
            <div className={s.problem}>
              <p>Agenda cheia neste período. Fale comigo pelo WhatsApp que encontramos um horário.</p>
              <a href={greetingUrl} target="_blank" rel="noopener noreferrer" className={`${s.button} ${s.buttonOutline}`}>
                <MessageCircle aria-hidden="true" /> Falar pelo WhatsApp
              </a>
            </div>
          ) : null}
          <div className={s.picker}>
            <div className={s.calendar}>
              <div className={s.monthBar}>
                <button
                  type="button"
                  aria-label="Mês anterior"
                  disabled={shownMonth <= monthStart(agenda.firstDay)}
                  onClick={() => setMonth(shiftMonth(shownMonth, -1))}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <p id="lz-month" aria-live="polite">
                  {monthLabel(shownMonth)}
                </p>
                <button
                  type="button"
                  aria-label="Próximo mês"
                  disabled={shownMonth >= monthStart(agenda.lastDay)}
                  onClick={() => setMonth(shiftMonth(shownMonth, 1))}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
              <div ref={grid} role="grid" aria-labelledby="lz-month" className={s.grid} onKeyDown={onGridKey}>
                <div role="row">
                  {WEEKDAYS.map((weekday) => (
                    <span key={weekday} role="columnheader" aria-label={weekday}>
                      {weekday.slice(0, 3)}
                    </span>
                  ))}
                </div>
                {Array.from({ length: cells.length / 7 }, (_, week) => (
                  <div role="row" key={week}>
                    {cells.slice(week * 7, week * 7 + 7).map((day, index) => {
                      if (!day) return <span key={index} role="gridcell" />;
                      const count = freeTimes(day).length;
                      return (
                        <span key={day} role="gridcell" aria-selected={date === day}>
                          <button
                            type="button"
                            data-date={day}
                            data-free={count > 0}
                            tabIndex={day === tabDay ? 0 : -1}
                            disabled={!inWindow(day)}
                            aria-disabled={count === 0 || undefined}
                            aria-pressed={date === day}
                            aria-label={`${longDate(day)}, ${slotCount(count)}`}
                            onClick={() => pickDay(day)}
                          >
                            {Number(day.slice(8))}
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className={s.legend}>
                <span aria-hidden="true" /> Dias com horário livre
              </p>
            </div>
            <div className={s.times} aria-live="polite">
              {!date ? (
                <p>Toque em um dia em verde para ver os horários.</p>
              ) : freeTimes(date).length === 0 ? (
                <p>Este dia está completo. Que tal outro?</p>
              ) : (
                <>
                  <h4>{longDate(date)}</h4>
                  <ul>
                    {freeTimes(date).map((value) => (
                      <li key={value}>
                        <button type="button" aria-pressed={time === value} onClick={() => pickTime(value)}>
                          {value}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p>Horários de Brasília.</p>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={submit} noValidate className={s.form}>
          <h3 ref={heading} tabIndex={-1}>
            Seus dados
          </h3>
          <div className={s.field}>
            <label htmlFor="lz-name">Nome completo</label>
            <input
              id="lz-name"
              autoComplete="name"
              maxLength={NAME_MAX}
              value={form.name}
              onChange={(event) => field("name", event.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "lz-name-error" : undefined}
              required
            />
            {errors.name && <p id="lz-name-error" className={s.error}>{errors.name}</p>}
          </div>
          <div className={s.field}>
            <label htmlFor="lz-whatsapp">WhatsApp</label>
            <input
              id="lz-whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(00) 00000-0000"
              value={form.whatsapp}
              onChange={(event) => field("whatsapp", maskPhone(event.target.value))}
              aria-invalid={!!errors.whatsapp}
              aria-describedby={errors.whatsapp ? "lz-whatsapp-error" : undefined}
              required
            />
            {errors.whatsapp && <p id="lz-whatsapp-error" className={s.error}>{errors.whatsapp}</p>}
          </div>
          <div className={`${s.field} ${s.wide}`}>
            <label htmlFor="lz-email">E-mail (opcional)</label>
            <input
              id="lz-email"
              type="email"
              autoComplete="email"
              maxLength={120}
              value={form.email}
              onChange={(event) => field("email", event.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "lz-email-error" : undefined}
            />
            {errors.email && <p id="lz-email-error" className={s.error}>{errors.email}</p>}
          </div>
          <fieldset className={`${s.choice} ${s.wide}`} aria-describedby={errors.firstSession ? "lz-first-error" : undefined}>
            <legend>É sua primeira sessão?</legend>
            {[true, false].map((value) => (
              <label key={String(value)}>
                <input
                  id={value ? "lz-firstSession" : undefined}
                  type="radio"
                  name="lz-first"
                  checked={form.firstSession === value}
                  onChange={() => field("firstSession", value)}
                />
                {value ? "Sim" : "Não"}
              </label>
            ))}
            {errors.firstSession && <p id="lz-first-error" className={s.error}>{errors.firstSession}</p>}
          </fieldset>
          <div className={`${s.field} ${s.wide}`}>
            <label htmlFor="lz-note">Observação (opcional)</label>
            <textarea
              id="lz-note"
              rows={3}
              maxLength={NOTE_MAX}
              value={form.note}
              onChange={(event) => field("note", event.target.value)}
              aria-describedby="lz-note-help"
            />
            <p id="lz-note-help" className={s.help}>
              Não precisa contar o que você viveu. Use só para recados, como preferências de contato. {form.note.length}/
              {NOTE_MAX}
            </p>
          </div>
          <div className={s.trap} aria-hidden="true">
            <label>
              Site
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </label>
          </div>
          <div className={`${s.consent} ${s.wide}`}>
            <label>
              <input
                id="lz-consent"
                type="checkbox"
                checked={form.consent}
                onChange={(event) => field("consent", event.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "lz-consent-error" : undefined}
              />
              <span>
                Li e concordo com a{" "}
                <Link href={privacyPath} target="_blank">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>
            {errors.consent && <p id="lz-consent-error" className={s.error}>{errors.consent}</p>}
          </div>
          <p className={`${s.summary} ${s.wide}`}>
            {longDate(date)} às {time} · {mode && MODE_LABEL[mode]}
          </p>
          <button type="submit" className={`${s.button} ${s.wide}`} disabled={sending}>
            {sending ? "Confirmando…" : "Confirmar agendamento"}
          </button>
        </form>
      )}

      {SITE.demo && (
        <p className={s.demoNote}>
          Prévia do site: os horários são de exemplo e uma reserva feita aqui ainda não vale como sessão marcada.
        </p>
      )}
    </div>
  );
}
