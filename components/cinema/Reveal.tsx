"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  }),
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Viewport amount required before triggering (0–1). */
  amount?: number;
};

/** Scroll-triggered rise. Once per element, respects reduced motion globally. */
export default function Reveal({
  children,
  delay = 0,
  className,
  amount = 0.3,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
