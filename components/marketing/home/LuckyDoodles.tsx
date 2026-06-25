"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { SVGProps } from "react";

/* Graffiti-style lucky iconography — outline glyphs scattered over the hero. */

const Clover = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" {...p}>
    <circle cx="24" cy="15" r="7.5" />
    <circle cx="33" cy="24" r="7.5" />
    <circle cx="24" cy="33" r="7.5" />
    <circle cx="15" cy="24" r="7.5" />
    <path d="M25 33c1 6 -1 9 -6 12" strokeLinecap="round" />
  </svg>
);

const Horseshoe = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}>
    <path d="M13 9 L13 24 a11 11 0 0 0 22 0 L35 9" />
    <circle cx="13" cy="11" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="35" cy="11" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="11" cy="19" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="37" cy="19" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const Die = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" {...p}>
    <rect x="9" y="9" width="30" height="30" rx="7" />
    <circle cx="17" cy="17" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="31" cy="17" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="17" cy="31" r="2.4" fill="currentColor" stroke="none" />
    <circle cx="31" cy="31" r="2.4" fill="currentColor" stroke="none" />
  </svg>
);

const Percent = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}>
    <circle cx="16" cy="16" r="6.5" />
    <circle cx="32" cy="32" r="6.5" />
    <line x1="35" y1="11" x2="13" y2="37" />
  </svg>
);

type Doodle = {
  Icon: (p: SVGProps<SVGSVGElement>) => React.ReactElement;
  top: string;
  left: string;
  size: number;
  rotate: number;
  rate: number; // parallax travel in px as you scroll down
  dur: number; // drift duration
  delay: number;
  tone: string;
};

const DOODLES: Doodle[] = [
  { Icon: Clover, top: "16%", left: "8%", size: 72, rotate: -14, rate: 140, dur: 7, delay: 0, tone: "text-bone/25" },
  { Icon: Horseshoe, top: "21%", left: "83%", size: 66, rotate: 13, rate: 95, dur: 8, delay: 0.6, tone: "text-tally/35" },
  { Icon: Die, top: "63%", left: "6%", size: 60, rotate: -9, rate: 190, dur: 6.5, delay: 0.3, tone: "text-bone/22" },
  { Icon: Percent, top: "57%", left: "87%", size: 62, rotate: 16, rate: 155, dur: 7.5, delay: 0.9, tone: "text-bone/25" },
  { Icon: Clover, top: "80%", left: "33%", size: 46, rotate: 22, rate: 230, dur: 6, delay: 0.4, tone: "text-tally/30" },
  { Icon: Die, top: "11%", left: "57%", size: 42, rotate: -19, rate: 110, dur: 8.5, delay: 1.1, tone: "text-bone/20" },
];

function Floating({ Icon, top, left, size, rotate, rate, dur, delay, tone }: Doodle) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -rate]);
  return (
    <motion.div style={{ y, top, left }} className={`absolute ${tone}`}>
      <motion.div
        style={{ rotate }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <Icon style={{ width: size, height: size }} />
      </motion.div>
    </motion.div>
  );
}

export default function LuckyDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {DOODLES.map((d, i) => (
        <Floating key={i} {...d} />
      ))}
    </div>
  );
}
