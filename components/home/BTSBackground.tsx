"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BTSImage {
  src: string;
  alt: string;
  delay: number;
}

const btsImages: BTSImage[] = [
  { src: "/images/Pod_shots_-07__1_.jpg", alt: "Podcast recording", delay: 0 },
  { src: "/images/Set_Shots-11__3_.jpg", alt: "Studio setup", delay: -2 },
  { src: "/images/Pod_shots_-17__1_.jpg", alt: "Recording session", delay: -4 },
  { src: "/images/ROW08557.jpg", alt: "Behind the scenes", delay: -6 },
  { src: "/images/Group_thumb-29.jpg", alt: "Team photo", delay: -8 },
];

export default function BTSBackground() {
  // Create a 4x3 grid (12 images total) by repeating the images
  const gridImages = Array.from({ length: 12 }, (_, i) => {
    const imageIndex = i % btsImages.length;
    return {
      ...btsImages[imageIndex],
      delay: btsImages[imageIndex].delay + (i * -2),
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-[10%] -left-[10%] -right-[10%] -bottom-[10%] grid grid-cols-4 grid-rows-3 gap-4 opacity-20 -rotate-[5deg] scale-[1.2]">
        {gridImages.map((image, index) => (
          <motion.div
            key={index}
            className="relative w-full h-full rounded-xl overflow-hidden"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.03, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: image.delay,
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover blur-[2px] grayscale-[30%]"
              sizes="(max-width: 768px) 25vw, 20vw"
              unoptimized
              onError={(e) => {
                // Fallback to gradient if image fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.style.background = 
                    "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)";
                }
              }}
            />
          </motion.div>
        ))}
      </div>
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background/98" />
      {/* Radial gradients for focus areas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(13,13,13,0.85)_0%,transparent_70%),radial-gradient(ellipse_at_70%_50%,rgba(13,13,13,0.9)_0%,transparent_70%)]" />
    </div>
  );
}

