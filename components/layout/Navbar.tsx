"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import RecBadge from "@/components/cinema/RecBadge";

const DEFAULT_NAV_LINKS = [
  { name: "Our Shows", href: "/shows" },
  { name: "For Creators", href: "/creators" },
  { name: "For Brands", href: "/brands" },
  { name: "The Studio", href: "/studio" },
  { name: "About", href: "/about" },
];

interface NavbarProps {
  links?: Array<{ name: string; href: string }>;
  bookingHref?: string;
  bookingLabel?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Navbar({
  links = DEFAULT_NAV_LINKS,
  bookingHref = "/contact?intent=consultation",
  bookingLabel = "Book a call",
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const bookingExternal = bookingHref.startsWith("http");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled && !menuOpen
          ? "border-b border-bone/10 bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-[4.5rem] md:px-10 lg:px-16">
        <Link href="/" aria-label="Lucky Studios — home" className="relative z-50 shrink-0">
          <Image
            src="/images/LOGO-WHITE.png"
            alt="Lucky Studios"
            width={120}
            height={28}
            className="h-6 w-auto md:h-7"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`tc-label transition-colors duration-200 ${
                  active ? "text-bone" : "text-bone/55 hover:text-bone"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href={bookingHref}
            {...(bookingExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="tc-label bg-tally px-5 py-3 text-ink transition-colors duration-200 hover:bg-bone"
          >
            {bookingLabel}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-bone transition-transform duration-300 ${
              menuOpen ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-bone transition-transform duration-300 ${
              menuOpen ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu — full-frame title card */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink md:hidden"
          >
            <div className="flex grow flex-col justify-center px-6 pt-16">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.08 + index * 0.06 }}
                  className="overflow-hidden border-t border-bone/10 last:border-b"
                >
                  <Link
                    href={link.href}
                    className="type-display block py-4 text-4xl uppercase text-bone"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.08 + links.length * 0.06 }}
                className="mt-10"
              >
                <Link
                  href={bookingHref}
                  {...(bookingExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="tc-label inline-block bg-tally px-7 py-4 text-ink"
                >
                  {bookingLabel}
                </Link>
              </motion.div>
            </div>
            <div className="flex items-center justify-between px-6 pb-8">
              <RecBadge label="LUCKY STUDIOS · LONDON" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
