"use client";

import { Stage } from "../stage/Stage";

export function RotinaWorld() {
  return <Stage load={() => import("./rotina-scene")} />;
}
