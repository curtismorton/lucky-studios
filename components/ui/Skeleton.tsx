"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
}: SkeletonProps) {
  const baseClasses = "bg-background-tertiary rounded";
  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full aspect-square",
    rectangular: "w-full",
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

