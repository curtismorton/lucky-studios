"use client";

import { motion, MotionProps } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

interface AnimateOnScrollProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}

export default function AnimateOnScroll({
  children,
  className,
  stagger = false,
  delay = 0,
  ...props
}: AnimateOnScrollProps) {
  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

