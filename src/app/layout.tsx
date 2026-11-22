import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Mr_Dafoe } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { asset, SITE_URL } from "@/lib/asset";
import { ViceLogo } from "@/components/ViceLogo";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { MotionProvider } from "@/components/MotionProvider";
import { RevealObserver } from "@/components/RevealObserver";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

// 80s script for the CJ logo. "block" so the loading screen never flashes a fallback font.
const vice = Mr_Dafoe({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vice",
  display: "block",
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
const introScript = `document.documentElement.classList.add('js');try{var s=sessionStorage;if(s.getItem('cj-intro')){document.documentElement.dataset.intro='seen'}else{s.setItem('cj-intro','1')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${jetbrains.variable} ${general.variable} ${vice.variable}`}
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
        {/* Loading screen: 80s Miami sunset, CJ pops up, then the curtain lifts */}
        <div className="intro" aria-hidden="true">
          <div className="intro-stage">
            <span className="vice-sun" />
            <span className="vice-horizon" />
            <ViceLogo className="intro-cj text-[clamp(7rem,30vw,15rem)]" />
            <span className="intro-name">Chirag Joshi</span>
          </div>
        </div>
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
