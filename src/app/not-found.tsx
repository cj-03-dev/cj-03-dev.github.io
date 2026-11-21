import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
      <p className="label">Error 404 <span className="mx-2 text-apricot">/</span> File missing</p>
      <h1 className="display mt-6 text-[clamp(3rem,10vw,8rem)] text-paper">
        This file was never <em className="italic text-apricot">filed</em>.
      </h1>
      <Link href="/" className="group mt-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-apricot">
        <span aria-hidden="true">←</span> <span className="uline pb-1">Back to the index</span>
      </Link>
    </main>
  );
}
