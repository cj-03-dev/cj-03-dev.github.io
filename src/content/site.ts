// All site copy lives here. Edit text in this file; components read from it.
// Rules: no invented numbers, no em dashes, no fluff.

export const site = {
  name: "Chirag Joshi",
  email: "chiragjoshiofficial03@gmail.com",
  phone: "+91 6389227333",
  phoneHref: "tel:+916389227333",
  linkedin: "https://www.linkedin.com/in/cj-ceo-vm/",
  location: "India",
  title: "Chirag Joshi · Operations, Partnerships & Growth",
  description:
    "Operations, partnerships and growth. NATO-funded conferences, a 90+ country community, 1,000 km run for flood relief.",
};

export const hero = {
  label: ["CJ", "Operations & Growth", "India"],
  // The headline ends with a rolling word. The first entry is shown first.
  line: "I run the",
  rolling: ["team.", "project.", "growth.", "GTM.", "funding."],
  subline:
    "Former business consultant and founder. Secured NATO conference funding, built a 90+ country photo community, ran 1,000 km in 100 days for flood relief.",
  status: "Open to ops, growth and Founder's Office roles",
};

export type StatIcon = "globe" | "continents" | "route" | "signal" | "donors" | "doc" | "podium" | "people";

export const stats: { value: number; suffix: string; label: string; icon: StatIcon }[] = [
  { value: 90, suffix: "+", label: "countries, Public Phone", icon: "globe" },
  { value: 7, suffix: "", label: "continents reached", icon: "continents" },
  { value: 1000, suffix: " km", label: "run in 100 days", icon: "route" },
  { value: 10, suffix: "M+", label: "impressions generated for clients", icon: "signal" },
  { value: 3, suffix: "", label: "continents my nonprofit got donations from", icon: "donors" },
  { value: 30, suffix: "+", label: "pieces published", icon: "doc" },
  { value: 4, suffix: "", label: "international youth conferences run end to end", icon: "podium" },
  { value: 7000, suffix: "+", label: "LinkedIn followers", icon: "people" },
];

export const marquee = [
  "NATO",
  "MEA",
  "UNICEF",
  "EU",
  "The Geostrata",
  "IIT Bombay",
  "IIT Delhi",
  "MIT DEDP",
  "MPs",
  "Prime Ministers",
  "Jadavpur University",
  "The Tribune",
  "Milaap",
  "Pzena (via Extern)",
];

export type LinkItem = { label: string; href: string };

export type Visual =
  | "image"
  | "runlog"
  | "globe"
  | "roadmap"
  | "research"
  | "candles";

export type Project = {
  slug: string;
  file: string;
  title: string;
  shortTitle: string;
  role: string;
  timeline: string;
  type: string;
  org: string;
  year: string;
  tag?: string;
  oneLiner: string;
  image: string;
  imageAlt: string;
  visual: Visual;
  brief?: string;
  did?: string[];
  result?: string;
  next?: string[];
  extra?: { heading: string; body: string }[];
  figures: { value: string; label: string }[];
  links: LinkItem[];
};

