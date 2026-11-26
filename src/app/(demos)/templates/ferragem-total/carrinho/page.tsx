import { CartView } from "@/components/ferragem/CartView";
import { STORE, cartPath } from "@/components/ferragem/catalog-data";
import s from "@/components/ferragem/ferragem.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: `Carrinho | Demo ${STORE.name}`,
  description: "Revise os produtos e as quantidades e envie o pedido para a loja pelo WhatsApp.",
  path: cartPath,
  noindex: true,
});

export default function CartPage() {
  return (
    <div className={s.wrap}>
      <CartView />
    </div>
  );
}
