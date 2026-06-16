"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import RecBadge from "@/components/cinema/RecBadge";

const SCENES = [
  {
    scene: "01",
    name: "Our Shows",
    href: "/shows",
    genre: "THE NETWORK",
    logline: "Three formats. Millions of views.",
  },
  {
    scene: "02",
    name: "The Work",
    href: "/work",
    genre: "RECEIPTS",
    logline: "Case studies. Numbers. No fluff.",
  },
  {
    scene: "03",
    name: "For Creators",
    href: "/creators",
    genre: "TALENT",
    logline: "Format strategy for shows that compound.",
  },
  {
    scene: "04",
    name: "For Brands",
    href: "/brands",
    genre: "PARTNERS",
    logline: "Integrated content. Not ad breaks.",
  },
  {
    scene: "05",
    name: "The Studio",
    href: "/studio",
    genre: "FACILITY",
    logline: "Multicam. Control room. London.",
  },
  {
    scene: "06",
    name: "About",
    href: "/about",
    genre: "COMPANY",
    logline: "The people behind the machine.",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface NavbarProps {
  links?: Array<{ name: string; href: string }>;
  bookingHref?: string;
  bookingLabel?: string;
}

export default function Navbar({
  bookingHref = "/contact?intent=consultation",
  bookingLabel = "Book a call",
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const bookingExternal = bookingHref.startsWith("http");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled && !open
          ? "border-b border-bone/10 bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-[4.5rem] md:px-10 lg:px-16">
        {/* Logo */}
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

        {/* Menu trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-11 items-center gap-3"
        >
          <span className="tc-label text-bone/50 transition-colors duration-200 hover:text-bone select-none">
            {open ? "CLOSE" : "MENU"}
          </span>
          <div className="flex flex-col items-end gap-[5px]">
            <span
              className={`block h-px w-5 bg-bone transition-all duration-300 origin-center ${
                open ? "translate-y-[7px] -rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px bg-bone transition-all duration-300 ${
                open ? "w-0 opacity-0" : "w-3.5"
              }`}
            />
            <span
              className={`block h-px w-5 bg-bone transition-all duration-300 origin-center ${
                open ? "-translate-y-[7px] rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Scene-select overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col bg-ink overflow-y-auto"
          >
            {/* Scene grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-16 md:mt-[4.5rem]">
              {SCENES.map((scene, i) => {
                const active =
                  pathname === scene.href ||
                  (scene.href !== "/" && pathname?.startsWith(`${scene.href}/`));

                return (
                  <motion.div
                    key={scene.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.06 + i * 0.055 }}
                    className="border-b border-r border-bone/8 last:border-r-0 [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0"
                  >
                    <Link
                      href={scene.href}
                      className={`group relative flex h-full min-h-[180px] flex-col gap-3 p-8 md:p-10 transition-colors duration-200 hover:bg-carbon/60 ${
                        active
                          ? "border-l-2 border-tally pl-[calc(2rem-2px)] md:pl-[calc(2.5rem-2px)]"
                          : "border-l-2 border-transparent hover:border-tally/30 pl-[calc(2rem-2px)] md:pl-[calc(2.5rem-2px)]"
                      }`}
                    >
                      {/* Scene number + genre */}
                      <div className="flex items-center justify-between">
                        <span className="tc-label text-tally">
                          SCENE {scene.scene}
                        </span>
                        <span className="tc-label text-bone/30 transition-colors duration-200 group-hover:text-bone/50">
                          {scene.genre}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="type-display text-[clamp(2rem,4vw,3.5rem)] uppercase text-bone leading-none mt-1">
                        {scene.name}
                      </h2>

                      {/* Logline */}
                      <p className="tc-label text-bone/40 mt-auto transition-colors duration-200 group-hover:text-bone/65">
                        {scene.logline}
                      </p>

                      {/* Active indicator */}
                      {active && (
                        <div className="absolute right-8 top-8">
                          <RecBadge />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="flex items-center justify-between border-t border-bone/10 px-6 py-5 md:px-10 lg:px-16"
            >
              <RecBadge label="LUCKY STUDIOS · LONDON" />
              <Link
                href={bookingHref}
                {...(bookingExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="tc-label bg-tally px-6 py-3 text-ink transition-colors duration-200 hover:bg-bone"
              >
                {bookingLabel}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
