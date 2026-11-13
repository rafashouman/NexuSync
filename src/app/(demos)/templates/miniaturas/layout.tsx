import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Miniaturas personalizadas | Demonstração Alchemist Voxel",
  description:
    "Configure uma miniatura sob medida em uma demonstração de experiência digital para apresentar produtos personalizados.",
  path: "/templates/miniaturas",
});

export default function MiniaturasLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
