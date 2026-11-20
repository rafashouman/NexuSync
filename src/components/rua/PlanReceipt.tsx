"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "./icons";
import { planOptions, proposalHref } from "./content";
import s from "./rua.module.css";

/** Plan simulator: pick Go, Presence or Pulse and the receipt reprints with that plan's real items. */
export function PlanReceipt() {
  const [active, setActive] = useState(1);
  const plan = planOptions[active];

  return (
    <>
      <div className={s.planTabs} role="group" aria-label="Escolha um plano para simular">
        {planOptions.map((option, i) => (
          <button key={option.name} type="button" aria-pressed={i === active}
            className={s.planTab} onClick={() => setActive(i)}>
            <span className={s.planTabName}>{option.name}{option.badge && <small>{option.badge}</small>}</span>
            <b>{option.consult ? "Consulte" : `R$ ${option.price}`}</b>
            <span className={s.planTabFor}>{option.idealFor}</span>
          </button>
        ))}
      </div>

      <div className={s.rcwrap}>
        <div className={s.receipt} id="rua-receipt" aria-live="polite">
          <div className={s.rcHead}>
            <b>NEXUSYNC · RECIBO</b>
            <span>Plano {plan.name}{plan.badge ? ` · ${plan.badge.toLowerCase()}` : ""}</span>
            <span>{plan.deliveryTime}</span>
          </div>
          <ol className={s.rcItems} key={plan.name}>
            {plan.items.map((item, i) => (
              <li key={item} className={s.rcLine} data-rua-line="" data-ink="false" style={{ "--i": i } as React.CSSProperties}>
                <span className={s.t}>{item}</span><span className={s.dots} /><span className={s.v}>{plan.consult ? "no escopo" : "incluso"}</span>
              </li>
            ))}
          </ol>
          <div className={s.rcTot}>
            {plan.consult ? (
              <div className={s.pay}><span>Seu investimento</span><span>Consulte</span></div>
            ) : (
              <>
                {plan.originalPrice && <div className={s.was}><span>De</span><s>R$ {plan.originalPrice}</s></div>}
                <div className={s.pay}><span>Seu investimento</span><span>R$ {plan.price}</span></div>
              </>
            )}
          </div>
          <p className={s.rcNote}>{plan.consult ? "Valor e prazo definidos depois da análise do projeto." : "Registro de domínio e hospedagem são orçados à parte."}</p>
          <div className={s.barcode} aria-hidden="true" />
          <p className={s.rcFoot}>obrigado por chegar até aqui.</p>
        </div>
      </div>

      <div className={s.ctas}>
        <Link className={`${s.btn} ${s.btnAmber}`} href={proposalHref("sites", plan.interest)}>
          <span>{plan.consult ? `Consultar o ${plan.name}` : `Quero o ${plan.name}`}</span>
          <em aria-hidden="true"><ArrowIcon /></em>
        </Link>
        <Link href="/criacao-de-sites" className={s.floorLink}>Comparar os planos →</Link>
      </div>
    </>
  );
}
