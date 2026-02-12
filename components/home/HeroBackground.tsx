"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { heroImages, type HeroImage } from "@/lib/data/heroImages";

interface HeroBackgroundProps {
  imageSources?: HeroImage[];
}

export default function HeroBackground({
  imageSources = heroImages,
}: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.1]);
  const availableIndices = useMemo(
    () =>
      imageSources
        .map((_, index) => index)
        .filter((index) => !failedIndices.has(index)),
    [failedIndices, imageSources]
  );
  const hasAnyImage = availableIndices.length > 0;

  useEffect(() => {
    if (!hasAnyImage) return;
    if (availableIndices.includes(activeIndex)) return;
    setActiveIndex(availableIndices[0]);
  }, [activeIndex, availableIndices, hasAnyImage]);

  useEffect(() => {
    if (shouldReduceMotion || availableIndices.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const currentPosition = availableIndices.indexOf(currentIndex);
        const safePosition = currentPosition === -1 ? 0 : currentPosition;
        return availableIndices[(safePosition + 1) % availableIndices.length];
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [availableIndices, shouldReduceMotion]);

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

      {hasAnyImage &&
        imageSources.map((image, index) => {
          if (failedIndices.has(index)) return null;

          const showAsActive = shouldReduceMotion
            ? index === availableIndices[0]
            : index === activeIndex;

          return (
            <motion.div
              key={image.src}
              className="absolute inset-0"
              style={
                shouldReduceMotion
                  ? { scale: 1.05 }
                  : { y: imageY, scale: imageScale }
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: showAsActive ? 1 : 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                unoptimized
                onError={() =>
                  setFailedIndices((previous) => new Set(previous).add(index))
                }
              />
              <div className="absolute inset-0 bg-black/28" />
            </motion.div>
          );
        })}

      <div className="absolute inset-0 bg-gradient-to-b from-background/62 via-background/38 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/52" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.84)_75%)]" />
      <div className="hero-noise absolute inset-0 opacity-[0.035]" />
    </div>
  );
}
