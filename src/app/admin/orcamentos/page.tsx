import type { Metadata } from "next";
import QuoteAdminPanel from "./QuoteAdminPanel";

export const metadata: Metadata = {
  title: "Orçamentos e vagas | NexuSync",
  robots: { index: false, follow: false },
};

export default function QuoteAdminPage() {
  return <QuoteAdminPanel />;
}
