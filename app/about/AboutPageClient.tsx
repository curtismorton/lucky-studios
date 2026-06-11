"use client";

import { motion } from "motion/react";
import { ArrowRight, Users, Target, Handshake, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import {
  defaultMarketingPagesContent,
  type AboutPageContent,
} from "@/lib/data/marketingContent";

interface AboutPageClientProps {
  content?: AboutPageContent;
}

const valueIcons = [Users, Target, Handshake, TrendingUp] as const;

export default function AboutPageClient({ content }: AboutPageClientProps) {
  const page = content || defaultMarketingPagesContent.about;

  return (
    <main className="min-h-screen bg-background">
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent-orange/10 via-transparent to-accent-purple/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <Logo size="md" showLink={false} />
          </motion.div>
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            About Lucky
          </p>
          <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
            We build shows like media products, not one-off uploads.
          </h1>
          <p className="font-body text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
            Lucky Studios is a London production studio and creator media
            network backed by Socially Powerful. We help talent and brands turn
            repeatable ideas into formats people want to watch again.
          </p>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 font-heading text-3xl font-bold sm:mb-8 sm:text-4xl md:text-5xl">
            Why Lucky <span className="text-gradient-accent">exists</span>
          </h2>
          <div className="space-y-4 font-body text-base leading-relaxed text-text-secondary sm:space-y-6 sm:text-lg">
            <p>
              Most content teams are stuck between two weak options: informal
              creator output that is inconsistent, or polished brand content
              that feels too slow and too safe for social platforms.
            </p>
            <p>
              Lucky sits in the middle. We bring format development, studio
              production, editing, packaging, distribution thinking, and brand
              access into one joined-up system.
            </p>
            <p>
              The goal is simple: make shows that have a reason to exist beyond
              the first episode, then turn every recording into assets that can
              actually travel.
            </p>
            <div className="mt-6 rounded-2xl border border-accent-orange/30 bg-accent-orange/10 p-5 sm:mt-8 sm:p-6">
              <p className="font-heading text-lg font-semibold text-white sm:text-xl">
                The operating principle
              </p>
              <p className="mt-2 font-body text-base text-text-secondary sm:text-lg">
                Strong ideas need a repeatable production machine behind them.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-accent-purple/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 sm:rounded-3xl sm:p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <div className="mb-6 grid gap-6 sm:mb-8 sm:gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">
                  Backed by{" "}
                  <span className="text-gradient-accent">Socially Powerful</span>
                </h2>
                <p className="mb-6 font-body text-base text-text-secondary sm:mb-8 sm:text-lg">
                  Lucky has the speed of a studio with the commercial context of
                  a global influencer marketing agency. That means show ideas
                  can be built with audience, talent, and brand outcomes in mind
                  from the start.
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  {page.sociallyPowerful.bullets.map((item, index) => (
                    <motion.li
                      key={`${item}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3 font-body text-sm text-text-secondary sm:text-base"
                    >
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-accent-purple" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-8 backdrop-blur-sm sm:p-12">
                  <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                    {page.sociallyPowerful.badgeText}
                  </p>
                </div>
              </div>
            </div>
            <Link href={page.sociallyPowerful.buttonHref} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-accent-purple bg-transparent px-4 py-2.5 font-heading text-xs font-semibold text-white transition-all duration-300 hover:bg-accent-purple/10 hover:glow-purple touch-manipulation sm:px-6 sm:py-3 sm:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page.sociallyPowerful.buttonLabel}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:mb-12 sm:text-4xl md:text-5xl">
            The people building <span className="text-gradient-accent">the system</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {page.team.members.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  {member.image ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-full sm:h-32 sm:w-32">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent-orange/30 via-accent-purple/30 to-accent-cyan/30 sm:h-32 sm:w-32" />
                  )}
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:text-xl">
                  {member.name}
                </h3>
                <p className="mb-2 font-body text-xs font-medium text-accent-purple sm:mb-3 sm:text-sm">
                  {member.role}
                </p>
                <p className="font-body text-xs text-text-secondary sm:text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:mb-12 sm:text-4xl md:text-5xl">
            What we will not <span className="text-gradient-accent">compromise on</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {page.values.items.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <motion.div
                  key={`${value.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent-orange/50 sm:p-6"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-accent-orange/10 p-2.5 sm:mb-4 sm:p-3">
                    <Icon className="h-5 w-5 text-accent-orange sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:mb-3 sm:text-xl">
                    {value.title}
                  </h3>
                  <p className="font-body text-xs text-text-secondary sm:text-sm">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-accent-orange/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-8 text-center sm:rounded-3xl sm:p-12"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">
              Bring us the idea. <span className="text-gradient-accent">We will build the show.</span>
            </h2>
            <p className="mb-6 font-body text-base text-text-secondary sm:mb-8 sm:text-lg">
              Pick the route that best matches what you are trying to make.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {page.cta.buttons.map((button, index) => (
                <Link key={`${button.label}-${index}`} href={button.href}>
                  <motion.button
                    className="min-h-[44px] rounded-full border-2 border-accent-orange bg-transparent px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:bg-accent-orange/10 hover:glow-orange touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {button.label}
                  </motion.button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
