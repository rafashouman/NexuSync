import { Archivo, Inter, JetBrains_Mono } from "next/font/google";

/** Rua typefaces, shared by the home and the service pages. */
export const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-rua-display", display: "swap" });
export const body = Inter({ subsets: ["latin"], variable: "--font-rua-body", display: "optional" });
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-rua-mono", display: "optional" });
export const ruaFonts = `${display.variable} ${body.variable} ${mono.variable}`;
