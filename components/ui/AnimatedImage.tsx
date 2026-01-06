"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "./Skeleton";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
}

export default function AnimatedImage({
  src,
  alt,
  className = "",
  skeletonClassName = "",
}: AnimatedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-background-tertiary ${className}`}
      >
        <span className="font-body text-sm text-text-muted">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton className={skeletonClassName} />
        </div>
      )}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className={`h-full w-full object-cover ${className}`}
      />
    </div>
  );
}

