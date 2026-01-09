"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-accent-orange/10 p-6">
            <AlertCircle className="h-16 w-16 text-accent-orange" />
          </div>
        </div>

        <h1 className="mb-4 font-heading text-3xl font-bold text-white md:text-4xl">
          Something went wrong!
        </h1>

        <p className="mb-8 font-body text-lg text-text-secondary">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        {error.digest && (
          <p className="mb-8 font-body text-sm text-text-muted">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <motion.button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full bg-accent-orange px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="h-5 w-5" />
            Try again
          </motion.button>

          <Link href="/">
            <motion.button
              className="flex items-center justify-center gap-2 rounded-full border border-background-tertiary bg-background-secondary/50 px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:border-accent-orange/50 hover:bg-accent-orange/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="h-5 w-5" />
              Go home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

