// Procedural topographic line art for the hero. Pure SVG, server-rendered,
// deterministic, and drawn in with CSS (see .contour in globals.css).

type Center = { x: number; y: number; rings: number; base: number; gap: number; seed: number };

const CENTERS: Center[] = [
  { x: 900, y: 300, rings: 11, base: 26, gap: 30, seed: 1.7 },
  { x: 960, y: 760, rings: 9, base: 40, gap: 34, seed: 4.1 },
  { x: 380, y: 860, rings: 6, base: 60, gap: 38, seed: 2.9 },
];

function ring(c: Center, k: number) {
  const N = 72;
  const r0 = c.base + k * c.gap;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const wob =
      0.13 * Math.sin(3 * t + c.seed + k * 0.22) +
      0.08 * Math.sin(5 * t + c.seed * 2.3 - k * 0.15) +
      0.05 * Math.sin(2 * t + c.seed * 0.7 + k * 0.4);
    const r = r0 * (1 + wob);
    pts.push([c.x + Math.cos(t) * r * 1.25, c.y + Math.sin(t) * r * 0.82]);
  }
  // closed Catmull-Rom spline -> cubic Béziers
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

export function Contours({ className = "" }: { className?: string }) {
  let k = 0;
  return (
    <svg viewBox="0 0 1200 1000" preserveAspectRatio="xMidYMid slice" className={`contour ${className}`} aria-hidden="true" fill="none">
      {CENTERS.map((c, ci) =>
        Array.from({ length: c.rings }, (_, i) => {
          const accent = ci === 0 && i === 3;
          const idx = k++;
          return (
            <path
              key={`${ci}-${i}`}
              d={ring(c, i)}
              pathLength={1}
              stroke={accent ? "#F2994A" : "#EDE6D8"}
              strokeOpacity={accent ? 0.75 : 0.11 + (i % 4 === 0 ? 0.07 : 0)}
              strokeWidth={accent ? 1.4 : 1}
              vectorEffect="non-scaling-stroke"
              style={{ ["--k" as string]: idx }}
            />
          );
        })
      )}
      {/* survey marker at the summit */}
      <g className="max-md:hidden" stroke="#F2994A" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.9">
        <circle cx="900" cy="300" r="5" fill="#F2994A" stroke="none" />
        <circle cx="900" cy="300" r="16" />
        <path d="M900 270v-18M900 330v18M870 300h-18M930 300h18" />
      </g>
      <text x="928" y="276" className="font-mono max-md:hidden" fill="#9A9285" fontSize="13" letterSpacing="2">
        SURVEY PT. 01
      </text>
    </svg>
  );
}
