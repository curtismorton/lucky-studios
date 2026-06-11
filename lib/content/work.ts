/** /work copy — case studies as first-class pages. */

export const workPage = {
  hero: {
    scene: "THE WORK",
    sceneTitle: "THE RECEIPTS",
    headline: ["Engineered.", "Not lucky."],
    sub: "Two formats, two audiences, one repeatable system. Here's what the pipeline looks like when it leaves the building.",
  },
  cases: [
    {
      slug: "back-post",
      title: "Back Post",
      genre: "FOOTBALL",
      headline: "Football emotion, engineered for live moments.",
      plate: "/images/hero/hero-1980.jpg",
      plateAlt: "Back Post cast in club shirts in front of the memorabilia wall",
      brief:
        "Build a football format that works as full episodes, live watchalongs and short-form clips — without running three separate productions.",
      system: [
        "Supporter-led debate with recurring weekly segments fans can argue about before the episode drops",
        "Live match emotion captured on an 8-camera setup, cut in real time from the control room",
        "Reactive clip packaging built around the loudest 40 seconds of every recording",
        "Platform-specific distribution: full episodes on YouTube and Spotify, cutdowns everywhere else",
      ],
      results: [
        { meter: "PARTNER", value: "WILLIAM HILL", note: "season sponsorship" },
        { meter: "SPOTIFY", value: "#10", note: "football podcast chart" },
        { meter: "TIKTOK", value: "2.78M", note: "views from clip strategy" },
      ],
      why: "Chemistry plus topical speed plus repeatable moments. The format makes the argument every week; the system makes sure it's seen.",
    },
    {
      slug: "abby-boom",
      title: "Don't Get Me Started",
      genre: "ENTERTAINMENT",
      headline: "Strong opinions, engineered for reactive clips.",
      plate: "/images/hero/hero-2171.jpg",
      plateAlt: "Multicam ISO record screen showing four camera angles of a recording",
      brief:
        "Turn one personality's takes into repeatable entertainment that survives beyond a single viral moment.",
      system: [
        "Guest-led chaos with designed conversation spikes — the clips are planned before the record",
        "Segment structure that turns opinions into recurring, titled moments",
        "Social-first editing and thumbnail packaging tuned per platform",
        "Season-level format learning: what spikes gets built into the next run",
      ],
      results: [
        { meter: "SEASON 1", value: "10M+", note: "views across platforms" },
        { meter: "GROWTH", value: "CLIP-LED", note: "three platforms compounding" },
        { meter: "FORMAT", value: "REPEATABLE", note: "spikes by design, not chance" },
      ],
      why: "A clear talent identity and a format built around conversation spikes. When the loud moments are engineered, virality stops being a lottery.",
    },
  ],
  cta: {
    headline: "Your show could be case three.",
    sub: "Bring the audience or the objective. The system's already warm.",
    primaryLabel: "Book a consultation",
    secondaryLabel: "See the network",
    secondaryHref: "/shows",
  },
};
