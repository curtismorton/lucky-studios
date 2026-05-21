"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Mic, Users, BarChart3, Video, Globe } from "lucide-react";
import Link from "next/link";
import {
  defaultMarketingPagesContent,
  type BrandsPageContent,
} from "@/lib/data/marketingContent";

interface BrandsPageClientProps {
  content?: BrandsPageContent;
}

const serviceIcons = [TrendingUp, Mic] as const;
const benefitIcons = [Users, Video, Globe, BarChart3] as const;

export default function BrandsPageClient({ content }: BrandsPageClientProps) {
  const page = content || defaultMarketingPagesContent.brands;

  return (
    <main className="min-h-screen bg-background">
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent-cyan/10 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan">
            For Brands
          </p>
          <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Stop renting attention. Build media people choose to watch.
          </h1>
          <p className="mb-8 font-body text-base leading-relaxed text-text-secondary sm:mb-12 sm:text-lg md:text-xl">
            Lucky helps brands create native shows, sponsor creator-led formats,
            and turn campaign ideas into polished video, audio, and social
            assets without building an internal studio.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16"
        >
          <p className="mb-4 text-center font-body text-xs font-medium uppercase tracking-wider text-text-muted sm:mb-6 sm:text-sm">
            {page.trustedBy.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {page.trustedBy.brands.map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className={`rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4 ${index === 0 ? "" : "opacity-70"}`}
              >
                <span className="font-heading text-lg font-bold text-white sm:text-xl">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {page.services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <motion.div
                key={`${service.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50 hover:glow-cyan touch-manipulation sm:rounded-3xl sm:p-8 md:p-10"
              >
                <div className="mb-4 inline-flex rounded-xl bg-accent-cyan/10 p-3 sm:mb-6 sm:p-4">
                  <Icon className="h-6 w-6 text-accent-cyan sm:h-8 sm:w-8" />
                </div>
                <h2 className="mb-3 font-heading text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
                  {service.title}
                </h2>
                <p className="mb-4 font-body text-sm text-text-secondary sm:mb-6 sm:text-base">
                  {service.description}
                </p>
                <motion.button
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-accent-cyan bg-transparent px-4 py-2.5 font-heading text-xs font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation sm:px-6 sm:py-3 sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {service.ctaLabel}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-accent-cyan/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 sm:rounded-3xl sm:p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <div className="mb-4">
              <span className="inline-flex rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1.5 text-xs font-medium text-accent-cyan sm:px-4 sm:py-2 sm:text-sm">
                {page.caseStudy.tag}
              </span>
            </div>
            <h2 className="mb-6 font-heading text-3xl font-bold sm:mb-8 sm:text-4xl md:text-5xl">
              {page.caseStudy.titleLead}{" "}
              <span className="text-gradient-accent">{page.caseStudy.titleAccent}</span>
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:mb-3 sm:text-xl">
                  Challenge
                </h3>
                <p className="font-body text-sm text-text-secondary sm:text-base">
                  {page.caseStudy.challenge}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:mb-3 sm:text-xl">
                  Solution
                </h3>
                <p className="font-body text-sm text-text-secondary sm:text-base">
                  {page.caseStudy.solution}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:mb-3 sm:text-xl">
                  Results
                </h3>
                <p className="font-body text-sm text-text-secondary sm:text-base">
                  {page.caseStudy.results}
                </p>
              </div>
            </div>

            <blockquote className="my-6 border-l-4 border-accent-cyan pl-4 font-body text-base italic text-text-secondary sm:my-8 sm:pl-6 sm:text-lg">
              &ldquo;{page.caseStudy.quote}&rdquo;
            </blockquote>
            <p className="mb-4 font-body font-semibold text-white sm:mb-6">
              — {page.caseStudy.author}
            </p>

            <Link href={page.caseStudy.buttonHref}>
              <motion.button
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-accent-cyan bg-transparent px-4 py-2.5 font-heading text-xs font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation sm:px-6 sm:py-3 sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page.caseStudy.buttonLabel}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            A network built for{" "}
            <span className="text-gradient-accent">repeat attention</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {page.network.stats.map((stat, index) => (
            <motion.div
              key={`${stat.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 text-center backdrop-blur-sm sm:p-8"
            >
              <div className="mb-2 font-heading text-3xl font-bold text-accent-cyan sm:text-4xl md:text-5xl">
                {stat.value}
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:text-xl">
                {stat.title}
              </h3>
              <p className="font-body text-xs text-text-secondary sm:text-sm">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            What brands get{" "}
            <span className="text-gradient-accent">without the overhead</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {page.benefits.items.map((benefit, index) => {
            const Icon = benefitIcons[index % benefitIcons.length];
            return (
              <motion.div
                key={`${benefit.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50 sm:p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-accent-cyan/10 p-2.5 sm:p-3">
                  <Icon className="h-5 w-5 text-accent-cyan sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:text-xl">
                  {benefit.title}
                </h3>
                <p className="font-body text-xs text-text-secondary sm:text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-accent-cyan/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 text-center sm:rounded-3xl sm:p-12"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-4 font-heading text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl">
              Build a campaign that{" "}
              <span className="text-gradient-accent">feels like content</span>.
            </h2>
            <p className="mb-6 font-body text-base text-text-secondary sm:mb-8 sm:text-lg">
              Bring the audience, category, or commercial brief. We will shape
              the format, talent route, production plan, and deliverables.
            </p>
            <motion.button
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent-cyan px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-cyan touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Talk Through the Brief
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            <p className="mt-4 font-body text-xs text-text-muted sm:text-sm">
              Or email us at{" "}
              <a href={`mailto:${page.cta.email}`} className="text-accent-cyan hover:underline">
                {page.cta.email}
              </a>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
