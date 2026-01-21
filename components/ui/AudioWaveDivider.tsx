"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface AudioWaveDividerProps {
  className?: string;
  variant?: "default" | "subtle" | "bold";
}

export default function AudioWaveDivider({
  className = "",
  variant = "default",
}: AudioWaveDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  
  const variantStyles = {
    default: {
      height: "h-24 md:h-32",
      opacity: "opacity-20",
      barWidth: "w-1 md:w-1.5",
      barColor: "bg-accent-amber",
    },
    subtle: {
      height: "h-16 md:h-20",
      opacity: "opacity-15",
      barWidth: "w-0.5 md:w-1",
      barColor: "bg-accent-amber/80",
    },
    bold: {
      height: "h-32 md:h-40",
      opacity: "opacity-30",
      barWidth: "w-1.5 md:w-2",
      barColor: "bg-accent-amber",
    },
  };

  const styles = variantStyles[variant];

  // Generate bars with unique animation patterns
  const bars = Array.from({ length: 60 }, (_, i) => {
    const baseHeight = 15 + ((i % 11) * 3);
    const peakHeight = 35 + ((i % 13) * 5);
    const duration = 1.2 + ((i % 5) * 0.3);
    const delay = ((i % 8) * 0.1);
    const reverseDelay = ((i % 7) * 0.12);
    
    return {
      id: i,
      baseHeight,
      peakHeight,
      duration,
      delay,
      reverseDelay,
    };
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${styles.height} ${className}`}
    >
      {/* Animated audio spectrum */}
      <motion.div
        style={{ opacity }}
        className={`absolute inset-0 flex items-center justify-center ${styles.opacity}`}
      >
        {/* Decorative wave paths on sides */}
        <svg
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none"
          height="120"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <defs>
            <linearGradient id={`decorativeWave1-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id={`decorativeWave2-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Top decorative wave */}
          <motion.path
            d="M0 60 C 200 40, 400 80, 600 60 C 800 40, 1000 80, 1200 60"
            stroke={`url(#decorativeWave1-${variant})`}
            strokeWidth="1.5"
            fill="none"
            animate={{
              d: [
                "M0 60 C 200 40, 400 80, 600 60 C 800 40, 1000 80, 1200 60",
                "M0 60 C 200 80, 400 40, 600 60 C 800 80, 1000 40, 1200 60",
                "M0 60 C 200 40, 400 80, 600 60 C 800 40, 1000 80, 1200 60",
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Bottom decorative wave */}
          <motion.path
            d="M0 60 C 250 80, 500 40, 750 60 C 1000 80, 1200 40, 1200 60"
            stroke={`url(#decorativeWave2-${variant})`}
            strokeWidth="1.5"
            fill="none"
            animate={{
              d: [
                "M0 60 C 250 80, 500 40, 750 60 C 1000 80, 1200 40, 1200 60",
                "M0 60 C 250 40, 500 80, 750 60 C 1000 40, 1200 80, 1200 60",
                "M0 60 C 250 80, 500 40, 750 60 C 1000 80, 1200 40, 1200 60",
              ],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </svg>

        {/* Center line wave */}
        <svg
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none"
          height="4"
          preserveAspectRatio="none"
          viewBox="0 0 1200 4"
        >
          <defs>
            <linearGradient id={`waveLineGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 2 Q 300 0, 600 2 T 1200 2"
            stroke={`url(#waveLineGradient-${variant})`}
            strokeWidth="2"
            fill="none"
            animate={{
              d: [
                "M0 2 Q 300 0, 600 2 T 1200 2",
                "M0 2 Q 300 4, 600 2 T 1200 2",
                "M0 2 Q 300 0, 600 2 T 1200 2",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Spectrum bars */}
        <div className="relative flex items-center justify-center gap-1 md:gap-1.5 z-10">
          {bars.map((bar) => (
            <motion.div
              key={bar.id}
              className={`${styles.barWidth} ${styles.barColor} rounded-full`}
              initial={{ height: `${bar.baseHeight}%` }}
              animate={{
                height: [
                  `${bar.baseHeight}%`,
                  `${bar.peakHeight}%`,
                  `${bar.baseHeight}%`,
                ],
              }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bar.id % 2 === 0 ? bar.delay : bar.reverseDelay,
              }}
              style={{
                minHeight: "8px",
                maxHeight: "80px",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
