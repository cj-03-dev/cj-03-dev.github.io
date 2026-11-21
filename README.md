# Chirag Joshi · Portfolio

Personal site. Next.js (static export) + Tailwind CSS v4, deployed to GitHub Pages.

## Edit the words

Almost all copy lives in one file: `src/content/site.ts`.
Change text there, commit, push to `main`, and the site redeploys in about two minutes.

- Hero, stats, marquee names, projects, writing list, About, timeline, Now: all in `site.ts`.
- Images: `public/images/` (each image has a `name.webp` and a smaller `name-800.webp`).
- Social preview image: `public/og.png` (regenerate with `npm run og`).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Static files land in `out/`. Pushing to `main` builds and deploys automatically via `.github/workflows/deploy.yml`.
