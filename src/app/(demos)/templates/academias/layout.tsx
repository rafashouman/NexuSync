import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Site para academia | Demonstração PulseFit Lab",
  description:
    "Veja uma demonstração de site para academia com apresentação de serviços, informações e caminhos para contato.",
  path: "/templates/academias",
});

export default function AcademiasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
