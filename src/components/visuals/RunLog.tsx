"use client";

import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useId, useRef, useState } from "react";

const DAYS = 100;
const W = 1000;
const H = 472;
const X0 = 84;
const X1 = 976;
const Y0 = 318; // 0 km
const Y1 = 30; // 1000 km
const BAR_TOP = 360;
const BAR_BOTTOM = 412;

const xFor = (d: number) => X0 + ((X1 - X0) * d) / DAYS;
const yFor = (km: number) => Y0 - ((Y0 - Y1) * km) / 1000;

// All 100 daily bars as one path (cheaper than 100 elements).
const BAR_W = (X1 - X0) / DAYS - 3;
const BARS = Array.from({ length: DAYS }, (_, d) => `M${(xFor(d) + 1.5).toFixed(2)} ${BAR_TOP}h${BAR_W.toFixed(2)}v${BAR_BOTTOM - BAR_TOP}h-${BAR_W.toFixed(2)}z`).join("");

// A run log that draws itself as you scroll: 100 days, 10 km a day, 1,000 km.
export function RunLog({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const progress = reduce ? scrollYProgress : smooth;
  const [day, setDay] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const d = Math.max(0, Math.min(DAYS, Math.round(v * DAYS)));
    setDay((prev) => (prev === d ? prev : d));
  });

  const headX = useTransform(progress, (v) => xFor(Math.min(1, Math.max(0, v)) * DAYS));
  const headY = useTransform(progress, (v) => yFor(Math.min(1, Math.max(0, v)) * 1000));
  const areaClip = useTransform(progress, (v) => `inset(0 ${100 - Math.min(1, Math.max(0, v)) * 100}% 0 0)`);
  const barsLit = useTransform(progress, (v) => ((X1 - X0) * Math.round(Math.min(1, Math.max(0, v)) * DAYS)) / DAYS);
  const clipId = `runbars-${useId().replace(/:/g, "")}`;
  const km = day * 10;

  return (
    <div ref={ref} className={`relative flex flex-col bg-ink-2 ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
        <p className="label">
          Run log <span className="mx-1.5 text-apricot">/</span> Sep to Dec 2025
        </p>
        <p className="label hidden sm:block">Logged daily on Strava</p>
      </div>

      <div className="grid grid-cols-3 border-b border-line">
        <Readout label="Day" value={String(day).padStart(3, "0")} total="/100" />
        <Readout label="Distance" value={km.toLocaleString("en-US")} total=" km" border />
        <Readout label="Daily" value="10" total=" km" border />
      </div>

      <div className="relative flex-1 px-2 pb-2 pt-4 sm:px-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Chart: cumulative distance rising evenly from 0 to 1,000 km over 100 days, one 10 km run every day.">
          {/* grid */}
          {[0, 250, 500, 750, 1000].map((k) => (
            <g key={k}>
              <line x1={X0} x2={X1} y1={yFor(k)} y2={yFor(k)} stroke="rgba(237,230,216,0.1)" strokeDasharray={k === 0 ? undefined : "2 6"} />
              <text x={X0 - 10} y={yFor(k) + 4} textAnchor="end" className="fill-muted font-mono text-[30px] sm:text-[13px]">
                {k === 0 ? "0" : `${k}`}
              </text>
            </g>
          ))}
          <text x={X0 - 10} y={Y1 - 14} textAnchor="end" className="fill-muted font-mono text-[24px] sm:text-[11px]" letterSpacing="1.5">
            KM
          </text>

          {/* ghost target line */}
          <line x1={xFor(0)} y1={yFor(0)} x2={xFor(DAYS)} y2={yFor(1000)} stroke="rgba(237,230,216,0.12)" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />

          {/* area under the line */}
          <m.path
            d={`M${xFor(0)} ${yFor(0)} L${xFor(DAYS)} ${yFor(1000)} L${xFor(DAYS)} ${yFor(0)} Z`}
            fill="url(#runFill)"
            style={{ clipPath: areaClip }}
          />
          <defs>
            <linearGradient id="runFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2994A" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#F2994A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* the line */}
          <m.path
            d={`M${xFor(0)} ${yFor(0)} L${xFor(DAYS)} ${yFor(1000)}`}
            fill="none"
            stroke="#F2994A"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
          <m.circle cx={headX} cy={headY} r="7" fill="#0E0D0B" stroke="#F2994A" strokeWidth="3" />

          {/* daily bars: 100 identical runs */}
          <clipPath id={clipId}>
            <m.rect x={X0} y={BAR_TOP - 2} height={BAR_BOTTOM - BAR_TOP + 4} width={barsLit} />
          </clipPath>
          <path d={BARS} fill="rgba(237,230,216,0.1)" />
          <path d={BARS} fill="#F2994A" clipPath={`url(#${clipId})`} />
          <text x={X0} y={H - 8} className="fill-muted font-mono text-[28px] sm:text-[12px]" letterSpacing="1.5">
            DAY 1
          </text>
          <text x={(X0 + X1) / 2} y={H - 8} textAnchor="middle" className="fill-muted font-mono text-[28px] sm:text-[12px]" letterSpacing="1.5">
            DAY 50
          </text>
          <text x={X1} y={H - 8} textAnchor="end" className="fill-muted font-mono text-[28px] sm:text-[12px]" letterSpacing="1.5">
            DAY 100
          </text>
        </svg>
      </div>
    </div>
  );
}

function Readout({ label, value, total, border }: { label: string; value: string; total: string; border?: boolean }) {
  return (
    <div className={`px-4 py-3 sm:px-6 sm:py-4 ${border ? "border-l border-line" : ""}`}>
      <p className="label">{label}</p>
      <p className="mt-1 font-mono text-xl font-medium tabular-nums text-paper sm:text-3xl">
        {value}
        <span className="text-sm text-muted sm:text-base">{total}</span>
      </p>
    </div>
  );
}
