"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { User, Building2, ArrowRight } from "lucide-react";
import { cardHover } from "@/lib/animations";
import TiltCard from "@/components/ui/TiltCard";

interface Pathway {
  title: string;
  description: string;
  href: string;
  icon: typeof User;
  accentColor: "orange" | "purple" | "cyan";
  features?: string[];
}

const pathways: Pathway[] = [
  {
    title: "For Creators",
    description: "Launch and grow your podcast with London's best production team. We handle everything from concept to chart position.",
    href: "/creators",
    icon: User,
    accentColor: "orange",
    features: [
      "Full production in our Bermondsey studio",
      "Multi-platform distribution",
      "Growth strategy & analytics",
      "Brand partnership opportunities",
    ],
  },
  {
    title: "For Brands",
    description: "Connect with engaged audiences through authentic podcast integrations and sponsorships across our network.",
    href: "/brands",
    icon: Building2,
    accentColor: "purple",
    features: [
      "Access to 5+ established shows",
      "Host-read integrations",
      "Custom branded content",
      "Cross-platform amplification",
    ],
  },
];

const accentStyles = {
  orange: {
    bg: "bg-accent-orange/10",
    text: "text-accent-orange",
    border: "border-accent-orange/50",
    glow: "hover:glow-orange",
    hoverBorder: "hover:border-accent-orange/50",
    hoverBg: "hover:bg-accent-orange/10",
  },
  purple: {
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
    border: "border-accent-purple/50",
    glow: "hover:glow-purple",
    hoverBorder: "hover:border-accent-purple/50",
    hoverBg: "hover:bg-accent-purple/10",
  },
  cyan: {
    bg: "bg-accent-cyan/10",
    text: "text-accent-cyan",
    border: "border-accent-cyan/50",
    glow: "hover:glow-cyan",
    hoverBorder: "hover:border-accent-cyan/50",
    hoverBg: "hover:bg-accent-cyan/10",
  },
};

export default function Pathways() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scanlineY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const clipTop = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const clipBottom = useTransform(scrollYProgress, [0.8, 1], ["0%", "100%"]);
  const clipPath = useTransform(
    [clipTop, clipBottom],
    ([top, bottom]) => `inset(${top} 0% ${bottom} 0%)`
  );

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-24 md:py-32">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-tech-grid opacity-15"
        style={{ y: gridY }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-scanlines opacity-10"
        style={{ y: scanlineY }}
      />
      <motion.div style={{ clipPath }} className="relative">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center sm:mb-16"
          >
            <h2 className="mb-4 font-heading text-2xl font-bold sm:text-3xl md:text-4xl">
              Who We Work With
            </h2>
            <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
              Whether you're a creator looking to launch your show or a brand seeking podcast partnerships, we've got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2">
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
                  <TiltCard
                    whileHover={cardHover}
                    className={`group relative overflow-hidden rounded-3xl border border-background-tertiary bg-background-secondary p-8 md:p-12 transition-all duration-300 ${styles.border} hover:bg-background-tertiary ${styles.glow}`}
                    glowClassName="rounded-3xl mix-blend-screen"
                    maxTilt={8}
                    glowSize={320}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none`} />
                    
                    <div className="relative z-10">
                      <div
                        className={`mb-6 inline-flex rounded-2xl ${styles.bg} p-4 ${styles.text} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-4 font-heading text-2xl font-bold md:text-3xl">
                        {pathway.title}
                      </h3>
                      <p className="mb-6 font-body text-text-secondary leading-relaxed">
                        {pathway.description}
                      </p>
                      
                      {pathway.features && (
                        <ul className="mb-8 space-y-3">
                          {pathway.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-center gap-3 font-body text-text-secondary">
                              <span className={`${styles.text} font-bold`}>✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <Link href={pathway.href}>
                        <motion.button
                          className={`flex items-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 ${styles.hoverBorder} ${styles.hoverBg} ${styles.border}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {pathway.title === "For Creators" ? "Learn More" : "Partner With Us"}
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </Link>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
