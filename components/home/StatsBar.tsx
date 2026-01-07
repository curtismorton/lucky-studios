"use client";

import { motion, useInView } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative px-4 py-12 md:py-16 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-background-tertiary bg-background-secondary/80 backdrop-blur-sm p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 font-heading text-3xl md:text-4xl font-bold text-accent-orange">
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
                </div>
                <div className="font-body text-sm md:text-base text-text-secondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
