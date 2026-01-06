"use client";

import { motion } from "framer-motion";
import { type Show } from "@/lib/data/shows";

interface ShowAboutProps {
  show: Show;
}

export default function ShowAbout({ show }: ShowAboutProps) {
  if (!show.description) return null;

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
          About
        </h2>
        <p className="mb-8 font-body text-lg leading-relaxed text-text-secondary">
          {show.description}
        </p>
        {show.format && (
          <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6">
            <p className="font-body text-sm font-medium text-text-secondary">
              <span className="text-white">Format:</span> {show.format}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}

