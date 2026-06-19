"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/cinema/Reveal";

const DOORS = [
  {
    id: "talent",
    words: "I'm",
    italic: "talent",
    sub: "Format, studio, growth — built around your audience.",
    href: "/creators",
    bg: "#0a0a0b",
  },
  {
    id: "brand",
    words: "I'm a",
    italic: "brand",
    sub: "Integrated strategy that compounds, not just ad spots.",
    href: "/brands",
    bg: "#131316",
  },
];

export default function TwoDoors() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {DOORS.map((door, i) => (
        <Link
          key={door.id}
          href={door.href}
          onMouseEnter={() => setHovered(door.id)}
          onMouseLeave={() => setHovered(null)}
          className="group relative flex min-h-[65vh] flex-col justify-end overflow-hidden p-10 md:min-h-svh md:p-16 lg:p-24"
          style={{
            background: door.bg,
            borderLeft: i === 1 ? "1px solid rgba(236,233,226,0.06)" : undefined,
            opacity: hovered && hovered !== door.id ? 0.45 : 1,
            transition: "opacity 0.5s ease",
          }}
        >
          {/* Tally glow — appears on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(ellipse 100% 55% at 50% 100%, rgba(255,49,46,0.12) 0%, transparent 65%)",
              opacity: hovered === door.id ? 1 : 0,
            }}
          />

          <div className="relative z-10">
            <Reveal amount={0.5}>
              <h2
                className="type-serif text-bone"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 0.96 }}
              >
                {door.words}{" "}
                <em className="italic text-tally">{door.italic}</em>
                <span className="text-tally">.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.08} amount={0.5}>
              <p className="mt-6 max-w-xs font-barlow text-sm leading-relaxed text-bone/40 transition-colors duration-300 group-hover:text-bone/65">
                {door.sub}
              </p>
            </Reveal>

            <Reveal delay={0.16} amount={0.5}>
              <div className="mt-10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-bone/25 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-tally"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </Reveal>
          </div>
        </Link>
      ))}
    </section>
  );
}