export const projects: Project[] = [
  {
    slug: "nato-india-youth-conference",
    file: "01",
    title: "NATO-India Youth Conference 2026",
    shortTitle: "NATO-India Youth Conference",
    role: "Lead",
    timeline: "Jan to Mar 2026",
    type: "Programme build",
    org: "The Geostrata",
    year: "2026",
    oneLiner: "Funded, staffed and ran comms for an India-NATO youth conference on security and diplomacy.",
    image: "/images/nato.jpg",
    imageAlt: "A display jet climbing through cloud",
    visual: "image",
    brief: "An India-NATO youth platform on security and diplomacy. It needed money, speakers and a programme.",
    did: [
      "Secured NATO funding, from first approach to close.",
      "Kept the invoice trail for every sponsor and vendor.",
      "Confirmed the speaker and moderator line-up.",
      "Co-drafted the concept note and set the theme.",
      "Ran all external comms.",
    ],
    result: "Ran in March 2026, fully funded.",
    figures: [{ value: "100%", label: "funded" }, { value: "5", label: "workstreams owned" }, { value: "Mar 2026", label: "delivered" }],
    links: [
      { label: "Conference site", href: "https://www.thegeostrata.com/nato-india-youth-conference" },
      { label: "Instagram", href: "https://www.instagram.com/natoindiayouthconference/" },
    ],
  },
  {
    slug: "punjab-floods-relief",
    file: "02",
    title: "1,000 km for Punjab",
    shortTitle: "1,000 km for Punjab",
    role: "Founder, sole operator",
    timeline: "Sep to Dec 2025",
    type: "Campaign",
    org: "Visual Merge Foundation",
    year: "2025",
    oneLiner: "10 km a day for 100 days straight, raising money for the 2025 Punjab floods.",
    image: "/images/punjab-run.jpg",
    imageAlt: "A house on a small island surrounded by floodwater",
    visual: "runlog",
    brief: "Launch initiative for my nonprofit, Visual Merge Foundation.",
    did: [
      "Designed it: 10 km daily for 100 days, logged on Strava.",
      "Ran the Milaap fundraiser for Khalsa Aid.",
      "Documented it on Instagram, LinkedIn, Strava and in the press.",
    ],
    result: "1,000 km done. 1M+ impressions, donors on three continents, featured in The Tribune.",
    figures: [{ value: "1,000 km", label: "run" }, { value: "100", label: "days straight" }, { value: "1M+", label: "impressions" }, { value: "3", label: "continents of donors" }],
    links: [
      { label: "Milaap fundraiser", href: "https://milaap.org/fundraisers/support-khalsa-aid-punjab-floods" },
      { label: "The Tribune", href: "https://www.tribuneindia.com/partner-exclusives/chirag-joshi-leads-a-major-fundraising-campaign-in-india-this-year/" },
      { label: "Strava", href: "https://strava.app.link/SGd8rgso9Vb" },
    ],
  },
  {
    slug: "public-phone",
    file: "03",
    title: "Public Phone",
    shortTitle: "Public Phone",
    role: "Founder",
    timeline: "Jan 2025 to Apr 2026",
    type: "Community",
    org: "Media",
    year: "2025",
    oneLiner: "A global community for serious phone photography and film.",
    image: "/images/phones.jpg",
    imageAlt: "Several smartphones laid out on a table",
    visual: "globe",
    brief: "A place for creators without cameras to be judged on the work, not the gear.",
    did: [
      "Founded it. Ran ops, recruiting, events and outreach.",
      "Featured a new creator every day.",
      "Ran prize competitions with established judges.",
    ],
    result: "90+ countries, all seven continents. Wound down April 2026.",
    figures: [{ value: "90+", label: "countries" }, { value: "7", label: "continents" }, { value: "1/day", label: "creator featured" }],
    links: [
      { label: "Instagram", href: "https://www.instagram.com/publicphone._/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/publicphone/" },
    ],
  },
  {
    slug: "india-eu-youth-conference",
    file: "04",
    title: "India-EU Youth Conference 2026",
    shortTitle: "India-EU Youth Conference",
    role: "Lead",
    timeline: "Jun 2026 onward",
    type: "Programme build",
    org: "The Geostrata",
    year: "2026",
    oneLiner: "End-to-end lead for an India-Europe youth platform on foreign policy, trade and security.",
    image: "/images/eu.jpg",
    imageAlt: "The European Parliament building with the EU flag on its glass facade",
    visual: "image",
    did: [
      "Partnerships and invitations.",
      "Concept note and themes.",
      "Sponsor and vendor invoicing.",
      "Speakers and moderators.",
      "External comms.",
    ],
    figures: [{ value: "5", label: "workstreams led" }, { value: "3", label: "themes: policy, trade, security" }, { value: "2", label: "partners: India and Europe" }],
    links: [
      { label: "Event page", href: "https://luma.com/qslwwcwj" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/ieuyc/" },
    ],
  },
  {
    slug: "stonefruit",
    file: "05",
    title: "Stonefruit",
    shortTitle: "Stonefruit",
    role: "Sole builder",
    timeline: "Sep 2026 onward",
    type: "Product build",
    org: "Health & longevity",
    year: "2026",
    tag: "In progress",
    oneLiner: "A health and longevity companion for quick, healthier daily choices.",
    image: "/images/stonefruit.jpg",
    imageAlt: "The Stonefruit homepage: Health and Longevity Companion",
    visual: "roadmap",
    extra: [
      { heading: "Why", body: "Longevity is where I want to build. Stonefruit is how I learn it." },
      { heading: "Built with", body: "Claude Code." },
    ],
    next: [
      "Now: live site at stonefruitlabs.com",
      "Next: first paying users",
      "Later: deeper personalisation",
    ],
    figures: [{ value: "1", label: "builder" }, { value: "Live", label: "stonefruitlabs.com" }, { value: "3", label: "roadmap stops" }],
    links: [{ label: "stonefruitlabs.com", href: "https://stonefruitlabs.com" }],
  },
  {
    slug: "research",
    file: "06",
    title: "Research & writing",
    shortTitle: "Research & writing",
    role: "Writer, researcher",
    timeline: "2023 onward",
    type: "Research",
    org: "Public policy",
    year: "2023",
    oneLiner: "30+ pieces for The Geostrata, plus a pan-India youth media-literacy survey.",
    image: "/images/research.jpg",
    imageAlt: "Open books stacked on a library table",
    visual: "research",
    figures: [{ value: "30+", label: "published pieces" }, { value: "1", label: "pan-India survey" }, { value: "2023", label: "writing since" }],
    links: [],
  },
  {
    slug: "equity-research",
    file: "07",
    title: "Equity research: TTMI",
    shortTitle: "Equity research: TTMI",
    role: "Extern, mentored by Yinan Zhao (Pzena)",
    timeline: "2026",
    type: "Financial analysis",
    org: "Extern",
    year: "2026",
    oneLiner: "Screened a Russell index, picked TTM Technologies, wrote the memo. Cohort of ~30, mostly US.",
    image: "",
    imageAlt: "",
    visual: "candles",
    extra: [{ heading: "Also built", body: "Covenant, an M&A valuation tool." }],
    figures: [{ value: "~30", label: "extern cohort, mostly US" }, { value: "1", label: "investment memo" }, { value: "1", label: "M&A valuation tool" }],
    links: [],
  },
];

export const writing: { title: string; note?: string; href?: string }[] = [
  {
    title: "Media Literacy Among Indian Youth",
    note: "Pan-India survey and report",
    href: "https://drive.google.com/file/d/1pWwmsd03H0tbcghdGkEhKSnJlYfFIaPb/view",
  },
  {
    title: "Overfunded or Underbuilt? Rethinking India's Capital Allocation Story",
    note: "The Geostrata",
    href: "https://www.thegeostrata.com/post/overfunded-or-underbuilt-rethinking-india-s-capital-allocation-story",
  },
  {
    title: "India's EV Push: Subsidies, Regulatory Shifts, and the Road to Cleaner Air",
    note: "The Geostrata",
    href: "https://www.thegeostrata.com/post/india-s-ev-push",
  },
  {
    title: "Apollo to Artemis: Humans Return to the Moon After Five Decades",
    note: "The Geostrata",
    href: "https://www.thegeostrata.com/post/apollo-to-artemis-humans-return-to-the-moon-after-five-decades",
  },
  { title: "Bangladesh at the Crossroads", note: "The Geostrata" },
  { title: "Quantum Technologies and the Next Arms Race", note: "GEOMAGA 2026, forthcoming" },
];

export const also = [
  {
    title: "Internal Capacity-Building Programme",
    org: "The Geostrata",
    timeline: "May 2026 onward",
    body: "Founded and run it: expert workshops, career guidance, university recruiting.",
    image: "/images/capacity.jpg",
  },
];

export const about = {
  // First sentence becomes the big heading; the rest is the paragraph.
  body: "I'm Chirag. Political Science at Jadavpur University; MIT MicroMasters® in progress. Former business consultant at Universal Hunt. Founded and ran Visual Merge. Now lead grants and engagements at The Geostrata, India's largest youth think tank.",
  // First sentence is the pull quote; the rest is the line under it.
  close: "I like work where someone has to find the money, line up the people and make it happen. Long term: human longevity.",
  // About card. title = main line, lines = smaller lines under it, badge = highlighted figure.
  facts: [
    { k: "Based in", title: "India" },
    { k: "Degree", title: "BA (Hons) Political Science", lines: ["Jadavpur University, 2024"], badge: "8.6 GPA" },
    {
      k: "MicroMasters®",
      title: "Data, Economics and Design of Policy",
      lines: ["Massachusetts Institute of Technology", "Expected 2027"],
    },
    { k: "Diploma", title: "Media Literacy", lines: ["U.S. Department of State, 2023"] },
  ] as { k: string; title: string; lines?: string[]; badge?: string }[],
  skills: [
    "Partnerships",
    "Fundraising",
    "Programme ops",
    "Excel & Power BI",
    "Salesforce",
    "Make automations",
    "Claude Code",
    "Lean Six Sigma (Yellow Belt)",
  ],
};

export type TimelineItem = {
  org: string;
  role: string;
  when?: string;
  detail?: string;
  ladder?: { role: string; when: string }[];
  badge?: string;
};

export const timeline: TimelineItem[] = [
  {
    org: "The Geostrata",
    role: "Head of Grants & Fund Development",
    badge: "Promoted twice within 8 months",
    ladder: [
      { role: "Head of Grants & Fund Development", when: "May 2026 onward" },
      { role: "Engagements Officer", when: "Feb 2026 onward" },
      { role: "Research Intern", when: "Oct 2025 to Feb 2026" },
    ],
  },
  {
    org: "Visual Merge / Visual Merge Foundation / Public Phone",
    role: "Founder",
  },
  {
    org: "Universal Hunt",
    role: "Business Consultant",
    detail: "Business development, workforce restructuring, Power BI reporting.",
  },
  { org: "Extern × Pzena", role: "Equity research extern", when: "2026" },
  {
    org: "Jadavpur University",
    role: "BA (Hons) Political Science",
    when: "2024",
    detail: "Equity & Diversity Officer, Debating Society.",
  },
  {
    org: "MIT MicroMasters®",
    role: "Data, Economics and Design of Policy",
    when: "Expected 2027",
    detail: "Massachusetts Institute of Technology.",
  },
  { org: "U.S. Department of State", role: "Diploma in Media Literacy", when: "2023" },
];

export const now = {
  updated: "Updated Nov 2026",
  items: [
    "Seeking ops, growth or Founder's Office roles.",
    "Building AI workflows and longevity tools.",
    "Studying for the GMAT.",
  ],
};
