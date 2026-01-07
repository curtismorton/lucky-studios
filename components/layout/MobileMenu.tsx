"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Logo from "@/components/ui/Logo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: 20,
    },
    open: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
          />

          {/* Menu Content */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4"
          >
            {/* Close Button */}
            <motion.button
              variants={itemVariants}
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-accent-orange touch-manipulation"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.button>

            {/* Logo */}
            <motion.div
              variants={itemVariants}
              className="mb-8 sm:mb-12"
            >
              <Logo size="md" />
            </motion.div>

            {/* Menu Items */}
            <nav className="flex flex-col items-center gap-6 sm:gap-8">
              {links.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  variants={itemVariants}
                  onClick={onClose}
                  className="font-heading text-3xl sm:text-4xl font-bold text-white transition-colors hover:text-gradient-accent touch-manipulation min-h-[44px] flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                variants={itemVariants}
                onClick={onClose}
                className="mt-4 rounded-full bg-accent-orange px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange touch-manipulation min-h-[44px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Call
              </motion.button>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

