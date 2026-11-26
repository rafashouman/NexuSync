import { DEMO_CONTENT_ID } from "@/components/ui/DemoShell";
import { DemoBar, MenuFooter } from "@/components/lanchonete/Chrome";
import { lancheFonts } from "@/components/lanchonete/fonts";
import s from "@/components/lanchonete/lanchonete.module.css";
import { TemplateFx } from "@/components/templates/TemplateFx";

export default function LanchoneteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="lanche-root" className={`${s.page} ${lancheFonts}`}>
      <TemplateFx rootId="lanche-root" />
      <DemoBar />
      <main id={DEMO_CONTENT_ID}>{children}</main>
      <MenuFooter />
    </div>
  );
}
