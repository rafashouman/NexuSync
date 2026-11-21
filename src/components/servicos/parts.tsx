import Link from "next/link";
import { ArrowIcon } from "@/components/rua/icons";
import r from "@/components/rua/rua.module.css";
import s from "./servico.module.css";

/** Rua button: amber (main action) or outlined. */
export function Cta({ href, children, line }: { href: string; children: React.ReactNode; line?: boolean }) {
  return (
    <Link className={`${r.btn} ${line ? r.btnLine : r.btnAmber}`} href={href}>
      <span>{children}</span>
      <em aria-hidden="true"><ArrowIcon /></em>
    </Link>
  );
}

export type StoryStep = { tag: string; title: string; text: string; get: readonly string[]; note?: string };

/** The steps that drive the 3D stage. "get" lines must be copied from sitePlans.ts features. */
export function StorySteps({ steps, label, prefix = "Etapa", getLabel = "Nos planos", id }: { steps: readonly StoryStep[]; label: string; prefix?: string; getLabel?: string; id?: string }) {
  return (
    <ol id={id} className={`${r.wrap} ${r.pad} ${s.floors}`} aria-label={label}>
      {steps.map((f, i) => (
        <li key={f.tag} className={s.floor} data-stage-step="" data-state="off">
          <p className={s.floorN}>{prefix} 0{i + 1} · {f.tag}</p>
          <h2 className={s.floorTitle} data-rua-type="">{f.title}</h2>
          <p className={s.floorText}>{f.text}</p>
          {f.get.length > 0 && (
            <>
              <p className={s.getLabel}>{getLabel}</p>
              <ul className={s.get}>
                {f.get.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
          {f.note && <p className={s.note}>{f.note}</p>}
        </li>
      ))}
    </ol>
  );
}
