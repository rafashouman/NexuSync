"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { adminLogin, adminLogout, adminSession } from "@/app/actions/pilotAdmin";
import {
  deleteQuoteRequest,
  listQuoteRequests,
  updateQuoteStatus,
  type QuoteRecord,
} from "@/app/actions/quotes";
import { getPromoSlots, setPromoSlot } from "@/app/actions/promoSlots";
import { PROMO_KEYS, PROMO_SLOTS, type PromoRemaining } from "@/lib/promo-slots";
import { QUOTE_INTERESTS, QUOTE_STATUSES } from "@/lib/quote";

const card = "rounded-2xl border border-white/10 bg-white/[0.04] p-5";
const input =
  "rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white focus:border-violet-300/60 focus:outline-none";

const interestLabel = (id: string) =>
  QUOTE_INTERESTS.find((i) => i.id === id)?.label ?? id;

function whatsappHref(contact: string) {
  const digits = contact.replace(/\D/g, "");
  if (contact.includes("@") || digits.length < 8) return null;
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`;
}

export default function QuoteAdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [slots, setSlots] = useState<PromoRemaining | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const [list, current] = await Promise.all([listQuoteRequests(), getPromoSlots()]);
      if (list === null) {
        setAuthenticated(false);
        return;
      }
      setQuotes(list);
      setSlots(current);
      setDrafts(Object.fromEntries(PROMO_KEYS.map((k) => [k, String(current[k])])));
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados.");
    }
  }, []);

  useEffect(() => {
    adminSession()
      .then((s) => {
        setAuthenticated(s.authenticated);
        if (s.authenticated) return load();
      })
      .finally(() => setLoading(false));
  }, [load]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await adminLogin(password);
    if (!result.ok) {
      setError(result.error ?? "Falha no login.");
      return;
    }
    setPassword("");
    setAuthenticated(true);
    await load();
  };

  const run = async (action: () => Promise<unknown>, message: string) => {
    try {
      await action();
      setNotice(message);
      await load();
    } catch (err) {
      console.error(err);
      setNotice("Ação não concluída.");
    }
  };

  if (loading) {
    return <main className="p-10 text-white/60">Carregando...</main>;
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07070c] p-6">
        <form onSubmit={login} className={`${card} w-full max-w-sm space-y-4`}>
          <h1 className="font-display text-xl font-bold text-white">Painel Nexusync</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de administrador"
            autoComplete="current-password"
            className={`${input} w-full`}
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button className="w-full rounded-lg bg-violet-500 py-2.5 text-sm font-bold text-white">
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070c] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold">Orçamentos e vagas</h1>
          <button
            onClick={async () => {
              await adminLogout();
              setAuthenticated(false);
            }}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            Sair
          </button>
        </header>

        {(notice || error) && (
          <p role="status" className="text-sm text-violet-200">
            {error || notice}
          </p>
        )}

        <section className={card}>
          <h2 className="mb-1 font-display text-lg font-bold">Vagas promocionais</h2>
          <p className="mb-4 text-xs text-white/50">
            Informe quantas vagas ainda restam. Em 0, o site mostra o preço cheio e esconde a promoção.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMO_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                <div>
                  <p className="text-sm font-semibold">{PROMO_SLOTS[key].label}</p>
                  <p className="text-[11px] text-white/40">
                    Atual: {slots?.[key] ?? "–"} · padrão {PROMO_SLOTS[key].total}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    aria-label={`Vagas restantes de ${PROMO_SLOTS[key].label}`}
                    value={drafts[key] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                    className={`${input} w-16`}
                  />
                  <button
                    onClick={() =>
                      run(() => setPromoSlot(key, Number(drafts[key])), "Vagas atualizadas.")
                    }
                    className="rounded-lg bg-violet-500 px-3 py-2 text-xs font-bold"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold">Pedidos de orçamento ({quotes.length})</h2>
          {quotes.length === 0 && <p className="text-sm text-white/50">Nenhum pedido ainda.</p>}
          {quotes.map((q) => {
            const wa = whatsappHref(q.contact);
            return (
              <article key={q.id} className={card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {q.name} <span className="text-white/50">· {q.company}</span>
                    </p>
                    <p className="text-xs text-white/50">
                      {q.segment} · {new Date(q.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={q.status}
                      onChange={(e) =>
                        run(() => updateQuoteStatus(q.id, e.target.value), "Status atualizado.")
                      }
                      className={input}
                      aria-label="Status"
                    >
                      {QUOTE_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-[#0c0e14]">
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        if (confirm("Excluir este pedido?")) {
                          run(() => deleteQuoteRequest(q.id), "Pedido excluído.");
                        }
                      }}
                      className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="inline text-white/40">Interesse: </dt>
                    <dd className="inline">{interestLabel(q.interest)}</dd>
                  </div>
                  <div>
                    <dt className="inline text-white/40">Objetivo: </dt>
                    <dd className="inline">{q.goal}</dd>
                  </div>
                  <div>
                    <dt className="inline text-white/40">Contato: </dt>
                    <dd className="inline">
                      {wa ? (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline">
                          {q.contact}
                        </a>
                      ) : (
                        <a href={`mailto:${q.contact}`} className="text-violet-200 underline">
                          {q.contact}
                        </a>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-white/40">Orçamento: </dt>
                    <dd className="inline">{q.budget || "não informado"}</dd>
                  </div>
                </dl>
                {q.message && <p className="mt-3 text-sm text-white/70">{q.message}</p>}
                <p className="mt-2 text-[11px] text-white/40">
                  Aceita novidades: {q.consentPromo ? "sim" : "não"}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
