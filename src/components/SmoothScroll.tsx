"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: Lenis | undefined;
    let raf = 0;
    // Start after the page has settled so it doesn't compete with first load.
    const start = () => {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        anchors: { offset: -72 },
        smoothWheel: true,
      });
      window.__lenis = lenis;
      const loop = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const idle = "requestIdleCallback" in window;
    const t = idle ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
    return () => {
      if (!lenis) {
        if (idle) window.cancelIdleCallback(t);
        else clearTimeout(t);
      }
      cancelAnimationFrame(raf);
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New page: start at the top (or at the hash target).
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        requestAnimationFrame(() =>
          window.__lenis ? window.__lenis.scrollTo(el as HTMLElement, { offset: -72, immediate: true }) : el.scrollIntoView()
        );
        return;
      }
    }
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
