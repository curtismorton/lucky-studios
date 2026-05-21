"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import Image from "next/image";
import {
  defaultHomepageContent,
  type TransformationContent,
  type TransformationItem,
} from "@/lib/data/homepageContent";

interface TransformationSectionProps {
  content?: TransformationContent;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const SAFE_START_OFFSET_MIN = 0.68;
const SAFE_START_OFFSET_MAX = 0.9;
const SAFE_END_OFFSET_MIN = 0.42;
const SAFE_SCROLL_WINDOW = 0.2;
const MIN_VISIBLE_POLISHED = 44;

export default function TransformationSection({
  content,
}: TransformationSectionProps) {
  const transformationContent = content || defaultHomepageContent.transformation;

  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-16 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            Production Pipeline
          </p>
          <h2 className="mx-auto mb-5 max-w-5xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            Raw studio moments, engineered into{" "}
            <span className="text-gradient-accent">finished media assets.</span>
          </h2>
          <p className="mx-auto max-w-3xl font-body text-lg leading-relaxed text-text-secondary">
            Compare the clean studio capture with the finished creative output: artwork,
            format, positioning, and the production polish that makes each show feel
            launch-ready.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24 md:gap-32">
          {transformationContent.items.map((transformation, index) => (
            <TransformationCard
              key={transformation.show}
              transformation={transformation}
              index={index}
              sliderConfig={transformationContent.slider}
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
  sliderConfig,
}: {
  transformation: TransformationItem;
  index: number;
  sliderConfig: TransformationContent["slider"];
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const [progress, setProgress] = useState(MIN_VISIBLE_POLISHED);

  // Keep the reveal completing while most of the card is still in view.
  const startOffset = clamp(
    sliderConfig.startOffset,
    SAFE_START_OFFSET_MIN,
    SAFE_START_OFFSET_MAX
  );
  const endOffset = clamp(
    sliderConfig.endOffset,
    SAFE_END_OFFSET_MIN,
    Math.max(SAFE_END_OFFSET_MIN, startOffset - SAFE_SCROLL_WINDOW)
  );

  const { scrollYProgress } = useScroll({
    target: imageRef,
    // Complete the scroll reveal before the slider nears the top edge.
    offset: [`start ${startOffset}`, `end ${endOffset}`],
  });

  const syncProgressFromScroll = useCallback(() => {
    if (isDraggingRef.current) return;

    const next = scrollYProgress.get();
    if (!Number.isFinite(next)) return;

    setProgress(clamp(next * 100, MIN_VISIBLE_POLISHED, 100));
  }, [scrollYProgress]);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;

    const scheduleSync = () => {
      firstFrame = window.requestAnimationFrame(() => {
        syncProgressFromScroll();
        secondFrame = window.requestAnimationFrame(syncProgressFromScroll);
      });
    };

    scheduleSync();
    window.addEventListener("load", scheduleSync);
    window.addEventListener("resize", syncProgressFromScroll);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("load", scheduleSync);
      window.removeEventListener("resize", syncProgressFromScroll);
    };
  }, [syncProgressFromScroll]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (isDraggingRef.current || !Number.isFinite(value)) return;
    setProgress(clamp(value * 100, MIN_VISIBLE_POLISHED, 100));
  });

  const updateProgressFromPointer = (clientX: number) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setProgress(clamp(next, 0, 100));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!sliderConfig.manualEnabled) return;
    if (!event.isPrimary) return;

    activePointerId.current = event.pointerId;
    isDraggingRef.current = true;
    updateProgressFromPointer(event.clientX);
    if (event.currentTarget) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!sliderConfig.manualEnabled) return;
    if (activePointerId.current !== event.pointerId) return;
    updateProgressFromPointer(event.clientX);
  };

  const endDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;

    if (event.currentTarget?.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activePointerId.current = null;
    isDraggingRef.current = false;
    window.requestAnimationFrame(syncProgressFromScroll);
  };

  const handlePosition = `${progress}%`;
  const clipPath = `inset(0 ${100 - progress}% 0 0)`;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] md:gap-16 ${
        !isEven ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
      }`}
    >
      <div ref={imageRef} className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(5,5,6,0.95)_40%,rgba(245,158,11,0.12))] p-3 shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Asset Compare
              </p>
              <p className="font-heading text-sm font-semibold text-white">
                {transformation.showName}
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-amber">
              Studio to Launch
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-xl border border-white/10 bg-black sm:h-[400px] md:h-[450px]">
          <Image
            src={transformation.rawImage}
            alt=""
            fill
            aria-hidden="true"
            className="scale-110 object-cover opacity-25 blur-xl grayscale"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0">
            <Image
              src={transformation.rawImage}
              alt={`Raw photoshoot - ${transformation.showName}`}
              fill
              className="object-contain grayscale-[20%] brightness-90"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.style.background =
                    "linear-gradient(135deg, rgba(22, 22, 22, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)";
                }
              }}
            />
          </div>

          <motion.div className="absolute inset-0" style={{ clipPath }}>
            <Image
              src={transformation.polishedImage}
              alt=""
              fill
              aria-hidden="true"
              className="scale-110 object-cover opacity-30 blur-xl saturate-150"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <Image
              src={transformation.polishedImage}
              alt={`Final cover - ${transformation.showName}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.style.background =
                    "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)";
                }
              }}
            />
          </motion.div>

          <div
            className="absolute bottom-4 left-4 z-20 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
          >
            {sliderConfig.manualEnabled ? "Drag the handle" : "Scroll to compare"}
          </div>

          <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
            Clean Capture
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-accent-amber/30 bg-accent-amber/15 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-amber backdrop-blur">
            Finished Asset
          </div>

          {sliderConfig.manualEnabled && (
            <div
              className="absolute inset-0 z-20 cursor-ew-resize touch-pan-y"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDragging}
              onPointerCancel={endDragging}
              aria-label="Drag to compare raw and polished artwork"
            />
          )}

          <motion.div
            className="absolute bottom-0 top-0 z-30 w-px bg-white/80 shadow-[0_0_24px_rgba(245,158,11,0.8)]"
            style={{ left: handlePosition }}
          >
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDragging}
              onPointerCancel={endDragging}
              className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-accent-amber text-background shadow-[0_12px_40px_rgba(245,158,11,0.48)] ${
                sliderConfig.manualEnabled ? "cursor-ew-resize touch-pan-y" : "cursor-default"
              }`}
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 7 3 12l5 5" />
                <path d="M16 7l5 5-5 5" />
                <path d="M3 12h18" />
              </svg>
            </div>
          </motion.div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <span
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-center font-body text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: progress < 50 ? "#F59E0B" : "rgba(255,255,255,0.48)" }}
          >
            Raw Studio
          </span>
          <span
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-center font-body text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: progress >= 50 ? "#F59E0B" : "rgba(255,255,255,0.48)" }}
          >
            Finished Creative
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent-amber/30 bg-accent-amber/10 px-4 py-2 text-sm font-medium text-accent-amber">
          <span className="h-2 w-2 rounded-full bg-accent-amber shadow-[0_0_18px_rgba(245,158,11,0.75)]" />
          {transformation.showName}
        </span>
        <h3 className="mb-4 font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
          {transformation.title}
        </h3>
        {transformation.description.map((paragraph, paragraphIndex) => (
          <p
            key={paragraphIndex}
            className="mb-4 font-body text-text-secondary leading-relaxed last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
