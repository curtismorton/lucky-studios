"use client";

import { motion } from "motion/react";
import { Users, Video, DollarSign, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import {
  defaultMarketingPagesContent,
  type CreatorsPageContent,
} from "@/lib/data/marketingContent";

interface CreatorsPageClientProps {
  content?: CreatorsPageContent;
}

const valueIcons = [Users, Video, DollarSign] as const;
const valueColors = [
  {
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
    glow: "hover:glow-purple",
  },
  {
    bg: "bg-accent-orange/10",
    text: "text-accent-orange",
    glow: "hover:glow-orange",
  },
  {
    bg: "bg-accent-cyan/10",
    text: "text-accent-cyan",
    glow: "hover:glow-cyan",
  },
] as const;

export default function CreatorsPageClient({ content }: CreatorsPageClientProps) {
  const page = content || defaultMarketingPagesContent.creators;

  return (
    <main className="min-h-screen bg-background">
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent-purple/10 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            For Creators
          </p>
          <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            Turn your personality into a show people come back to.
          </h1>
          <p className="mb-8 font-body text-base leading-relaxed text-text-secondary sm:mb-12 sm:text-lg md:text-xl">
            Bring the idea, audience, or point of view. Lucky builds the format,
            captures the episodes, packages the assets, and helps the show move
            across every platform that matters.
          </p>
          <Link href="/contact" className="inline-block">
            <motion.span
              className="inline-flex min-h-[44px] items-center rounded-full bg-accent-orange px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Build a Show
            </motion.span>
          </Link>
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
            What Lucky builds around{" "}
            <span className="text-gradient-accent">your idea</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {page.valueProps.items.map((prop, index) => {
            const Icon = valueIcons[index % valueIcons.length];
            const styles = valueColors[index % valueColors.length];

            return (
              <motion.div
                key={`${prop.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-sm transition-all duration-300 ${styles.glow} hover:border-accent-purple/50 sm:p-8`}
              >
                <div className={`mb-4 inline-flex rounded-xl ${styles.bg} p-3 sm:mb-6 sm:p-4`}>
                  <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${styles.text}`} />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
                  {prop.title}
                </h3>
                <p className="font-body text-sm text-text-secondary sm:text-base">
                  {prop.description}
                </p>
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
          className="relative overflow-hidden rounded-2xl border border-accent-purple/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 sm:rounded-3xl sm:p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10 grid gap-6 sm:gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <span className="inline-flex rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1.5 text-xs font-medium text-accent-purple sm:px-4 sm:py-2 sm:text-sm">
                  {page.successStory.tag}
                </span>
              </div>
              <h2 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">
                {page.successStory.titleLead}{" "}
                <span className="text-gradient-accent">{page.successStory.titleAccent}</span>{" "}
                {page.successStory.titleSuffix}
              </h2>
              <blockquote className="mb-4 border-l-4 border-accent-purple pl-4 font-body text-base italic text-text-secondary sm:mb-6 sm:pl-6 sm:text-lg">
                &ldquo;{page.successStory.quote}&rdquo;
              </blockquote>
              <p className="font-body font-semibold text-white">— {page.successStory.author}</p>
              <p className="font-body text-xs text-text-secondary sm:text-sm">
                {page.successStory.show}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:gap-6">
              {page.successStory.metrics.map((metric, index) => (
                <div
                  key={`${metric.value}-${index}`}
                  className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-4 sm:p-6"
                >
                  <div className="mb-2 font-heading text-2xl font-bold text-accent-purple sm:text-3xl">
                    {metric.value}
                  </div>
                  <p className="font-body text-xs text-text-secondary sm:text-sm">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-center font-heading text-3xl font-bold sm:mb-8 sm:text-4xl md:text-5xl">
            The creators we can{" "}
            <span className="text-gradient-accent">actually help</span>
          </h2>
          <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-sm sm:p-8">
            <ul className="space-y-3 sm:space-y-4">
              {page.lookFor.items.map((trait, index) => (
                <motion.li
                  key={`${trait}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4"
                >
                  <div className="mt-1 flex-shrink-0">
                    <Check className="h-4 w-4 text-accent-purple sm:h-5 sm:w-5" />
                  </div>
                  <span className="font-body text-base text-text-secondary sm:text-lg">
                    {trait}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">
            Ready to make the show{" "}
            <span className="text-gradient-accent">real</span>?
          </h2>
          <p className="mb-6 font-body text-base text-text-secondary sm:mb-8 sm:text-lg">
            We will help shape the format, production plan, launch assets, and
            first publishing rhythm before anything gets overcomplicated.
          </p>
          <Link href="/contact" className="inline-block">
            <motion.span
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent-purple px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-purple touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start the Conversation
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.span>
          </Link>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:mb-12 sm:text-4xl md:text-5xl">
            Frequently Asked <span className="text-gradient-accent">Questions</span>
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {page.faqs.map((faq, index) => (
              <motion.div
                key={`${faq.question}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 backdrop-blur-sm sm:p-6"
              >
                <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:mb-3 sm:text-xl">
                  {faq.question}
                </h3>
                <p className="font-body text-sm text-text-secondary sm:text-base">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
