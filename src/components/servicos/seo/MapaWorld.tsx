"use client";

import { Stage } from "../stage/Stage";

export function MapaWorld() {
  return <Stage load={() => import("./mapa-scene")} />;
}
