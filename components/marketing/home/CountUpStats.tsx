"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { HomeContent } from "@/lib/content/home";

/** Split a stat string like "5M+" / "1.1M" / "4.8" into number, decimals, suffix. */
function parseStat(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: value, decimals: 0 };
  const num = parseFloat(match[1]);
  const decimals = (match[1].split(".")[1] ?? "").length;
  return { num, suffix: match[2], decimals };
}

function Counter({ value }: { value: string }) {
  const { num, suffix, decimals } = parseStat(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(num);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setDisplay(num * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [num]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function CountUpStats({ content }: { content: HomeContent["proofReel"] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={content.slate.scene} title={content.slate.title} className="mb-14" />

      <Reveal>
        <p className="type-serif max-w-4xl text-[clamp(2rem,5vw,3.75rem)]">{content.lede}</p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.map((stat, index) => (
          <div key={stat.meter} className="liquid-glass rounded-2xl p-8 md:p-10">
            <Reveal delay={index * 0.08}>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
                <span className="tc-label text-bone/55">{stat.meter}</span>
              </div>
              <p className="type-serif mt-5 text-6xl md:text-7xl">
                <Counter value={stat.value} />
              </p>
              <p className="mt-4 text-sm leading-relaxed text-bone/55">{stat.note}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
