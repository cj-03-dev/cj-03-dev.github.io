import { about, also, now, site, timeline } from "@/content/site";
import { img } from "@/lib/asset";
import { Reveal } from "./Reveal";
import { TimelineRail } from "./TimelineRail";
import { ParallaxImage } from "./visuals/ParallaxImage";

export function SectionHead({ num, title, aside }: { num: string; title: string; aside?: string }) {
  return (
    <div className="flex items-center justify-between border-t border-line py-4">
      <p className="label">
        <span className="text-paper">{num}</span>
        <span className="mx-2 text-apricot">/</span>
        {title}
      </p>
      {aside && <p className="label hidden sm:block">{aside}</p>}
    </div>
  );
}

export function Also() {
  return (
    <div className="pb-24 sm:pb-32">
      <div className="flex items-center justify-between border-t border-line py-4">
        <p className="label">
          <span className="text-paper">Also</span>
          <span className="mx-2 text-apricot">/</span>
          Smaller projects
        </p>
      </div>
      <ul className="mt-4 grid gap-6 md:grid-cols-2">
        {also.map((a) => (
          <Reveal as="li" key={a.title} className="grid grid-cols-[96px_1fr] gap-5 border border-line p-4 sm:grid-cols-[140px_1fr] sm:p-5">
            <ParallaxImage src={a.image} alt="" className="aspect-square" reveal={false} />
            <div>
              <p className="label">
                {a.org} <span className="mx-1.5 text-apricot">/</span> {a.timeline}
              </p>
              <h3 className="display mt-2 text-2xl text-paper sm:text-3xl">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function About() {
  const [first, ...rest] = about.body.split(". ");
  return (
    <section id="about" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
      <SectionHead num="02" title="About" />
      <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
        {/* Dossier card: small portrait plus key facts */}
        <Reveal className="lg:col-span-4">
          <div className="relative border border-line bg-ink-2/60 p-4 sm:p-5">
            <span className="marks" aria-hidden="true" />
            <div className="flex gap-5 lg:flex-col">
              <figure className="w-24 shrink-0 sm:w-28 lg:w-36">
                <div className="duo relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...img("/images/headshot")}
                    alt="Chirag Joshi"
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{ transform: "scale(1.7)", transformOrigin: "78% 60%" }}
                  />
                </div>
              </figure>
              <dl className="grid flex-1 content-start gap-3.5 text-sm">
                {about.facts.map((f) => (
                  <div key={f.k} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="label text-[10px]">{f.k}</dt>
                    <dd className="mt-1.5">
                      <span className="block leading-snug text-paper">{f.title}</span>
                      {f.lines?.map((l) => (
                        <span key={l} className="mt-0.5 block text-[13px] leading-snug text-muted">
                          {l}
                        </span>
                      ))}
                      {f.badge && <span className="mt-1.5 inline-block font-mono text-[13px] text-apricot">{f.badge}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-8 lg:pl-10">
          <Reveal>
            <p className="display text-[clamp(3rem,7vw,6rem)] text-paper">{first}.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-paper/80 sm:text-xl">{rest.join(". ")}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <blockquote className="mt-10 border-l-2 border-apricot pl-6">
              <p className="display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05] text-paper">
                <em className="italic">{about.close.split(". ")[0]}.</em>
              </p>
              <p className="mt-4 text-paper/70">{about.close.split(". ").slice(1).join(". ")}</p>
            </blockquote>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-12 flex flex-wrap gap-x-1 border-t border-line pt-5 font-mono text-[11px] uppercase leading-loose tracking-[0.12em] text-muted">
              {about.skills.map((s, i) => (
                <span key={s} className="whitespace-nowrap">
                  {i > 0 && <span className="mr-2 text-apricot">·</span>}
                  {s}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
      <SectionHead num="03" title="Experience" aside="Most recent first" />
      <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="display text-[clamp(2.8rem,6vw,5rem)] text-paper">Timeline</h2>
        </Reveal>
        <div className="lg:col-span-8">
          <TimelineRail items={timeline} />
        </div>
      </div>
    </section>
  );
}

export function Now() {
  return (
    <section id="now" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
      <SectionHead num="04" title="Now" aside={now.updated} />
      <div className="mt-8 grid gap-10 lg:mt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="display text-[clamp(2.8rem,6vw,5rem)] text-paper">Now</h2>
        </Reveal>
        <ul className="lg:col-span-8">
          {now.items.map((t, i) => (
            <Reveal as="li" key={t} delay={i * 0.06} className="flex items-baseline gap-6 border-b border-line py-6 first:border-t">
              <span className="font-mono text-xs text-apricot">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-xl leading-snug text-paper sm:text-2xl">{t}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const contactLinks = [
  { label: "LinkedIn", value: "in/cj-ceo-vm", href: site.linkedin, external: true },
  { label: "Phone", value: site.phone, href: site.phoneHref, external: false },
];
