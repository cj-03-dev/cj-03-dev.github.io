import { stats, marquee } from "@/content/site";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { StatIcon } from "./StatIcon";

export function Stats() {
  return (
    <section aria-label="Key numbers" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between border-t border-line py-4">
        <p className="label">In numbers</p>
        <p className="label">2023 to 2026</p>
      </div>
      <div className="grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={(i % 4) * 0.06} className="group flex flex-col gap-5 bg-ink px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex items-start justify-between">
              <StatIcon kind={s.icon} className="h-6 w-6 text-paper/70 transition-colors duration-500 group-hover:text-apricot sm:h-7 sm:w-7" />
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="whitespace-nowrap font-mono text-[1.9rem] font-medium leading-none tracking-tight text-apricot sm:text-5xl xl:text-[3.4rem]">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="max-w-[24ch] text-sm leading-snug text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Marquee() {
  const row = marquee; // one list per copy; two copies make the seamless loop
  return (
    <section aria-label="Worked with or alongside" className="marquee relative overflow-hidden border-y border-line py-8 sm:py-10">
      <p className="sr-only">Worked with or alongside: {marquee.join(", ")}</p>
      <div className="marquee-track flex w-max items-center" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((name, i) => (
              <span
                key={`${copy}-${i}`}
                className="display whitespace-nowrap px-6 text-[clamp(2.4rem,6vw,5.5rem)] italic text-paper/85 after:ml-12 after:font-mono after:text-sm after:not-italic after:text-apricot after:content-['/'] sm:px-10 sm:after:ml-20"
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent sm:w-32" />
    </section>
  );
}
