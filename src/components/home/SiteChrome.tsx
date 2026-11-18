"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChaosHeader, ChaosFooter } from "./ChaosChrome";
import { FloatingWA } from "@/components/FloatingWA";
import { ScrollProgress } from "@/components/ui/MotionKit";
import { StudioCursor } from "./StudioCursor";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  if (isHome) return <MotionConfig reducedMotion="user"><StudioCursor key={pathname} /><main id="conteudo">{children}</main></MotionConfig>;
  return <MotionConfig reducedMotion="user"><StudioCursor key={pathname} /><ScrollProgress className="from-turquoise via-ice to-champagne" /><ChaosHeader /><main id="conteudo" className="relative flex min-h-screen flex-col overflow-hidden">{children}</main><ChaosFooter /><FloatingWA /></MotionConfig>;
}
