"use client";

import { MotionConfig, motion } from "motion/react";
import Hero from "@/components/home/Hero";
import TransformationSection from "@/components/home/TransformationSection";
import ShowsGrid from "@/components/home/ShowsGrid";
import StatsBar from "@/components/home/StatsBar";
import Pathways from "@/components/home/Pathways";
import ProductionSystem from "@/components/home/ProductionSystem";
import ProblemSection from "@/components/home/ProblemSection";
import CaseStudies from "@/components/home/CaseStudies";
import HomepageFaq from "@/components/home/HomepageFaq";
import type { HomepageContent } from "@/lib/data/homepageContent";
import type { Show } from "@/lib/data/shows";

interface HomeClientProps {
  content: HomepageContent;
  shows: Show[];
  consultationHref: string;
}

export default function HomeClient({
  content,
  shows,
  consultationHref,
}: HomeClientProps) {
  const consultationTarget = /^https?:\/\//i.test(consultationHref)
    ? "_blank"
    : undefined;
  const consultationRel = consultationTarget ? "noopener noreferrer" : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen overflow-hidden bg-background">
        <Hero content={content.hero} consultationHref={consultationHref} />
        <StatsBar />
        <ProblemSection />
        <ProductionSystem consultationHref={consultationHref} />
        <ShowsGrid shows={shows} />
        <TransformationSection content={content.transformation} />
        <CaseStudies />
        <Pathways />
        <HomepageFaq />

        <section className="relative overflow-hidden px-4 pb-24 pt-10 md:pb-32 md:pt-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px] bg-[radial-gradient(circle_at_50%_75%,rgba(245,158,11,0.24),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-accent-orange/30 bg-[linear-gradient(120deg,rgba(245,158,11,0.16),rgba(22,22,24,0.96)_38%,rgba(10,10,11,0.98))] px-6 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.42)] sm:px-10 md:px-20 md:py-20"
          >
            <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent-orange/25 blur-3xl" />
            <div className="relative z-10">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
                Start a conversation
              </p>
              <h2 className="mx-auto mb-5 max-w-4xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
                Got a creator, brand or idea that could become a show?
              </h2>
              <p className="mx-auto mb-9 max-w-2xl font-body text-base leading-relaxed text-white/70 sm:text-lg">
                We will help shape the format, build the production plan and
                turn every recording into a full content pipeline.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={consultationHref}
                  target={consultationTarget}
                  rel={consultationRel}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-accent-orange px-8 py-3.5 font-heading text-base font-semibold text-white shadow-[0_12px_40px_rgba(245,158,11,0.28)] transition hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                >
                  Start building
                </a>
                <a
                  href="/contact?intent=idea"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-8 py-3.5 font-heading text-base font-semibold text-white transition hover:border-accent-orange/45 hover:bg-accent-orange/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                >
                  Send us your idea
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        </section>
      </main>
    </MotionConfig>
  );
}
