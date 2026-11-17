"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChaosHeader, ChaosFooter } from "./ChaosChrome";
import { FloatingWA } from "@/components/FloatingWA";
import { ScrollProgress } from "@/components/ui/MotionKit";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";
  if (isHome) return <MotionConfig reducedMotion="user"><main id="conteudo">{children}</main></MotionConfig>;
  return <MotionConfig reducedMotion="user"><ScrollProgress className="from-turquoise via-ice to-champagne" /><ChaosHeader /><main id="conteudo" className="relative flex min-h-screen flex-col overflow-hidden">{children}</main><ChaosFooter /><FloatingWA /></MotionConfig>;
}
