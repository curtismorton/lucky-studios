const PLATFORMS = [
  "Spotify",
  "Apple Podcasts",
  "YouTube",
  "Amazon Music",
  "TikTok",
  "Instagram",
  "Pocket Casts",
];

/**
 * Broadcast ticker — an infinite serif marquee of the platforms shows live on.
 * Pure CSS animation (track is two copies, translated -50%); pauses on hover,
 * stilled for reduced-motion users.
 */
export default function Ticker() {
  const row = [...PLATFORMS, ...PLATFORMS];

  return (
    <section
      className="overflow-hidden border-y border-bone/10 bg-carbon py-6"
      aria-label="Distributed everywhere your audience already listens"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((platform, index) => (
          <span key={index} className="flex items-center whitespace-nowrap" aria-hidden={index >= PLATFORMS.length}>
            <span className="type-serif px-8 text-3xl italic text-bone/85 md:text-4xl">
              {platform}
            </span>
            <span className="text-tally" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
