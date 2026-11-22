import { hero, site } from "@/content/site";
import { RollingWord } from "./RollingWord";
import { Contours } from "./visuals/Contours";

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
  const n = hero.line.split(" ").length;

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-16">
      {/* Topographic line art, drawn in after the intro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-45 md:left-[30%] md:opacity-100"
        style={{
          maskImage: "linear-gradient(to left, black 40%, transparent 98%)",
          WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 98%)",
        }}
      >
        <Contours className="h-full w-full" />
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
        <div className="after-intro flex items-center border-b border-line py-4" style={{ ["--d" as string]: "-0.2s" }}>
          <p className="label">
            {hero.label.map((s, i) => (
              <span key={s}>
                {i > 0 && <span className="mx-2 text-apricot">/</span>}
                {s}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">
          <h1 className="display text-[clamp(3rem,12.5vw,10.5rem)] text-paper">
            <Words text={hero.line} start={0} />
            <span className="mask mask-roll">
              <span className="rise" style={{ ["--i" as string]: n }}>
                <RollingWord words={hero.rolling} />
              </span>
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
                 
                  className="group inline-flex h-12 items-center gap-3 rounded-full bg-apricot px-6 font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Email me
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="#work"
                 
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
