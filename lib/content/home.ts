/**
 * Homepage copy — the "Luck, engineered." narrative.
 *
 * Single source of truth for every word on the homepage. Will be modelled
 * into the CMS in the CMS-rebuild phase; until then, edit here.
 */

export const coldOpen = {
  slate: "LUCKY STUDIOS · PODCAST NETWORK · LONDON",
  headline: ["Hit shows", "aren't luck."],
  sub: "Lucky Studios builds creator-led shows for talent, brands and broadcasters — and makes what looks like luck repeatable. Format, studio, packaging, distribution, growth. One pipeline.",
  primaryCta: "Book a consultation",
  secondaryCta: "See the shows",
  plate: "/images/hero/hero-main-our-pic.jpg",
  plateAlt: "The Back Post cast around the desk in the Lucky Studios recording room",
};

export const proofReel = {
  slate: { scene: "SCENE 01", title: "THE NUMBERS" },
  lede: "What looks like luck leaves numbers behind.",
  stats: [
    { meter: "VIEWS", value: "5M+", note: "organic views across studio formats" },
    { meter: "SHOWS", value: "10+", note: "original shows developed and produced" },
    { meter: "REACH", value: "1.1M", note: "unique audience across the network" },
    { meter: "RATING", value: "4.8", note: "average Spotify rating, flagship shows" },
  ],
};

export const thesis = {
  slate: { scene: "SCENE 02", title: "THE THESIS" },
  lines: [
    "Every hit show looks like an accident.",
    "A clip catches. A format lands. A nobody becomes appointment viewing.",
    "It isn't an accident. It's structure, packaging and distribution — executed every single week.",
    "We make our own luck. Then we make yours.",
  ],
};

export const system = {
  slate: { scene: "SCENE 03", title: "THE SYSTEM" },
  headline: "Five stations. One pipeline.",
  sub: "Every recording leaves the building as a complete platform package — not a file in a folder.",
  stations: [
    {
      id: "01",
      name: "Shape",
      copy: "Format, positioning, segments, guest strategy, commercial angle. We decide why anyone comes back before anyone shows up.",
    },
    {
      id: "02",
      name: "Record",
      copy: "Multi-camera studio production — direction, audio, lighting and a guest experience that gets the good stuff on tape.",
    },
    {
      id: "03",
      name: "Package",
      copy: "Titles, thumbnails, clips, hooks and platform-native assets. The moments get found because they're built to be found.",
    },
    {
      id: "04",
      name: "Distribute",
      copy: "YouTube, TikTok, Instagram, Spotify, Apple — plus paid-ready cutdowns. Each platform gets its own cut, not a repost.",
    },
    {
      id: "05",
      name: "Grow",
      copy: "Retention, audience behaviour and clip performance feed the next recording. The system learns or it doesn't deserve the name.",
    },
  ],
};

export const network = {
  slate: { scene: "SCENE 04", title: "THE NETWORK" },
  headline: "Shows people schedule their week around.",
  sub: "Original formats with clear identities, repeatable moments and packaging built for every platform they live on.",
  cta: "Browse the network",
};

export const receipts = {
  slate: { scene: "SCENE 05", title: "THE RECEIPTS" },
  headline: "Two formats. Two audiences. One system.",
  cases: [
    {
      slug: "back-post",
      title: "Back Post",
      genre: "FOOTBALL",
      headline: "Football emotion, engineered for live moments.",
      challenge:
        "Build a football format that works as full episodes, live watchalongs and short-form clips — without three separate productions.",
      system:
        "Supporter-led debate, recurring segments, reactive clips and platform-specific packaging, produced on a weekly rhythm.",
      result: "William Hill partnership · #10 Spotify Football · 2.78M TikTok views",
      plate: "/images/hero/hero-1980.jpg",
      plateAlt: "Back Post cast in club shirts in front of the memorabilia wall",
    },
    {
      slug: "abby-boom",
      title: "Don't Get Me Started",
      genre: "ENTERTAINMENT",
      headline: "Strong opinions, engineered for reactive clips.",
      challenge:
        "Turn one personality's takes into repeatable entertainment that survives beyond a single viral moment.",
      system:
        "Guest-led chaos with designed conversation spikes — segment structure, social-first editing and thumbnail packaging.",
      result: "10M+ views in Season 1 · clip-led growth across three platforms",
      plate: "/images/hero/hero-2171.jpg",
      plateAlt: "Multicam ISO record screen showing four camera angles of a recording",
    },
  ],
};

