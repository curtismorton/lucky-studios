"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="tc-label flex items-center gap-4 text-bone/50">
        <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
        TECHNICAL FAULT
        <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
      </p>
      <h1 className="type-display mt-8 text-[clamp(2.5rem,8vw,6rem)] uppercase">
        We lost the feed<span className="text-tally">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/65">
        Something broke on our side. Roll it back and try again.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="tc-label inline-flex min-h-[52px] items-center justify-center gap-3 bg-tally px-7 !text-xs text-ink transition-colors hover:bg-bone"
        >
          Try again →
        </button>
        <Link
          href="/"
          className="tc-label inline-flex min-h-[52px] items-center justify-center border border-bone/25 px-7 !text-xs text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
        >
          Back to the start
        </Link>
      </div>
      {error.digest && (
        <p className="tc-label mt-12 text-bone/30">REF {error.digest}</p>
      )}
    </main>
  );
}
