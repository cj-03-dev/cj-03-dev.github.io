// Prefix public-folder paths with the deploy base path (empty for <user>.github.io).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => (p ? `${BASE_PATH}${p}` : p);
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.github.io";

// Images live in /public/images as <name>.webp (1600w) and <name>-800.webp (800w).
// Pass "/images/<name>" (any extension is ignored).
const NO_SMALL = new Set(["headshot", "avatar", "phones-art"]);
export function img(path: string) {
  const base = path.replace(/\.(jpe?g|png|webp)$/i, "");
  const name = base.split("/").pop() || "";
  const src = asset(`${base}.webp`);
  if (NO_SMALL.has(name)) return { src };
  return { src, srcSet: `${asset(`${base}-800.webp`)} 800w, ${src} 1600w` };
}
