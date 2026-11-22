// Letter-free loading mark: topographic contour rings that draw themselves,
// a glowing accent ring, a pulsing core and a light orbiting the outer ring.
// Server-rendered SVG, animated with CSS (see .intro-mark in globals.css).

const N = 60;

function ring(k: number) {
  const r0 = 18 + k * 15;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wob =
      0.12 * Math.sin(3 * a + 1.7 + k * 0.35) +
      0.07 * Math.sin(5 * a + 3.9 - k * 0.25) +
      0.04 * Math.sin(2 * a + 1.2 + k * 0.5);
    const r = r0 * (1 + wob);
    pts.push([120 + Math.cos(a) * r * 1.18, 120 + Math.sin(a) * r * 0.86]);
  }
  const mid = (u: [number, number], v: [number, number]) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
  const m0 = mid(pts[N - 1], pts[0]);
  let d = `M${m0[0].toFixed(2)} ${m0[1].toFixed(2)}`;
  for (let i = 0; i < N; i++) {
    const c = pts[i];
    const m = mid(c, pts[(i + 1) % N]);
    d += `Q${c[0].toFixed(2)} ${c[1].toFixed(2)} ${m[0].toFixed(2)} ${m[1].toFixed(2)}`;
  }
  return d + "Z";
}

const RINGS = Array.from({ length: 6 }, (_, k) => ring(k));
const ACCENT = 2;

export function IntroMark() {
  return (
    <svg viewBox="0 0 240 240" className="intro-mark" fill="none" aria-hidden="true">
      {RINGS.map((d, k) => (
        <path
          key={k}
          d={d}
          pathLength={1}
          className={k === ACCENT ? "intro-ring-accent" : "intro-ring"}
          style={{ ["--k" as string]: k }}
        />
      ))}
      <circle cx="120" cy="120" r="4" className="intro-core" />
      {/* a point of light travelling the outer ring */}
      <circle r="2.6" className="intro-comet">
        <animateMotion dur="1.1s" repeatCount="indefinite" path={RINGS[RINGS.length - 1]} />
      </circle>
    </svg>
  );
}
