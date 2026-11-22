"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

// Illustrative spread across all seven continents (not a member list).
const MARKERS: [number, number][] = [
  [17.385, 78.4867], [28.6139, 77.209], [19.076, 72.8777], [22.5726, 88.3639], [12.9716, 77.5946],
  [6.9271, 79.8612], [23.8103, 90.4125], [27.7172, 85.324], [24.8607, 67.0011], [1.3521, 103.8198],
  [13.7563, 100.5018], [-6.2088, 106.8456], [14.5995, 120.9842], [35.6762, 139.6503], [37.5665, 126.978],
  [31.2304, 121.4737], [25.2048, 55.2708], [41.0082, 28.9784], [35.6892, 51.389], [51.5072, -0.1276],
  [48.8566, 2.3522], [52.52, 13.405], [41.9028, 12.4964], [40.4168, -3.7038], [59.3293, 18.0686],
  [50.0755, 14.4378], [55.7558, 37.6173], [6.5244, 3.3792], [-1.2921, 36.8219], [30.0444, 31.2357],
  [-33.9249, 18.4241], [33.5731, -7.5898], [40.7128, -74.006], [34.0522, -118.2437], [43.6532, -79.3832],
  [19.4326, -99.1332], [41.8781, -87.6298], [4.711, -74.0721], [-23.5505, -46.6333], [-34.6037, -58.3816],
  [-12.0464, -77.0428], [-33.4489, -70.6693], [-33.8688, 151.2093], [-37.8136, 144.9631], [-36.8485, 174.7633],
  [64.1466, -21.9426], [-77.8463, 166.6683], [-62.2, -58.96],
];

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const drag = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.offsetWidth;
    let phi = 4.6;
    let raf = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 1.15,
      mapSamples: 18000,
      mapBrightness: 4.2,
      mapBaseBrightness: 0.02,
      baseColor: [0.2, 0.18, 0.16],
      markerColor: [0.949, 0.6, 0.29],
      glowColor: [0.24, 0.14, 0.17],
      markers: MARKERS.map((location, i) => ({ location, size: i === 0 ? 0.05 : 0.02 + ((i * 37) % 5) * 0.004 })),
      opacity: 0.92,
    });

    const onResize = () => {
      width = canvas.offsetWidth;
      globe.update({ width: width * dpr, height: width * dpr });
    };
    window.addEventListener("resize", onResize);

    const loop = () => {
      if (pointer.current === null) {
        phi += reduce ? 0 : 0.0028 + velocity.current;
        velocity.current *= 0.94;
      }
      globe.update({ phi: phi + drag.current });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    requestAnimationFrame(() => (canvas.style.opacity = "1"));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
     
      aria-label="Rotating globe with markers across all seven continents. Drag to spin."
      role="img"
      className={`aspect-square w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 active:cursor-grabbing ${className}`}
      onPointerDown={(e) => {
        pointer.current = e.clientX - drag.current * 200;
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      }}
      onPointerUp={() => {
        pointer.current = null;
      }}
      onPointerCancel={() => {
        pointer.current = null;
      }}
      onPointerMove={(e) => {
        if (pointer.current !== null) {
          const next = (e.clientX - pointer.current) / 200;
          velocity.current = (next - drag.current) * 0.15;
          drag.current = next;
        }
      }}
    />
  );
}
