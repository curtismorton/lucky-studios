import Reveal from "@/components/cinema/Reveal";

const PILLARS = [
  {
    num: "01",
    label: "THE SHOW",
    words: "IP creation, strategy, management,",
    italic: "production",
    body: "From first format concept to finished episode. We build shows with longevity — creative development, studio production and talent management under one roof.",
    flip: false,
    bg: "#0a0a0b",
    glow: "radial-gradient(ellipse 70% 60% at 22% 50%, rgba(236,233,226,0.03) 0%, transparent 70%)",
  },
  {
    num: "02",
    label: "THE BRAND",
    words: "Commercialisation and long-term",
    italic: "delivery",
    body: "Integrated partnerships built into the format from day one. Not ad breaks — commercial moments that audiences don't skip and brands actually remember.",
    flip: true,
    bg: "#131316",
    glow: "radial-gradient(ellipse 70% 60% at 78% 50%, rgba(236,233,226,0.025) 0%, transparent 70%)",
  },
  {
    num: "03",
    label: "GET LUCKY",
    words: "The system that makes",
    italic: "luck",
    body: "Distribution, clip strategy, audience data and a growth playbook applied to every show. What looks like luck is a process. We run the process.",
    flip: false,
    bg: "#0a0a0b",
    glow: "radial-gradient(ellipse 70% 60% at 22% 60%, rgba(255,49,46,0.07) 0%, transparent 70%)",
  },
];

export default function HowWeGetLucky() {
  return (
    <>
      {PILLARS.map((p) => {
        const numCol = (
          <div className="relative hidden min-h-svh items-center justify-center md:flex">
            {/* Giant typographic number — visual anchor */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex select-none items-center justify-center type-serif leading-none text-bone"
              style={{ fontSize: "clamp(12rem, 28vw, 24rem)", opacity: 0.04 }}
            >
              {p.num}
            </span>
            <div className="relative z-10 text-center">
              <p className="tc-label text-tally">{p.num}</p>
              <p className="tc-label mt-2 text-bone/25">{p.label}</p>
            </div>
          </div>
        );

        const contentCol = (
          <Reveal
            className="flex min-h-svh flex-col justify-center px-8 py-20 md:py-0 md:px-12 lg:px-20 xl:px-28"
            amount={0.2}
          >
            <div className="mb-8 h-px w-10 bg-tally" />
            <h3
              className="type-serif text-bone"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.8rem)", lineHeight: 1.08 }}
            >
              {p.words}{" "}
              <em className="italic text-tally">{p.italic}</em>
              <span className="text-tally">.</span>
            </h3>
            <p className="mt-8 max-w-sm font-barlow text-base leading-relaxed text-bone/45">
              {p.body}
            </p>
          </Reveal>
        );

        return (
          <section
            key={p.num}
            className="relative overflow-hidden"
            style={{ background: `${p.glow}, ${p.bg}` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {p.flip ? contentCol : numCol}
              {p.flip ? numCol : contentCol}
            </div>
          </section>
        );
      })}
    </>
  );
}
