"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  defaultHomepageContent,
  type TransformationContent,
  type TransformationItem,
} from "@/lib/data/homepageContent";

interface TransformationSectionProps {
  content?: TransformationContent;
}

const outputs = [
  "Full YouTube episode",
  "Spotify episode",
  "Audio podcast",
  "Short form clips",
  "Thumbnails",
  "Titles and descriptions",
  "Guest social assets",
  "Sponsor cutdowns",
  "Newsletter or LinkedIn snippets",
  "Analytics insights",
] as const;

const imageFocusByShow: Record<
  string,
  { rawPosition: string; polishedPosition: string }
> = {
  backpost: {
    rawPosition: "50% 46%",
    polishedPosition: "50% 50%",
  },
  dgms: {
    rawPosition: "50% 38%",
    polishedPosition: "50% 42%",
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function TransformationSection({
  content,
}: TransformationSectionProps) {
  const transformationContent = content || defaultHomepageContent.transformation;

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-12 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.13),transparent_48%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 max-w-4xl md:mb-16"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            Content engine
          </p>
          <h2 className="mb-5 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            One recording. A full content engine.
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
            A studio session should not end with one upload. We turn every
            recording into a complete platform package.
          </p>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[minmax(420px,0.96fr)_minmax(440px,1.04fr)] xl:items-start">
          <div className="space-y-5">
            {transformationContent.items.slice(0, 2).map((item, index) => (
              <ComparisonCard
                key={item.show}
                transformation={item}
                index={index}
                manualEnabled={transformationContent.slider.manualEnabled}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-8"
          >
            <div className="mb-8 flex items-center gap-4 rounded-2xl border border-accent-orange/25 bg-accent-orange/[0.07] p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-orange font-heading text-sm font-bold text-white">
                01
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-orange">
                  Studio recording
                </p>
                <p className="mt-1 text-sm text-white/68">
                  One captured session enters the pipeline.
                </p>
              </div>
            </div>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                Platform outputs
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {outputs.map((output, index) => (
                <li
                  key={output}
                  className="flex min-h-[58px] items-center gap-3 rounded-xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white/72"
                >
                  <span className="font-heading text-xs font-semibold text-accent-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {output}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ComparisonCard({
  transformation,
  index,
  manualEnabled,
}: {
  transformation: TransformationItem;
  index: number;
  manualEnabled: boolean;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const [progress, setProgress] = useState(14);
  const imageFocus = imageFocusByShow[transformation.show] ?? {
    rawPosition: "50% 50%",
    polishedPosition: "50% 50%",
  };

  const updateProgressFromPointer = (clientX: number) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    setProgress(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!manualEnabled || !event.isPrimary) return;
    activePointerId.current = event.pointerId;
    updateProgressFromPointer(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    updateProgressFromPointer(event.clientX);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activePointerId.current = null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!manualEnabled) return;
    let nextProgress = progress;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextProgress = progress - 5;
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextProgress = progress + 5;
    } else if (event.key === "Home") {
      nextProgress = 0;
    } else if (event.key === "End") {
      nextProgress = 100;
    } else {
      return;
    }
    event.preventDefault();
    setProgress(clamp(nextProgress, 0, 100));
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="rounded-3xl border border-white/10 bg-white/[0.035] p-3"
    >
      <div ref={imageRef} className="relative h-[255px] overflow-hidden rounded-2xl bg-black sm:h-[330px]">
        <Image
          src={transformation.rawImage}
          alt={`${transformation.showName} studio recording`}
          fill
          sizes="(max-width: 1280px) 100vw, 46vw"
          className="object-cover"
          style={{ objectPosition: imageFocus.rawPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/45" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
        >
          <Image
            src={transformation.polishedImage}
            alt={`${transformation.showName} finished media asset`}
            fill
            sizes="(max-width: 1280px) 100vw, 46vw"
            className="object-cover"
            style={{ objectPosition: imageFocus.polishedPosition }}
          />
        </div>
        <span className="absolute left-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm">
          Studio
        </span>
        <span className="absolute right-4 top-4 z-10 rounded-full bg-accent-orange/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-accent-orange backdrop-blur-sm">
          Packaged
        </span>
        {manualEnabled ? (
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Compare studio capture and packaged asset for ${transformation.showName}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="absolute inset-0 z-20 cursor-ew-resize touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-orange"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onKeyDown={handleKeyDown}
          >
            <span
              className="absolute bottom-0 top-0 w-px bg-white/90 shadow-[0_0_18px_rgba(245,158,11,0.7)]"
              style={{ left: `${progress}%` }}
            >
              <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-semibold text-background shadow-xl">
                &lt;&gt;
              </span>
            </span>
          </div>
        ) : null}
      </div>
      <figcaption className="flex items-center justify-between gap-4 px-3 pb-2 pt-4 text-sm">
        <span className="font-heading font-semibold text-white">
          {transformation.showName}
        </span>
        <span className="text-white/52">
          {manualEnabled ? "Drag or use arrow keys to compare" : "Studio to packaged asset"}
        </span>
      </figcaption>
    </motion.figure>
  );
}
