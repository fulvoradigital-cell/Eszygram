"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Clearly marked placeholder testimonials: easy to customize
export const PLACEHOLDER_TESTIMONIALS = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    handle: "@fitwithrahul",
    niche: "Fitness Coach · Mumbai",
    quote:
      "Ezsygram changed my fitness business overnight. People used to comment 'diet plan' on my reels and I would lose them in WhatsApp chaos. Now Ezsygram auto-DMs the UPI link in 2 seconds. I did ₹1.8 Lakhs in my first month.",
    earningsTag: "₹1.8L / month",
    followers: "120K followers",
    rating: 5,
  },
  {
    id: 2,
    name: "Neha Kulkarni",
    handle: "@designbyneha",
    niche: "UI/UX Mentor · Bengaluru",
    quote:
      "The UPI-first checkout is pure magic in India. Buyers don't need to create an account—they scan Google Pay or Paytm and get their Figma UI kit instantly. The checkout conversion rate is almost double what I had before.",
    earningsTag: "₹92K / month",
    followers: "48K followers",
    rating: 5,
  },
  {
    id: 3,
    name: "Vikram Sengupta",
    handle: "@vikram.finance",
    niche: "Personal Finance Educator · Delhi",
    quote:
      "Automating my Sunday financial workshop bookings was seamless. Followers commented 'REGISTER', got the DM with the booking slot, paid via UPI, and Google Meet links were created automatically. Ezsygram saved me 15 hours a week.",
    earningsTag: "₹3.4L / cohort",
    followers: "210K followers",
    rating: 5,
  },
  {
    id: 4,
    name: "Ananya Deshmukh",
    handle: "@ananya.bakes",
    niche: "Home Baker & Recipe Creator · Pune",
    quote:
      "I sell digital sourdough guides and holiday recipe books. Being able to offer order bumps directly at checkout added an extra ₹200 to almost every order. The platform fee is transparent and payouts are right on time.",
    earningsTag: "₹65K / month",
    followers: "35K followers",
    rating: 5,
  },
] as const;

export function TestimonialsCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => {
    setCurrentIdx((prevIdx) =>
      prevIdx === 0 ? PLACEHOLDER_TESTIMONIALS.length - 1 : prevIdx - 1
    );
  };

  const next = () => {
    setCurrentIdx((prevIdx) =>
      prevIdx === PLACEHOLDER_TESTIMONIALS.length - 1 ? 0 : prevIdx + 1
    );
  };

  const active =
    PLACEHOLDER_TESTIMONIALS[currentIdx] ?? PLACEHOLDER_TESTIMONIALS[0]!;

  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 dark:bg-canvas-darkCard/40 border-y border-slate-200/70 dark:border-canvas-darkBorder">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="accent" dot>
              Real Creator Stories
            </Badge>
            <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Loved by creators across India
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              *Clearly marked placeholder testimonials representing typical Indian creator outcomes.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-canvas-darkBorder dark:bg-canvas-dark dark:text-slate-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-canvas-darkBorder dark:bg-canvas-dark dark:text-slate-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Active Testimonial Card */}
        <div className="relative rounded-4xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
          <Quote className="absolute right-8 top-8 h-16 w-16 text-slate-100 dark:text-white/5 -z-0" />

          <div className="relative z-10 space-y-6">
            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(active.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            {/* Quote Text */}
            <p className="font-display text-fluid-lg sm:text-2xl font-bold leading-relaxed text-slate-900 dark:text-white">
              &quot;{active.quote}&quot;
            </p>

            {/* Creator Bio & Earnings Tag */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-canvas-darkBorder">
              <div>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {active.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {active.handle} · {active.niche} ({active.followers})
                </p>
              </div>

              <div className="rounded-full bg-mint-50 px-3.5 py-1.5 text-xs font-bold text-mint-700 dark:bg-mint-900/40 dark:text-mint-300">
                {active.earningsTag}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
