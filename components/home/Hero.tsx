"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Phone } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { buttonHover, buttonTap } from "@/lib/animations";
import Logo from "@/components/ui/Logo";
import BTSBackground from "@/components/home/BTSBackground";
import FeaturedShowCard from "@/components/home/FeaturedShowCard";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const waveY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.7, 0.35, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-32 px-4 md:px-8"
    >
      {/* Animated BTS Background */}
      <BTSBackground />
      
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent-amber/20 blur-3xl"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-accent-amber/15 blur-3xl"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        
        {/* Sound wave patterns in background - Full width podcast visualizer */}
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y: waveY, opacity: waveOpacity }}>
          <motion.svg
            viewBox="0 0 2000 400"
            className="absolute inset-0 w-full h-full opacity-20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="soundWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#B87333" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="soundWaveGradientSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#B87333" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="soundWaveGradientTertiary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#B87333" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            
            {/* Primary wave path - flowing left to right */}
            <motion.path
              d="M0 200 C 200 120, 400 280, 600 200 C 800 120, 1000 280, 1200 200 C 1400 120, 1600 280, 1800 200 C 1900 160, 2000 220, 2000 220"
              stroke="url(#soundWaveGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="12 16"
              animate={{ strokeDashoffset: [0, -112] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Secondary wave path - counterflow for depth */}
            <motion.path
              d="M0 240 C 250 180, 500 300, 750 220 C 1000 140, 1250 300, 1500 220 C 1750 140, 2000 280, 2000 280"
              stroke="url(#soundWaveGradientSecondary)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 14"
              animate={{ strokeDashoffset: [0, -96] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 0.5 }}
              opacity="0.8"
            />
            
            {/* Tertiary wave path - subtle background layer */}
            <motion.path
              d="M0 160 C 150 100, 300 220, 450 140 C 600 60, 750 220, 900 140 C 1050 60, 1200 220, 1350 140 C 1500 60, 1650 220, 1800 140 C 1900 100, 2000 160, 2000 160"
              stroke="url(#soundWaveGradientTertiary)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="6 12"
              animate={{ strokeDashoffset: [0, -84] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
              opacity="0.6"
            />
          </motion.svg>
          
          {/* Audio waveform bars - podcast visualizer style */}
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-2 md:gap-3 opacity-15">
            {Array.from({ length: 40 }, (_, i) => {
              const baseHeight = 10 + (i % 5) * 5;
              const peakHeight = 30 + (i % 7) * 8;
              const duration = 1.5 + ((i % 3) * 0.5);
              const delay = (i % 10) * 0.1;
              
              return (
                <motion.div
                  key={i}
                  className="w-1.5 md:w-2 bg-accent-amber rounded-t-full"
                  animate={{
                    height: [
                      `${baseHeight}%`,
                      `${peakHeight}%`,
                      `${baseHeight}%`,
                    ],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            {/* Logo - centered above text with space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8 flex justify-center md:justify-start"
            >
              <Logo size="lg" showLink={false} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="mb-6 font-heading font-bold leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(3rem, 6vw, 5rem)",
              }}
            >
              We build podcasts that{" "}
              <span className="text-gradient-accent">top the charts.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="mb-10 mx-auto max-w-lg font-body text-lg leading-relaxed text-text-secondary md:mx-0"
            >
              Full-service podcast production for creators and brands. From strategy and recording to distribution and growth—we handle it all from our Bermondsey studio.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center md:justify-start gap-4"
            >
              <Link href="/contact">
                <motion.button
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-amber px-8 py-4 font-heading text-base font-semibold text-white transition-all duration-300 hover:glow-amber touch-manipulation min-h-[44px] shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Phone className="h-5 w-5" />
                  <span>Book a Call</span>
                </motion.button>
              </Link>
              <Link href="/shows">
                <motion.button
                  className="flex items-center justify-center gap-2 rounded-full border border-background-tertiary bg-transparent px-8 py-4 font-heading text-base font-semibold text-white transition-all duration-300 hover:border-accent-amber hover:bg-accent-amber/10 touch-manipulation min-h-[44px]"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Play className="h-5 w-5" />
                  <span>Explore Shows</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Featured Show Card */}
          <div className="max-w-md mx-auto md:max-w-none">
            <FeaturedShowCard />
          </div>
        </div>
      </div>

    </section>
  );
}
