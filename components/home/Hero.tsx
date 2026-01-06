"use client";

import { motion } from "framer-motion";
import { Play, Phone } from "lucide-react";
import { buttonHover, buttonTap } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0">
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
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-4 py-2 backdrop-blur-sm"
        >
          <span className="text-xl">🎲</span>
          <span className="font-body text-xs sm:text-sm font-medium text-text-secondary">
            London's Creator-First Podcast Network
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 font-heading font-bold leading-tight tracking-tight"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
          }}
        >
          Stories Worth{" "}
          <span className="text-gradient-accent">Listening To</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 sm:mb-12 mx-auto max-w-2xl font-body text-base sm:text-lg text-text-secondary md:text-xl px-2"
        >
          We build hit podcasts. From concept to millions of views - Lucky
          Studios is where creators and brands find their voice.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <motion.button
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-orange px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:glow-orange touch-manipulation min-h-[44px]"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="whitespace-nowrap">Explore Our Shows</span>
          </motion.button>
          <motion.button
            className="flex items-center justify-center gap-2 rounded-full border-2 border-accent-orange bg-transparent px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-orange/10 hover:glow-orange touch-manipulation min-h-[44px]"
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

