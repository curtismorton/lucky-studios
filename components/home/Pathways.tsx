"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { User, Building2, Mic } from "lucide-react";
import { cardHover } from "@/lib/animations";

interface Pathway {
  title: string;
  description: string;
  href: string;
  icon: typeof User;
  accentColor: "orange" | "purple" | "cyan";
}

const pathways: Pathway[] = [
  {
    title: "I'm a Creator",
    description: "Join our network and amplify your voice with professional production and distribution.",
    href: "/creators",
    icon: User,
    accentColor: "orange",
  },
  {
    title: "I'm a Brand",
    description: "Partner with us to reach engaged audiences through authentic storytelling.",
    href: "/brands",
    icon: Building2,
    accentColor: "purple",
  },
  {
    title: "Book the Studio",
    description: "Access our state-of-the-art recording facilities for your next project.",
    href: "/studio",
    icon: Mic,
    accentColor: "cyan",
  },
];

const accentStyles = {
  orange: {
    bg: "bg-accent-orange/10",
    text: "text-accent-orange",
    border: "border-accent-orange/50",
    glow: "hover:glow-orange",
  },
  purple: {
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
    border: "border-accent-purple/50",
    glow: "hover:glow-purple",
  },
  cyan: {
    bg: "bg-accent-cyan/10",
    text: "text-accent-cyan",
    border: "border-accent-cyan/50",
    glow: "hover:glow-cyan",
  },
};

export default function Pathways() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center font-heading text-3xl sm:text-4xl font-bold md:text-5xl"
        >
          Find Your{" "}
          <span className="text-gradient-accent">Pathway</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;
            const styles = accentStyles[pathway.accentColor];

            return (
              <motion.div
                key={pathway.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={pathway.href}>
                  <motion.div
                    whileHover={cardHover}
                    className={`group relative rounded-2xl border border-background-tertiary bg-background-secondary p-8 transition-all duration-300 ${styles.border} hover:bg-background-tertiary ${styles.glow}`}
                  >
                    <div
                      className={`mb-6 inline-flex rounded-xl ${styles.bg} p-4 ${styles.text} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-semibold">
                      {pathway.title}
                    </h3>
                    <p className="font-body text-text-secondary">
                      {pathway.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
