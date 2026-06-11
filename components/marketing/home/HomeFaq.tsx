"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Slate from "@/components/cinema/Slate";
import type { HomeContent } from "@/lib/content/home";

export default function HomeFaq({ content: faq }: { content: HomeContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <Slate scene={faq.slate.scene} title={faq.slate.title} className="mb-14" />

      <div className="max-w-4xl">
        {faq.items.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.q} className="border-t border-bone/15 last:border-b">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-semibold md:text-xl">{item.q}</span>
                <span
                  className={`tc-label !text-base transition-colors ${
                    isOpen ? "text-tally" : "text-bone/40"
                  }`}
                  aria-hidden
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-7 leading-relaxed text-bone/65">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
