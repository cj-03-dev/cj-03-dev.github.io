"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";

function useIndiaTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useIndiaTime();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = site.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative scroll-mt-16 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between border-t border-line py-4">
          <p className="label">
            <span className="text-paper">05</span>
            <span className="mx-2 text-apricot">/</span>
            Contact
          </p>
        </div>

        <Reveal>
          <h2 className="display mt-10 text-[clamp(3.4rem,14vw,10.5rem)] sm:text-[clamp(3.4rem,10.5vw,10.5rem)] text-paper sm:mt-16">
            Let&apos;s build something that <em className="italic text-apricot">actually</em> ships.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 border-t border-line pt-8 sm:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <p className="label mb-3">Email</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <a
                href={`mailto:${site.email}`}
               
                className="group display break-all text-[clamp(1.55rem,4.6vw,3.6rem)] leading-tight text-paper"
              >
                <span className="uline pb-1 transition-colors duration-300 group-hover:text-apricot">{site.email}</span>
              </a>
              <button
                type="button"
                onClick={copy}
               
                aria-label="Copy email address"
                className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-apricot hover:text-apricot"
              >
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="grid grid-cols-2 gap-6 lg:col-span-4">
            <div>
              <p className="label mb-3">LinkedIn</p>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="group text-lg text-paper">
                <span className="uline">in/cj-ceo-vm</span> <span aria-hidden="true" className="text-apricot">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <div>
              <p className="label mb-3">Phone</p>
              <a href={site.phoneHref} className="group text-lg text-paper">
                <span className="uline whitespace-nowrap">{site.phone}</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line py-6 sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            India <span className="mx-1.5 text-apricot">/</span>
            <span className="tabular-nums text-paper">{time ?? "--:--:--"}</span> IST
          </p>
          <p className="label">© 2026 Chirag Joshi</p>
          <button type="button" onClick={toTop} className="label group text-left transition-colors hover:text-paper sm:text-right">
            Back to top <span aria-hidden="true" className="inline-block text-apricot transition-transform group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {copied && (
          <m.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-paper px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            Copied
          </m.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
