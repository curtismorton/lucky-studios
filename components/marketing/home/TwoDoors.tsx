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
    <section className="px-6 pb-28 pt-4 md:px-10 md:pb-36 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="tc-label tracking-widest text-bone/55">WHICH PATH IS YOURS?</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {DOORS.map((door, i) => (
            <Reveal key={door.id} delay={i * 0.1}>
              <Link
                href={door.href}
                className="liquid-glass group flex min-h-[46vh] flex-col justify-between rounded-[1.5rem] p-8 transition-transform duration-300 hover:-translate-y-1 md:min-h-[52vh] md:p-12 lg:p-14"
              >
                <div>
                  <span className="tc-label mb-8 block text-bone/45">{door.label}</span>
                  <h2 className="type-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1.1]">
                    {lastWordItalic(door.statement)}
                  </h2>
                  <p className="mt-6 max-w-xs font-barlow text-sm leading-relaxed text-bone/65 transition-colors duration-300 group-hover:text-bone/85">
                    {door.sub}
                  </p>
                </div>

                <div className="mt-12 flex items-center gap-3">
                  <span className="tc-label text-bone/50 transition-colors duration-300 group-hover:text-tally">
                    {door.cta}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-bone/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-tally"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
