import { Hero } from "@/components/Hero";
import { Stats, Marquee } from "@/components/Stats";
import { ProjectFile } from "@/components/ProjectFile";
import { About, Also, Experience, Now, SectionHead } from "@/components/Sections";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/content/site";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Stats />
        <div className="mt-20 sm:mt-28">
          <Marquee />
        </div>

        <section id="work" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 pt-24 sm:px-8 sm:pt-32 lg:px-12">
          <SectionHead num="01" title="Selected files" aside={`${String(projects.length).padStart(2, "0")} files`} />
          <div className="mb-16 mt-8 grid gap-6 sm:mb-24 lg:mt-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <h2 className="display text-[clamp(3rem,8vw,7.5rem)] text-paper">
                Filed from the <em className="italic text-apricot">field</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-4 lg:self-end">
              <p className="max-w-[36ch] text-paper/70">
                Conferences funded, a campaign run, a community built, a product in progress. Each file opens to the brief, what I did and the result.
              </p>
            </Reveal>
          </div>
          {projects.map((p, i) => (
            <ProjectFile key={p.slug} p={p} index={i} />
          ))}
          <Also />
        </section>

        <About />
        <Experience />
        <Now />
      </main>
      <Contact />
    </>
  );
}
