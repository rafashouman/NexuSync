"use client";

import { usePathname } from "next/navigation";
import { appCatalog } from "@/data/appCatalog";
import { AppGuide } from "./AppGuide";

export function RouteAppGuide() {
  const path = usePathname();
  const app = appCatalog.find(entry => entry.path === path);
  return app ? <AppGuide key={app.slug} app={app} /> : null;
}
