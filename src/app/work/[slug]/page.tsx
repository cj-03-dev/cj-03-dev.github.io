import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, type Project } from "@/content/site";
import { asset } from "@/lib/asset";
import { Reveal } from "@/components/Reveal";
import { Contact } from "@/components/Contact";
import { FileHeader, Figures } from "@/components/ProjectFile";
import { ParallaxImage } from "@/components/visuals/ParallaxImage";
import { RunLog } from "@/components/visuals/RunLog";
import { GlobePanel } from "@/components/visuals/GlobePanel";
import { Roadmap, StonefruitFrame } from "@/components/visuals/Roadmap";
import { Candles } from "@/components/visuals/Candles";
import { ResearchList } from "@/components/visuals/ResearchList";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title} · Chirag Joshi`;
  return {
    title,
    description: p.oneLiner,
    openGraph: { title, description: p.oneLiner, images: [{ url: asset("/og.png"), width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description: p.oneLiner, images: [asset("/og.png")] },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 sm:py-14 lg:grid-cols-12 lg:gap-12">
      <Reveal className="lg:col-span-3">
        <h2 className="label text-paper">{label}</h2>
      </Reveal>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

function Feature({ p }: { p: Project }) {
  switch (p.visual) {
    case "runlog":
      return <RunLog />;
    case "globe":
      return <GlobePanel />;
    case "roadmap":
      return <StonefruitFrame />;
    case "research":
      return <ResearchList />;
    case "candles":
      return <Candles />;
    default:
      return null;
  }
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <main id="main">
        {/* Full-bleed hero */}
        <header className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden pt-16 sm:min-h-[86svh]">
          {p.image ? (
            <ParallaxImage src={p.image} alt={p.imageAlt} priority reveal={false} className="!absolute inset-0 -z-10" />
          ) : (
            <div className="absolute inset-0 -z-10 opacity-60" aria-hidden="true">
              <Candles count={64} cover className="h-full w-full !bg-transparent [&>div:first-child]:hidden" />
            </div>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/10" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/80 to-transparent" aria-hidden="true" />
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12">
            <Link href="/#work" className="group label mb-8 inline-flex items-center gap-2 transition-colors hover:text-paper">
              <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span> All files
            </Link>
            <h1 className="display max-w-[14ch] text-[clamp(3.2rem,10vw,9rem)] text-paper">
              <span className="mask">
                <span className="rise">{p.title}</span>
              </span>
            </h1>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <FileHeader p={p} />

          {/* Metadata row */}
          <dl className={`grid grid-cols-2 gap-px border-y border-line bg-line ${p.links.length ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {[
              { k: "Role", v: p.role },
              { k: "Timeline", v: p.timeline },
              { k: "Type", v: `${p.type} · ${p.org}` },
            ].map((m) => (
              <div key={m.k} className="bg-ink py-5 pr-4 md:px-5 md:first:pl-0">
                <dt className="label">{m.k}</dt>
                <dd className="mt-2 text-sm leading-snug text-paper">{m.v}</dd>
              </div>
            ))}
            {p.links.length > 0 && (
              <div className="col-span-2 bg-ink py-5 md:col-span-1 md:px-5">
                <dt className="label">Links</dt>
                <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="group text-paper">
                      <span className="uline">{l.label}</span> <span aria-hidden="true" className="text-apricot">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          <Reveal>
            <p className="display max-w-[24ch] pb-10 pt-14 text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.05] text-paper sm:pb-14 sm:pt-20">{p.oneLiner}</p>
          </Reveal>
          <Reveal className="pb-14 sm:pb-20">
            <Figures items={p.figures} className="max-w-3xl" />
          </Reveal>

          {p.brief && (
            <Block label="The brief">
              <Reveal>
                <p className="max-w-[60ch] text-lg leading-relaxed text-paper/85 sm:text-xl">{p.brief}</p>
              </Reveal>
            </Block>
          )}

          {p.visual !== "image" && (
            <Reveal className="pb-14">
              <Feature p={p} />
            </Reveal>
          )}

          {p.did && (
            <Block label="What I did">
              <ol>
                {p.did.map((d, i) => (
                  <Reveal as="li" key={d} delay={i * 0.04} className="flex gap-5 border-b border-line py-5 first:pt-0 sm:gap-8">
                    <span className="pt-1 font-mono text-xs text-apricot">{String(i + 1).padStart(2, "0")}</span>
                    <span className="max-w-[60ch] text-lg leading-relaxed text-paper/85">{d}</span>
                  </Reveal>
                ))}
              </ol>
            </Block>
          )}

          {p.extra?.map((e) => (
            <Block key={e.heading} label={e.heading}>
              <Reveal>
                <p className="max-w-[60ch] text-lg leading-relaxed text-paper/85 sm:text-xl">{e.body}</p>
              </Reveal>
            </Block>
          ))}

          {p.result && (
            <Block label="Result">
              <Reveal>
                <p className="display max-w-[22ch] text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-apricot">{p.result}</p>
              </Reveal>
            </Block>
          )}

          {p.next && (
            <Block label="What's next">
              <Roadmap />
            </Block>
          )}

          {/* Next file */}
          <Link href={`/work/${next.slug}/`} className="group mt-10 block border-t border-line py-14 sm:py-20">
            <p className="label">
              Next file <span className="mx-1.5 text-apricot">/</span> {next.file}
            </p>
            <div className="mt-6 flex items-end justify-between gap-6">
              <p className="display text-[clamp(2.8rem,8vw,7.5rem)] text-paper transition-colors duration-500 group-hover:text-apricot">
                {next.shortTitle}
              </p>
              <span aria-hidden="true" className="display pb-2 text-[clamp(2.4rem,6vw,5rem)] text-apricot transition-transform duration-500 group-hover:translate-x-3">
                →
              </span>
            </div>
          </Link>
        </div>
      </main>
      <Contact />
    </>
  );
}
