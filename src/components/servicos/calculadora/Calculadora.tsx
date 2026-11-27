"use client";

import { useEffect, useState } from "react";
import {
  addProduct as addToStore,
  removeProduct,
  resetExample,
  selectProduct,
  typeNumber,
  updateProduct as update,
  useCalc,
  type NumberField,
} from "./calc-store";
import { ArrowIcon } from "@/components/rua/icons";
import r from "@/components/rua/rua.module.css";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  CPA_SCENARIOS,
  cpaProjection,
  formatBrl as brl,
  formatCount as count,
  parseBrNumber,
  type CpaProduct,
  type CpaVerdict,
} from "@/lib/cpa";
import { waLink } from "@/lib/site-config";
import c from "./calculadora.module.css";

const VERDICT: Record<CpaVerdict, string> = { lucro: "dá lucro", empate: "perto do empate", prejuizo: "dá prejuízo" };

function verdictPhrase(p: CpaProduct, res: ReturnType<typeof cpaProjection>) {
  if (p.ticket <= 0) return "Comece pelo preço de venda e pelos custos de cada venda.";
  if (res.margem <= 0) return "Os custos de cada venda já engolem o preço. Nenhum anúncio dá lucro assim: reveja o preço ou os custos antes de investir.";
  if (!Number.isFinite(res.cpa)) return `Com esses números, nenhuma venda acontece. Confira o custo por ${p.modo === "whats" ? "conversa" : "clique"} e a taxa.`;
  if (res.sit === "lucro") return `Cada venda pode custar até ${brl(res.max)} antes de dar prejuízo. Com ${brl(res.cpa)}, sobra folga para o anúncio errar um pouco.`;
  if (res.sit === "empate") return `Ainda dá lucro, mas com pouca folga. O limite é ${brl(res.max)} por venda; qualquer piora no anúncio vira prejuízo.`;
  return `Cada venda custa mais do que sobra dela (${brl(res.max)}). Antes de investir, melhore ${p.modo === "whats" ? "o atendimento" : "a página"}, o anúncio ou o preço.`;
}

