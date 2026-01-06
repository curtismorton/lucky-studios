"use client";

import { motion } from "framer-motion";
import { Mic, Building, Video, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cardHover, buttonHover, buttonTap } from "@/lib/animations";

interface Pathway {
  title: string;
  description: string;
  href: string;
  icon: typeof Mic;
  accentColor: "orange" | "purple" | "cyan";
}

const pathways: Pathway[] = [
  {
    title: "I'm a Creator",
    description: "Join our network and grow your audience",
    href: "/creators",
    icon: Mic,
    accentColor: "orange",
  },
  {
    title: "I'm a Brand",
    description: "Partner with us on branded content",
    href: "/brands",
    icon: Building,
    accentColor: "purple",
  },
  {
    title: "Book the Studio",
    description: "Rent our London Bridge space",
    href: "/studio",
    icon: Video,
    accentColor: "cyan",
  },
];

const accentStyles = {
  orange: {
    bg: "bg-accent-orange/10",
    text: "text-accent-orange",
    border: "border-accent-orange/30",
    glow: "hover:glow-orange",
    hoverBorder: "hover:border-accent-orange/50",
  },
  purple: {
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
    border: "border-accent-purple/30",
    glow: "hover:glow-purple",
    hoverBorder: "hover:border-accent-purple/50",
  },
  cyan: {
    bg: "bg-accent-cyan/10",
    text: "text-accent-cyan",
    border: "border-accent-cyan/30",
    glow: "hover:glow-cyan",
    hoverBorder: "hover:border-accent-cyan/50",
  },
};

export default function Pathways() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 md:py-32">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
          Find Your <span className="text-gradient-accent">Path</span>
        </h2>
      </motion.div>

      {/* Pathway Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {pathways.map((pathway, index) => {
          const Icon = pathway.icon;
          const styles = accentStyles[pathway.accentColor];

          return (
            <motion.div
              key={pathway.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={pathway.href}>
                <motion.div
                  className={`group relative overflow-hidden rounded-2xl border ${styles.border} ${styles.hoverBorder} bg-background-secondary/50 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 ${styles.glow} touch-manipulation`}
                  whileHover={cardHover}
                >
                  {/* Icon Circle */}
                  <div className="mb-6">
                    <div
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${styles.bg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className={`h-8 w-8 ${styles.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 font-heading text-xl sm:text-2xl font-semibold text-white">
                    {pathway.title}
                  </h3>
                  <p className="mb-6 font-body text-text-secondary">
                    {pathway.description}
                  </p>

                  {/* Arrow */}
                  <div className={`relative inline-flex items-center gap-2 ${styles.text} font-body text-sm font-medium`}>
                    <span>Learn more</span>
                    <div className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${styles.bg}`}
                  />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

