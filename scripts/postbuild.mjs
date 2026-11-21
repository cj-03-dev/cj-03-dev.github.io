// Post-build fixes for static hosting on GitHub Pages.
// 1. Next 16 writes RSC segment files as nested folders (__next.work/$d$slug/__PAGE__.txt)
//    but the client requests dot-joined names (__next.work.$d$slug.__PAGE__.txt).
//    Copy each nested file to its flat name so client-side navigation prefetches resolve.
// 2. Add .nojekyll so Pages serves the _next folder untouched.
import { readdir, copyFile, writeFile, stat } from "node:fs/promises";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));
let copied = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("__next.")) await flatten(full);
      else await walk(full);
    }
  }
}

async function flatten(segDir) {
  const parent = dirname(segDir);
  async function inner(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await inner(full);
      else {
        const rel = relative(parent, full).split(sep).join(".");
        const target = join(parent, rel);
        try {
          await stat(target);
        } catch {
          await copyFile(full, target);
          copied++;
        }
      }
    }
  }
  await inner(segDir);
}

await walk(OUT);
await writeFile(join(OUT, ".nojekyll"), "");
console.log(`postbuild: flattened ${copied} segment file(s), wrote .nojekyll`);
