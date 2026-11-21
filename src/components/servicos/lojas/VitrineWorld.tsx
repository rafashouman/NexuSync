"use client";

import { Stage } from "../stage/Stage";

export function VitrineWorld() {
  return <Stage load={() => import("./vitrine-scene")} />;
}
