"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/rua/icons";
import { trackAnalyticsEvent } from "@/lib/analytics";
import s from "../servico.module.css";

/** Marketing plan button: goes to the form with the plan preselected and keeps the analytics event. */
export function PlanCta({ id, children, featured }: { id: string; children: React.ReactNode; featured: boolean }) {
  return (
    <Link
      className={s.planBtn}
      data-featured={featured}
      href={`/contato?${new URLSearchParams({ interest: id, source: "form" })}#orcamento`}
      onClick={() => trackAnalyticsEvent({ eventName: "marketing_plan_click", plan_id: id, section: "planos-marketing", destination: "form" })}
    >
      <span>{children}</span>
      <em aria-hidden="true"><ArrowIcon /></em>
    </Link>
  );
}
