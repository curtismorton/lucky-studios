import Link from "next/link";
import Cta from "@/components/cinema/Cta";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import { twoDoors } from "@/lib/content/home";

export default function TwoDoors() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={twoDoors.slate.scene} title={twoDoors.slate.title} className="mb-14" />

      <div className="grid gap-px border border-bone/15 bg-bone/15 lg:grid-cols-2">
        {twoDoors.doors.map((door, index) => (
          <Reveal key={door.id} delay={index * 0.1} className="h-full">
            <div className="flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-carbon md:p-12 lg:p-14">
              <span className="tc-label text-tally">{door.eyebrow}</span>
              <h3 className="type-display mt-5 text-3xl md:text-4xl">{door.headline}</h3>
              <p className="mt-5 max-w-md leading-relaxed text-bone/65">{door.copy}</p>

              <ul className="mt-9 space-y-3.5">
                {door.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm text-bone/80">
                    <span className="tc-label mt-0.5 text-tally" aria-hidden>
                      +
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <Cta href={door.href} variant="ghost">
                  {door.cta}
                </Cta>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-8 text-sm text-bone/50">
          Agency or platform?{" "}
          <Link
            href="/contact?intent=agency"
            className="link-underline text-bone/80"
          >
            Same doors — just tell us it&apos;s for a client.
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
