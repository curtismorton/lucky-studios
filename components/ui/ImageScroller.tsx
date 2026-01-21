"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Skeleton from "@/components/ui/Skeleton";

interface ImageScrollerProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  imageClassName?: string;
}

export default function ImageScroller({
  images,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = "",
  imageClassName = "",
}: ImageScrollerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [imageLoadStates, setImageLoadStates] = useState<Map<number, boolean>>(
    new Map()
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images];

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const handleImageLoad = (index: number) => {
    setImageLoadStates((prev) => new Map(prev).set(index, true));
  };

  // Animation duration based on speed (lower speed = faster animation)
  const duration = (images.length * 200) / speed;

  // Handle pause/resume with animation controls
  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        transition: {
          duration,
          repeat: Infinity,
          ease: "linear",
        },
      });
    }
  }, [isPaused, direction, duration, controls]);

  // Start animation on mount
  useEffect(() => {
    controls.start({
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        duration,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [direction, duration, controls]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        ref={scrollerRef}
        className="flex gap-4 md:gap-6"
        animate={controls}
      >
        {duplicatedImages.map((image, index) => {
          const hasError = imageErrors.has(index % images.length);
          const isLoading = !imageLoadStates.has(index % images.length);

          return (
            <div
              key={`${index}-${image.src}`}
              className="relative flex-shrink-0 w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] aspect-[4/3] rounded-xl overflow-hidden group"
            >
              {/* Fallback gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/10 via-accent-amber/5 to-accent-gold/10" />

              {/* Loading skeleton */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 z-10">
                  <Skeleton className="h-full w-full" variant="rectangular" />
                </div>
              )}

              {/* Image */}
              {!hasError && (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`object-cover transition-transform duration-300 group-hover:scale-110 ${imageClassName}`}
                  sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 350px"
                  unoptimized
                  onLoad={() => handleImageLoad(index % images.length)}
                  onError={() => handleImageError(index % images.length)}
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-20" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}