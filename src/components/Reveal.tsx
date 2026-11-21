// Server component. Fades/slides children in when scrolled into view.
// The actual trigger is one shared IntersectionObserver (RevealObserver) that adds
// .is-in; the transition itself is pure CSS (see globals.css), so this costs no JS.
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "p" | "span";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Tag = as;
  return (
    <Tag data-reveal="" className={className} style={delay ? ({ ["--rd" as string]: `${delay}s` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
