"use client";

import { useEffect, useState } from "react";
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

const PILL_NAV = [
  { name: "Shows", href: "/shows" },
  { name: "Studio", href: "/studio" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface NavbarProps {
  bookingHref?: string;
  bookingLabel?: string;
}

export default function Navbar({
  bookingHref = "/contact?intent=consultation",
  bookingLabel = "Book a call",
}: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-start justify-between px-4 pt-4 md:px-6 md:pt-5">
        {/* Logo glass circle */}
        <Link
          href="/"
          aria-label="Lucky Studios — home"
          className={`shrink-0 transition-opacity duration-200 ${
            open ? "pointer-events-none opacity-0" : "pointer-events-auto"
          }`}
        >
          <div className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
            <span className="font-serif text-2xl italic text-bone">L</span>
          </div>
        </Link>

        {/* Desktop glass pill nav */}
        <nav
          aria-label="Main navigation"
          className={`liquid-glass hidden items-center rounded-full px-1.5 py-1.5 transition-opacity duration-200 md:flex ${
            open ? "pointer-events-none opacity-0" : "pointer-events-auto"
          }`}
        >
          {PILL_NAV.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 font-barlow text-sm transition-colors duration-200 ${
                  active ? "bg-white/10 text-bone" : "text-bone/70 hover:text-bone"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href={bookingHref}
            {...(bookingExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="ml-1 rounded-full bg-bone px-4 py-2 font-barlow text-sm font-medium text-ink transition-colors duration-200 hover:bg-tally hover:text-bone"
          >
            {bookingLabel}
          </Link>
        </nav>

        {/* Hamburger / close */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="liquid-glass pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full"
        >
          <span className="flex flex-col items-center gap-[5px]">
            <span
              className={`block h-px w-4 bg-bone transition-all duration-300 origin-center ${
                open ? "translate-y-[9px] -rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px bg-bone transition-all duration-300 ${
                open ? "w-0 opacity-0" : "w-3"
              }`}
            />
            <span
              className={`block h-px w-4 bg-bone transition-all duration-300 origin-center ${
                open ? "-translate-y-[9px] rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Scene-select overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink"
          >
            {/* Scene grid */}
            <div className="mt-20 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                      className={`group relative flex h-full min-h-[180px] flex-col gap-3 p-8 transition-colors duration-200 hover:bg-carbon/60 md:p-10 ${
                        active
                          ? "border-l-2 border-tally pl-[calc(2rem-2px)] md:pl-[calc(2.5rem-2px)]"
                          : "border-l-2 border-transparent hover:border-tally/30 pl-[calc(2rem-2px)] md:pl-[calc(2.5rem-2px)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="tc-label text-tally">SCENE {scene.scene}</span>
                        <span className="tc-label text-bone/30 transition-colors duration-200 group-hover:text-bone/50">
                          {scene.genre}
                        </span>
                      </div>
                      <h2 className="type-serif mt-1 text-[clamp(2rem,4vw,3.5rem)] leading-none text-bone">
                        {scene.name}
                      </h2>
                      <p className="tc-label mt-auto text-bone/40 transition-colors duration-200 group-hover:text-bone/65">
                        {scene.logline}
                      </p>
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
