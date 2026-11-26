import { Checkout } from "@/components/lanchonete/Checkout";
import { TopBar } from "@/components/lanchonete/Chrome";
import { STORE, orderPath } from "@/components/lanchonete/menu-data";
import s from "@/components/lanchonete/lanchonete.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: `Seu pedido | ${STORE.name}`,
  description: "Revise os itens, informe entrega ou retirada e envie o pedido pelo WhatsApp.",
  path: orderPath,
  noindex: true,
  image: "/images/lanchonete/x-tudo.jpg",
});

export default function PedidoPage() {
  return (
    <>
      <TopBar />
      <div className={s.wrap}>
        <Checkout />
      </div>
    </>
  );
}
