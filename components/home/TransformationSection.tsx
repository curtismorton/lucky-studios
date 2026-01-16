"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Skeleton from "@/components/ui/Skeleton";

interface Transformation {
  show: string;
  showName: string;
  rawImage: string;
  polishedImage: string;
  title: string;
  description: string[];
}

const transformations: Transformation[] = [
  {
    show: "backpost",
    showName: "Back Post",
    rawImage: "/images/Group_thumb-29.jpg",
    polishedImage: "/images/COVER-ART__1_.png",
    title: "From Studio Session to Spotify Top 10",
    description: [
      "What started as three mates talking football in our Bermondsey studio became one of the fastest-growing football podcasts in the UK. The raw energy of the recording translates into polished content that resonates with fans.",
      "Every episode goes through our full production pipeline—professional audio mixing, clip creation for socials, thumbnail design, and strategic distribution across platforms.",
    ],
  },
  {
    show: "dgms",
    showName: "Don't Get Me Started",
    rawImage: "/images/ROW08813.jpg",
    polishedImage: "/images/VER1__1_.png",
    title: "Authentic Conversations, Professional Production",
    description: [
      "Abby Boom brings the passion—we bring the production value. The magic happens when genuine enthusiasm meets world-class audio and visual quality.",
      "Our 8-camera setup captures every reaction, giving editors the flexibility to create dynamic content that keeps audiences engaged across long-form and short-form formats.",
    ],
  },
];

function TransformationImage({
  src,
  alt,
  className,
  fallbackGradient,
}: {
  src: string;
  alt: string;
  className: string;
  fallbackGradient: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="absolute inset-0">
      {/* Fallback gradient */}
      <div
        className="absolute inset-0"
        style={{ background: fallbackGradient }}
      />
      
      {/* Loading skeleton */}
      {isLoading && !imageError && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full" variant="rectangular" />
        </div>
      )}

      {/* Image */}
      {!imageError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`${className} z-20`}
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageError(true);
          }}
        />
      )}
    </div>
  );
}

export default function TransformationSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            From Raw Footage to{" "}
            <span className="text-gradient-accent">Chart-Topping Content</span>
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            We don't just record podcasts—we craft them. See the transformation
            from studio session to finished product.
          </p>
        </motion.div>

        {/* Transformation Cards */}
        <div className="flex flex-col gap-24 md:gap-32">
          {transformations.map((transformation, index) => (
            <TransformationCard
              key={transformation.show}
              transformation={transformation}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TransformationCard({
  transformation,
  index,
}: {
  transformation: Transformation;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start 0.75", "start 0.25"],
  });

  // Transform progress: starts when element is 75% from top, completes at 25% from top
  const clipProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const handlePosition = useTransform(clipProgress, (value) => `${Math.max(0, Math.min(100, value))}%`);
  const clipPathValue = useTransform(clipProgress, (value) => `inset(0 ${Math.max(0, 100 - value)}% 0 0)`);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`grid gap-8 md:grid-cols-2 md:gap-16 ${
        !isEven ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
      }`}
    >
      {/* Images */}
      <div ref={imageRef} className="relative">
        <div className="relative h-[300px] overflow-hidden rounded-2xl shadow-2xl sm:h-[400px] md:h-[450px]">
          {/* Fallback gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-background-tertiary via-background-secondary to-background-tertiary" />
          
          {/* Raw Image */}
          <TransformationImage
            src={transformation.rawImage}
            alt={`Raw photoshoot - ${transformation.showName}`}
            className="object-cover grayscale-[20%] brightness-90"
            fallbackGradient="linear-gradient(135deg, rgba(22, 22, 22, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)"
          />

          {/* Polished Image with clip-path */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: clipPathValue,
            }}
          >
            <TransformationImage
              src={transformation.polishedImage}
              alt={`Final cover - ${transformation.showName}`}
              className="object-cover"
              fallbackGradient="linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)"
            />
          </motion.div>

          {/* Slider Handle */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-accent-amber z-10 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            style={{ left: handlePosition }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-accent-amber shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex items-center justify-center">
              <span className="text-background font-bold text-lg">↔</span>
            </div>
          </motion.div>
        </div>

        {/* Labels */}
        <div className="mt-6 flex justify-between">
          <motion.span
            className="font-heading text-sm uppercase tracking-wider"
            style={{
              color: useTransform(
                clipProgress,
                (value) => (value < 50 ? "#F59E0B" : "#666666")
              ),
            }}
          >
            Raw Photoshoot
          </motion.span>
          <motion.span
            className="font-heading text-sm uppercase tracking-wider"
            style={{
              color: useTransform(
                clipProgress,
                (value) => (value >= 50 ? "#F59E0B" : "#666666")
              ),
            }}
          >
            Final Cover
          </motion.span>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 text-sm font-medium text-accent-amber">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          {transformation.showName}
        </span>
        <h3 className="mb-4 font-heading text-2xl font-bold md:text-3xl">
          {transformation.title}
        </h3>
        {transformation.description.map((paragraph, pIndex) => (
          <p
            key={pIndex}
            className="mb-4 font-body text-text-secondary leading-relaxed last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

