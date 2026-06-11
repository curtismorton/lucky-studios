"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do I need an existing audience?",
    answer:
      "No, but it helps. We can build shows around creators, brands, communities or specific audience niches.",
  },
  {
    question: "Can you handle everything?",
    answer:
      "Yes. Strategy, production, editing, packaging, distribution and growth support can all sit inside the Lucky Studios pipeline.",
  },
  {
    question: "Do you work with brands?",
    answer:
      "Yes. We develop branded shows that feel like entertainment first, not adverts in disguise.",
  },
  {
    question: "Can you improve an existing show?",
    answer:
      "Yes. We can sharpen the format, improve production quality, rebuild packaging and create a stronger distribution system.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Every show is scoped around ambition, output and support needed. The best first step is a short consultation.",
  },
] as const;

export default function HomepageFaq() {
  const [activeItem, setActiveItem] = useState<number | null>(0);

  return (
    <section className="px-4 py-16 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            FAQ
          </p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Useful things to know first
          </h2>
        </motion.div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => {
            const expanded = activeItem === index;
            const buttonId = `homepage-faq-button-${index}`;
            const answerId = `homepage-faq-answer-${index}`;

            return (
              <div key={faq.question}>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={answerId}
                  onClick={() => setActiveItem(expanded ? null : index)}
                  className="flex min-h-[68px] w-full items-center justify-between gap-6 py-5 text-left font-heading text-base font-semibold text-white transition hover:text-accent-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange sm:text-lg"
                >
                  {faq.question}
                  <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
                    <ChevronDown className="h-5 w-5 shrink-0" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-sm leading-relaxed text-white/65 sm:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
