import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { PRODUCTS, STORE, discountPercent, getCategory, getProduct, installmentLabel, money } from "@/components/ferragem/catalog-data";

const size = { width: 1200, height: 630 };

/** A foto do produto (WebP em /public) vira PNG recortado para o painel da esquerda; o ImageResponse não lê WebP. */
async function photoDataUrl(image?: string) {
  if (!image?.startsWith("/")) return null;
  try {
    const file = await readFile(path.join(process.cwd(), "public", image));
    // Foto de produto em fundo branco entra inteira; foto de ambiente preenche o painel.
    // stats() ignora o recorte do pipeline, por isso o canto vira um buffer antes.
    const corner = await sharp(file).extract({ left: 0, top: 0, width: 8, height: 8 }).png().toBuffer();
    const { channels } = await sharp(corner).stats();
    const whiteBackground = channels.slice(0, 3).every((channel) => channel.mean > 250);
    const png = await sharp(file)
      .resize(430, 630, { fit: whiteBackground ? "contain" : "cover", background: "#ffffff" })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

/**
 * Cartão de prévia do link (WhatsApp, Telegram, Facebook): nome, preços e a loja.
 * Rota própria, e não `opengraph-image`, para a URL ser fixa e a página poder mostrar a mesma imagem.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) return new Response("Produto não encontrado", { status: 404 });
  const category = getCategory(product.category);
  const off = discountPercent(product);
  const photo = await photoDataUrl(product.image);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f5f3ee", color: "#17202b", fontFamily: "sans-serif" }}>
        <div style={{ width: 430, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 40, background: category?.tone ?? "#e8e5df", position: "relative" }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- imagem dentro do ImageResponse
            <img src={photo} width={430} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
          ) : (
            <>
              <div style={{ display: "flex", width: 72, height: 10, background: "#c2410c", marginBottom: 22 }} />
              <div style={{ display: "flex", fontSize: 52, fontWeight: 800, lineHeight: 1.05 }}>{category?.name ?? STORE.name}</div>
              <div style={{ display: "flex", marginTop: 14, fontSize: 26, color: "#3f4752", letterSpacing: 2 }}>{`Cód. ${product.sku}`}</div>
            </>
          )}
          {off > 0 && (
            <div style={{ position: "absolute", top: 36, left: 36, display: "flex", padding: "8px 18px", background: "#c2410c", color: "#fff", fontSize: 30, fontWeight: 700, borderRadius: 6 }}>
              {`${off}% off no Pix`}
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 60px" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#545d69", textTransform: "uppercase", letterSpacing: 2 }}>
            {`${product.brand} · ${category?.name ?? ""}`}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 56, fontWeight: 800, lineHeight: 1.08 }}>{product.name}</div>
          {product.listPrice ? (
            <div style={{ display: "flex", marginTop: 34, fontSize: 30, color: "#545d69", textDecoration: "line-through" }}>{`De ${money(product.listPrice)}`}</div>
          ) : (
            <div style={{ display: "flex", marginTop: 34 }} />
          )}
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
            <span style={{ fontSize: 80, fontWeight: 800, color: "#c2410c" }}>{money(product.cashPrice)}</span>
            <span style={{ fontSize: 30, marginLeft: 16 }}>à vista no Pix</span>
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#17202b" }}>{`ou ${installmentLabel(product)}`}</div>
          <div style={{ display: "flex", marginTop: "auto", fontSize: 28, fontWeight: 700, color: "#17202b" }}>{STORE.name}</div>
        </div>
      </div>
    ),
    size,
  );
}
