"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { heroImages } from "@/lib/data/heroImages";

interface HeroPhotoStackProps {
  children: ReactNode;
  className?: string;
}

type StackImage = {
  id: number;
  src: string;
  alt: string;
  frameClassName: string;
};

export default function HeroPhotoStack({
  children,
  className = "",
}: HeroPhotoStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || heroImages.length <= 3) return;

    const interval = setInterval(() => {
      setStartIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const stackImages = useMemo<StackImage[]>(() => {
    if (heroImages.length === 0) return [];

    const frameClassNames = [
      "absolute -left-10 -top-12 w-56 rotate-[-8deg] md:w-64",
      "absolute -bottom-12 -right-10 w-52 rotate-[6deg] md:w-60",
      "absolute -top-16 right-10 hidden w-44 rotate-[3deg] lg:block",
    ];

    return frameClassNames.map((frameClassName, frameIndex) => {
      const imageIndex = (startIndex + frameIndex + 1) % heroImages.length;
      const image = heroImages[imageIndex];

      return {
        id: imageIndex,
        src: image.src,
        alt: image.alt,
        frameClassName,
      };
    });
  }, [startIndex]);

  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block"
      >
        {stackImages.map((image, index) => {
          if (failedImages.has(image.src)) return null;

          return (
            <motion.div
              key={`${image.id}-${image.src}`}
              className={image.frameClassName}
              initial={{ opacity: 0, y: 16 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : {
                      opacity: 1,
                      y: [0, index === 0 ? -10 : -7, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.6, ease: "easeOut" }
                  : {
                      duration: 8 + index * 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <div className="rounded-2xl border border-white/10 bg-background/35 p-2 shadow-2xl backdrop-blur-md">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/12 via-accent-amber/6 to-accent-gold/12" />
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="256px"
                    className="object-cover"
                    unoptimized
                    onError={() =>
                      setFailedImages((previous) => new Set(previous).add(image.src))
                    }
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {children}
    </div>
  );
}
