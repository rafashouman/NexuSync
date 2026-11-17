"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function MarketingPlanLink({ id, children, className }: { id: string; children: React.ReactNode; className: string }) {
  return <Link className={className} href={`/contato?${new URLSearchParams({ interest: id, source: "form" })}#orcamento`} onClick={() => trackAnalyticsEvent({ eventName: "marketing_plan_click", plan_id: id, section: "planos-marketing", destination: "form" })}>{children}<ArrowUpRight size={18} /></Link>;
}
