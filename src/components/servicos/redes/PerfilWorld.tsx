"use client";

import { Stage } from "../stage/Stage";

export function PerfilWorld() {
  return <Stage load={() => import("./perfil-scene")} />;
}
