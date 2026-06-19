import Reveal from "@/components/cinema/Reveal";

const PILLARS = [
  {
    num: "01",
    label: "THE SHOW",
    headline: ["IP creation, strategy, management,", "production"],
    body: "From first format concept to finished episode. We build shows with longevity — creative development, studio production and talent management under one roof.",
  },
  {
    num: "02",
    label: "THE BRAND",
    headline: ["Commercialisation and long-term", "delivery"],
    body: "Integrated partnerships built into the format from day one. Not ad breaks — commercial moments that audiences don't skip and brands actually remember.",
  },
  {
    num: "03",
    label: "GET LUCKY",
    headline: ["The system that makes", "luck"],
    body: "Distribution, clip strategy, audience data and a growth playbook applied to every show. What looks like luck is a process. We run the process.",
  },
];

export default function HowWeGetLucky() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="tc-label mb-12 tracking-widest text-bone/55">HOW WE GET LUCKY</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.num} delay={i * 0.1}>
              <div className="liquid-glass flex h-full flex-col gap-8 rounded-[1.25rem] p-7 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="tc-label text-tally">{pillar.num}</span>
                  <span className="tc-label text-bone/40">{pillar.label}</span>
                </div>

                <h3 className="type-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.1]">
                  {pillar.headline[0]}{" "}
                  <em className="italic text-tally">{pillar.headline[1]}</em>
                  <span className="text-tally">.</span>
                </h3>

                <p className="mt-auto font-barlow text-sm leading-relaxed text-bone/70 md:text-base">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
