"use client";

import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import SocialProofBar from "@/components/home/SocialProofBar";
import TransformationSection from "@/components/home/TransformationSection";
import ShowsGrid from "@/components/home/ShowsGrid";
import Pathways from "@/components/home/Pathways";
import ImageGallery from "@/components/home/ImageGallery";

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Raw to Polished Transformation Section */}
      <TransformationSection />

      {/* Image Gallery Scroller */}
      <ImageGallery />

      {/* Shows Grid */}
      <ShowsGrid />

      {/* Two Paths Section */}
      <Pathways />

      {/* CTA Section */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-accent-orange/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-6 backdrop-blur-sm sm:rounded-3xl sm:p-8 md:p-12"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-glow opacity-30" />
            <div className="relative z-10">
              <h2 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">
                Ready to{" "}
                <span className="text-gradient-accent">Listen</span>?
              </h2>
              <p className="mb-6 font-body text-base text-text-secondary sm:mb-8 sm:text-lg">
                Join the Lucky Studios community and discover your next
                favorite podcast.
              </p>
              <button className="min-h-[44px] rounded-full bg-gradient-accent px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-accent touch-manipulation sm:px-10 sm:py-4 sm:text-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

