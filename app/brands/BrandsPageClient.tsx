"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Mic, Users, BarChart3, Target, Video, Globe, FileText } from "lucide-react";
import Link from "next/link";

export default function BrandsPageClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        {/* Cyan Tint Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent-cyan/10 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-4 sm:mb-6 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Reach Engaged{" "}
            <span className="text-gradient-accent">Audiences</span>
          </h1>
          <p className="mb-8 sm:mb-12 font-body text-base sm:text-lg md:text-xl text-text-secondary">
            Partner with shows your customers actually listen to
          </p>
        </motion.div>

        {/* Logo Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16"
        >
          <p className="mb-4 sm:mb-6 text-center font-body text-xs sm:text-sm font-medium uppercase tracking-wider text-text-muted">
            Trusted by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {/* William Hill Logo Placeholder */}
            <div className="rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 sm:px-8 py-3 sm:py-4 backdrop-blur-sm">
              <span className="font-heading text-lg sm:text-xl font-bold text-white">William Hill</span>
            </div>
            {/* Placeholder Logos */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 sm:px-8 py-3 sm:py-4 backdrop-blur-sm opacity-50"
              >
                <span className="font-body text-xs sm:text-sm text-text-secondary">Partner {i}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Service Cards */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Sponsor a Show */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-background-tertiary bg-background-secondary/50 p-6 sm:p-8 md:p-10 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50 hover:glow-cyan touch-manipulation"
          >
            <div className="mb-4 sm:mb-6 inline-flex rounded-xl bg-accent-cyan/10 p-3 sm:p-4">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent-cyan" />
            </div>
            <h2 className="mb-3 sm:mb-4 font-heading text-2xl sm:text-3xl font-bold text-white">
              Sponsor a Show
            </h2>
            <p className="mb-4 sm:mb-6 font-body text-sm sm:text-base text-text-secondary">
              Integrate into existing shows with established audiences and proven
              engagement. Reach millions of listeners who trust our hosts.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 rounded-full border-2 border-accent-cyan bg-transparent px-4 sm:px-6 py-2.5 sm:py-3 font-heading text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Sponsorship Options
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.button>
          </motion.div>

          {/* Create a Branded Podcast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-background-tertiary bg-background-secondary/50 p-6 sm:p-8 md:p-10 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50 hover:glow-cyan touch-manipulation"
          >
            <div className="mb-4 sm:mb-6 inline-flex rounded-xl bg-accent-cyan/10 p-3 sm:p-4">
              <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-accent-cyan" />
            </div>
            <h2 className="mb-3 sm:mb-4 font-heading text-2xl sm:text-3xl font-bold text-white">
              Create a Branded Podcast
            </h2>
            <p className="mb-4 sm:mb-6 font-body text-sm sm:text-base text-text-secondary">
              Your own show, from concept to distribution. We handle everything
              - you get a professional podcast that tells your brand's story.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 rounded-full border-2 border-accent-cyan bg-transparent px-4 sm:px-6 py-2.5 sm:py-3 font-heading text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discuss Your Podcast
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Case Study */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-accent-cyan/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 sm:p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <div className="mb-4">
              <span className="inline-flex rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-accent-cyan">
                Case Study
              </span>
            </div>
            <h2 className="mb-6 sm:mb-8 font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
              William Hill × <span className="text-gradient-accent">Back Post</span>
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-2 sm:mb-3 font-heading text-lg sm:text-xl font-semibold text-white">
                  Challenge
                </h3>
                <p className="font-body text-sm sm:text-base text-text-secondary">
                  Reach football fans authentically through content they
                  genuinely engage with, moving beyond traditional advertising.
                </p>
              </div>
              <div>
                <h3 className="mb-2 sm:mb-3 font-heading text-lg sm:text-xl font-semibold text-white">
                  Solution
                </h3>
                <p className="font-body text-sm sm:text-base text-text-secondary">
                  Integrated sponsorship of Back Post, a weekly football
                  podcast with deep tactical analysis and cultural commentary.
                </p>
              </div>
              <div>
                <h3 className="mb-2 sm:mb-3 font-heading text-lg sm:text-xl font-semibold text-white">
                  Results
                </h3>
                <p className="font-body text-sm sm:text-base text-text-secondary">
                  Reached 500K+ engaged listeners, 4.8★ average rating, and
                  measurable brand lift in target demographics.
                </p>
              </div>
            </div>

            <blockquote className="my-6 sm:my-8 border-l-4 border-accent-cyan pl-4 sm:pl-6 font-body text-base sm:text-lg italic text-text-secondary">
              "Working with Lucky Studios gave us access to an audience that
              actually cares about football. The integration felt natural, not
              like advertising."
            </blockquote>
            <p className="mb-4 sm:mb-6 font-body font-semibold text-white">
              — William Hill Marketing Team
            </p>

            <Link href="/case-studies/william-hill">
              <motion.button
                className="inline-flex items-center gap-2 rounded-full border-2 border-accent-cyan bg-transparent px-4 sm:px-6 py-2.5 sm:py-3 font-heading text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read Full Case Study
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Network Stats */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold md:text-5xl">
            Our <span className="text-gradient-accent">Network</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Total Reach",
              value: "1.1M+",
              description: "Unique monthly listeners",
            },
            {
              title: "Engagement Rate",
              value: "68%",
              description: "Average completion rate",
            },
            {
              title: "Key Demographics",
              value: "18-45",
              description: "Primary age range",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 sm:p-8 text-center backdrop-blur-sm"
            >
              <div className="mb-2 font-heading text-3xl sm:text-4xl font-bold text-accent-cyan md:text-5xl">
                {stat.value}
              </div>
              <h3 className="mb-2 font-heading text-lg sm:text-xl font-semibold text-white">
                {stat.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-text-secondary">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: Users,
              title: "Influencer Access",
              description: "SP roster 15M+ followers across platforms",
            },
            {
              icon: Video,
              title: "Professional Production",
              description: "Studio-quality audio and video from day one",
            },
            {
              icon: Globe,
              title: "Multi-Platform Distribution",
              description: "Spotify, Apple, YouTube, and more",
            },
            {
              icon: BarChart3,
              title: "Performance Reporting",
              description: "Detailed analytics and ROI tracking",
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50"
              >
                <div className="mb-4 inline-flex rounded-xl bg-accent-cyan/10 p-2.5 sm:p-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent-cyan" />
                </div>
                <h3 className="mb-2 font-heading text-lg sm:text-xl font-semibold text-white">
                  {benefit.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-text-secondary">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-accent-cyan/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 sm:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-4 sm:mb-6 font-heading text-2xl sm:text-3xl font-bold md:text-4xl">
              Ready to <span className="text-gradient-accent">Get Started</span>?
            </h2>
            <p className="mb-6 sm:mb-8 font-body text-base sm:text-lg text-text-secondary">
              Let's discuss how we can help you reach your target audience
              through podcast partnerships.
            </p>
            <motion.button
              className="inline-flex items-center gap-2 rounded-full bg-accent-cyan px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-cyan touch-manipulation min-h-[44px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule a Call
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            <p className="mt-4 font-body text-xs sm:text-sm text-text-muted">
              Or email us at{" "}
              <a
                href="mailto:brands@luckystudios.com"
                className="text-accent-cyan hover:underline"
              >
                brands@luckystudios.com
              </a>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

