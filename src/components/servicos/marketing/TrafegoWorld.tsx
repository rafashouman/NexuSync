"use client";

import { Stage } from "../stage/Stage";

export function TrafegoWorld() {
  return <Stage load={() => import("./trafego-scene")} />;
}
