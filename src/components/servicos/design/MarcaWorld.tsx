"use client";

import { Stage } from "../stage/Stage";

export function MarcaWorld() {
  return <Stage load={() => import("./marca-scene")} />;
}
