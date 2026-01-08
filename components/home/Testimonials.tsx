"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";
import TiltCard from "@/components/ui/TiltCard";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  badge: string;
  accent: "orange" | "purple" | "cyan";
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Lucky Studios turned our raw idea into a charting show. Their team pushes for quality and it shows in every episode.",
    name: "Maya Reid",
    role: "Host, Behind the Screens",
    badge: "Creator",
    accent: "orange",
  },
  {
    quote:
      "We partnered on Back Post and saw the strongest brand lift of our season. The storytelling is unreal.",
    name: "Tom Alvarez",
    role: "Partnerships Lead, William Hill",
    badge: "Brand",
    accent: "purple",
  },
  {
    quote:
      "From concept to launch, the studio made everything feel effortless. The audio quality is next level.",
    name: "Sophie Grant",
    role: "Founder, Abby Boom",
    badge: "Studio",
    accent: "cyan",
  },
];

const accentStyles = {
  orange: {
    text: "text-accent-orange",
    border: "border-accent-orange/40",
    glow: "hover:glow-orange",
    orb: "bg-accent-orange/20",
  },
  purple: {
    text: "text-accent-purple",
    border: "border-accent-purple/40",
    glow: "hover:glow-purple",
    orb: "bg-accent-purple/20",
  },
  cyan: {
    text: "text-accent-cyan",
    border: "border-accent-cyan/40",
    glow: "hover:glow-cyan",
    orb: "bg-accent-cyan/20",
  },
};

export default function Testimonials() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scanlineY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const clipTop = useTransform(scrollYProgress, [0, 0.2], ["100%", "0%"]);
  const clipBottom = useTransform(scrollYProgress, [0.8, 1], ["0%", "100%"]);
  const clipPath = useTransform(
    [clipTop, clipBottom],
    ([top, bottom]) => `inset(${top} 0% ${bottom} 0%)`
  );

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-24 md:py-32">
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-accent-purple/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent-cyan/10 blur-3xl" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-tech-grid opacity-12"
        style={{ y: gridY }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-scanlines opacity-10"
        style={{ y: scanlineY }}
      />

      <motion.div style={{ clipPath }} className="relative">
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center sm:mb-16"
          >
            <p className="mb-3 font-heading text-sm uppercase tracking-[0.4em] text-text-muted">
              Proof of the Lucky Effect
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
              Loved by{" "}
              <span className="text-gradient-accent">Creators</span> and Brands
            </h2>
            <p className="mt-4 font-body text-base text-text-secondary sm:text-lg">
              Real stories from partners who trusted us with their next hit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => {
              const styles = accentStyles[testimonial.accent];
              const offsetX = index % 2 === 0 ? -24 : 24;
              return (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20, x: offsetX }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4,
                    }}
                  >
                    <TiltCard
                      className={`group relative h-full rounded-2xl border bg-background-secondary/70 p-8 backdrop-blur-sm transition-all duration-300 ${styles.border} ${styles.glow}`}
                      glowClassName="rounded-2xl mix-blend-screen"
                      maxTilt={7}
                      glowSize={360}
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <span
                          className={`rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest ${styles.text}`}
                        >
                          {testimonial.badge}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={`${testimonial.name}-star-${starIndex}`}
                              className={`h-4 w-4 ${styles.text}`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mb-8 font-body text-lg text-white">
                        “{testimonial.quote}”
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <p className="font-heading text-base font-semibold text-white">
                            {testimonial.name}
                          </p>
                          <p className="font-body text-sm text-text-secondary">
                            {testimonial.role}
                          </p>
                        </div>
                        <div
                          className={`h-12 w-12 rounded-full ${styles.orb} transition-transform duration-300 group-hover:scale-110`}
                        />
                      </div>
                    </TiltCard>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
