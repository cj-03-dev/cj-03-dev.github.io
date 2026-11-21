import { hero, site } from "@/content/site";
import { img } from "@/lib/asset";
import { RollingWord } from "./RollingWord";

function Words({ text, start }: { text: string; start: number }) {
  return (
    <>
      {text.split(" ").map((w, k) => (
        <span key={k} className="mask">
          <span className="rise" style={{ ["--i" as string]: start + k }}>
            {w}
          </span>
          {" "}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const [l1, l2, l3] = hero.lines;
  const n1 = l1.split(" ").length;
  const n2 = l2.split(" ").length;

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      {/* Atmospheric texture, duotoned and faded into the ink */}
      <div
        aria-hidden="true"
        className="after-intro duo duo-soft pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-[0.22] md:w-[58%] md:opacity-30"
        style={{
          ["--d" as string]: "-0.3s",
          maskImage: "linear-gradient(to left, black 5%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to left, black 5%, transparent 90%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...img("/images/hero-texture")} sizes="(min-width: 768px) 58vw, 100vw" alt="" className="h-full w-full object-cover object-right" fetchPriority="low" />
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
        <div className="after-intro flex items-center justify-between border-b border-line py-4" style={{ ["--d" as string]: "-0.2s" }}>
          <p className="label">
            {hero.label.map((s, i) => (
              <span key={s}>
                {i > 0 && <span className="mx-2 text-apricot">/</span>}
                {s}
              </span>
            ))}
          </p>
          <p className="label hidden sm:block">17.385° N, 78.487° E</p>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">
          <h1 className="display text-[clamp(2.6rem,11.6vw,9.6rem)] text-paper">
            <span className="block">
              <Words text={l1} start={0} />
            </span>
            <span className="block">
              <Words text={l2} start={n1} />
              <span className="mask">
                <span className="rise" style={{ ["--i" as string]: n1 + n2 }}>
                  <RollingWord words={hero.rolling} />
                </span>
              </span>
            </span>
            <span className="block">
              <Words text={l3} start={n1 + n2 + 1} />
            </span>
          </h1>

          <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-12 md:items-end">
            <p
              className="after-intro max-w-[38ch] text-[1.0625rem] leading-relaxed text-paper/80 md:col-span-6 lg:col-span-5 lg:text-lg"
              style={{ ["--d" as string]: "0s" }}
            >
              {hero.subline}
            </p>
            <div className="after-intro flex flex-col gap-5 md:col-span-6 md:items-end lg:col-span-7" style={{ ["--d" as string]: "0.12s" }}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${site.email}`}
                  data-cursor="Email"
                  className="group inline-flex h-12 items-center gap-3 rounded-full bg-apricot px-6 font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Email me
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="#work"
                  data-cursor="View"
                  className="group inline-flex h-12 items-center gap-3 rounded-full border border-line px-6 font-medium text-paper transition-colors duration-300 hover:border-paper/50"
                >
                  See the work
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                    ↓
                  </span>
                </a>
              </div>
              <p className="inline-flex items-center gap-3 rounded-full border border-line bg-ink/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/80">
                <span className="pulse relative inline-block h-2 w-2 rounded-full bg-apricot text-apricot" aria-hidden="true" />
                {hero.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
