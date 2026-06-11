import Image from "next/image";
import Link from "next/link";
import type { Show } from "@/lib/data/shows";

const FALLBACK_PLATE = "/images/hero/hero-main-our-pic.jpg";

/** Film-poster show card. Used on the homepage network grid and /shows. */
export default function ShowPoster({ show }: { show: Show }) {
  return (
    <Link
      href={`/shows/${show.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden border border-bone/10 bg-carbon"
    >
      <Image
        src={show.ogImage || FALLBACK_PLATE}
        alt={show.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="film-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="scrim-b absolute inset-0" />
      <span className="tc-label absolute left-4 top-4 bg-ink/70 px-2.5 py-1.5 text-bone/80 backdrop-blur-sm">
        {show.genre}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="type-display text-2xl leading-none">{show.title}</h3>
        <p className="tc-label mt-3 text-bone/60">{show.stat}</p>
      </div>
      <span
        className="absolute right-4 top-4 h-2 w-2 rounded-full bg-tally opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}
