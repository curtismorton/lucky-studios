import FadingVideo from "@/components/cinema/FadingVideo";
import Reveal from "@/components/cinema/Reveal";

const VIDEO_URL = "https://assets.mixkit.co/videos/44047/44047-1080.mp4";

const CARDS = [
  {
    title: "Studio Sessions",
    tags: ["4K Multi-Cam", "SM7B Audio", "Broadcast Lighting"],
    body: "Three-camera 4K capture with broadcast-grade audio and lighting. Walk in with an idea, walk out with an episode.",
    icon: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2Z",
  },
  {
    title: "Edit & Clips",
    tags: ["Full Episode Edit", "Shorts & Clips", "Captions"],
    body: "Every session cut into full episodes and platform-native clips — captioned, formatted and ready to post the same week.",
    icon: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
  },
  {
    title: "Distribution & Growth",
    tags: ["Every Platform", "Clip Strategy", "Audience Data"],
    body: "Strategy, publishing and growth across Spotify, YouTube and social. We read the data so your show compounds.",
    icon: "M7 18h2V6H7v12Zm4 4h2V2h-2v20Zm-8-8h2v-4H3v4Zm12 4h2V6h-2v12Zm4-8v4h2v-4h-2Z",
  },
];

export default function ProductionCards() {
  return (
    <section className="relative min-h-svh overflow-hidden bg-black">
      <FadingVideo
        src={VIDEO_URL}
        className="absolute inset-0 z-0 h-full w-full object-cover film-grade-deep"
      />
      <div className="scrim-b absolute inset-0 z-[1]" />
      <div className="vignette absolute inset-0 z-[1]" />

      <div className="relative z-10 flex min-h-svh flex-col px-6 pb-14 pt-28 md:px-10 md:pt-32 lg:px-16">
        {/* Section header */}
        <div className="mb-auto">
          <Reveal>
            <p className="mb-5 font-barlow text-sm text-bone/55">// The Lucky System</p>
            <h2 className="type-serif text-[clamp(3rem,8vw,6.5rem)] leading-none">
              Production <em className="italic text-tally">evolved</em>.
            </h2>
          </Reveal>
        </div>

        {/* Glass service cards */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CARDS.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <div className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6">
                {/* Icon + tags */}
                <div className="flex items-start justify-between gap-4">
                  <div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-bone">
                      <path d={card.icon} />
                    </svg>
                  </div>
                  <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-barlow text-[11px] text-bone/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1" />

                {/* Card body */}
                <div className="mt-6">
                  <h3 className="type-serif text-3xl italic leading-none md:text-4xl">{card.title}</h3>
                  <p className="mt-3 max-w-[32ch] font-barlow text-sm font-light leading-snug text-bone/85">
                    {card.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
