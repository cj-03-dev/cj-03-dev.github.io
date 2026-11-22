import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { asset, SITE_URL } from "@/lib/asset";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { MotionProvider } from "@/components/MotionProvider";
import { RevealObserver } from "@/components/RevealObserver";
import { IntroMark } from "@/components/IntroMark";
import { BLACK_HOLE_SCRIPT } from "@/lib/blackHoleScript";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-jetbrains",
  display: "swap",
});

const general = localFont({
  src: [
    { path: "../fonts/GeneralSans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-general",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    images: [{ url: asset("/og.png"), width: 1200, height: 630, alt: "Chirag Joshi. I run the team." }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [asset("/og.png")],
  },
  icons: {
    icon: [
      { url: asset("/favicon-64.png"), sizes: "64x64", type: "image/png" },
      { url: asset("/favicon-32.png"), sizes: "32x32", type: "image/png" },
    ],
    apple: asset("/apple-touch-icon.png"),
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0D0B",
  colorScheme: "dark",
};

// Runs before paint: skip the intro on repeat visits in the same session.
const introScript = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('cj-theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}try{var s=sessionStorage;if(s.getItem('cj-intro')){document.documentElement.dataset.intro='seen'}else{s.setItem('cj-intro','1')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${jetbrains.variable} ${general.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-apricot focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        {/* Loading screen (pure CSS, about 1.6s, no text): warp-speed stars, a black hole with a
            spinning accretion disk forms, the camera dives in, then the screen splits open. */}
        <div className="intro" aria-hidden="true">
          <div className="intro-panel intro-panel-top" />
          <div className="intro-panel intro-panel-bottom" />
          <IntroMark />
          {/* Ray-traced WebGL black hole; replaces the CSS scene when WebGL works */}
          <canvas id="bh-gl" className="bh-canvas" suppressHydrationWarning />
        </div>
        <script dangerouslySetInnerHTML={{ __html: BLACK_HOLE_SCRIPT }} />
        <MotionProvider>
          <SmoothScroll />
          <RevealObserver />
          <Nav />
          {children}
        </MotionProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
