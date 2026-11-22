"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

// Dark is always the default. A chosen light theme lasts for the browser session.
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    const html = document.documentElement;
    if (next) html.dataset.theme = "light";
    else delete html.dataset.theme;
    try {
      if (next) sessionStorage.setItem("cj-theme", "light");
      else sessionStorage.removeItem("cj-theme");
    } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#F6F3EE" : "#0E0D0B");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={light}
      title={light ? "Dark theme" : "Light theme"}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line text-paper transition-colors duration-300 hover:border-apricot hover:text-apricot"
    >
      <Sun
        size={15}
        aria-hidden="true"
        className={`absolute transition-all duration-500 ${light ? "-translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"}`}
      />
      <Moon
        size={15}
        aria-hidden="true"
        className={`absolute transition-all duration-500 ${light ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 -rotate-90 opacity-0"}`}
      />
    </button>
  );
}
