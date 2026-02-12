"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface HeroSignalHorizonProps {
  className?: string;
}

type Bar = {
  id: number;
  baseHeight: number;
  peakHeight: number;
  duration: number;
  delay: number;
};

export default function HeroSignalHorizon({
  className = "",
}: HeroSignalHorizonProps) {
  const shouldReduceMotion = useReducedMotion();

  const bars = useMemo<Bar[]>(() => {
    const barCount = 120;
    return Array.from({ length: barCount }, (_, index) => {
      const ratio = index / (barCount - 1);
      const arc = Math.sin(ratio * Math.PI);
      const offset = (index % 9) * 0.03;
      const baseHeight = 9 + arc * 22 + offset * 100;
      const peakHeight = 22 + arc * 50 + (index % 7) * 3;

      return {
        id: index,
        baseHeight: Math.round(baseHeight),
        peakHeight: Math.round(peakHeight),
        duration: 1.15 + (index % 6) * 0.18,
        delay: (index % 12) * 0.06,
      };
    });
  }, []);

  const waveformPaths = useMemo(
    () => [
      "M0 62 C 120 48, 240 74, 360 62 C 480 48, 600 74, 720 62 C 840 48, 960 74, 1080 62 C 1140 58, 1200 66, 1200 66",
      "M0 62 C 120 38, 240 86, 360 62 C 480 44, 600 80, 720 62 C 840 38, 960 86, 1080 62 C 1140 52, 1200 70, 1200 70",
      "M0 62 C 120 54, 240 70, 360 62 C 480 58, 600 66, 720 62 C 840 54, 960 70, 1080 62 C 1140 60, 1200 64, 1200 64",
      "M0 62 C 120 42, 240 82, 360 62 C 480 48, 600 76, 720 62 C 840 42, 960 82, 1080 62 C 1140 54, 1200 68, 1200 68",
    ],
    []
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 ${className}`}
    >
      <div className="relative h-44 md:h-56">
        <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/34 to-transparent" />

        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="absolute inset-x-0 bottom-4 mx-auto grid w-full max-w-7xl items-end gap-[2px] px-4 opacity-35 md:bottom-6 md:gap-[3px] md:px-8"
            style={{
              gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
            }}
          >
            {bars.map((bar) => (
              <motion.div
                key={bar.id}
                className="w-full rounded-t-full bg-gradient-to-t from-accent-copper/60 via-accent-gold/70 to-accent-amber/82 shadow-[0_0_14px_rgba(245,158,11,0.25)]"
                style={{ height: `${bar.baseHeight}%` }}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        height: [
                          `${bar.baseHeight}%`,
                          `${bar.peakHeight}%`,
                          `${Math.max(6, Math.round(bar.baseHeight * 0.75))}%`,
                          `${Math.max(10, Math.round(bar.peakHeight * 0.88))}%`,
                          `${bar.baseHeight}%`,
                        ],
                        opacity: [0.55, 0.92, 0.72, 0.9, 0.55],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: bar.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bar.delay,
                      }
                }
              />
            ))}
          </div>

          <svg
            className="absolute inset-x-0 bottom-10 mx-auto h-28 w-full max-w-7xl px-4 opacity-60 md:bottom-12 md:h-32 md:px-8"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="heroWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                <stop offset="15%" stopColor="#F59E0B" stopOpacity="0.58" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.92" />
                <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.58" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
              <filter id="heroWaveGlow">
                <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={waveformPaths[0]}
              stroke="url(#heroWaveGradient)"
              strokeWidth="3"
              fill="none"
              filter="url(#heroWaveGlow)"
              animate={shouldReduceMotion ? undefined : { d: waveformPaths }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

