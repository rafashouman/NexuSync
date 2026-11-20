"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { DemoFrame } from "./DemoFrame";

export { DEMO_CONTENT_ID, useDemoTheme } from "./DemoFrame";

export default function DemoShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DemoFrame>{children}</DemoFrame>
    </MotionConfig>
  );
}
