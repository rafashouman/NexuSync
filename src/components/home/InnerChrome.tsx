"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChaosHeader, ChaosFooter } from "./ChaosChrome";
import { FloatingWA } from "@/components/FloatingWA";
import { ScrollProgress } from "@/components/ui/MotionKit";
import { StudioCursor } from "./StudioCursor";

/** Header, footer and motion layer of the inner pages. The home never loads this code. */
export default function InnerChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <MotionConfig reducedMotion="user">
      <StudioCursor key={pathname} />
      <ScrollProgress className="from-turquoise via-ice to-champagne" />
      <ChaosHeader />
      <main id="conteudo" className="relative flex min-h-screen flex-col overflow-hidden">{children}</main>
      <ChaosFooter />
      <FloatingWA />
    </MotionConfig>
  );
}
