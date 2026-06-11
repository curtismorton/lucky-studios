"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroBackground from "@/components/home/HeroBackground";
import Logo from "@/components/ui/Logo";
import {
  defaultHomepageContent,
  type HeroContent,
} from "@/lib/data/homepageContent";

interface HeroProps {
  content?: HeroContent;
  consultationHref: string;
}

export default function Hero({ content, consultationHref }: HeroProps) {
  const heroContent = content || defaultHomepageContent.hero;
  const consultationTarget = /^https?:\/\//i.test(consultationHref)
    ? "_blank"
    : undefined;
  const consultationRel = consultationTarget ? "noopener noreferrer" : undefined;

  return (
    <header className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-8 pt-24 sm:px-6 lg:px-8">
      <HeroBackground
        mainImage={heroContent.mainBackground}
        fallbackImage={heroContent.accentImage}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-[720px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="mb-7"
          >
            <Logo size="md" showLink={false} className="max-w-[168px] sm:max-w-none" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.14, ease: "easeOut" }}
            className="mb-5 font-heading text-[clamp(2.45rem,5.7vw,4.7rem)] font-bold leading-[0.98] tracking-[-0.045em] text-white"
          >
            Build a show people actually come back to.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.23, ease: "easeOut" }}
            className="mb-4 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg"
          >
            Lucky Studios creates, produces and grows creator led podcasts for
            brands, talent and audiences that want more than another talking
            heads show.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mb-6 text-sm font-medium tracking-wide text-accent-orange sm:text-base"
          >
            Strategy. Studio production. Editing. Clips. Distribution. Growth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.36, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <a
              href={consultationHref}
              target={consultationTarget}
              rel={consultationRel}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-accent-orange px-8 py-3.5 font-heading text-base font-semibold text-white shadow-[0_16px_45px_rgba(245,158,11,0.28)] transition hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
            >
              Book a consultation
            </a>
            <Link
              href="/shows"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/22 bg-black/25 px-8 py-3.5 font-heading text-base font-semibold text-white backdrop-blur-sm transition hover:border-accent-orange/45 hover:bg-accent-orange/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
            >
              See the network
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.48 }}
            className="mt-5 text-sm text-white/60"
          >
            From raw studio moments to full platform ready media systems.
          </motion.p>
        </div>
      </div>
    </header>
  );
}
