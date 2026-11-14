"use client";

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FAQ_ITEMS } from "@/lib/marketing-data";

export { FAQ_ITEMS };

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const baseId = useId();

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="primary" dot>
            Got Questions?
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            Everything you need to know about payouts, UPI checkout, Instagram
            automation, and platform fees.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            const qId = `${baseId}-q-${idx}`;
            const aId = `${baseId}-a-${idx}`;

            return (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200/80 bg-white transition-all dark:border-canvas-darkBorder dark:bg-canvas-darkCard"
              >
                <button
                  type="button"
                  id={qId}
                  aria-expanded={isOpen}
                  aria-controls={aId}
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-canvas-darkBorder pt-3"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

