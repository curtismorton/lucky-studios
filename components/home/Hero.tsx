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
  const heroRef = useRef<HTMLElement | null>(null);
  
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
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-accent-amber/15 blur-3xl"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        
        {/* Sound wave patterns in background - Two layered waves for depth */}
        <motion.svg
          viewBox="0 0 1200 200"
          className="absolute left-1/2 top-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[1px]"
          style={{ y: waveY, opacity: waveOpacity }}
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
          </defs>
          {/* Primary wave path */}
          <motion.path
            d="M0 100 C 120 60, 240 140, 360 100 C 480 60, 600 140, 720 100 C 840 60, 960 140, 1080 100 C 1140 80, 1200 110, 1200 110"
            stroke="url(#soundWaveGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10 12"
            animate={{ strokeDashoffset: [0, -88] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Secondary wave path - creates layered depth effect */}
          <motion.path
            d="M0 120 C 150 90, 300 150, 450 110 C 600 70, 750 150, 900 110 C 1050 70, 1200 140, 1200 140"
            stroke="url(#soundWaveGradientSecondary)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            opacity="0.7"
          />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex justify-center md:justify-start"
            >
              <Logo size="lg" showLink={false} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 mx-auto max-w-lg font-body text-lg text-text-secondary md:mx-0"
            >
              Full-service podcast production for creators and brands. From strategy and recording to distribution and growth—we handle it all from our Bermondsey studio.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
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
