"use client";

import { motion } from "framer-motion";
import { Users, Video, DollarSign, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function CreatorsPageClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Purple Tint Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent-purple/10 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-4 sm:mb-6 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Grow Your Podcast{" "}
            <span className="text-gradient-accent">With Us</span>
          </h1>
          <p className="mb-8 sm:mb-12 font-body text-base sm:text-lg md:text-xl text-text-secondary">
            Join London's fastest-growing podcast network
          </p>
          <motion.button
            className="rounded-full bg-accent-purple px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-purple touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply to Join
          </motion.button>
        </motion.div>
      </section>

      {/* Value Props */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
            Why Partner <span className="text-gradient-accent">With Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Users,
              title: "Network Growth",
              description: "Cross-promotion to 1.1M+ viewers across our network",
              color: "purple",
            },
            {
              icon: Video,
              title: "Production Support",
              description: "Sony A7 IV, Shure SM7B, professional editing and post-production",
              color: "orange",
            },
            {
              icon: DollarSign,
              title: "Revenue Share",
              description: "YouTube, Spotify, and brand deals - we share the success",
              color: "cyan",
            },
          ].map((prop, index) => {
            const Icon = prop.icon;
            const colorStyles = {
              purple: {
                bg: "bg-accent-purple/10",
                text: "text-accent-purple",
                glow: "hover:glow-purple",
              },
              orange: {
                bg: "bg-accent-orange/10",
                text: "text-accent-orange",
                glow: "hover:glow-orange",
              },
              cyan: {
                bg: "bg-accent-cyan/10",
                text: "text-accent-cyan",
                glow: "hover:glow-cyan",
              },
            };
            const styles = colorStyles[prop.color as keyof typeof colorStyles];

            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 ${styles.glow} hover:border-accent-purple/50`}
              >
                <div className={`mb-4 sm:mb-6 inline-flex rounded-xl ${styles.bg} p-3 sm:p-4`}>
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${styles.text}`} />
                </div>
                <h3 className="mb-3 sm:mb-4 font-heading text-xl sm:text-2xl font-semibold text-white">
                  {prop.title}
                </h3>
                <p className="font-body text-sm sm:text-base text-text-secondary">
                  {prop.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Success Story */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-accent-purple/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 sm:p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10 grid gap-6 sm:gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <span className="inline-flex rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-accent-purple">
                  Success Story
                </span>
              </div>
              <h2 className="mb-4 sm:mb-6 font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
                From 0 to{" "}
                <span className="text-gradient-accent">10M Views</span> in
                Season 1
              </h2>
              <blockquote className="mb-4 sm:mb-6 border-l-4 border-accent-purple pl-4 sm:pl-6 font-body text-base sm:text-lg italic text-text-secondary">
                "Lucky Studios didn't just give me a platform - they gave me a
                team. The production quality, cross-promotion, and support
                helped turn my idea into a hit show."
              </blockquote>
              <p className="font-body font-semibold text-white">— Abby Boom</p>
              <p className="font-body text-xs sm:text-sm text-text-secondary">
                Don't Get Me Started
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:gap-6">
              <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-4 sm:p-6">
                <div className="mb-2 font-heading text-2xl sm:text-3xl font-bold text-accent-purple">
                  10M+
                </div>
                <p className="font-body text-xs sm:text-sm text-text-secondary">
                  Views in Season 1
                </p>
              </div>
              <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-4 sm:p-6">
                <div className="mb-2 font-heading text-2xl sm:text-3xl font-bold text-accent-purple">
                  0 → 1M
                </div>
                <p className="font-body text-xs sm:text-sm text-text-secondary">
                  Subscribers in 6 months
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What We Look For */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 sm:mb-8 text-center font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
            What We <span className="text-gradient-accent">Look For</span>
          </h2>
          <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 sm:p-8 backdrop-blur-sm">
            <ul className="space-y-3 sm:space-y-4">
              {[
                "Unique perspective or niche expertise",
                "Commitment to consistent content creation",
                "Passion for your subject matter",
                "Openness to collaboration and feedback",
                "Long-term vision for your show",
                "Focus on potential, not existing audience size",
              ].map((trait, index) => (
                <motion.li
                  key={trait}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  <div className="mt-1 flex-shrink-0">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent-purple" />
                  </div>
                  <span className="font-body text-base sm:text-lg text-text-secondary">
                    {trait}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Application CTA */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-4 sm:mb-6 font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
            Ready to <span className="text-gradient-accent">Get Started</span>?
          </h2>
          <p className="mb-6 sm:mb-8 font-body text-base sm:text-lg text-text-secondary">
            We're always looking for passionate creators with unique voices.
            Let's talk about how we can help grow your podcast.
          </p>
          <motion.button
            className="inline-flex items-center gap-2 rounded-full bg-accent-purple px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-purple touch-manipulation min-h-[44px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Talk
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 sm:mb-12 text-center font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
            Frequently Asked <span className="text-gradient-accent">Questions</span>
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: "How does partnership work?",
                answer:
                  "We provide production support, studio access, editing, and cross-promotion across our network. You focus on creating great content while we handle the technical and marketing aspects.",
              },
              {
                question: "What's the revenue split?",
                answer:
                  "We operate on a revenue share model. The exact split depends on the partnership structure, but we believe in fair compensation that grows with your success.",
              },
              {
                question: "Do I need an existing audience?",
                answer:
                  "No! We focus on potential, not existing audience size. If you have a unique voice and commitment to creating great content, we want to hear from you.",
              },
              {
                question: "Where is the studio located?",
                answer:
                  "Our studio is located in London Bridge, easily accessible by public transport. We also support remote recording setups for creators who prefer to work from their own space.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 sm:p-6 backdrop-blur-sm"
              >
                <h3 className="mb-2 sm:mb-3 font-heading text-lg sm:text-xl font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="font-body text-sm sm:text-base text-text-secondary">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

