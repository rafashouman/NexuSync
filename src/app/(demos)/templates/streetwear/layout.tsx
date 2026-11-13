import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Loja virtual streetwear | Demonstração Vortex Atelier",
  description:
    "Explore uma demonstração de loja virtual streetwear, conheça as peças e monte uma sacola de compras.",
  path: "/templates/streetwear",
});

export default function StreetwearLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
