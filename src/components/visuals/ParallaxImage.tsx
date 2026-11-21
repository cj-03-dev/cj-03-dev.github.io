"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { img } from "@/lib/asset";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  reveal?: boolean;
  children?: React.ReactNode;
  imgClassName?: string;
  sizes?: string;
};

function Picture({ src, alt, priority, imgClassName, sizes }: Pick<Props, "src" | "alt" | "priority" | "imgClassName" | "sizes">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...img(src)}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${imgClassName}`}
    />
  );
}

// Scroll-linked layer. Mounted only near the viewport so pages don't pay
// for a scroll measurement per image at startup.
function ParallaxLayer({ target, children }: { target: React.RefObject<HTMLDivElement | null>; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  return (
    <m.div style={{ y }} className="absolute inset-x-0 -inset-y-[9%]">
      {children}
    </m.div>
  );
}

// Duotoned image with slow parallax and a clip-path reveal on first view.
export function ParallaxImage({ src, alt, className = "", priority, reveal = true, children, imgClassName = "", sizes = "(min-width: 1024px) 58vw, 100vw" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const picture = <Picture src={src} alt={alt} priority={priority} imgClassName={imgClassName} sizes={sizes} />;

  return (
    <m.div
      ref={ref}
      className={`duo relative overflow-hidden ${className}`}
      initial={reveal ? (reduce ? { opacity: 0 } : { clipPath: "inset(12% 9% 12% 9%)" }) : false}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.6 : 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      {near ? (
        <ParallaxLayer target={ref}>{picture}</ParallaxLayer>
      ) : (
        <div className="absolute inset-x-0 -inset-y-[9%]">{picture}</div>
      )}
      {children}
    </m.div>
  );
}
