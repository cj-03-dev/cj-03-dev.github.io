type Props = { className?: string; strokeWidth?: number; title?: string };

// "CJ." mark. Paths use pathLength=1 so CSS can draw them with a dash offset.
export function Monogram({ className, strokeWidth = 3, title = "Chirag Joshi" }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title} fill="none">
      <path
        d="M32 21.3 A14 14 0 1 0 32 42.7"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M40 18 H51 M46 18 V39 A7 7 0 0 1 32 39"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="intro-dot" cx="55" cy="44.5" r={strokeWidth * 0.95} fill="#F2994A" />
    </svg>
  );
}
