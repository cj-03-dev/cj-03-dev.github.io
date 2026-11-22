// Interstellar-style loading scene, pure CSS (see .space in globals.css):
// stars rush past at warp speed, a black hole forms with a spinning
// accretion disk and a lensed halo, then the camera dives in.
// Star positions are deterministic so server and client match.

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function starField(count: number, seed: number, spread: number) {
  const r = rng(seed);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    // bias stars away from the very centre so the hole reads cleanly
    const a = r() * Math.PI * 2;
    const d = (0.12 + Math.pow(r(), 0.7) * 0.88) * spread;
    const x = Math.round(Math.cos(a) * d);
    const y = Math.round(Math.sin(a) * d * 0.62);
    const size = r() < 0.22 ? 1 : 0;
    const alpha = (0.45 + r() * 0.55).toFixed(2);
    const tint = r() < 0.25 ? "214 186 255" : "255 255 255";
    out.push(`${x}px ${y}px 0 ${size}px rgb(${tint} / ${alpha})`);
  }
  return out.join(",");
}

const FAR = starField(160, 11, 900);
const NEAR = starField(130, 29, 1100);

export function IntroMark() {
  return (
    <div className="space" aria-hidden="true">
      <span className="stars stars-far" style={{ boxShadow: FAR }} />
      <span className="stars stars-near" style={{ boxShadow: NEAR }} />
      <div className="bh">
        <span className="bh-glow" />
        <span className="bh-disk bh-disk-back" />
        <span className="bh-halo" />
        <span className="bh-core" />
        <span className="bh-disk bh-disk-front" />
      </div>
    </div>
  );
}
