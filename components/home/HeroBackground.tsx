"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";
import {
  defaultHomepageContent,
  type HeroImage,
  type HeroVideoContent,
} from "@/lib/data/homepageContent";

interface HeroBackgroundProps {
  mainImage: HeroImage;
  fallbackImage?: HeroImage;
  backgroundVideo?: HeroVideoContent;
}

export default function HeroBackground({
  mainImage,
  fallbackImage = defaultHomepageContent.hero.accentImage,
  backgroundVideo = defaultHomepageContent.hero.backgroundVideo,
}: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());
  const [videoFailed, setVideoFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.01]);
  const imageSources = useMemo(
    () => [mainImage, fallbackImage],
    [mainImage, fallbackImage]
  );
  const availableIndices = useMemo(
    () =>
      imageSources
        .map((_, index) => index)
        .filter((index) => !failedIndices.has(index)),
    [failedIndices, imageSources]
  );
  const activeIndex = availableIndices[0];
  const activeImage =
    activeIndex === undefined ? undefined : imageSources[activeIndex];
  const showVideo =
    Boolean(backgroundVideo.enabled && backgroundVideo.src) &&
    !videoFailed &&
    !shouldReduceMotion;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      <div className="absolute inset-0 bg-background" />

      <div className="absolute inset-0">
        <motion.div
          className="absolute -left-24 top-24 h-[430px] w-[430px] rounded-full bg-accent-amber/25 blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : { opacity: [0.28, 0.46, 0.28], scale: [1, 1.12, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.div
          className="absolute -right-24 bottom-20 h-[390px] w-[390px] rounded-full bg-accent-gold/22 blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : { opacity: [0.24, 0.4, 0.24], scale: [1, 1.1, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }
          }
        />
      </div>

      {(activeImage || showVideo) && (
        <motion.div
          className="absolute inset-0"
          style={
            shouldReduceMotion
              ? { scale: 1 }
              : { y: imageY, scale: imageScale }
          }
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {showVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={backgroundVideo.poster || activeImage?.src || mainImage.src}
              aria-label={backgroundVideo.alt || "Hero background video"}
              onError={() => setVideoFailed(true)}
            >
              <source src={backgroundVideo.src} />
            </video>
          ) : (
            activeImage && (
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
                onError={() =>
                  setFailedIndices((previous) =>
                    activeIndex === undefined
                      ? previous
                      : new Set(previous).add(activeIndex)
                  )
                }
              />
            )
          )}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/48 to-background/96" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/94 via-background/78 to-background/32" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.76)_100%)]" />
      <div className="hero-noise absolute inset-0 opacity-[0.03]" />
    </div>
  );
}
