"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Instagram,
  MessageCircle,
  Repeat,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEMO_TRIGGERS = [
  {
    keyword: "LINK",
    comment: "Drop the LINK to your reels growth guide please! 🔥",
    reply: "Sent you the direct UPI link in your DM! 🚀",
    dmTitle: "Reels Growth Blueprint (2026 Edition)",
    dmPrice: "₹499",
    dmDesc: "50+ viral hook templates, audio trends & breakdown sheet.",
  },
  {
    keyword: "WORKSHOP",
    comment: "Is registration still open for Sunday's live WORKSHOP? 🙏",
    reply: "Yes! Just DM'd you the exclusive early-bird slot link 👇",
    dmTitle: "Live Creator Masterclass (Zoom)",
    dmPrice: "₹1,499",
    dmDesc: "2-hour intensive cohort + live Q&A + recording access.",
  },
  {
    keyword: "GUIDE",
    comment: "Can I get the free diet GUIDE you mentioned? 🙌",
    reply: "Check your DMs! Download it free with 1 tap 🎉",
    dmTitle: "7-Day High-Protein Indian Meal Plan",
    dmPrice: "FREE",
    dmDesc: "Instant PDF delivery + WhatsApp weekly meal updates.",
  },
] as const;

export function InstagramSpotlight() {
  const [activeIdx, setActiveIdx] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const current = DEMO_TRIGGERS[activeIdx] ?? DEMO_TRIGGERS[0]!;

  return (
    <section id="automation" className="py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" dot>
            Instagram API Powered
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Turn every Reel comment into a 1-tap sale.
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            Never lose a lead in the comments again. Set your keyword trigger,
            and Ezsygram sends an automated private DM in less than 3 seconds.
          </p>

          {/* Interactive Trigger Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500">
              Try a keyword:
            </span>
            {DEMO_TRIGGERS.map((t, idx) => (
              <button
                key={t.keyword}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  activeIdx === idx
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-brand-300 dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-300"
                }`}
              >
                &quot;{t.keyword}&quot;
              </button>
            ))}
          </div>
        </div>

        {/* Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Feature Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint-50 text-mint-600 dark:bg-mint-900/40 dark:text-mint-300">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Sub-3 Second DM Delivery
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Triggered instantaneously via official Instagram Graph API
                    webhooks. Fully compliant with Meta rate limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <Repeat className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Dynamic Comment Replies
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Replies to the public comment with rotating variations to
                    boost engagement and signal the algorithm to push your Reel.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Attributed Sales Tracking
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Track exactly which post, reel, and keyword produced how
                    many clicks, leads, and UPI orders in your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4 dark:border-brand-500/30 dark:bg-brand-900/20">
              <p className="text-xs font-semibold text-brand-800 dark:text-brand-200">
                💡 Indian Creator Stat
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Creators using Ezsygram&apos;s comment-to-DM automation see an
                average <span className="font-bold text-brand-700 dark:text-brand-300">4.2x higher conversion</span> compared to a static link-in-bio bio URL alone.
              </p>
            </div>
          </div>

          {/* Right Column: Animated Dual-Phone Conversation Simulation */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-lg rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-elevated dark:border-canvas-darkBorder dark:from-canvas-darkCard dark:to-canvas-dark">
              {/* Top Fake Instagram Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-canvas-darkBorder">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                    <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                      <Instagram className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Instagram Reel Automation
                    </p>
                    <p className="text-[10px] text-mint-600 dark:text-mint-400 font-semibold">
                      ● Active · 0.8s avg response
                    </p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  Live Preview
                </Badge>
              </div>

              {/* Chat Simulation Body */}
              <div className="space-y-4 py-6">
                {/* 1. Follower Comment Bubble */}
                <motion.div
                  key={`comment-${activeIdx}`}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-2.5 max-w-[85%]"
                >
                  <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                    AY
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-xs text-slate-800 dark:bg-canvas-darkBorder dark:text-slate-100 shadow-sm">
                    <span className="font-bold text-slate-900 dark:text-white mr-1">
                      @ananya_fit:
                    </span>
                    {current.comment}
                  </div>
                </motion.div>

                {/* 2. Public Automated Comment Reply */}
                <motion.div
                  key={`reply-${activeIdx}`}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15 }}
                  className="ml-8 flex items-start gap-2 max-w-[80%]"
                >
                  <div className="h-6 w-6 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center text-[9px] font-bold text-white">
                    EZ
                  </div>
                  <div className="rounded-2xl bg-brand-50 px-3 py-1.5 text-[11px] text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
                    <span className="font-bold mr-1">@creator_hub (Reply):</span>
                    {current.reply}
                  </div>
                </motion.div>

                {/* Divider Line */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="border-t border-dashed border-slate-200 dark:border-canvas-darkBorder w-full" />
                  <span className="absolute bg-white px-2 text-[10px] uppercase font-bold text-slate-400 dark:bg-canvas-darkCard">
                    ⚡ Instant Private DM Sent
                  </span>
                </div>

                {/* 3. Direct Message Product Card */}
                <motion.div
                  key={`dm-${activeIdx}`}
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="ml-auto max-w-[90%] rounded-2xl border border-brand-200 bg-white p-4 shadow-elevated dark:border-brand-500/30 dark:bg-canvas-darkCard"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-canvas-darkBorder">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                      Ezsygram Private Reply
                    </span>
                    <span className="text-[10px] text-slate-400">Just now</span>
                  </div>

                  <div className="pt-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <p className="font-display text-xs font-bold text-slate-900 dark:text-white">
                        {current.dmTitle}
                      </p>
                      <span className="font-display text-sm font-extrabold text-brand-600 dark:text-brand-400">
                        {current.dmPrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {current.dmDesc}
                    </p>

                    <div className="pt-2">
                      <div className="flex items-center justify-between rounded-xl bg-brand-gradient px-3 py-2 text-xs font-bold text-white shadow-soft">
                        <span>
                          {current.dmPrice === "FREE"
                            ? "Get Free Instant Access"
                            : `Buy for ${current.dmPrice} via UPI`}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
