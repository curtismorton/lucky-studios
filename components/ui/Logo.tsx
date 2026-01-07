"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  variant?: "default" | "icon" | "text";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
  showLink?: boolean;
}

const sizeMap = {
  sm: { width: 120, height: 40 },
  md: { width: 180, height: 60 },
  lg: { width: 240, height: 80 },
  xl: { width: 320, height: 107 },
};

export default function Logo({
  variant = "default",
  size = "md",
  className = "",
  href = "/",
  showLink = true,
}: LogoProps) {
  const dimensions = sizeMap[size];
  
  // For PNG, we'll use a standard path - user will add the actual file
  const logoSrc = "/images/LOGO.png";
  
  const logoElement = (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Image
        src={logoSrc}
        alt="Lucky Studios Logo"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
        priority
      />
    </motion.div>
  );

  if (showLink) {
    return (
      <Link href={href} className="inline-block">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

