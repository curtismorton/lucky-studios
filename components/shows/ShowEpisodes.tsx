import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { Show } from "@/lib/data/shows";
import type { SpotifyEpisode } from "@/lib/services/spotify";

type ShowEpisodesProps = {
  show: Show;
  spotifyEpisodes?: SpotifyEpisode[];
};

type EpisodeRow = {
  key: string;
  title: string;
  date: string;
  duration: string;
  href?: string;
};

function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  return `${minutes} MIN`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function ShowEpisodes({ show, spotifyEpisodes }: ShowEpisodesProps) {
  const rows: EpisodeRow[] = spotifyEpisodes?.length
    ? spotifyEpisodes.slice(0, 6).map((episode) => ({
        key: episode.id,
        title: episode.name,
        date: formatDate(episode.release_date),
        duration: formatDuration(episode.duration_ms),
        href: episode.external_urls?.spotify,
      }))
    : (show.episodes || []).map((episode) => ({
        key: `${episode.number}`,
        title: episode.title,
        date: formatDate(episode.date),
        duration: episode.duration,
        href: show.platforms?.spotify,
      }));

  if (rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-16">
      <Slate scene="SCENE 02" title="LATEST RECORDINGS" className="mb-12" />
      <ol>
        {rows.map((row, index) => {
          const inner = (
            <div className="grid items-baseline gap-2 py-6 md:grid-cols-[90px_1fr_200px_90px] md:gap-8">
              <span className="tc-label tabular-nums text-tally">
                EP {String(rows.length - index).padStart(2, "0")}
              </span>
              <span className="text-lg font-semibold leading-snug transition-colors group-hover:text-bone md:text-xl">
                {row.title}
              </span>
              <span className="tc-label text-bone/45">{row.date}</span>
              <span className="tc-label text-bone/45 md:text-right">{row.duration}</span>
            </div>
          );

          return (
            <li key={row.key} className="border-t border-bone/15 last:border-b">
              <Reveal amount={0.4}>
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block text-bone/85 transition-colors hover:bg-carbon"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="text-bone/85">{inner}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
