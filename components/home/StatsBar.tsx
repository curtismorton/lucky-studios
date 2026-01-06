"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  value: number;
  label: string;
  suffix: string;
  decimals?: number;
}

const stats: Stat[] = [
  { value: 5, label: "Organic Views", suffix: "M+", decimals: 0 },
  { value: 10, label: "Original Shows", suffix: "+", decimals: 0 },
  { value: 1.1, label: "Unique Viewers", suffix: "M", decimals: 1 },
  { value: 4.8, label: "Spotify Rating", suffix: "★", decimals: 1 },
];

function StatItem({
  stat,
  index,
  isInView,
}: {
  stat: Stat;
  index: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    const endValue = stat.value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      if (stat.decimals === 0) {
        setCount(Math.floor(currentValue));
      } else {
        setCount(parseFloat(currentValue.toFixed(stat.decimals)));
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isInView, stat.value, stat.decimals]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="mb-2 font-heading text-2xl sm:text-3xl font-bold md:text-4xl lg:text-5xl">
        <span className="text-gradient-accent">
          {stat.decimals === 0
            ? `${count}${stat.suffix}`
            : `${count.toFixed(stat.decimals)}${stat.suffix}`}
        </span>
      </div>
      <div className="font-body text-xs font-medium uppercase tracking-wider text-text-muted">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-4">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

