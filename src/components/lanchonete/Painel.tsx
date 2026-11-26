"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Bike, MessageCircle, RefreshCw, Store } from "lucide-react";
import {
  deleteLanchoneteOrder,
  listLanchoneteOrders,
  loginLanchonete,
  logoutLanchonete,
  setLanchoneteOrderStatus,
  type PanelOrder,
  type PanelResult,
} from "@/app/actions/lanchonetePainel";
import { STORE, money } from "./menu-data";
import { isOpen, nextStep, statusLabel, type OrderStatus } from "./order-status";
import s from "./lanchonete.module.css";
import p from "./painel.module.css";

const REFRESH_MS = 20_000;
const TIME_ZONE = "America/Sao_Paulo";

const FILTERS = [
  { id: "abertos", label: "Em aberto", match: (status: OrderStatus) => isOpen(status), empty: "Nenhum pedido em aberto." },
  { id: "concluidos", label: "Concluídos", match: (status: OrderStatus) => status === "concluido", empty: "Nenhum pedido concluído ainda." },
  { id: "cancelados", label: "Cancelados", match: (status: OrderStatus) => status === "cancelado", empty: "Nenhum pedido cancelado." },
  { id: "todos", label: "Todos", match: () => true, empty: "Nenhum pedido registrado." },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const dayOf = (time: number) => new Date(time).toLocaleDateString("pt-BR", { timeZone: TIME_ZONE });
const whenOf = (time: number) =>
  new Date(time).toLocaleString("pt-BR", { timeZone: TIME_ZONE, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

/** Link para a lanchonete chamar o cliente; telefones sem o 55 ganham o código do país. */
function customerWhatsApp(order: PanelOrder) {
  const digits = order.customer.phone.replace(/\D/g, "");
  const number = digits.length <= 11 ? `55${digits}` : digits;
  const text = `Olá, ${order.customer.name.split(" ")[0]}! Sobre o seu pedido ${order.code} na ${STORE.name}:`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function Painel() {
  const [view, setView] = useState<"abrindo" | "login" | "pedidos">("abrindo");
  const [orders, setOrders] = useState<PanelOrder[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState(0);
  const [filter, setFilter] = useState<FilterId>("abertos");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
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
      const list = await listLanchoneteOrders();
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
    // Primeira busca já na fila de tarefas; ela também diz se há sessão aberta.
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
      const result = await loginLanchonete(user, password);
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
      await logoutLanchonete();
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
    act(order, () => setLanchoneteOrderStatus(order.id, to), `Pedido ${order.code}: ${statusLabel(to, order.customer.mode)}.`);

  if (view === "abrindo") {
    return (
      <div className={s.loading}>
        <h1 className={s.pageTitle}>Painel de pedidos</h1>
        <p>Abrindo o painel…</p>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className={p.login}>
        <h1 className={s.pageTitle}>Painel de pedidos</h1>
        <p>Área da lanchonete. Entre para ver e atualizar os pedidos.</p>
        <form className={s.form} onSubmit={login}>
          <div className={s.field}>
            <label htmlFor="painel-login">Login</label>
            <input id="painel-login" value={user} onChange={(event) => setUser(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={80} required />
          </div>
          <div className={s.field}>
            <label htmlFor="painel-senha">Senha</label>
            <input id="painel-senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" maxLength={200} required />
          </div>
          {loginError && <p className={s.error} role="alert">{loginError}</p>}
          <button type="submit" className={`${s.primary} ${s.block}`} disabled={entering}>
            {entering ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  const all = orders ?? [];
  const active = FILTERS.find((option) => option.id === filter)!;
  const shown = all.filter((order) => active.match(order.status));
  // Em aberto é uma fila: quem pediu primeiro aparece primeiro.
  if (filter === "abertos") shown.reverse();
  const today = all.filter((order) => order.status !== "cancelado" && dayOf(order.createdAt) === dayOf(updatedAt));
  const todayTotal = today.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className={p.panel}>
      <div className={p.head}>
        <div>
          <h1 className={s.pageTitle}>Painel de pedidos</h1>
          {orders && (
            <p className={p.today}>
              Hoje: {today.length} {today.length === 1 ? "pedido" : "pedidos"}, {money(todayTotal)}
            </p>
          )}
        </div>
        <div className={p.headActions}>
          <button type="button" className={s.ghost} onClick={load}>
            <RefreshCw size={18} aria-hidden="true" />Atualizar
          </button>
          <button type="button" className={s.ghost} onClick={logout}>Sair</button>
        </div>
      </div>

      <div className={p.filters} role="group" aria-label="Filtrar pedidos">
        {FILTERS.map((option) => (
          <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => setFilter(option.id)}>
            {option.label} <span>{all.filter((order) => option.match(order.status)).length}</span>
          </button>
        ))}
      </div>

      <p className={p.notice} role="status">{notice}</p>
      {loadError && <p className={s.failure} role="alert">{loadError}</p>}

      {orders && shown.length === 0 && <p className={p.empty}>{active.empty}</p>}

      <ul className={p.grid}>
        {shown.map((order) => {
          const { customer } = order;
          const step = nextStep(order.status, customer.mode);
          const working = busy === order.id;
          return (
            <li key={order.id} className={p.card} aria-busy={working}>
              <div className={p.cardHead}>
                <h2 className={s.nowrap}>{order.code}</h2>
                <span className={p.status} data-status={order.status}>{statusLabel(order.status, customer.mode)}</span>
                <time dateTime={new Date(order.createdAt).toISOString()}>{whenOf(order.createdAt)}</time>
              </div>

              <div className={p.customer}>
                <p className={p.mode}>
                  {customer.mode === "entrega" ? <Bike size={18} aria-hidden="true" /> : <Store size={18} aria-hidden="true" />}
                  {customer.mode === "entrega" ? "Entrega" : "Retirada no balcão"}
                </p>
                <p><strong>{customer.name}</strong>, {customer.phone}</p>
                {customer.mode === "entrega" && <p>{customer.street}, {customer.number}, {customer.district}</p>}
                {customer.reference && <p>Referência: {customer.reference}</p>}
              </div>

              <ul className={p.items}>
                {order.items.map((item, index) => (
                  <li key={index}>
                    <div className={s.lineTop}>
                      <span className={s.lineName}>{item.qty}x {item.name}</span>
                      <span>{money(item.total)}</span>
                    </div>
                    {item.details.length > 0 && <p className={s.lineDetails}>{item.details.join(" · ")}</p>}
                  </li>
                ))}
              </ul>

              {customer.note && <p className={p.note}>Recado: {customer.note}</p>}

              <div className={p.total}>
                <p>
                  {customer.paymentLabel}
                  {customer.changeFor && `, troco para ${customer.changeFor}`}
                  {order.deliveryFee > 0 && `. Inclui entrega de ${money(order.deliveryFee)}`}
                </p>
                <strong className={s.price}>{money(order.total)}</strong>
              </div>

              <div className={p.actions}>
                {step ? (
                  <button type="button" className={s.primary} disabled={working} onClick={() => move(order, step.to)}>
                    {step.label}
                  </button>
                ) : (
                  <button type="button" className={s.ghost} disabled={working} onClick={() => move(order, "novo")}>
                    Reabrir pedido
                  </button>
                )}
                <a className={s.ghost} href={customerWhatsApp(order)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} aria-hidden="true" />Chamar cliente
                  <span className={s.srOnly}> {customer.name} no WhatsApp (abre em nova aba)</span>
                </a>
                <button
                  type="button"
                  className={p.danger}
                  disabled={working}
                  onClick={() => {
                    if (step) {
                      if (window.confirm(`Cancelar o pedido ${order.code}?`)) move(order, "cancelado");
                    } else if (window.confirm(`Apagar o pedido ${order.code}? Não dá para desfazer.`)) {
                      act(order, () => deleteLanchoneteOrder(order.id), `Pedido ${order.code} apagado.`);
                    }
                  }}
                >
                  {step ? "Cancelar pedido" : "Apagar pedido"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
