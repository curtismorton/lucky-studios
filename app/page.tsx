"use client";

import { motion } from "framer-motion";
import { Mic, Play, Users, Sparkles } from "lucide-react";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="relative px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 sm:mb-16 text-center font-heading text-3xl sm:text-4xl font-bold md:text-5xl"
          >
            What Makes Us{" "}
            <span className="text-gradient-accent">Lucky</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Mic,
                title: "Premium Content",
                description: "Curated shows that push boundaries and spark conversations.",
                bgColor: "bg-accent-orange/10",
                textColor: "text-accent-orange",
                glowClass: "hover:glow-orange",
                color: "orange",
              },
              {
                icon: Users,
                title: "Diverse Voices",
                description: "Amplifying perspectives from all walks of life.",
                bgColor: "bg-accent-purple/10",
                textColor: "text-accent-purple",
                glowClass: "hover:glow-purple",
                color: "purple",
              },
              {
                icon: Play,
                title: "Immersive Experience",
                description: "High-quality production that draws you in.",
                bgColor: "bg-accent-cyan/10",
                textColor: "text-accent-cyan",
                glowClass: "hover:glow-cyan",
                color: "cyan",
              },
              {
                icon: Sparkles,
                title: "Cultural Impact",
                description: "Shows that matter and conversations that resonate.",
                bgColor: "bg-accent-green/10",
                textColor: "text-accent-green",
                glowClass: "hover:glow-green",
                color: "green",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              
              // Predefined mapping for hover border colors (Tailwind-safe)
              const colorStyles = {
                orange: "hover:border-accent-orange/50",
                purple: "hover:border-accent-purple/50",
                cyan: "hover:border-accent-cyan/50",
                green: "hover:border-accent-green/50",
              };
              
              const hoverBorderClass = colorStyles[feature.color as keyof typeof colorStyles] || colorStyles.orange;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative rounded-2xl border border-background-tertiary bg-background-secondary p-8 transition-all duration-300 ${hoverBorderClass} hover:bg-background-tertiary ${feature.glowClass}`}
                >
                  <div
                    className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3 ${feature.textColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="font-body text-text-secondary">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

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
