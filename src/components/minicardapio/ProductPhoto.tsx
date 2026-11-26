import Image from "next/image";
import type { Product } from "./data";
import s from "./minicardapio.module.css";

/** Foto do produto ou, sem foto, a inicial do nome em destaque. */
export function ProductPhoto({ product, sizes }: { product: Product; sizes: string }) {
  if (!product.image) {
    return (
      <span className={s.initial} aria-hidden="true">
        {product.name.trim().charAt(0).toUpperCase() || "?"}
      </span>
    );
  }
  return <Image src={product.image} alt="" fill sizes={sizes} unoptimized={product.image.startsWith("data:")} />;
}
