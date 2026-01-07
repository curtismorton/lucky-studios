"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { buttonHover, buttonTap } from "@/lib/animations";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { name: "Our Shows", href: "/shows" },
  { name: "For Creators", href: "/creators" },
  { name: "For Brands", href: "/brands" },
  { name: "The Studio", href: "/studio" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-background-tertiary"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Logo size="sm" className="h-12" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-8">
              {navLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ y: -2 }}>
                  <Link
                    href={link.href}
                    className="link-underline font-body text-sm font-medium text-text-secondary transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                className="rounded-full bg-accent-orange px-6 py-2.5 font-heading text-sm font-semibold text-white transition-all duration-300 hover:glow-orange"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Book a Call
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex h-11 w-11 items-center justify-center text-white touch-manipulation"
              onClick={() => setIsMobileMenuOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}

