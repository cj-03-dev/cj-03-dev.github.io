// Renders text with any ® set as a small superscript mark (like an exponent).
export function Reg({ text }: { text: string }) {
  if (!text.includes("®")) return <>{text}</>;
  const parts = text.split("®");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && (
            <sup className="relative -top-[0.1em] ml-[0.08em] align-super text-[0.55em] leading-none tracking-normal opacity-80">®</sup>
          )}
        </span>
      ))}
    </>
  );
}
