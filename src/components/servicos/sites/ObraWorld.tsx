"use client";

import { Stage } from "../stage/Stage";

export function ObraWorld() {
  return <Stage load={() => import("./obra-scene")} />;
}
