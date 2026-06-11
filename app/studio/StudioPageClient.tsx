"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Camera,
  Mic,
  Video,
  Lightbulb,
  Wifi,
  Coffee,
  Download,
  MapPin,
  X,
  ArrowRight,
} from "lucide-react";
import { site } from "@/lib/data/site";
import {
  defaultMarketingPagesContent,
  type StudioPageContent,
} from "@/lib/data/marketingContent";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

interface StudioPageClientProps {
  content?: StudioPageContent;
}

const equipmentIcons = [Camera, Mic, Video, Lightbulb] as const;
const includedIcons = [Video, Coffee, Coffee, Wifi, Coffee, Download] as const;

export default function StudioPageClient({ content }: StudioPageClientProps) {
  const page = content || defaultMarketingPagesContent.studio;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = useMemo(
    () => page.gallery.images.filter((entry) => entry.trim().length > 0),
    [page.gallery.images]
  );

  const bookingHref = resolveConsultationHref(site.calendlyUrl);
  const isExternalBooking = /^https?:\/\//i.test(bookingHref);
  const bookingTarget = isExternalBooking ? "_blank" : undefined;
  const bookingRel = isExternalBooking ? "noopener noreferrer" : undefined;

  return (
    <main className="min-h-screen bg-background">
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-accent-cyan/10 via-transparent to-accent-orange/5" />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan">
              London Bridge Studio
            </p>
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              A studio built for shows, clips, and campaign assets.
            </h1>
            <p className="mb-4 font-body text-base leading-relaxed text-text-secondary sm:mb-6 sm:text-lg md:text-xl">
              Walk in with an idea and leave with clean multi-camera footage,
              broadcast audio, and a production team that knows how to package
              content for the platforms it needs to live on.
            </p>
            <div className="mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1.5 text-xs font-medium text-accent-cyan sm:px-4 sm:py-2 sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                {page.hero.locationBadge}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <motion.a
                href={bookingHref}
                target={bookingTarget}
                rel={bookingRel}
                className="min-h-[44px] rounded-full bg-accent-cyan px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-cyan touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Studio Walkthrough
              </motion.a>
              <motion.a
                href="/contact"
                className="min-h-[44px] rounded-full border-2 border-accent-cyan bg-transparent px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Talk Through a Shoot
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-4/3 w-full overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            {page.hero.heroImage ? (
              <Image
                src={page.hero.heroImage}
                alt={page.hero.heroImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-accent-cyan/30 via-accent-purple/30 to-accent-orange/30" />
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:mb-12 sm:text-4xl md:text-5xl">
            See the space before <span className="text-gradient-accent">you book it</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {(galleryImages.length > 0 ? galleryImages : Array.from({ length: 6 }).map(() => "")).map(
              (imageSrc, index) => (
                <motion.button
                  key={`${imageSrc || "placeholder"}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className="group relative aspect-square overflow-hidden rounded-xl touch-manipulation sm:rounded-2xl"
                  aria-label={`View studio image ${index + 1}`}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`Studio gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-accent-cyan/20 via-accent-purple/20 to-accent-orange/20 transition-transform duration-300 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                </motion.button>
              )
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedImageIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImageIndex(null)}
            >
              <motion.button
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 touch-manipulation"
                onClick={() => setSelectedImageIndex(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </motion.button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-h-[90vh] max-w-4xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="aspect-video w-full overflow-hidden rounded-2xl">
                  {galleryImages[selectedImageIndex] ? (
                    <Image
                      src={galleryImages[selectedImageIndex]}
                      alt={`Studio gallery lightbox ${selectedImageIndex + 1}`}
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-accent-cyan/30 via-accent-purple/30 to-accent-orange/30" />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:mb-12 sm:text-4xl md:text-5xl">
            Production-grade kit, <span className="text-gradient-accent">ready to roll</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {page.equipment.items.map((item, index) => {
              const Icon = equipmentIcons[index % equipmentIcons.length];
              return (
                <motion.div
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 backdrop-blur-xs transition-all duration-300 hover:border-accent-cyan/50 sm:p-6"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-accent-cyan/10 p-2.5 sm:p-3">
                    <Icon className="h-5 w-5 text-accent-cyan sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-white sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-text-secondary sm:text-sm">
                    {item.description}
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
        >
          <h2 className="mb-6 text-center font-heading text-3xl font-bold sm:mb-8 sm:text-4xl md:text-5xl">
            What is handled <span className="text-gradient-accent">on the day</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {page.included.items.map((item, index) => {
              const Icon = includedIcons[index % includedIcons.length];
              return (
                <motion.div
                  key={`${item}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-background-tertiary bg-background-secondary/50 p-4 backdrop-blur-xs sm:gap-4"
                >
                  <div className="shrink-0 rounded-lg bg-accent-cyan/10 p-2">
                    <Icon className="h-4 w-4 text-accent-cyan sm:h-5 sm:w-5" />
                  </div>
                  <span className="font-body text-sm text-text-secondary sm:text-base">
                    {item}
                  </span>
                </motion.div>
              );
            })}
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
            Choose the session <span className="text-gradient-accent">that fits the job</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {page.booking.options.map((option, index) => (
              <motion.div
                key={`${option.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-accent-cyan/50 sm:p-8"
              >
                <h3 className="mb-2 font-heading text-xl font-bold text-white sm:text-2xl">
                  {option.title}
                </h3>
                <p className="mb-3 font-heading text-lg font-semibold text-accent-cyan sm:mb-4 sm:text-xl">
                  {option.duration}
                </p>
                <p className="mb-4 font-body text-sm text-text-secondary sm:mb-6 sm:text-base">
                  {option.description}
                </p>
                <motion.a
                  href={bookingHref}
                  target={bookingTarget}
                  rel={bookingRel}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-full border-2 border-accent-cyan bg-transparent px-4 py-2.5 font-heading text-xs font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan touch-manipulation sm:px-6 sm:py-3 sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.ctaLabel}
                </motion.a>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 rounded-2xl border border-accent-purple/30 bg-accent-purple/10 p-4 text-center sm:mt-8 sm:p-6"
          >
            <p className="font-body text-xs text-text-secondary sm:text-sm">
              <span className="font-semibold text-accent-purple">{page.booking.memberNotePrefix}</span>{" "}
              {page.booking.memberNoteText}
            </p>
          </motion.div>
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
            Easy to reach, <span className="text-gradient-accent">easy to run</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <div className="h-full w-full bg-linear-to-br from-accent-cyan/20 via-accent-purple/20 to-accent-orange/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-body text-xs text-text-muted sm:text-sm">{page.location.mapLabel}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-4 sm:mb-6">
                <h3 className="mb-3 font-heading text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
                  Address
                </h3>
                <p className="font-body text-sm text-text-secondary sm:text-base">
                  {page.location.addressLines.map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < page.location.addressLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
                  Transport
                </h3>
                <ul className="space-y-2 font-body text-sm text-text-secondary sm:text-base">
                  {page.location.transportLines.map((line, index) => (
                    <li key={`${line}-${index}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-accent-cyan/30 bg-linear-to-br from-background-secondary to-background-tertiary p-8 text-center sm:rounded-3xl sm:p-12"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl">
              Want the studio and the production brain?
            </h2>
            <p className="mb-6 font-body text-base text-text-secondary sm:mb-8 sm:text-lg">
              Tell us what you need to capture. We will help shape the session
              around the show, campaign, or content run you are trying to make.
            </p>
            <div className="mx-auto max-w-2xl rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-xs sm:p-8">
              <p className="mb-4 font-body text-xs text-text-muted sm:text-sm">
                {page.cta.widgetHint}
              </p>
              <motion.a
                href={bookingHref}
                target={bookingTarget}
                rel={bookingRel}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent-cyan px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-cyan touch-manipulation sm:px-8 sm:py-4 sm:text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Planning the Session
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
