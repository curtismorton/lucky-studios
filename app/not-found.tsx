import Link from "next/link";
import Cta from "@/components/cinema/Cta";

// Note: Metadata exports are not supported in not-found.tsx files in Next.js
// The 404 page title will use the default from layout.tsx

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="tc-label flex items-center gap-4 text-bone/50">
        <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
        SCENE MISSING
        <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
      </p>
      <h1 className="type-display mt-8 text-[clamp(4rem,18vw,12rem)] leading-none">
        4<span className="text-tally">0</span>4
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/65">
        This page didn&apos;t make the final cut. The rest of the show is still
        running.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Cta href="/">Back to the start</Cta>
        <Cta href="/shows" variant="ghost">
          See the shows
        </Cta>
      </div>
      <Link href="/contact" className="link-underline tc-label mt-12 text-bone/45">
        Think something should be here? Tell us.
      </Link>
    </main>
  );
}
