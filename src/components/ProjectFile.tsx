import Link from "next/link";
import type { Project } from "@/content/site";
import { Reveal } from "./Reveal";
import { ParallaxImage } from "./visuals/ParallaxImage";
import { RunLog } from "./visuals/RunLog";
import { GlobePanel } from "./visuals/GlobePanel";
import { Roadmap, StonefruitFrame } from "./visuals/Roadmap";
import { Candles } from "./visuals/Candles";
import { ResearchList } from "./visuals/ResearchList";

export function FileHeader({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <div className={`flex items-center justify-between gap-4 border-t border-line py-4 ${className}`}>
      <p className="label">
        <span className="text-paper">Project {p.file}</span>
        <span className="mx-2 text-apricot">/</span>
        {p.type}
        <span className="mx-2 text-apricot">/</span>
        {p.year}
      </p>
      <div className="flex items-center gap-3">
        {p.tag && (
          <span className="rounded-full bg-apricot px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
            {p.tag}
          </span>
        )}
        <p className="label hidden sm:block">{p.org}</p>
      </div>
    </div>
  );
}

// Key figures: mono numbers on hairline cells.
export function Figures({ items, className = "" }: { items: Project["figures"]; className?: string }) {
  return (
    <ul className={`grid gap-px border border-line bg-line ${items.length > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"} ${className}`}>
      {items.map((f) => (
        <li key={f.label} className="flex flex-col justify-between gap-2 bg-ink px-3 py-3">
          <span className="whitespace-nowrap font-mono text-lg leading-none text-apricot sm:text-xl">{f.value}</span>
          <span className="text-[11px] leading-snug text-muted">{f.label}</span>
        </li>
      ))}
    </ul>
  );
}

function OpenLabel() {
  return (
    <span className="pointer-events-none absolute bottom-0 left-0 z-[3] flex translate-y-[105%] items-center gap-2 bg-apricot px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
      Open project <span aria-hidden="true">→</span>
    </span>
  );
}

function ImageLink({ p, aspect = "aspect-[4/3]" }: { p: Project; aspect?: string }) {
  return (
    <Link href={`/work/${p.slug}/`} className="group block" aria-label={`Open project: ${p.title}`}>
      <ParallaxImage src={p.image} alt={p.imageAlt} className={aspect}>
        <OpenLabel />
      </ParallaxImage>
    </Link>
  );
}

function Visual({ p }: { p: Project }) {
  switch (p.visual) {
    case "runlog":
      return (
        <div className="flex flex-col gap-px bg-line">
          <ImageLink p={p} aspect="aspect-[16/7]" />
          <RunLog />
        </div>
      );
    case "globe":
      return <GlobePanel />;
    case "roadmap":
      return (
        <div className="flex flex-col gap-8">
          <Link href={`/work/${p.slug}/`} className="group relative block">
            <StonefruitFrame />
            <span className="absolute inset-0 overflow-hidden">
              <OpenLabel />
            </span>
          </Link>
          <Roadmap />
        </div>
      );
    case "research":
      return (
        <div className="flex flex-col gap-6">
          <ImageLink p={p} aspect="aspect-[16/7]" />
          <ResearchList limit={4} />
        </div>
      );
    case "candles":
      return (
        <Link href={`/work/${p.slug}/`} className="group relative block overflow-hidden">
          <Candles />
          <OpenLabel />
        </Link>
      );
    default:
      return <ImageLink p={p} />;
  }
}

export function ProjectFile({ p, index }: { p: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article id={p.slug} className="scroll-mt-20 pb-20 sm:pb-28 lg:pb-36">
      <FileHeader p={p} />
      <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-12">
        <div className={`flex flex-col lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
          <Reveal>
            <h3 className="display text-[clamp(2.6rem,6.4vw,5.6rem)] text-paper">
              <Link href={`/work/${p.slug}/`} className="transition-colors duration-300 hover:text-apricot">
                {p.title}
              </Link>
            </h3>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-paper/75">{p.oneLiner}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
              <div>
                <dt className="label">Role</dt>
                <dd className="mt-1.5 text-sm text-paper">{p.role}</dd>
              </div>
              <div>
                <dt className="label">Timeline</dt>
                <dd className="mt-1.5 text-sm text-paper">{p.timeline}</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.17}>
            <Figures items={p.figures} className="mt-6" />
          </Reveal>
          <Reveal delay={0.2} className="mt-8 lg:mt-auto lg:pt-10">
            <Link
              href={`/work/${p.slug}/`}
             
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-apricot"
            >
              <span className="uline pb-1">Open project</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>
        <div className={`relative lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : ""}`}>
          <span className="marks" aria-hidden="true" />
          <Visual p={p} />
        </div>
      </div>
    </article>
  );
}
