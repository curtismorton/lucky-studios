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
  system,
  network,
  finalCta,
};

export type HomeContent = typeof homeContent;
