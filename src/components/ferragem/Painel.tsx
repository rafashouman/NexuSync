"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { LogOut, MapPin, MessageCircle, RefreshCw, Search, Store, Truck, Weight } from "lucide-react";
import {
  deleteFerragemOrder,
  listFerragemOrders,
  loginFerragem,
  logoutFerragem,
  setFerragemOrderStatus,
  setFerragemPanelNote,
  type PanelOrder,
  type PanelResult,
} from "@/app/actions/ferragemPainel";
import { STORE, installmentText, money } from "./catalog-data";
import { NOTE_PANEL_MAX, ORDER_STATUSES, isOpen, nextStep, statusHint, statusLabel, type OrderStatus } from "./order-status";
import s from "./ferragem.module.css";
import p from "./painel.module.css";

const REFRESH_MS = 20_000;
const TIME_ZONE = "America/Sao_Paulo";

const FILTERS = [
  { id: "abertos", label: "Em aberto", match: (status: OrderStatus) => isOpen(status), empty: "Nenhum pedido em aberto." },
  { id: "novo", label: "Novos", match: (status: OrderStatus) => status === "novo", empty: "Nenhum pedido novo." },
  { id: "pendencia", label: "Com pendência", match: (status: OrderStatus) => status === "pendencia", empty: "Nenhum pedido com pendência." },
  { id: "entregue", label: "Entregues", match: (status: OrderStatus) => status === "entregue", empty: "Nenhum pedido entregue ainda." },
  { id: "cancelado", label: "Cancelados", match: (status: OrderStatus) => status === "cancelado", empty: "Nenhum pedido cancelado." },
  { id: "todos", label: "Todos", match: () => true, empty: "Nenhum pedido registrado." },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const dayOf = (time: number) => new Date(time).toLocaleDateString("pt-BR", { timeZone: TIME_ZONE });
const whenOf = (time: number) =>
  new Date(time).toLocaleString("pt-BR", { timeZone: TIME_ZONE, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** Link para a loja chamar o cliente; telefones sem o 55 ganham o código do país. */
function customerWhatsApp(order: PanelOrder) {
  const digits = order.customer.phone.replace(/\D/g, "");
  const number = digits.length <= 11 ? `55${digits}` : digits;
  const text = `Olá, ${order.customer.name.split(" ")[0]}! Aqui é da ${STORE.name}, sobre o seu pedido ${order.code}:`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function Painel() {
  const [view, setView] = useState<"abrindo" | "login" | "pedidos">("abrindo");
  const [orders, setOrders] = useState<PanelOrder[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState(0);
  const [filter, setFilter] = useState<FilterId>("abertos");
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [entering, setEntering] = useState(false);
  const known = useRef<Set<string> | null>(null);

  const toLogin = useCallback((message = "") => {
    known.current = null;
    setOrders(null);
    setNotice("");
    setLoadError("");
    setLoginError(message);
    setView("login");
  }, []);

  const load = useCallback(async () => {
    try {
      const list = await listFerragemOrders();
      if (list === null) {
        toLogin(known.current ? "Sua sessão terminou. Entre de novo." : "");
        return;
      }
      const arrived = known.current ? list.filter((order) => !known.current!.has(order.id)).length : 0;
      known.current = new Set(list.map((order) => order.id));
      if (arrived) setNotice(arrived === 1 ? "Chegou 1 pedido novo." : `Chegaram ${arrived} pedidos novos.`);
      setOrders(list);
      setUpdatedAt(Date.now());
      setLoadError("");
      setView("pedidos");
    } catch {
      setLoadError("Não conseguimos buscar os pedidos. Confira a internet e o banco de dados.");
      setView("pedidos");
    }
  }, [toLogin]);

  useEffect(() => {
    const first = window.setTimeout(load, 0);
    return () => window.clearTimeout(first);
  }, [load]);

  useEffect(() => {
    if (view !== "pedidos") return;
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
      const result = await loginFerragem(user, password);
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
      await logoutFerragem();
      toLogin();
    } catch {
      setNotice("Não foi possível sair. Tente de novo.");
    }
  }

  async function act(order: PanelOrder, action: () => Promise<PanelResult>, done: string) {
    setBusy(order.id);
    setNotice("");
    try {
      const result = await action();
      if (result === "expirou") {
        toLogin("Sua sessão terminou. Entre de novo.");
        return;
      }
      setNotice(result === "ok" ? done : `O pedido ${order.code} não existe mais.`);
      await load();
    } catch {
      setNotice(`Não foi possível alterar o pedido ${order.code}. Tente de novo.`);
    } finally {
      setBusy("");
    }
  }

  const move = (order: PanelOrder, to: OrderStatus) =>
    act(order, () => setFerragemOrderStatus(order.id, to), `Pedido ${order.code}: ${statusLabel(to, order.mode)}.`);

  async function saveNote(order: PanelOrder) {
    const note = drafts[order.id];
    if (note === undefined || note === order.panelNote) return;
    await act(order, () => setFerragemPanelNote(order.id, note), `Anotação do pedido ${order.code} salva.`);
    setDrafts((current) => {
      const next = { ...current };
      delete next[order.id];
      return next;
    });
  }

  if (view === "abrindo") {
    return (
      <div className={p.wrapNarrow}>
        <h1 className={s.cartTitle}>Painel de pedidos</h1>
        <p>Abrindo o painel…</p>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className={p.wrapNarrow}>
        <p className={s.kicker}>{STORE.name} · área da loja</p>
        <h1 className={s.cartTitle}>Painel de pedidos</h1>
        <form className={p.login} onSubmit={login}>
          <div className={s.addressField}>
            <label htmlFor="painel-login">Login</label>
            <input id="painel-login" value={user} onChange={(event) => setUser(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={80} required />
          </div>
          <div className={s.addressField}>
            <label htmlFor="painel-senha">Senha</label>
            <input id="painel-senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" maxLength={200} required />
          </div>
          {loginError && <p className={s.fieldError} role="alert">{loginError}</p>}
          <button type="submit" className={s.primary} disabled={entering}>{entering ? "Entrando…" : "Entrar"}</button>
        </form>
      </div>
    );
  }

  const all = orders ?? [];
  const active = FILTERS.find((option) => option.id === filter)!;
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const shown = all.filter((order) => {
    if (!active.match(order.status)) return false;
    if (!terms.length) return true;
    const haystack = normalize(`${order.code} ${order.customer.name} ${order.customer.phone} ${order.address?.district ?? ""} ${order.items.map((item) => item.name).join(" ")}`);
    return terms.every((term) => haystack.includes(term));
  });
  // Em aberto é uma fila: quem pediu primeiro aparece primeiro.
  if (filter === "abertos" || filter === "novo" || filter === "pendencia") shown.reverse();
  const today = all.filter((order) => order.status !== "cancelado" && dayOf(order.createdAt) === dayOf(updatedAt));
  const count = (status: OrderStatus) => all.filter((order) => order.status === status).length;

  return (
    <div className={p.panel}>
      <div className={p.head}>
        <div>
          <p className={s.kicker}>{STORE.name} · área da loja</p>
          <h1 className={s.cartTitle}>Painel de pedidos</h1>
        </div>
        <div className={p.headActions}>
          <button type="button" className={p.ghost} onClick={load}><RefreshCw size={18} aria-hidden="true" />Atualizar</button>
          <button type="button" className={p.ghost} onClick={logout}><LogOut size={18} aria-hidden="true" />Sair</button>
        </div>
      </div>

      {orders && (
        <dl className={p.stats}>
          <div><dt>Hoje</dt><dd>{today.length}</dd><span>{money(today.reduce((sum, order) => sum + order.cashTotal, 0))} à vista</span></div>
          <div data-tone="novo"><dt>Novos</dt><dd>{count("novo")}</dd><span>esperando a loja</span></div>
          <div data-tone="andamento"><dt>Em andamento</dt><dd>{count("andamento") + count("pronto")}</dd><span>separando ou a caminho</span></div>
          <div data-tone="pendencia"><dt>Com pendência</dt><dd>{count("pendencia")}</dd><span>precisam de atenção</span></div>
        </dl>
      )}

      <div className={p.toolbar}>
        <div className={p.filters} role="group" aria-label="Filtrar pedidos">
          {FILTERS.map((option) => (
            <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
              {option.label} <span>{all.filter((order) => option.match(order.status)).length}</span>
            </button>
          ))}
        </div>
        <div className={s.searchBox}>
          <Search size={18} aria-hidden="true" />
          <label htmlFor="painel-busca" className={s.srOnly}>Buscar pedido</label>
          <input id="painel-busca" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Código, cliente, bairro ou produto" autoComplete="off" />
        </div>
      </div>

      <p className={p.notice} role="status">{notice}</p>
      {loadError && <p className={s.fieldError} role="alert">{loadError}</p>}
      {orders && shown.length === 0 && <p className={p.empty}>{terms.length ? "Nenhum pedido com essa busca." : active.empty}</p>}

      <ul className={p.grid}>
        {shown.map((order) => {
          const step = nextStep(order.status, order.mode);
          const working = busy === order.id;
          const draft = drafts[order.id] ?? order.panelNote;
          return (
            <li key={order.id} className={p.card} data-status={order.status} aria-busy={working}>
              <div className={p.cardHead}>
                <h2>{order.code}</h2>
                <span className={p.status} data-status={order.status}>{statusLabel(order.status, order.mode)}</span>
                <time dateTime={new Date(order.createdAt).toISOString()}>{whenOf(order.createdAt)}</time>
              </div>

              <div className={p.customer}>
                <p className={p.mode}>
                  {order.mode === "entrega" ? <Truck size={18} aria-hidden="true" /> : <Store size={18} aria-hidden="true" />}
                  {order.mode === "entrega" ? "Entrega" : "Retirada na loja"}
                </p>
                <p><strong>{order.customer.name}</strong> · {order.customer.phone}</p>
                {order.address && (
                  <>
                    <p>{order.address.street} – {order.address.district}</p>
                    {order.address.reference && <p>Referência: {order.address.reference}</p>}
                    {order.address.map && (
                      <a href={order.address.map} target="_blank" rel="noopener noreferrer" className={s.mapPreview}>
                        <MapPin size={16} aria-hidden="true" />
                        {order.address.exact ? "Ver localização exata no mapa" : "Ver endereço no mapa"}
                        <span className={s.srOnly}> (abre em nova aba)</span>
                      </a>
                    )}
                  </>
                )}
              </div>

              <ul className={p.items}>
                {order.items.map((item, index) => (
                  <li key={index}>
                    <span>
                      {item.qty}x {item.name}
                      {item.heavy && <Weight size={14} aria-label="produto pesado" className={p.heavy} />}
                      <small>cód. {item.sku}</small>
                    </span>
                    <span>{money(item.total)}</span>
                  </li>
                ))}
                {order.mode === "entrega" && (
                  <li>
                    <span>Frete{order.freight ? " (produto pesado)" : ""}</span>
                    <span>{order.freight ? money(order.freight) : "Grátis"}</span>
                  </li>
                )}
              </ul>

              <div className={p.total}>
                <span>
                  À vista no Pix<small>ou {installmentText(order.cardTotal)} (total {money(order.cardTotal)})</small>
                </span>
                <strong>{money(order.cashTotal)}</strong>
              </div>

              {order.note && <p className={p.customerNote}>Observação do cliente: {order.note}</p>}

              <div className={p.statusField}>
                <label htmlFor={`status-${order.id}`}>Situação</label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  disabled={working}
                  onChange={(event) => move(order, event.target.value as OrderStatus)}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{statusLabel(status, order.mode)}</option>
                  ))}
                </select>
                <p>{statusHint(order.status, order.mode)}</p>
              </div>

              <div className={p.noteField}>
                <label htmlFor={`anotacao-${order.id}`}>Anotação da loja <small>(o cliente não vê)</small></label>
                <textarea
                  id={`anotacao-${order.id}`}
                  rows={2}
                  maxLength={NOTE_PANEL_MAX}
                  value={draft}
                  placeholder={order.status === "pendencia" ? "O que está pendente? Ex.: sem cimento CP II, cliente vai trocar por CP III" : "Ex.: entregar depois das 14 h"}
                  onChange={(event) => setDrafts({ ...drafts, [order.id]: event.target.value })}
                />
                {draft !== order.panelNote && (
                  <button type="button" className={p.ghost} disabled={working} onClick={() => saveNote(order)}>Salvar anotação</button>
                )}
              </div>

              <div className={p.actions}>
                {step ? (
                  <button type="button" className={s.primary} disabled={working} onClick={() => move(order, step.to)}>{step.label}</button>
                ) : (
                  <button type="button" className={p.ghost} disabled={working} onClick={() => move(order, "andamento")}>Reabrir pedido</button>
                )}
                {isOpen(order.status) && order.status !== "pendencia" && (
                  <button type="button" className={p.warn} disabled={working} onClick={() => move(order, "pendencia")}>Marcar pendência</button>
                )}
                <a className={p.ghost} href={customerWhatsApp(order)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} aria-hidden="true" />Chamar cliente
                  <span className={s.srOnly}> {order.customer.name} no WhatsApp (abre em nova aba)</span>
                </a>
                <button
                  type="button"
                  className={p.danger}
                  disabled={working}
                  onClick={() => {
                    if (isOpen(order.status)) {
                      if (window.confirm(`Cancelar o pedido ${order.code}?`)) move(order, "cancelado");
                    } else if (window.confirm(`Apagar o pedido ${order.code}? Não dá para desfazer.`)) {
                      act(order, () => deleteFerragemOrder(order.id), `Pedido ${order.code} apagado.`);
                    }
                  }}
                >
                  {isOpen(order.status) ? "Cancelar" : "Apagar"}
                </button>
              </div>

              {order.history.length > 1 && (
                <details className={p.history}>
                  <summary>Histórico</summary>
                  <ol>
                    {order.history.map((entry, index) => (
                      <li key={index}><time dateTime={new Date(entry.at).toISOString()}>{whenOf(entry.at)}</time> {statusLabel(entry.status, order.mode)}</li>
                    ))}
                  </ol>
                </details>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
