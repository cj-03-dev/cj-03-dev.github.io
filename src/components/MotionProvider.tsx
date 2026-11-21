"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

// Lightweight motion bundle (m.* components) and OS-level reduced-motion support.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
