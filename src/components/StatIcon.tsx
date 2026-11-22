import type { StatIcon as Kind } from "@/content/site";

// Custom line glyphs (24px grid, 1.25 stroke) for the numbers strip.
const paths: Record<Kind, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" />
    </>
  ),
  continents: (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={12 + Math.cos(a) * 8} cy={12 + Math.sin(a) * 8} r="1.6" />;
      })}
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),
  route: (
    <>
      <path d="M3 19c3-1 3-6 6-7s4 4 7 2 2-7 5-9" />
      <circle cx="3" cy="19" r="1.6" fill="currentColor" stroke="none" />
      <path d="M19 3h3v3" />
    </>
  ),
  signal: (
    <>
      <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
      <path d="M8.5 13.5a5 5 0 0 1 7 0M5.5 10.5a9 9 0 0 1 13 0M2.5 7.5a13 13 0 0 1 19 0" />
    </>
  ),
  donors: (
    <>
      <circle cx="9" cy="10" r="5" />
      <circle cx="15" cy="10" r="5" />
      <circle cx="12" cy="15" r="5" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 11h6M9 14h6M9 17h4" />
    </>
  ),
  podium: (
    <>
      <path d="M8 21h8M12 21v-6M7 15h10l-1.5-6h-7z" />
      <path d="M12 9V5M10 5h4" />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2A4.6 4.6 0 0 1 21 18.5" />
    </>
  ),
};

export function StatIcon({ kind, className = "" }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}
