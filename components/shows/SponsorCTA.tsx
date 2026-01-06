"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SponsorCTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-accent-orange/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-12 text-center"
      >
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="relative z-10">
          <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
            Want to sponsor this show?
          </h2>
          <p className="mb-8 font-body text-lg text-text-secondary">
            Partner with us to reach millions of engaged listeners.
          </p>
          <Link href="/brands">
            <motion.button
              className="inline-flex items-center gap-2 rounded-full bg-accent-orange px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

