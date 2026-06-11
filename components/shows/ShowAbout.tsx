import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import type { Show } from "@/lib/data/shows";

export default function ShowAbout({ show }: { show: Show }) {
  if (!show.description) return null;

  return (
    <section className="border-y border-bone/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <Slate scene="SCENE 01" title="THE FORMAT" className="mb-12" />
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-bone/75 md:text-xl">
              {show.description}
            </p>
          </Reveal>
          {(show.hosts?.length || show.format) && (
            <Reveal delay={0.1}>
              <dl className="space-y-6 border-l-2 border-tally pl-6">
                {show.format && (
                  <div>
                    <dt className="tc-label text-bone/50">Format</dt>
                    <dd className="mt-2 text-bone/80">{show.format}</dd>
                  </div>
                )}
                {show.hosts && show.hosts.length > 0 && (
                  <div>
                    <dt className="tc-label text-bone/50">
                      {show.hosts.length === 1 ? "Host" : "Hosts"}
                    </dt>
                    {show.hosts.map((host) => (
                      <dd key={host.name} className="mt-2 text-bone/80">
                        {host.name}
                        <span className="tc-label ml-3 text-bone/45">{host.role}</span>
                      </dd>
                    ))}
                  </div>
                )}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
