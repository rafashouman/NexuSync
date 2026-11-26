import { Alfa_Slab_One, Figtree } from "next/font/google";

/** Letreiro pintado nos títulos, texto limpo no resto. */
const sign = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--font-lanche-sign", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-lanche-body", display: "swap" });

export const lancheFonts = `${sign.variable} ${body.variable}`;
