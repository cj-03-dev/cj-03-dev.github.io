"use client";

import { useEffect, useRef } from "react";

// A living topographic map for the hero, drawn on a canvas:
// contour rings slowly breathe and drift, and soft apricot light pulses
// travel along some of them with a glow. Pauses off-screen; static for
// reduced motion.

type Center = { x: number; y: number; rings: number; base: number; gap: number; seed: number };

const VW = 1200;
const VH = 1000;
const N = 64;
const CENTERS: Center[] = [
  { x: 900, y: 300, rings: 11, base: 26, gap: 30, seed: 1.7 },
  { x: 980, y: 780, rings: 9, base: 40, gap: 34, seed: 4.1 },
  { x: 380, y: 880, rings: 6, base: 60, gap: 38, seed: 2.9 },
];
const RX = 1.25;
const RY = 0.82;

function ring(c: Center, k: number, t: number) {
  const r0 = (c.base + k * c.gap) * (1 + 0.018 * Math.sin(t * 0.55 + k * 0.5 + c.seed));
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob =
      0.13 * Math.sin(3 * a + c.seed + k * 0.22 + t * 0.22) +
      0.08 * Math.sin(5 * a + c.seed * 2.3 - k * 0.15 - t * 0.17) +
      0.05 * Math.sin(2 * a + c.seed * 0.7 + k * 0.4 + t * 0.11);
    const r = r0 * (1 + wob);
    pts.push([c.x + Math.cos(a) * r * RX, c.y + Math.sin(a) * r * RY]);
  }
  const p = new Path2D();
  const mid = (u: [number, number], v: [number, number]) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2] as const;
  const m0 = mid(pts[N - 1], pts[0]);
  p.moveTo(m0[0], m0[1]);
  for (let i = 0; i < N; i++) {
    const cur = pts[i];
    const m = mid(cur, pts[(i + 1) % N]);
    p.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
  }
  p.closePath();
  // ellipse perimeter (Ramanujan) for dash sizing
  const A = r0 * RX, B = r0 * RY;
  const per = Math.PI * (3 * (A + B) - Math.sqrt((3 * A + B) * (A + 3 * B)));
  return { p, per };
}

export function ContourField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const fps = small ? 24 : 30;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let s = 1, ox = 0, oy = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      s = Math.max(w / VW, h / VH); // like preserveAspectRatio "xMidYMid slice"
      ox = (w - VW * s) / 2;
      oy = (h - VH * s) / 2;
    };

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(s, 0, 0, s, ox, oy);
      const px = dpr / s; // 1 CSS pixel in map units
      // slow overall drift
      ctx.translate(Math.sin(t * 0.07) * 14, Math.cos(t * 0.05) * 10);

      CENTERS.forEach((c, ci) => {
        for (let k = 0; k < c.rings; k++) {
          const { p, per } = ring(c, k, t);
          const accent = ci === 0 && k === 3;

          // base line
          ctx.setLineDash([]);
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = (accent ? 1.4 : 1) * px;
          ctx.strokeStyle = accent ? "rgba(242,153,74,0.8)" : `rgba(237,230,216,${k % 4 === 0 ? 0.17 : 0.1})`;
          ctx.stroke(p);

          // glow around the accent ring (breathing)
          if (accent) {
            ctx.globalCompositeOperation = "lighter";
            ctx.lineWidth = 7 * px;
            ctx.strokeStyle = `rgba(242,153,74,${0.07 + 0.05 * Math.sin(t * 1.3)})`;
            ctx.stroke(p);
          }

          // travelling light pulses on every third ring
          if ((k + ci) % 3 === 0 && !reduce) {
            const len = per * 0.07;
            const off = -((t * (18 + k * 2) + c.seed * 400 + k * 97) % per);
            ctx.globalCompositeOperation = "lighter";
            ctx.setLineDash([len, per - len]);
            ctx.lineDashOffset = off;
            ctx.lineCap = "round";
            ctx.lineWidth = 8 * px; // soft halo
            ctx.strokeStyle = "rgba(242,153,74,0.10)";
            ctx.stroke(p);
            ctx.lineWidth = 3.5 * px;
            ctx.strokeStyle = "rgba(242,153,74,0.22)";
            ctx.stroke(p);
            ctx.lineWidth = 1.4 * px; // bright core
            ctx.strokeStyle = "rgba(255,196,140,0.95)";
            ctx.stroke(p);
          }
        }
      });
      ctx.globalCompositeOperation = "source-over";
      ctx.setLineDash([]);
    };

    resize();
    draw(0);
    requestAnimationFrame(() => (canvas.style.opacity = "1"));
    if (reduce) {
      const onR = () => { resize(); draw(0); };
      window.addEventListener("resize", onR);
      return () => window.removeEventListener("resize", onR);
    }

    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / fps) return;
      last = now;
      draw((now - start) / 1000);
    };
    let ready = false;
    const play = () => {
      if (!ready || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    // let the intro and first paint finish before animating
    const kick = window.setTimeout(() => {
      ready = true;
      play();
    }, 1200);

    return () => {
      clearTimeout(kick);
      pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className={`opacity-0 transition-opacity duration-[1.6s] ${className}`} />;
}