export function Calculadora() {
  // Numbers typed here stay only in this browser.
  const state = useCalc();
  const texts = state.drafts;
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const p = state.produtos[state.atual];
  const res = cpaProjection(p);
  const whats = p.modo === "whats";

  const select = selectProduct;
  const onNumber = (field: NumberField) => (e: React.ChangeEvent<HTMLInputElement>) =>
    typeNumber(field, e.target.value, parseBrNumber(e.target.value));

  const addProduct = () => {
    if (!addToStore()) return setToast("Limite de 12 produtos");
    trackAnalyticsEvent({ eventName: "cpa_calculator_interaction", action: "add_product" });
  };
  const duplicate = () => {
    if (!addToStore({ ...p, nome: `${p.nome} (cópia)`.slice(0, 60) }, state.atual + 1)) setToast("Limite de 12 produtos");
  };
  const remove = removeProduct;
  const reset = () => {
    resetExample();
    setToast("Exemplo restaurado");
  };

  const copySummary = async () => {
    const lines = ["Projeção de anúncios (estimativa, não garantia)", ""];
    for (const q of state.produtos) {
      const x = cpaProjection(q);
      lines.push(`${q.nome}: investimento ${brl(x.verba)}, ${count(x.unidades)} ${q.modo === "whats" ? "conversas" : "cliques"}, ${count(x.vendas)} vendas, custo por venda ${brl(x.cpa)} (limite ${brl(x.max)}), faturamento ${brl(x.fat)}, sobra ${brl(x.sobra)}.`);
    }
    lines.push("", "Feito com a calculadora da NexuSync: nexusync.online/calculadora-cpa");
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setToast("Resumo copiado");
    } catch {
      setToast("Não consegui copiar. Selecione e copie a tabela.");
    }
    trackAnalyticsEvent({ eventName: "cpa_calculator_interaction", action: "copy_summary" });
  };

  // Ruler: 0 to 1.5x the limit (or a bit past the current cost).
  const top = Math.max(res.max * 1.5, Number.isFinite(res.cpa) ? res.cpa * 1.1 : 0, 1);
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / top) * 100))}%`;
  const ruler = { "--alvo": pct(res.alvo), "--max": pct(res.max), "--pos": Number.isFinite(res.cpa) ? pct(res.cpa) : "100%" } as React.CSSProperties;

  const biggest = Math.max(Number.isFinite(res.verba) ? res.verba : 0, res.fat, 1);
  const funnel = [
    ["Investimento", Number.isFinite(res.verba) ? res.verba / biggest : 1, brl(res.verba)],
    [whats ? "Conversas" : "Cliques", 1, count(res.unidades)],
    ["Vendas", res.unidades > 0 ? res.vendas / res.unidades : 0, count(res.vendas)],
    ["Faturamento", res.fat / biggest, brl(res.fat)],
  ] as const;

  const totals = state.produtos.map((q) => ({ q, x: cpaProjection(q) }));
  const sum = (k: "verba" | "vendas" | "fat" | "sobra") => totals.reduce((acc, { x }) => acc + (Number.isFinite(x[k]) ? x[k] : 0), 0);
  const message = `Olá, usei a calculadora de custo por venda da NexuSync e quero ajuda com os anúncios de ${p.nome || "meu negócio"}.`;

  return (
    <div className={c.calc}>
      <div className={c.side}>
        <h2 className={c.label}>Seus produtos</h2>
        <div className={c.tabs} role="tablist" aria-label="Produtos da projeção">
          {state.produtos.map((q, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === state.atual} className={c.tab} onClick={() => select(i)}>
              <i className={c.dot} data-sit={cpaProjection(q).sit} aria-hidden="true" />
              <span>{q.nome || "Sem nome"}</span>
            </button>
          ))}
          <button type="button" className={`${c.tab} ${c.tabNew}`} onClick={addProduct}>+ Novo produto</button>
        </div>

        <div className={c.panel}>
          <div className={c.field}>
            <label htmlFor="cpa-nome">Nome do produto ou serviço</label>
            <div className={c.input}><input id="cpa-nome" type="text" maxLength={60} autoComplete="off" value={p.nome} onChange={(e) => update({ nome: e.target.value })} /></div>
          </div>

          <div className={c.field}>
            <span className={c.label} id="cpa-modo">Como a venda acontece</span>
            <div className={c.toggle} role="group" aria-labelledby="cpa-modo">
              <button type="button" aria-pressed={!whats} onClick={() => { update({ modo: "site" }); trackAnalyticsEvent({ eventName: "cpa_calculator_interaction", action: "mode_site" }); }}>Compra no site</button>
              <button type="button" aria-pressed={whats} onClick={() => { update({ modo: "whats" }); trackAnalyticsEvent({ eventName: "cpa_calculator_interaction", action: "mode_whatsapp" }); }}>Conversa no WhatsApp</button>
            </div>
          </div>

          <div className={c.two}>
            <Money id="cpa-ticket" label="Preço de venda" value={texts.ticket} onChange={onNumber("ticket")} />
            <Money id="cpa-custos" label="Custos de cada venda" hint="Taxa do cartão, imposto, entrega, material, suas horas." value={texts.custos} onChange={onNumber("custos")} />
          </div>

          <div className={c.field}>
            <span className={c.label} id="cpa-obj">O que você quer saber</span>
            <div className={c.toggle} role="group" aria-labelledby="cpa-obj">
              <button type="button" aria-pressed={p.obj !== "meta"} onClick={() => update({ obj: "verba" })}>Quanto vendo com uma verba</button>
              <button type="button" aria-pressed={p.obj === "meta"} onClick={() => { update({ obj: "meta" }); trackAnalyticsEvent({ eventName: "cpa_calculator_interaction", action: "goal_target" }); }}>Quanto investir para uma meta</button>
            </div>
          </div>

          {p.obj === "meta" ? (
            <div className={c.field}>
              <label htmlFor="cpa-meta">Quantas vendas você quer</label>
              <div className={c.input}><input id="cpa-meta" inputMode="numeric" autoComplete="off" value={texts.meta} onChange={onNumber("meta")} /><span className={c.after}>vendas</span></div>
            </div>
          ) : (
            <Money id="cpa-verba" label="Investimento em anúncio no período" value={texts.verba} onChange={onNumber("verba")} />
          )}

          <div className={c.two}>
            <Money
              id="cpa-unit"
              label={whats ? "Custo por conversa" : "Custo por clique"}
              hint={whats ? "Quanto o anúncio cobra por cada pessoa que chama no WhatsApp." : "Quanto o anúncio cobra por cada pessoa que clica e entra no site."}
              value={texts.unit}
              onChange={onNumber("unit")}
            />
            <div className={c.field}>
              <label htmlFor="cpa-taxa">{whats ? "Taxa de fechamento" : "Taxa de conversão"}</label>
              <div className={c.input}><input id="cpa-taxa" inputMode="decimal" autoComplete="off" value={texts.taxa} onChange={onNumber("taxa")} /><span className={c.after}>%</span></div>
              <small>{whats ? "De cada 100 conversas, quantas viram venda. Depende muito do atendimento." : "De cada 100 pessoas que entram, quantas compram."}</small>
            </div>
          </div>

          <div className={c.actions}>
            <button type="button" className={c.small} onClick={duplicate}>Duplicar produto</button>
            <button type="button" className={c.small} onClick={remove} disabled={state.produtos.length < 2}>Remover</button>
            <button type="button" className={c.small} onClick={reset}>Voltar ao exemplo</button>
          </div>
        </div>
      </div>

      <div className={c.result} aria-live="polite">
        <h2 className={c.label}>A conta deste produto</h2>

        <div className={c.verdict} data-sit={p.ticket > 0 ? res.sit : undefined}>
          <span className={c.badge}>{p.ticket > 0 ? VERDICT[res.sit] : "preencha o preço"}</span>
          <p className={c.big}><b>{brl(res.cpa)}</b> <span>por venda</span></p>
          <p className={c.phrase}>{verdictPhrase(p, res)}</p>
          <div className={c.ruler} style={ruler}><i aria-hidden="true" /></div>
          <div className={c.rulerLegend}><span>R$ 0</span><span>alvo {brl(res.alvo)}</span><span>limite {brl(res.max)}</span></div>
        </div>

        <dl className={c.numbers}>
          <div><dt>{whats ? "Conversas" : "Cliques"}</dt><dd>{count(res.unidades)}</dd></div>
          <div><dt>Vendas</dt><dd>{count(res.vendas)}</dd></div>
          <div><dt>Investimento</dt><dd>{brl(res.verba)}</dd></div>
          <div><dt>Faturamento</dt><dd>{brl(res.fat)}</dd></div>
          <div><dt>Sobra no fim</dt><dd data-neg={res.sobra < 0 || undefined}>{brl(res.sobra)}</dd></div>
          <div><dt>Retorno (ROAS)</dt><dd>{res.roas.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}x</dd></div>
        </dl>

        <div className={c.block}>
          <h3>O caminho do dinheiro</h3>
          <div className={c.funnel}>
            {funnel.map(([name, share, text]) => (
              <div key={name} className={c.step}>
                <span>{name}</span>
                <div className={c.bar}><i style={{ width: `${Math.max(1, Math.min(100, share * 100))}%` }} /></div>
                <b>{text}</b>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className={c.wide}>
        <div className={c.block}>
          <h3>E se for pior ou melhor?</h3>
          <p className={c.note}>Ninguém sabe o custo por clique e a conversão antes de anunciar. Os cenários mudam esses dois números para mostrar a margem de segurança.</p>
          <div className={c.tableWrap}>
            <table>
              <thead><tr><th scope="col">Cenário</th><th scope="col">Investimento</th><th scope="col">Vendas</th><th scope="col">Custo por venda</th><th scope="col">Faturamento</th><th scope="col">Sobra</th></tr></thead>
              <tbody>
                {CPA_SCENARIOS.map(([name, fu, fr]) => {
                  const x = cpaProjection(p, fu, fr);
                  return <tr key={name}><td><i className={c.dot} data-sit={x.sit} aria-hidden="true" />{name}</td><td>{brl(x.verba)}</td><td>{count(x.vendas)}</td><td>{brl(x.cpa)}</td><td>{brl(x.fat)}</td><td>{brl(x.sobra)}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={c.block}>
          <h3>Todos os produtos juntos</h3>
          <div className={c.tableWrap}>
            <table>
              <thead><tr><th scope="col">Produto</th><th scope="col">Investimento</th><th scope="col">Vendas</th><th scope="col">Custo por venda</th><th scope="col">Faturamento</th><th scope="col">Sobra</th></tr></thead>
              <tbody>
                {totals.map(({ q, x }, i) => <tr key={i}><td><i className={c.dot} data-sit={x.sit} aria-hidden="true" />{q.nome || "Sem nome"}</td><td>{brl(x.verba)}</td><td>{count(x.vendas)}</td><td>{brl(x.cpa)}</td><td>{brl(x.fat)}</td><td>{brl(x.sobra)}</td></tr>)}
              </tbody>
              <tfoot><tr><td>Total</td><td>{brl(sum("verba"))}</td><td>{count(sum("vendas"))}</td><td>{brl(sum("vendas") > 0 ? sum("verba") / sum("vendas") : Infinity)}</td><td>{brl(sum("fat"))}</td><td>{brl(sum("sobra"))}</td></tr></tfoot>
            </table>
          </div>
          <div className={r.ctas}>
            <button type="button" className={`${r.btn} ${r.btnAmber}`} onClick={copySummary}><span>Copiar resumo</span><em aria-hidden="true"><ArrowIcon /></em></button>
            <a
              className={`${r.btn} ${r.btnLine}`}
              href={waLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAnalyticsEvent({ eventName: "cpa_calculator_interaction", action: "whatsapp_click" })}
            >
              <span>Falar com a NexuSync</span>
              <em aria-hidden="true"><ArrowIcon /></em>
            </a>
          </div>
          <p className={c.note}>Os números iniciais são um exemplo. Os que você digitar ficam guardados só neste navegador.</p>
        </div>
      </div>
      {toast && <p className={c.toast} role="status">{toast}</p>}
    </div>
  );
}

function Money({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className={c.field}>
      <label htmlFor={id}>{label}</label>
      <div className={c.input}><span className={c.before}>R$</span><input id={id} inputMode="decimal" autoComplete="off" value={value} onChange={onChange} /></div>
      {hint && <small>{hint}</small>}
    </div>
  );
}
