// "CJ" in an 80s Miami neon style: pink script, cyan offset, soft glow.
// Size it with a text-size class on className.
export function ViceLogo({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  return (
    <span aria-hidden="true" className={`vice-logo ${glow ? "vice-glow" : ""} ${className}`}>
      CJ
    </span>
  );
}