export const twoDoors = {
  slate: { scene: "SCENE 06", title: "TWO WAYS IN" },
  doors: [
    {
      id: "creators",
      eyebrow: "FOR CREATORS & TALENT",
      headline: "You bring the audience. We build the machine.",
      copy: "Production, format, packaging and growth around your voice — so your moment becomes a show, not a spike.",
      bullets: [
        "Creators ready to move past short-form",
        "Talent with chemistry, opinions or a loyal community",
        "Personalities who need a format brands can buy into",
      ],
      cta: "Build my show",
      href: "/creators",
    },
    {
      id: "brands",
      eyebrow: "FOR BRANDS & AGENCIES",
      headline: "You bring the objective. We build the property.",
      copy: "Recurring entertainment people choose to watch — a content asset with an audience, not a campaign with a deadline.",
      bullets: [
        "Brands that want recurring content, not one-off campaigns",
        "Agencies building creator-led formats for clients",
        "Rights holders and publishers launching original shows",
      ],
      cta: "Create a branded show",
      href: "/brands",
    },
  ],
};

export const theRoom = {
  slate: { scene: "SCENE 07", title: "THE ROOM" },
  headline: "One room in London. Eight cameras. Zero excuses.",
  copy: "Purpose-built for shows, not hire-by-the-hour content. Multi-cam direction, broadcast audio, lighting design and a control room that cuts as you record.",
  cta: "Book the studio",
  href: "/studio",
  plate: "/images/hero/hero-1682-2.jpg",
  plateAlt: "The Lucky Studios set — cameras, desk and memorabilia wall, ready to roll",
};

export const faq = {
  slate: { scene: "SCENE 08", title: "BEFORE YOU ASK" },
  items: [
    {
      q: "Do I need an existing audience?",
      a: "No — but it helps. We build shows around creators, brands, communities or an audience niche worth owning. The format does the heavy lifting either way.",
    },
    {
      q: "Can you handle everything?",
      a: "Yes. Strategy, production, editing, packaging, distribution and growth all run inside one pipeline. You can take the whole thing or the stations you're missing.",
    },
    {
      q: "Do you work with brands?",
      a: "Yes — on shows that feel like entertainment first. If it looks like an advert in disguise, audiences treat it like one. We don't make those.",
    },
    {
      q: "Can you fix an existing show?",
      a: "Often, yes. We rebuild the format, raise the production, repackage the moments and put a real distribution rhythm underneath it.",
    },
    {
      q: "What does it cost?",
      a: "Every show is scoped around ambition and output. The honest answer takes a 30-minute consultation, not a pricing page.",
    },
  ],
};

export const finalCta = {
  slate: "FINAL SCENE",
  headline: ["Make your", "own luck."],
  sub: "Bring the creator, the brand or the half-formed idea. We'll bring the system that turns it into a show people come back for.",
  primaryCta: "Book a consultation",
  secondaryCta: "Send us the idea",
  secondaryHref: "/contact",
};

/** Canonical homepage payload — the shape the CMS stores and the page renders. */
export const homeContent = {
  coldOpen,
  proofReel,
  thesis,
  system,
  network,
  receipts,
  twoDoors,
  theRoom,
  faq,
  finalCta,
};

export type HomeContent = typeof homeContent;
