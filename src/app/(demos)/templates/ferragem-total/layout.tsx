import { Suspense } from "react";
import { DEMO_CONTENT_ID } from "@/components/ui/DemoShell";
import { DomainBar } from "@/components/ferragem/DomainBar";
import { StoreFooter, StoreHeader } from "@/components/ferragem/StoreChrome";
import s from "@/components/ferragem/ferragem.module.css";
import { ruaFonts } from "@/components/rua/fonts";

export default function FerragemLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${s.page} ${ruaFonts}`}>
      <Suspense fallback={<div className={s.demoBar} />}>
        <DomainBar />
      </Suspense>
      <Suspense fallback={null}>
        <StoreHeader />
      </Suspense>
      <main id={DEMO_CONTENT_ID}>{children}</main>
      <StoreFooter />
    </div>
  );
}
