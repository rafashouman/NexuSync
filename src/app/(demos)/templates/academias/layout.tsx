import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Site para academia | Demonstração PulseFit",
  description:
    "Conheça uma academia com musculação, aulas em grupo, planos e agendamento de aula experimental. Demonstração NexuSync.",
  path: "/templates/academias",
  noindex: true,
});

export default function AcademiasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
