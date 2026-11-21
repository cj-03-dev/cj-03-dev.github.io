"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// Cycles through words with a vertical roll. Width is reserved for the
// longest word so the headline never reflows.
export function RollingWord({ words, startDelay = 2600, interval = 2400 }: { words: string[]; startDelay?: number; interval?: number }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

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
      {/* invisible sizer */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {longest}
      </span>
      <span className="sr-only">{words[0]}</span>
      <AnimatePresence initial={false}>
        <m.span
          key={words[i]}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap text-apricot italic"
          initial={reduce ? { opacity: 0 } : { y: "105%", opacity: 1 }}
          animate={reduce ? { opacity: 1 } : { y: "0%", opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-105%", opacity: 1 }}
          transition={{ duration: reduce ? 0.4 : 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {words[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
