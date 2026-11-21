"use client";

import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useSpring } from "motion/react";

// Small apricot dot that grows into a labelled ring over interactive elements.
// Elements opt in with data-cursor="View" (any label). Links/buttons get a ring.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.4 });
  const last = useRef<Element | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      if (target === last.current) return;
      last.current = target;
      const el = target?.closest?.("[data-cursor], a, button, [role='button'], input, textarea");
      if (!el) {
        setHovering(false);
        setLabel(null);
        return;
      }
      setHovering(true);
      setLabel(el.getAttribute("data-cursor") || null);
    };
    const leave = () => setVisible(false);
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 40 : 10;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[150]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <m.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          scale: down ? 0.85 : 1,
          backgroundColor: label ? "rgba(242,153,74,1)" : hovering ? "rgba(242,153,74,0)" : "rgba(242,153,74,1)",
          borderWidth: hovering && !label ? 1.5 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        style={{ borderColor: "#F2994A", borderStyle: "solid" }}
      >
        {label && (
          <m.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink"
          >
            {label}
          </m.span>
        )}
      </m.div>
    </m.div>
  );
}
