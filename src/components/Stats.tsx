import { stats, marquee } from "@/content/site";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";

export function Stats() {
  return (
    <section aria-label="Key numbers" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between border-t border-line py-4">
        <p className="label">Field summary</p>
        <p className="label">2023 to 2026</p>
      </div>
      <dl className="grid grid-cols-2 border-t border-line md:grid-cols-5">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.06}
            className={`flex flex-col justify-between gap-6 border-b border-line py-7 pr-4 md:border-b-0 md:py-10 md:pl-6 md:pr-6 ${
              i % 2 === 1 ? "pl-4 border-l md:border-l" : ""
            } ${i > 0 ? "md:border-l" : "md:pl-0"} ${i === 4 ? "col-span-2 md:col-span-1" : ""} ${
              i === 4 ? "border-l-0" : ""
            } border-line`}
          >
            <dt className="order-2 max-w-[22ch] text-sm leading-snug text-muted">{s.label}</dt>
            <dd className="order-1 whitespace-nowrap font-mono text-[2.1rem] font-medium leading-none tracking-tight text-apricot sm:text-5xl lg:text-[2.9rem] xl:text-[3.4rem]">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

export function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <section aria-label="Worked with or alongside" className="marquee relative overflow-hidden border-y border-line py-8 sm:py-10" data-cursor="Pause">
      <p className="sr-only">Worked with or alongside: {marquee.join(", ")}</p>
      <div className="marquee-track flex w-max items-center" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {row.map((name, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="display whitespace-nowrap px-6 text-[clamp(2.4rem,6vw,5.5rem)] italic text-paper/85 sm:px-10">{name}</span>
                <span className="font-mono text-sm text-apricot">/</span>
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
