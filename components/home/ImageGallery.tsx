"use client";

import { motion } from "framer-motion";
import ImageScroller from "@/components/ui/ImageScroller";

// Studio and behind-the-scenes images
const studioImages = [
  { src: "/images/Pod_shots_-07__1_.jpg", alt: "Podcast recording session" },
  { src: "/images/Set_Shots-11__3_.jpg", alt: "Studio setup" },
  { src: "/images/Pod_shots_-17__1_.jpg", alt: "Recording in progress" },
  { src: "/images/ROW08557.jpg", alt: "Behind the scenes" },
  { src: "/images/Group_thumb-29.jpg", alt: "Team collaboration" },
  { src: "/images/ROW08813.jpg", alt: "Studio environment" },
];

export default function ImageGallery() {
  return (
    <section className="relative overflow-hidden bg-background-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Behind the{" "}
            <span className="text-gradient-accent">Scenes</span>
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            A glimpse into our Bermondsey studio where the magic happens
          </p>
        </motion.div>

        <div className="relative">
          {/* First scroller - left direction */}
          <ImageScroller
            images={studioImages}
            speed={40}
            direction="left"
            pauseOnHover={true}
            className="mb-8"
          />

          {/* Second scroller - right direction (reversed) for visual interest */}
          <ImageScroller
            images={[...studioImages].reverse()}
            speed={45}
            direction="right"
            pauseOnHover={true}
            className="opacity-90"
          />
        </div>
      </div>
    </section>
  );
}
