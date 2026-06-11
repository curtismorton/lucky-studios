/** /studio copy — the room. Edit here until the CMS re-model. */

export const studioPage = {
  hero: {
    scene: "THE STUDIO",
    sceneTitle: "THE ROOM",
    headline: ["Built for shows.", "Not hire-by-the-hour."],
    sub: "A purpose-built recording room in London with a live control room next to it. You leave with an episode and its clips in motion — not a folder of raw files.",
  },
  specs: [
    { meter: "CAMERAS", value: "8", note: "multi-cam with live direction" },
    { meter: "AUDIO", value: "BROADCAST", note: "tracked per voice, mixed live" },
    { meter: "VISION", value: "LIVE CUT", note: "ATEM control room, ISO records" },
    { meter: "LOCATION", value: "LONDON", note: "central, ground-floor load-in" },
  ],
  gallery: [
    {
      plate: "/images/hero/hero-1682-2.jpg",
      alt: "The Lucky Studios set — cameras, desk and memorabilia wall",
      label: "STUDIO FLOOR",
    },
    {
      plate: "/images/hero/hero-main-our-pic.jpg",
      alt: "A full cast recording around the Lucky Studios desk",
      label: "ON SET",
    },
    {
      plate: "/images/hero/hero-2171.jpg",
      alt: "Multicam ISO record screen during a session",
      label: "CONTROL ROOM",
    },
  ],
  day: {
    headline: "A session, start to finish.",
    steps: [
      {
        id: "01",
        name: "Pre-light & soundcheck",
        copy: "The room is set to your format before you arrive. Walk in, sit down, record.",
      },
      {
        id: "02",
        name: "Directed recording",
        copy: "Multi-cam direction and a live vision mix while you talk. The edit starts in the room.",
      },
      {
        id: "03",
        name: "Same-day assets",
        copy: "ISO records, the live cut and marked moments leave with us into the packaging pipeline.",
      },
    ],
  },
  cta: {
    headline: "Book the room. Or the whole pipeline.",
    sub: "Studio-only sessions are available — but the room works hardest when packaging and distribution are attached.",
    primaryLabel: "Book the studio",
    secondaryLabel: "Ask a question",
    secondaryHref: "/contact",
  },
};
