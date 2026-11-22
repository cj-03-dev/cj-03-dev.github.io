"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ViceLogo } from "./ViceLogo";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Now", href: "/#now" },
];

// Contact lives in the footer, so scroll all the way to the bottom of the page.
function scrollToBottom() {
  const bottom = document.documentElement.scrollHeight;
  if (window.__lenis) window.__lenis.scrollTo(bottom, { duration: 1.4 });
  else window.scrollTo({ top: bottom, behavior: "smooth" });
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const home = pathname === "/";

  return (
    <header
      className={`after-intro fixed inset-x-0 top-0 z-[80] transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-line bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
      style={{ ["--d" as string]: "0.1s" }}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Chirag Joshi, home" className="-ml-1 flex items-center p-1">
          <ViceLogo className="text-[2.3rem]" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={home ? l.href.slice(1) : l.href}
                  className="group px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper"
                >
                  <span className="uline pb-0.5">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              if (home || document.getElementById("contact")) scrollToBottom();
              else router.push("/#contact");
            }}
            className="ml-2 inline-flex h-9 items-center rounded-full bg-apricot px-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
