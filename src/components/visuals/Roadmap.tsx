"use client";

import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { img } from "@/lib/asset";

const STOPS = [
  { k: "Now", v: "Live site at stonefruitlabs.com" },
  { k: "Next", v: "First paying users" },
  { k: "Later", v: "Deeper personalisation" },
];

export function Roadmap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [lit, setLit] = useState(0);
  useMotionValueEvent(reduce ? scrollYProgress : p, "change", (v) => {
    const n = v > 0.98 ? 3 : v > 0.48 ? 2 : v > 0.02 ? 1 : 0;
    setLit((prev) => (prev === n ? prev : n));
  });

  return (
    <div ref={ref} className={className}>
      <p className="label mb-5">Roadmap</p>
      <div className="relative">
        {/* track */}
        <div className="absolute left-[7px] right-[7px] top-[7px] h-px bg-line sm:left-[7px]" aria-hidden="true" />
        <m.div
          aria-hidden="true"
          className="absolute left-[7px] right-[7px] top-[7px] h-px origin-left bg-apricot"
          style={{ scaleX: reduce ? scrollYProgress : p }}
        />
        <ol className="relative grid grid-cols-3 gap-3">
          {STOPS.map((s, i) => {
            const on = i < lit;
            return (
              <li key={s.k} className={i === 1 ? "text-center" : i === 2 ? "text-right" : ""}>
                <span
                  className={`relative inline-block h-[15px] w-[15px] rounded-full border transition-all duration-500 ${
                    on ? "border-apricot bg-apricot shadow-[0_0_0_6px_rgba(242,153,74,0.15)]" : "border-muted bg-ink"
                  }`}
                  aria-hidden="true"
                />
                <p className={`mt-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-500 ${on ? "text-apricot" : "text-muted"}`}>
                  {s.k}
                </p>
                <p className={`mt-1 text-sm leading-snug transition-colors duration-500 ${on ? "text-paper" : "text-muted"}`}>{s.v}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function StonefruitFrame({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[6px] border border-line bg-ink-2 ${className}`}>
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
        </span>
        <span className="flex-1 truncate rounded-full bg-ink px-3 py-1 text-center font-mono text-[10px] tracking-[0.08em] text-muted">
          stonefruitlabs.com
        </span>
      </div>
      <div className="duo group/sf relative aspect-[1705/922]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...img("/images/stonefruit")}
          sizes="(min-width: 1024px) 58vw, 100vw"
          alt="The Stonefruit homepage: Health and Longevity Companion"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}
