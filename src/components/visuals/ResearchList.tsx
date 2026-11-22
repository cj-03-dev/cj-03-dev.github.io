import { writing } from "@/content/site";

export function ResearchList({ limit, className = "" }: { limit?: number; className?: string }) {
  const items = limit ? writing.slice(0, limit) : writing;
  return (
    <ul className={`border-t border-line ${className}`}>
      {items.map((w, i) => {
        const inner = (
          <>
            <span className="font-mono text-[11px] tracking-[0.1em] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className="display block text-[1.45rem] leading-[1.1] text-paper sm:text-[1.75rem]">
                <span className="uline">{w.title}</span>
              </span>
              {w.note && <span className="label mt-2 block">{w.note}</span>}
            </span>
            <span
              aria-hidden="true"
              className={`mt-1 font-mono text-lg transition-transform duration-500 ${
                w.href ? "text-apricot group-hover:translate-x-1 group-hover:-translate-y-1" : "text-transparent"
              }`}
            >
              ↗
            </span>
          </>
        );
        return (
          <li key={w.title} className="border-b border-line">
            {w.href ? (
              <a href={w.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 py-5 sm:gap-6">
                {inner}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <div className="flex items-start gap-4 py-5 sm:gap-6">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
