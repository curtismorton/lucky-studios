"use client";

import Link from "next/link";
import Reveal from "@/components/cinema/Reveal";

const DOORS = [
  {
    id: "talent",
    label: "PATH ONE",
    statement: "I'm talent launching a podcast.",
    sub: "Format, studio, growth — built around your audience.",
    href: "/creators",
    cta: "For Creators",
  },
  {
    id: "brand",
    label: "PATH TWO",
    statement: "I'm a brand sponsoring or building podcasts.",
    sub: "Integrated strategy that compounds, not just ad spots.",
    href: "/brands",
    cta: "For Brands",
  },
];

function lastWordItalic(sentence: string) {
  const stripped = sentence.replace(/\.$/, "");
  const words = stripped.split(" ");
  const last = words.pop() ?? "";
  return (
    <>
      {words.join(" ")}{" "}
      <em className="italic text-tally">{last}</em>
      <span className="text-tally">.</span>
    </>
  );
}

export default function TwoDoors() {
  return (
    <section className="border-t border-bone/10 bg-ink">
      <Reveal>
        <div className="mx-auto max-w-7xl px-6 pt-20 md:px-10 lg:px-16">
          <p className="tc-label text-bone/35 tracking-widest">WHICH PATH IS YOURS?</p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2">
        {DOORS.map((door, i) => (
          <Reveal key={door.id} delay={i * 0.1}>
            <Link
              href={door.href}
              className={`group flex min-h-[52vh] flex-col justify-between border-t border-bone/10 p-8 transition-colors duration-300 hover:bg-carbon/50 md:min-h-[56vh] md:border-t-0 md:p-14 lg:p-20 ${i === 1 ? "md:border-l md:border-bone/10" : ""}`}
            >
              <div>
                <span className="tc-label text-bone/25 block mb-8">{door.label}</span>
                <h2 className="type-serif text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.1] transition-colors duration-300">
                  {lastWordItalic(door.statement)}
                </h2>
                <p className="mt-6 max-w-xs font-barlow text-sm leading-relaxed text-bone/45 transition-colors duration-300 group-hover:text-bone/65">
                  {door.sub}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-3">
                <span className="tc-label text-bone/30 transition-colors duration-300 group-hover:text-tally">
                  {door.cta}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-bone/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-tally"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
