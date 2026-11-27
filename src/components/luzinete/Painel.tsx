"use client";

import { Mail, MapPin, MessageCircle, RefreshCw, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  cancelLuzineteSession,
  listLuzineteSessions,
  loginLuzinete,
  logoutLuzinete,
  type PanelAgenda,
  type PanelSession,
} from "@/app/actions/luzinetePainel";
import { addDays, longDate, shortDate, todayIn } from "./agenda";
import { AGENDA, MODE_LABEL } from "./data";
import s from "./luzinete.module.css";
import p from "./painel.module.css";

const REFRESH_MS = 30_000;
const TIME_ZONE = "America/Sao_Paulo";

const FILTERS = [
  { id: "proximas", label: "Próximas", empty: "Nenhuma sessão marcada." },
  { id: "anteriores", label: "Anteriores", empty: "Nenhuma sessão anterior." },
  { id: "canceladas", label: "Canceladas", empty: "Nenhuma sessão cancelada." },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const groupOf = (session: PanelSession, now: number): FilterId =>
  session.cancelled
    ? "canceladas"
    : session.startsAt + AGENDA.durationMin * 60_000 > now
      ? "proximas"
      : "anteriores";

const whenOf = (time: number) =>
  new Date(time).toLocaleString("pt-BR", { timeZone: TIME_ZONE, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

/** Conversa com quem agendou, já com o assunto escrito. */
function clientWhatsApp(session: PanelSession) {
  const first = session.name.split(" ")[0];
  const when = `${shortDate(session.date)} às ${session.time}`;
  const text = session.cancelled
    ? `Olá, ${first}! Aqui é a Luzinete. Sua sessão de ${when} foi cancelada. Vamos combinar um novo horário?`
    : `Olá, ${first}! Aqui é a Luzinete, sobre a sua sessão de ${when}.`;
  return `https://wa.me/55${session.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function Painel() {
  const [view, setView] = useState<"abrindo" | "login" | "agenda">("abrindo");
  const [agenda, setAgenda] = useState<PanelAgenda | null>(null);
  const [filter, setFilter] = useState<FilterId>("proximas");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState<{ text: string; url?: string }>({ text: "" });
  const [busy, setBusy] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [entering, setEntering] = useState(false);
  const known = useRef<Set<string> | null>(null);

  const toLogin = useCallback((message = "") => {
    known.current = null;
    setAgenda(null);
    setNotice({ text: "" });
    setLoadError("");
    setLoginError(message);
    setView("login");
  }, []);

  const load = useCallback(async () => {
    try {
      const result = await listLuzineteSessions();
      if (result === null) {
        toLogin(known.current ? "Seu acesso expirou. Entre de novo." : "");
        return;
      }
      const arrived = known.current
        ? result.sessions.filter((session) => !session.cancelled && !known.current!.has(session.id)).length
        : 0;
      known.current = new Set(result.sessions.map((session) => session.id));
      if (arrived) {
        setNotice({ text: arrived === 1 ? "Chegou 1 agendamento novo." : `Chegaram ${arrived} agendamentos novos.` });
      }
      setAgenda(result);
      setLoadError("");
      setView("agenda");
    } catch {
      setLoadError("Não foi possível buscar as sessões. Confira a internet e tente de novo.");
      setView("agenda");
    }
  }, [toLogin]);

  useEffect(() => {
    // Primeira busca já na fila de tarefas; ela também diz se há acesso aberto.
    const first = window.setTimeout(load, 0);
    return () => window.clearTimeout(first);
  }, [load]);

  useEffect(() => {
    if (view !== "agenda") return;
    const refresh = () => {
      if (document.visibilityState === "visible") load();
    };
    const timer = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [view, load]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    setEntering(true);
    try {
      const result = await loginLuzinete(user, password);
      if (!result.ok) {
        setLoginError(result.error ?? "Não foi possível entrar.");
        return;
      }
      setPassword("");
      await load();
    } catch {
      setLoginError("Sem conexão. Confira a internet e tente de novo.");
    } finally {
      setEntering(false);
    }
  }

  async function logout() {
    try {
      await logoutLuzinete();
      toLogin();
    } catch {
      setNotice({ text: "Não foi possível sair. Tente de novo." });
    }
  }

  async function cancel(session: PanelSession) {
    const question = `Cancelar a sessão de ${session.name}, ${longDate(session.date).toLowerCase()}, às ${session.time}?\n\nO horário volta a ficar livre no site. A pessoa não é avisada automaticamente.`;
    if (!window.confirm(question)) return;
    setBusy(session.id);
    setNotice({ text: "" });
    try {
      const result = await cancelLuzineteSession(session.id);
      if (result === "expirou") {
        toLogin("Seu acesso expirou. Entre de novo.");
        return;
      }
      setNotice(
        result === "ok"
          ? {
              text: `Sessão de ${session.name} cancelada. Falta avisar pelo WhatsApp.`,
              url: clientWhatsApp({ ...session, cancelled: true }),
            }
          : { text: "Essa sessão já tinha sido cancelada ou já passou." },
      );
      await load();
    } catch {
      setNotice({ text: `Não foi possível cancelar a sessão de ${session.name}. Tente de novo.` });
    } finally {
      setBusy("");
    }
  }

  const title = <h1 className={p.title}>Minhas sessões</h1>;

  if (view === "abrindo") {
    return (
      <>
        {title}
        <p role="status">Abrindo o painel…</p>
      </>
    );
  }

  if (view === "login") {
    return (
      <div className={p.login}>
        {title}
        <p>Área restrita. Entre para ver e cancelar sessões.</p>
        <form onSubmit={login}>
          <div className={s.field}>
            <label htmlFor="painel-login">Login</label>
            <input
              id="painel-login"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={80}
              required
            />
          </div>
          <div className={s.field}>
            <label htmlFor="painel-senha">Senha</label>
            <input
              id="painel-senha"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              maxLength={200}
              required
            />
          </div>
          {loginError && (
            <p className={s.error} role="alert">
              {loginError}
            </p>
          )}
          <button type="submit" className={s.button} disabled={entering}>
            {entering ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  const now = agenda?.now ?? 0;
  const all = agenda?.sessions ?? [];
  const shown = all.filter((session) => groupOf(session, now) === filter);
  // Próximas da mais perto para a mais longe; o histórico, da mais recente para a mais antiga.
  shown.sort((a, b) => (filter === "proximas" ? a.startsAt - b.startsAt : b.startsAt - a.startsAt));
  const days = [...new Set(shown.map((session) => session.date))];
  const today = agenda ? todayIn(new Date(now)) : "";
  const dayLabel = (date: string) =>
    date === today
      ? `Hoje, ${longDate(date).toLowerCase()}`
      : date === addDays(today, 1)
        ? `Amanhã, ${longDate(date).toLowerCase()}`
        : longDate(date);

  return (
    <>
      <div className={p.head}>
        {title}
        <div>
          <button type="button" className={`${s.button} ${s.buttonOutline}`} onClick={load}>
            <RefreshCw aria-hidden="true" /> Atualizar
          </button>
          <button type="button" className={`${s.button} ${s.buttonOutline}`} onClick={logout}>
            Sair
          </button>
        </div>
      </div>

      <div className={p.filters} role="group" aria-label="Filtrar sessões">
        {FILTERS.map((option) => (
          <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
            {option.label} <span>{all.filter((session) => groupOf(session, now) === option.id).length}</span>
          </button>
        ))}
      </div>

      <div role="status">
        {notice.text && (
          <div className={s.problem}>
            <p>{notice.text}</p>
            {notice.url && (
              <a href={notice.url} target="_blank" rel="noopener noreferrer" className={s.button}>
                <MessageCircle aria-hidden="true" /> Avisar pelo WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
      {loadError && (
        <p className={s.problem} role="alert">
          {loadError}
        </p>
      )}

      {agenda && shown.length === 0 && <p className={p.empty}>{FILTERS.find((option) => option.id === filter)!.empty}</p>}

      {days.map((date) => (
        <section key={date} className={p.day}>
          <h2>{dayLabel(date)}</h2>
          <ul>
            {shown
              .filter((session) => session.date === date)
              .map((session) => (
                <li key={session.id} className={p.card} data-cancelled={session.cancelled} aria-busy={busy === session.id}>
                  <p className={p.time}>{session.time}</p>
                  <div className={p.info}>
                    <h3>{session.name}</h3>
                    <p className={p.tags}>
                      <span>
                        {session.mode === "online" ? <Video aria-hidden="true" /> : <MapPin aria-hidden="true" />}
                        {MODE_LABEL[session.mode]}
                      </span>
                      {session.firstSession && <span className={p.first}>Primeira sessão</span>}
                      {session.cancelled && <span className={p.cancelled}>Cancelada</span>}
                    </p>
                    <p>{session.whatsapp}</p>
                    {session.email && (
                      <p>
                        <a href={`mailto:${session.email}`} className={p.mail}>
                          <Mail aria-hidden="true" />
                          {session.email}
                        </a>
                      </p>
                    )}
                    {session.note && <p className={p.note}>{session.note}</p>}
                    <p className={p.created}>Agendada em {whenOf(session.createdAt)}</p>
                  </div>
                  <div className={p.actions}>
                    <a href={clientWhatsApp(session)} target="_blank" rel="noopener noreferrer" className={s.button}>
                      <MessageCircle aria-hidden="true" /> WhatsApp
                      <span className={s.srOnly}> de {session.name} (abre em nova aba)</span>
                    </a>
                    {groupOf(session, now) === "proximas" && (
                      <button type="button" className={p.danger} disabled={busy === session.id} onClick={() => cancel(session)}>
                        {busy === session.id ? "Cancelando…" : "Cancelar sessão"}
                        <span className={s.srOnly}> de {session.name}</span>
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
