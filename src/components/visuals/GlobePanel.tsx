"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Counter } from "../Counter";
import { img } from "@/lib/asset";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

// Lazy: the WebGL globe only loads when the panel nears the viewport.
export function GlobePanel({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative isolate overflow-hidden bg-ink-2 ${className}`}>
      <div className="phones-art absolute inset-0 -z-10" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...img("/images/phones-art")} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_50%,transparent_15%,var(--color-ink-2)_80%)]" aria-hidden="true" />

      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
        <p className="label">
          Reach
          <span className="hidden sm:inline">
            <span className="mx-1.5 text-apricot">/</span> Jan 2025 to Apr 2026
          </span>
        </p>
        <p className="label">Drag to spin</p>
      </div>

      <div className="relative grid items-center gap-2 p-4 sm:p-6 md:grid-cols-[1fr_1.35fr]">
        <div className="order-2 md:order-1">
          <p className="font-mono text-6xl font-medium leading-none tracking-tight text-apricot sm:text-7xl lg:text-8xl">
            <Counter value={90} suffix="+" />
          </p>
          <p className="display mt-3 text-3xl text-paper sm:text-4xl">countries</p>
          <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-muted">All seven continents.</p>        </div>
        <div className="order-1 mx-auto w-full max-w-[460px] md:order-2">
          <div className="relative aspect-square w-full">
            {show ? <Globe /> : <div className="aspect-square w-full rounded-full border border-line" />}
          </div>
        </div>
      </div>
    </div>
  );
}
