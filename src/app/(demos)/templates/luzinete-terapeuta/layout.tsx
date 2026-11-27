import type { Viewport } from "next";
import { FloatingActions } from "@/components/luzinete/FloatingActions";
import { Footer } from "@/components/luzinete/Footer";
import { luzineteFonts } from "@/components/luzinete/fonts";
import { Header } from "@/components/luzinete/Header";
import s from "@/components/luzinete/luzinete.module.css";
import { TemplateFx } from "@/components/templates/TemplateFx";
import { DEMO_CONTENT_ID } from "@/components/ui/DemoShell";

export const viewport: Viewport = { themeColor: "#F6EFE4", colorScheme: "light" };

export default function LuzineteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="lz-root" className={`${s.page} ${luzineteFonts}`}>
      <TemplateFx rootId="lz-root" />
      <Header />
      <main id={DEMO_CONTENT_ID}>{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
