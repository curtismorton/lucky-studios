"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useTilt } from "@/lib/hooks/useTilt";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  wrapperClassName?: string;
  perspective?: number;
  maxTilt?: number;
  glowSize?: number;
  glowClassName?: string;
}

export default function TiltCard({
  wrapperClassName = "",
  perspective = 1200,
  maxTilt = 10,
  glowSize = 420,
  glowClassName = "",
  className = "",
  style,
  onMouseMove,
  onMouseLeave,
  children,
  ...props
}: TiltCardProps) {
  const { rotateX, rotateY, glow, handleMouseMove, handleMouseLeave } = useTilt({
    max: maxTilt,
    glowSize,
  });

  return (
    <div
      className={`relative ${wrapperClassName}`}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        {...props}
        className={`relative ${className}`}
        style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={(event) => {
          handleMouseMove(event);
          onMouseMove?.(event);
        }}
        onMouseLeave={(event) => {
          handleMouseLeave();
          onMouseLeave?.(event);
        }}
      >
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${glowClassName}`}
          style={{ background: glow }}
        />
        {children}
      </motion.div>
    </div>
  );
}
