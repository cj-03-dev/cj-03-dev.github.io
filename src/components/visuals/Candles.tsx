// Decorative candlestick motif. No axes, no prices, no labels: not data.
// Server component; the grow-in animation is CSS, triggered by RevealObserver.

// Deterministic pseudo-random so every build renders the same shapes.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function Candles({ className = "", count = 42, cover = false }: { className?: string; count?: number; cover?: boolean }) {
  const r = rng(7);
  let price = 50;
  const candles = Array.from({ length: count }, (_, i) => {
    const drift = 0.55 + (i / count) * 0.5;
    const open = price;
    const close = open + (r() - 0.42) * 9 * drift;
    const high = Math.max(open, close) + r() * 4;
    const low = Math.min(open, close) - r() * 4;
    price = close;
    return { open, close, high, low };
  });

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const W = 600;
  const H = 340;
  const pad = 20;
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const step = (W - pad * 2) / count;

  const avg = candles.map((_, i) => {
    const slice = candles.slice(Math.max(0, i - 5), i + 1);
    return slice.reduce((a, c) => a + c.close, 0) / slice.length;
  });
  const avgPath = avg.map((v, i) => `${i === 0 ? "M" : "L"}${(pad + i * step + step / 2).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  return (
    <div data-reveal="" className={`candles relative overflow-hidden bg-ink-2 ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
        <p className="label">
          TTMI <span className="mx-1.5 text-apricot">/</span> Investment memo
        </p>
        <p className="label">Russell screen</p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={cover ? "absolute inset-0 h-full w-full" : "w-full"}
        preserveAspectRatio={cover ? "xMidYMid slice" : undefined}
        aria-hidden="true"
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={W - pad} y1={H * f} y2={H * f} style={{ stroke: "rgb(var(--fg-rgb) / 0.07)" }} strokeDasharray="2 6" />
        ))}
        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const x = pad + i * step + step / 2;
          const top = y(Math.max(c.open, c.close));
          const bot = y(Math.min(c.open, c.close));
          return (
            <g key={i} className="candle" style={{ ["--cd" as string]: `${(i * 0.025).toFixed(3)}s` }}>
              <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} strokeWidth="1" style={{ stroke: up ? "var(--color-apricot)" : "rgb(var(--fg-rgb) / 0.35)" }} />
              <rect
                x={x - step * 0.3}
                y={top}
                width={step * 0.6}
                height={Math.max(1.5, bot - top)}
                style={{ fill: up ? "var(--color-apricot)" : "transparent", stroke: up ? "var(--color-apricot)" : "rgb(var(--fg-rgb) / 0.45)" }}
                strokeWidth="1"
              />
            </g>
          );
        })}
        <path className="avg" d={avgPath} pathLength={1} fill="none" strokeOpacity="0.55" strokeWidth="1.2" style={{ stroke: "var(--color-paper)" }} />
      </svg>
    </div>
  );
}
