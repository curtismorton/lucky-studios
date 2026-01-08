"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import { Play, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { buttonHover, buttonTap } from "@/lib/animations";
import Logo from "@/components/ui/Logo";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [timecode, setTimecode] = useState("00:00:00");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const spotlight = useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(6, 182, 212, 0.18), transparent 65%)`;
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scanlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const waveY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const waveOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.7, 0.35, 0]);

  useEffect(() => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const seconds = String(elapsed % 60).padStart(2, "0");
      setTimecode(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    mouseX.set(rect.width / 2);
    mouseY.set(rect.height / 2);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ background: spotlight }}
        />
        <motion.div
          className="absolute inset-0 bg-tech-grid opacity-20"
          style={{ y: gridY }}
        />
        <motion.div
          className="absolute inset-0 bg-scanlines opacity-15"
          style={{ y: scanlineY }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-accent-orange/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent-purple/20 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/15 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.svg
          viewBox="0 0 1200 200"
          className="absolute left-1/2 top-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[1px]"
          style={{ y: waveY, opacity: waveOpacity }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0 100 C 120 60, 240 140, 360 100 C 480 60, 600 140, 720 100 C 840 60, 960 140, 1080 100 C 1140 80, 1200 110, 1200 110"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10 12"
            animate={{ strokeDashoffset: [0, -88] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M0 120 C 150 90, 300 150, 450 110 C 600 70, 750 150, 900 110 C 1050 70, 1200 140, 1200 140"
            stroke="url(#waveGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [0, -72] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            opacity="0.7"
          />
        </motion.svg>
      </div>

      {/* HUD Details */}
      <div className="pointer-events-none absolute left-6 top-6 z-20 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400">REC</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="h-2 w-1 rounded-sm bg-text-secondary/70" />
          <span className="h-3 w-1 rounded-sm bg-text-secondary/80" />
          <span className="h-4 w-1 rounded-sm bg-text-secondary/90" />
          <span className="h-5 w-1 rounded-sm bg-text-secondary" />
        </div>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 z-20 font-mono text-xs text-text-muted">
        {timecode}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <Logo size="lg" showLink={false} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 font-heading font-bold leading-[1.02] tracking-tight"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
          }}
        >
          Stories that{" "}
          <span className="text-gradient-rainbow">move culture.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 sm:mb-12 mx-auto max-w-2xl font-body text-base sm:text-lg text-text-secondary md:text-xl px-2"
        >
          Lucky Studios turns ideas into shows audiences binge. Strategy,
          production, and distribution for creators and brands.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Link href="/shows">
            <motion.button
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-orange px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:glow-orange touch-manipulation min-h-[44px]"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">Explore Our Shows</span>
            </motion.button>
          </Link>
          <motion.button
            className="flex items-center justify-center gap-2 rounded-full border-2 border-accent-orange bg-black px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-orange/10 hover:glow-orange touch-manipulation min-h-[44px]"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="whitespace-nowrap">Book a Call</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-8 w-8 rounded-full border-2 border-text-secondary"
        />
      </motion.div>
    </section>
  );
}
