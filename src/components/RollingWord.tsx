"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// Cycles through words with a vertical roll. Width is reserved for the
// longest word so the headline never reflows.
export function RollingWord({ words, startDelay = 3000, interval = 2400 }: { words: string[]; startDelay?: number; interval?: number }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const seen = document.documentElement.dataset.intro === "seen";
    const t = setTimeout(
      () => {
        setI(1);
        id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
      },
      seen ? startDelay - 1100 : startDelay
    );
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [words.length, interval, startDelay]);

  return (
    <span className="relative inline-grid align-top" aria-live="off">
      {/* Invisible sizers: every word, in the same italic style, stacked in one cell,
          so the box is as wide as the widest word actually renders. */}
      {words.map((w) => (
        <span key={`size-${w}`} className="invisible col-start-1 row-start-1 whitespace-nowrap italic" aria-hidden="true">
          {w}
        </span>
      ))}
      <span className="sr-only">{words[0]}</span>
      {/* Sequential: old word rolls up and out, then the new one rises in, so they never overlap neighbouring lines. */}
      <AnimatePresence initial={false} mode="wait">
        <m.span
          key={words[i]}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap text-apricot italic"
          initial={reduce ? { opacity: 0 } : { y: "45%", opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: "0%", opacity: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
          exit={reduce ? { opacity: 0 } : { y: "-45%", opacity: 0, transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] } }}
          transition={{ duration: 0.4 }}
        >
          {words[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
