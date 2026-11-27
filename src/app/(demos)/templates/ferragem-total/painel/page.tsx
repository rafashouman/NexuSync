import { Painel } from "@/components/ferragem/Painel";
import { STORE, painelPath } from "@/components/ferragem/catalog-data";
import s from "@/components/ferragem/ferragem.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: `Painel de pedidos | ${STORE.name}`,
  description: "Área restrita da loja para acompanhar os pedidos do catálogo.",
  path: painelPath,
  noindex: true,
});

export default function PainelPage() {
  return (
    <div className={s.wrap}>
      <Painel />
    </div>
  );
}
