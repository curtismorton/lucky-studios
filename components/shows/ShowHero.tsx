import Image from "next/image";
import Cta from "@/components/cinema/Cta";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { Show } from "@/lib/data/shows";
import type { SpotifyShow } from "@/lib/services/spotify";

const FALLBACK_PLATE = "/images/hero/hero-main-our-pic.jpg";

type ShowHeroProps = {
  show: Show;
  spotifyShow?: SpotifyShow;
};

export default function ShowHero({ show, spotifyShow }: ShowHeroProps) {
  const plate = spotifyShow?.images?.[0]?.url || show.ogImage || FALLBACK_PLATE;
  const spotifyUrl = spotifyShow?.external_urls?.spotify || show.platforms?.spotify;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-36 md:px-10 md:pb-24 md:pt-44 lg:px-16">
      <Slate scene="NOW SHOWING" title={show.genre.toUpperCase()} className="mb-12" />

      <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <Reveal>
            <h1 className="type-display text-[clamp(2.5rem,6.5vw,5.5rem)] uppercase">
              {show.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-bone/70">
              {show.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="tc-label mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-bone/55">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-tally" aria-hidden />
                {show.stat}
              </span>
              {spotifyShow?.total_episodes ? (
                <span>{spotifyShow.total_episodes} EPISODES</span>
              ) : null}
              {show.format ? <span>{show.format.toUpperCase()}</span> : null}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              {spotifyUrl && (
                <Cta href={spotifyUrl} external>
                  Listen on Spotify
                </Cta>
              )}
              {show.platforms?.youtube && (
                <Cta href={show.platforms.youtube} variant="ghost" external>
                  Watch on YouTube
                </Cta>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal amount={0.2}>
          <div className="relative aspect-square overflow-hidden border border-bone/10">
            <Image
              src={plate}
              alt={`${show.title} key art`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="film-grade object-cover"
            />
            <span
              className="absolute right-4 top-4 h-2 w-2 rounded-full bg-tally animate-rec-blink motion-reduce:animate-none"
              aria-hidden
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
