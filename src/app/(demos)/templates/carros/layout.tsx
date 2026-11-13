import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Site para concessionária | Demonstração Prime Motors",
  description:
    "Explore uma demonstração de site para concessionária com estoque de veículos e formulário de interesse.",
  path: "/templates/carros",
});

export default function CarrosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
