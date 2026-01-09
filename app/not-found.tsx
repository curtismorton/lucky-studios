"use client";

import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import Link from "next/link";

// Note: Metadata exports are not supported in not-found.tsx files in Next.js
// The 404 page title will use the default from layout.tsx

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-accent-purple/10 p-6">
            <Search className="h-16 w-16 text-accent-purple" />
          </div>
        </div>

        <h1 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl">
          404
        </h1>

        <h2 className="mb-4 font-heading text-2xl font-semibold text-white md:text-3xl">
          Page Not Found
        </h2>

        <p className="mb-8 font-body text-lg text-text-secondary">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <motion.button
              className="flex items-center justify-center gap-2 rounded-full bg-accent-orange px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="h-5 w-5" />
              Go home
            </motion.button>
          </Link>

          <Link href="/shows">
            <motion.button
              className="flex items-center justify-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:border-accent-purple/50 hover:bg-accent-purple/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
              Browse shows
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

