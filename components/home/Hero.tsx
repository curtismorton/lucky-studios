"use client";

import { motion } from "framer-motion";
import { Play, Phone } from "lucide-react";
import Link from "next/link";
import { buttonHover, buttonTap } from "@/lib/animations";
import FeaturedShowCard from "@/components/home/FeaturedShowCard";
import HeroBackground from "@/components/home/HeroBackground";
import HeroPhotoStack from "@/components/home/HeroPhotoStack";
import HeroSignalHorizon from "@/components/home/HeroSignalHorizon";
import { site } from "@/lib/data/site";

export default function Hero() {
  const bookingHref = site.calendlyUrl || "/contact";
  const bookingTarget = site.calendlyUrl ? "_blank" : undefined;
  const bookingRel = site.calendlyUrl ? "noopener noreferrer" : undefined;

  const primaryCtaContent = (
    <motion.span
      className="group relative flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full bg-accent-amber px-8 py-4 font-heading text-base font-semibold text-white shadow-[0_4px_24px_rgba(245,158,11,0.28)] transition-all duration-300 hover:glow-amber touch-manipulation"
      whileHover={buttonHover}
      whileTap={buttonTap}
    >
      <Phone className="h-5 w-5" />
      <span>Book a Call</span>
    </motion.span>
  );

  const primaryCta = site.calendlyUrl ? (
    <a
      href={bookingHref}
      target={bookingTarget}
      rel={bookingRel}
      className="inline-block"
    >
      {primaryCtaContent}
    </a>
  ) : (
    <Link href={bookingHref} className="inline-block">
      {primaryCtaContent}
    </Link>
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pb-24 pt-28 px-4 md:px-8 md:pt-32">
      <HeroBackground />
      <HeroSignalHorizon />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-6 flex justify-center md:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-text-secondary backdrop-blur">
                Bermondsey, London <span className="text-text-muted">•</span>{" "}
                Podcast Production <span className="text-text-muted">•</span>{" "}
                Growth
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="mb-6 font-heading font-bold leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(3.1rem, 6vw, 5.35rem)" }}
            >
              <span className="block">We build</span>
              <span className="block">podcasts that</span>
              <span className="block">
                <span className="relative inline-block text-gradient-accent after:absolute after:-bottom-2 after:left-0 after:h-[6px] after:w-full after:rounded-full after:bg-gradient-accent after:opacity-38 after:content-['']">
                  top the charts.
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="mb-10 mx-auto max-w-lg font-body text-lg leading-relaxed text-text-secondary md:mx-0"
            >
              Full-service podcast production in London Bridge. Strategy,
              recording, distribution, and growth under one roof.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col flex-wrap items-stretch justify-center gap-4 sm:flex-row sm:items-center md:justify-start"
            >
              {primaryCta}
              <Link href="/shows" className="inline-block">
                <motion.span
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/10 bg-background/25 px-8 py-4 font-heading text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:border-accent-amber hover:bg-accent-amber/10 touch-manipulation"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Play className="h-5 w-5" />
                  <span>Explore Shows</span>
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <div className="mx-auto max-w-md md:max-w-none">
            <HeroPhotoStack>
              <FeaturedShowCard />
            </HeroPhotoStack>
          </div>
        </div>
      </div>
    </section>
  );
}

