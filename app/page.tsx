"use client";

import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import Pathways from "@/components/home/Pathways";
import ShowsGrid from "@/components/home/ShowsGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Stats Bar */}
      <StatsBar />

      {/* Pathways Section */}
      <Pathways />

      {/* Shows Grid */}
      <ShowsGrid />

      {/* CTA Section */}
      <section className="relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl sm:rounded-3xl border border-accent-orange/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-6 sm:p-8 md:p-12 backdrop-blur-sm"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-glow opacity-30" />
            <div className="relative z-10">
              <h2 className="mb-4 sm:mb-6 font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
                Ready to{" "}
                <span className="text-gradient-accent">Listen</span>?
              </h2>
              <p className="mb-6 sm:mb-8 font-body text-base sm:text-lg text-text-secondary">
                Join the Lucky Studios community and discover your next
                favorite podcast.
              </p>
              <button className="rounded-full bg-gradient-accent px-6 py-3 sm:px-10 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-accent touch-manipulation min-h-[44px]">
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
