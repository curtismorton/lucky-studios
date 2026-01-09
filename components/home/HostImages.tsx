"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface HostImage {
  src: string;
  alt: string;
  name?: string;
}

interface HostImagesProps {
  hosts?: HostImage[];
  radius?: number;
  className?: string;
}

function HostImageItem({ 
  host, 
  index, 
  angle, 
  radius 
}: { 
  host: HostImage; 
  index: number; 
  angle: number; 
  radius: number;
}) {
  const [imageError, setImageError] = useState(false);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
    >
      <motion.div
        className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full overflow-hidden border-2 border-accent-amber/50 shadow-lg"
        whileHover={{ scale: 1.1, borderColor: "#F59E0B" }}
        animate={{
          boxShadow: [
            "0 0 10px rgba(245, 158, 11, 0.3)",
            "0 0 20px rgba(245, 158, 11, 0.5)",
            "0 0 10px rgba(245, 158, 11, 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
      >
        {/* Placeholder fallback - always visible behind image */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/20 to-accent-gold/20 flex items-center justify-center z-0">
          <span className="text-accent-amber text-xs font-semibold">
            {host.name || `H${index + 1}`}
          </span>
        </div>
        {/* Host image - will be hidden if image fails to load */}
        {!imageError && (
          <Image
            src={host.src}
            alt={host.alt}
            fill
            className="object-cover z-10"
            sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
            onError={() => setImageError(true)}
            unoptimized
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function HostImages({ 
  hosts = [], 
  radius = 280,
  className = "" 
}: HostImagesProps) {
  // Default placeholder hosts if none provided
  const defaultHosts: HostImage[] = [
    { src: "/images/hosts/host1.jpg", alt: "Host 1", name: "H1" },
    { src: "/images/hosts/host2.jpg", alt: "Host 2", name: "H2" },
    { src: "/images/hosts/host3.jpg", alt: "Host 3", name: "H3" },
    { src: "/images/hosts/host4.jpg", alt: "Host 4", name: "H4" },
    { src: "/images/hosts/host5.jpg", alt: "Host 5", name: "H5" },
  ];
  
  const displayHosts = hosts.length > 0 ? hosts : defaultHosts;
  const angleStep = (2 * Math.PI) / displayHosts.length;

  return (
    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}>
      {displayHosts.map((host, index) => {
        const angle = index * angleStep - Math.PI / 2;
        return (
          <HostImageItem
            key={index}
            host={host}
            index={index}
            angle={angle}
            radius={radius}
          />
        );
      })}
    </div>
  );
}

