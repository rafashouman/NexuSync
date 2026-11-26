import { TopBar } from "@/components/lanchonete/Chrome";
import { Painel } from "@/components/lanchonete/Painel";
import { STORE, painelPath } from "@/components/lanchonete/menu-data";
import s from "@/components/lanchonete/lanchonete.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: `Painel de pedidos | ${STORE.name}`,
  description: "Área restrita da lanchonete para acompanhar os pedidos do cardápio.",
  path: painelPath,
  noindex: true,
  image: "/images/lanchonete/x-tudo.jpg",
});

export default function PainelPage() {
  return (
    <>
      <TopBar />
      <div className={s.wrap}>
        <Painel />
      </div>
    </>
  );
}
