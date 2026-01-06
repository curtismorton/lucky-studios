"use client";

import { motion, MotionProps } from "framer-motion";
import { buttonHover, buttonTap } from "@/lib/animations";
import { ReactNode } from "react";

interface ButtonProps extends MotionProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  color?: "orange" | "purple" | "cyan";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const variantStyles = {
  primary: {
    orange: "bg-accent-orange hover:glow-orange",
    purple: "bg-accent-purple hover:glow-purple",
    cyan: "bg-accent-cyan hover:glow-cyan",
  },
  secondary: {
    orange: "bg-accent-orange/80 hover:bg-accent-orange hover:glow-orange",
    purple: "bg-accent-purple/80 hover:bg-accent-purple hover:glow-purple",
    cyan: "bg-accent-cyan/80 hover:bg-accent-cyan hover:glow-cyan",
  },
  outline: {
    orange: "border-2 border-accent-orange bg-transparent hover:bg-accent-orange/10 hover:glow-orange",
    purple: "border-2 border-accent-purple bg-transparent hover:bg-accent-purple/10 hover:glow-purple",
    cyan: "border-2 border-accent-cyan bg-transparent hover:bg-accent-cyan/10 hover:glow-cyan",
  },
};

export default function Button({
  children,
  variant = "primary",
  color = "orange",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses = "rounded-full px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";
  const variantClass = variantStyles[variant][color];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClass} ${className}`}
      whileHover={disabled ? {} : buttonHover}
      whileTap={disabled ? {} : buttonTap}
      {...props}
    >
      {children}
    </motion.button>
  );
}

