"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { value: "5", label: "Organic Views", suffix: "M+" },
  { value: "10", label: "Original Shows", suffix: "+" },
  { value: "1.1", label: "Unique Viewers", suffix: "M" },
  { value: "4.8", label: "Spotify Rating", suffix: "★" },
];

const sparkPaths = [
  "M0 20 C 20 10, 40 30, 60 18 C 80 6, 100 26, 120 14",
  "M0 22 C 24 8, 48 34, 72 16 C 96 -2, 120 28, 144 12",
  "M0 18 C 18 4, 36 26, 54 14 C 72 2, 90 30, 108 10",
  "M0 24 C 22 12, 44 32, 66 18 C 88 4, 110 26, 132 14",
];

const accentStyles = [
  {
    stroke: "stroke-accent-orange/70",
    dot: "bg-accent-orange/70",
    text: "text-accent-orange",
  },
  {
    stroke: "stroke-accent-cyan/70",
    dot: "bg-accent-cyan/70",
    text: "text-accent-cyan",
  },
  {
    stroke: "stroke-accent-purple/70",
    dot: "bg-accent-purple/70",
    text: "text-accent-purple",
  },
  {
    stroke: "stroke-accent-green/70",
    dot: "bg-accent-green/70",
    text: "text-accent-green",
  },
];

function AnimatedNumber({
  value,
  suffix,
  prefix,
}: {
  value: string;
  suffix?: string;
  prefix?: string;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const isNumeric = !isNaN(parseFloat(value)) && isFinite(parseFloat(value));

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    const numValue = parseFloat(value);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1); // Ensure we never exceed 1
      
      if (step >= steps) {
        // On final step, use exact target value to avoid floating-point errors
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        // Calculate current value based on progress (avoids accumulation errors)
        const current = numValue * progress;
        
        // Format based on original value
        if (value.includes(".")) {
          setDisplayValue(current.toFixed(1));
        } else {
          setDisplayValue(Math.floor(current).toString());
        }
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isNumeric]);

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scanlineY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const clipTop = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const clipBottom = useTransform(scrollYProgress, [0.8, 1], ["0%", "100%"]);
  const clipPath = useTransform(
    [clipTop, clipBottom],
    ([top, bottom]) => `inset(${top} 0% ${bottom} 0%)`
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-4 py-12 md:py-16"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-tech-grid opacity-15"
        style={{ y: gridY }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-scanlines opacity-10"
        style={{ y: scanlineY }}
      />
      <motion.div style={{ clipPath }} className="relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-background-tertiary bg-background-secondary/80 p-8 backdrop-blur-sm md:p-12"
          >
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {stats.map((stat, index) => {
                const accent = accentStyles[index % accentStyles.length];
                const path = sparkPaths[index % sparkPaths.length];
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="relative mb-2 flex items-center justify-center">
                      <motion.svg
                        viewBox="0 0 140 40"
                        className="absolute -top-4 h-10 w-28 opacity-40"
                      >
                        <motion.path
                          d={path}
                          strokeWidth="2"
                          fill="none"
                          className={accent.stroke}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: isInView ? 1 : 0 }}
                          transition={{ duration: 1.2, delay: index * 0.1 }}
                        />
                      </motion.svg>
                      <span
                        className={`absolute -right-4 top-1 h-2 w-2 rounded-full ${accent.dot} animate-pulse`}
                      />
                      <span className={`font-heading text-3xl font-bold md:text-4xl ${accent.text}`}>
                        {isInView ? (
                          <AnimatedNumber
                            value={stat.value}
                            suffix={stat.suffix}
                            prefix={stat.prefix}
                          />
                        ) : (
                          <span>
                            {stat.prefix}
                            {stat.value}
                            {stat.suffix}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="font-body text-sm text-text-secondary md:text-base">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
