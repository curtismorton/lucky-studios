import Image from "next/image";
import Reveal from "@/components/cinema/Reveal";
import Slate from "@/components/cinema/Slate";
import { receipts } from "@/lib/content/home";

export default function Receipts() {
  return (
    <section className="border-y border-bone/10 bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Slate scene={receipts.slate.scene} title={receipts.slate.title} className="mb-14" />

        <Reveal>
          <h2 className="type-display max-w-4xl text-[clamp(2.25rem,5.5vw,4.5rem)]">
            {receipts.headline}
          </h2>
        </Reveal>

        <div className="mt-20 space-y-24 md:space-y-32">
          {receipts.cases.map((caseStudy, index) => {
            const flipped = index % 2 === 1;
            return (
              <Reveal key={caseStudy.slug} amount={0.2}>
                <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div
                    className={`relative aspect-[16/10] overflow-hidden border border-bone/10 ${
                      flipped ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={caseStudy.plate}
                      alt={caseStudy.plateAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="film-grade object-cover"
                    />
                    <span className="tc-label absolute left-4 top-4 bg-ink/70 px-2.5 py-1.5 text-bone/80 backdrop-blur-sm">
                      CASE {String(index + 1).padStart(2, "0")} · {caseStudy.genre}
                    </span>
                  </div>

                  <div className={flipped ? "lg:order-1" : ""}>
                    <h3 className="tc-label text-tally">{caseStudy.title}</h3>
                    <p className="type-display mt-4 text-3xl md:text-4xl">
                      {caseStudy.headline}
                    </p>

                    <dl className="mt-10 space-y-8">
                      <div>
                        <dt className="tc-label text-bone/50">The brief</dt>
                        <dd className="mt-3 max-w-xl leading-relaxed text-bone/70">
                          {caseStudy.challenge}
                        </dd>
                      </div>
                      <div>
                        <dt className="tc-label text-bone/50">The system</dt>
                        <dd className="mt-3 max-w-xl leading-relaxed text-bone/70">
                          {caseStudy.system}
                        </dd>
                      </div>
                    </dl>

                    <p className="tc-label mt-10 border-l-2 border-tally pl-4 !leading-relaxed text-bone">
                      {caseStudy.result}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
