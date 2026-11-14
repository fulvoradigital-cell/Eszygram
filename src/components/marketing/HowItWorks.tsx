"use client";

import React from "react";
import { ArrowRight, CheckCircle2, QrCode, Sparkles, UploadCloud, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Create your page",
    subtitle: "Claim your handle & pick a theme",
    description:
      "Claim your unique username (ezsygram.com/yourname) in 60 seconds. Choose from 6+ mobile-first themes tailored for Indian creators.",
    icon: <Sparkles className="h-6 w-6" />,
    badge: "60 Seconds",
    highlight: "Free link-in-bio URL",
  },
  {
    step: "02",
    title: "Add what you sell",
    subtitle: "Upload files, courses, or slots",
    description:
      "Upload PDF guides, set up video course modules, list 1:1 consultation slots, or offer free lead magnets to collect WhatsApp leads.",
    icon: <UploadCloud className="h-6 w-6" />,
    badge: "Drag & Drop",
    highlight: "Secure private file vault",
  },
  {
    step: "03",
    title: "Automate & get paid",
    subtitle: "Connect Instagram & accept UPI",
    description:
      "Turn on comment-to-DM triggers. When followers comment on your reels, they instantly receive the UPI checkout link and you get paid.",
    icon: <Zap className="h-6 w-6" />,
    badge: "Instant Payouts",
    highlight: "UPI Intent & QR codes",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-canvas-darkCard/40 border-y border-slate-200/70 dark:border-canvas-darkBorder">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" dot>
            Three Simple Steps
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How it works
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            From zero to selling on Instagram in less than 5 minutes. No coding,
            no confusing setup, no developer required.
          </p>
        </div>

        {/* 3 Step Sequence */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, index) => (
            <div
              key={s.step}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard"
            >
              {/* Top Step Pill & Icon */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-extrabold text-brand-600/30 dark:text-brand-400/30">
                    {s.step}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                    {s.icon}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                    {s.subtitle}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.description}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-canvas-darkBorder flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-mint-500" />
                  {s.highlight}
                </span>
                <Badge variant="outline" size="sm">
                  {s.badge}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

