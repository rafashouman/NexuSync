"use client";

import type { ReactNode } from "react";
import { selectInterest, type QuoteSection } from "@/lib/quote";

type QuoteLinkProps = {
  children: ReactNode;
  className: string;
  section: QuoteSection;
  interest?: string;
  onClick?: () => void;
};

export function QuoteLink({
  children,
  className,
  section,
  interest,
  onClick,
}: QuoteLinkProps) {
  const search = new URLSearchParams();
  if (interest) search.set("interest", interest);
  search.set("source", section);
  const query = search.toString();
  const href = `/contato${query ? `?${query}` : ""}#orcamento`;

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (window.location.pathname === "/" || window.location.pathname === "/contato") {
          event.preventDefault();
          selectInterest(interest ?? null, section);
        }
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
