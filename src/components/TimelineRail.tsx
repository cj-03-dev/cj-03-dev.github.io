"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { TimelineItem } from "@/content/site";
import { Reveal } from "./Reveal";

export function TimelineRail({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative pl-8 sm:pl-12">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-line" aria-hidden="true" />
      <m.div
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-apricot"
        style={{ scaleY: reduce ? scrollYProgress : fill }}
        aria-hidden="true"
      />
      {items.map((it, i) => (
        <Reveal as="li" key={it.org} delay={0.04} className={`relative ${i === items.length - 1 ? "" : "pb-12 sm:pb-14"}`}>
          <span className="absolute -left-8 top-[0.55rem] h-[11px] w-[11px] rounded-full border border-apricot bg-ink sm:-left-12" aria-hidden="true" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="display text-[1.9rem] leading-tight text-paper sm:text-[2.4rem]">{it.org}</h3>
            {it.when && <p className="label">{it.when}</p>}
          </div>
          {it.ladder ? (
            <div className="mt-4">
              {it.badge && (
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-apricot/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-apricot">
                  <span aria-hidden="true">↑</span> {it.badge}
                </p>
              )}
              <ol className="flex flex-col">
                {it.ladder.map((r, k) => (
                  <li
                    key={r.role}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line py-3"
                    style={{ paddingLeft: `${(it.ladder!.length - 1 - k) * 0}px` }}
                  >
                    <span className={`flex items-baseline gap-3 ${k === 0 ? "text-paper" : "text-paper/65"}`}>
                      <span className="font-mono text-[10px] text-apricot">{String(it.ladder!.length - k).padStart(2, "0")}</span>
                      {r.role}
                    </span>
                    <span className="label">{r.when}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <>
              <p className="mt-2 text-paper/80">{it.role}</p>
              {it.detail && <p className="mt-1 text-sm text-muted">{it.detail}</p>}
            </>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
