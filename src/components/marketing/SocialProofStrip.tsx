"use client";

import React from "react";
import {
  Camera,
  Coins,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  MessageSquareText,
  Palette,
  Sparkles,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_PROOF_STATS } from "@/lib/marketing-data";

export { SOCIAL_PROOF_STATS };

const NICHES = [
  { label: "Coaches", icon: <GraduationCap className="h-3.5 w-3.5" /> },
  { label: "Fitness", icon: <Dumbbell className="h-3.5 w-3.5" /> },
  { label: "Educators", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { label: "Designers", icon: <Palette className="h-3.5 w-3.5" /> },
  { label: "Photographers", icon: <Camera className="h-3.5 w-3.5" /> },
  { label: "Finance", icon: <Coins className="h-3.5 w-3.5" /> },
  { label: "Astrologers", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { label: "Chefs", icon: <UtensilsCrossed className="h-3.5 w-3.5" /> },
] as const;

export function SocialProofStrip() {
  return (
    <section className="border-y border-slate-200/80 bg-white/70 py-12 shadow-soft backdrop-blur-md dark:border-canvas-darkBorder dark:bg-canvas-darkCard/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Niche Chips */}
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Built for Indian Creators
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {NICHES.map((niche) => (
              <span
                key={niche.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-canvas-darkBorder dark:bg-canvas-dark/60 dark:text-slate-300 dark:hover:border-brand-500/50 dark:hover:bg-brand-900/30"
              >
                <span className="text-brand-600 dark:text-brand-400">
                  {niche.icon}
                </span>
                <span>{niche.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3 Large Stat Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:divide-x sm:divide-slate-200 sm:dark:divide-canvas-darkBorder">
          <div className="text-center space-y-1 sm:px-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300 mb-1">
              <Users className="h-5 w-5" />
            </div>
            <p className="font-display text-fluid-2xl font-extrabold text-slate-900 dark:text-white">
              {SOCIAL_PROOF_STATS.creatorsCount}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {SOCIAL_PROOF_STATS.creatorsLabel}
            </p>
          </div>

          <div className="text-center space-y-1 sm:px-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-50 text-mint-600 dark:bg-mint-900/40 dark:text-mint-300 mb-1">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="font-display text-fluid-2xl font-extrabold text-slate-900 dark:text-white text-gradient">
              {SOCIAL_PROOF_STATS.salesProcessed}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {SOCIAL_PROOF_STATS.salesLabel}
            </p>
          </div>

          <div className="text-center space-y-1 sm:px-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300 mb-1">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <p className="font-display text-fluid-2xl font-extrabold text-slate-900 dark:text-white">
              {SOCIAL_PROOF_STATS.dmsAutomated}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {SOCIAL_PROOF_STATS.dmsLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

