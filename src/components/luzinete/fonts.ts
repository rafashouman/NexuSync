import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";

const title = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lz-title",
  display: "swap",
});
const body = Nunito_Sans({ subsets: ["latin"], variable: "--font-lz-body", display: "swap" });

export const luzineteFonts = `${title.variable} ${body.variable}`;
