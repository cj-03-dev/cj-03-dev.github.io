// One-off generator for the static Open Graph image and PNG favicons.
// Run with: npm run og   (writes into /public, commit the results)
import { ImageResponse } from "next/og.js";
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";

const font = (f) => readFile(new URL(`./fonts/${f}`, import.meta.url));
const fonts = [
  { name: "Instrument Serif", data: await font("InstrumentSerif-Regular.ttf"), style: "normal", weight: 400 },
  { name: "Instrument Serif", data: await font("InstrumentSerif-Italic.ttf"), style: "italic", weight: 400 },
  { name: "General Sans", data: await font("GeneralSans-400.ttf"), style: "normal", weight: 400 },
  { name: "JetBrains Mono", data: await font("JetBrainsMono-Medium.ttf"), style: "normal", weight: 500 },
];

const INK = "#0E0D0B";
const PAPER = "#EDE6D8";
const MUTED = "#9A9285";
const APRICOT = "#F2994A";
const LINE = "rgba(237,230,216,0.16)";

// Mark: concentric contour rings (echoes the hero map). No initials.
const rings = (size, bg = null) =>
  h(
    "svg",
    { width: size, height: size, viewBox: "0 0 64 64", fill: "none" },
    bg ? h("rect", { width: 64, height: 64, rx: 14, fill: bg }) : null,
    h("ellipse", { cx: 32, cy: 32, rx: 24, ry: 17, stroke: PAPER, strokeOpacity: 0.35, strokeWidth: 2 }),
    h("ellipse", { cx: 32, cy: 32, rx: 16, ry: 11, stroke: APRICOT, strokeWidth: 3 }),
    h("circle", { cx: 32, cy: 32, r: 4.5, fill: APRICOT })
  );
const mono = { fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 2.5, color: MUTED, textTransform: "uppercase" };

const og = h(
  "div",
  { style: { width: 1200, height: 630, display: "flex", flexDirection: "column", background: INK, padding: "52px 64px", fontFamily: "General Sans", color: PAPER } },
  h(
    "div",
    { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${LINE}`, paddingBottom: 18 } },
    h("div", { style: { ...mono, display: "flex" } }, "Chirag Joshi ", h("span", { style: { color: APRICOT, margin: "0 12px" } }, "/"), " Business Consultant ", h("span", { style: { color: APRICOT, margin: "0 12px" } }, "/"), " India"),
    rings(52)
  ),
  h(
    "div",
    { style: { display: "flex", flex: 1, alignItems: "center", fontFamily: "Instrument Serif", fontSize: 168, lineHeight: 1, letterSpacing: -3 } },
    "I run the ",
    h("span", { style: { fontStyle: "italic", color: APRICOT } }, "team.")
  ),
  h(
    "div",
    { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${LINE}`, paddingTop: 22 } },
    h("div", { style: { ...mono, display: "flex" } }, "Business Consultant · Operations · Growth"),
    h(
      "div",
      { style: { display: "flex", gap: 34, fontFamily: "JetBrains Mono", fontSize: 22, color: APRICOT } },
      h("span", null, "90+ countries"),
      h("span", null, "1,000 km"),
      h("span", null, "NATO-funded")
    )
  )
);

async function render(el, w, hgt, out) {
  const res = new ImageResponse(el, { width: w, height: hgt, fonts });
  await writeFile(new URL(`../public/${out}`, import.meta.url), Buffer.from(await res.arrayBuffer()));
  console.log("wrote", out);
}

await render(og, 1200, 630, "og.png");
const icon = (s) => h("div", { style: { width: s, height: s, display: "flex" } }, rings(s, INK));
await render(icon(32), 32, 32, "favicon-32.png");
await render(icon(64), 64, 64, "favicon-64.png");
await render(icon(180), 180, 180, "apple-touch-icon.png");
