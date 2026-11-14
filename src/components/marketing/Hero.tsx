"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  Play,
  QrCode,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-14 lg:pb-32">
      {/* Background Animated Gradient Mesh Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 25, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.08, 1],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 top-0 h-[480px] w-[480px] rounded-full bg-brand-600/15 blur-3xl dark:bg-brand-600/25 sm:h-[620px] sm:w-[620px]"
        />
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, -20, 0],
                  y: [0, 35, 0],
                  scale: [1, 1.1, 1],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 top-20 h-[440px] w-[440px] rounded-full bg-coral-500/12 blur-3xl dark:bg-coral-500/20 sm:h-[580px] sm:w-[580px]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines and CTAs */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-soft backdrop-blur-md dark:border-brand-500/30 dark:bg-brand-900/30 dark:text-brand-200">
              <Sparkles className="h-3.5 w-3.5 text-coral-500" />
              <span>Link-in-bio Storefront + Instagram Automation</span>
              <span className="hidden rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold text-white sm:inline-block">
                UPI-First
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Turn your Instagram followers into{" "}
              <span className="text-gradient">customers.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto max-w-2xl text-fluid-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0">
              Build your store, sell digital products, courses and sessions,
              accept UPI instantly and automate every DM and comment. All in one
              link.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  fullWidth
                  className="text-base font-bold shadow-glow"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start free
                </Button>
              </Link>

              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  leftIcon={<Play className="h-4 w-4 text-brand-600 fill-brand-600" />}
                >
                  See how it works
                </Button>
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400 lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-mint-500" />
                No coding required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                Set up in 5 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                UPI-ready with instant payouts
              </span>
            </div>
          </div>

          {/* Right Column: Floating Mobile Mockup with Live Floating Cards */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:col-span-5">
            {/* Ambient Backing Glow */}
            <div className="absolute -inset-4 rounded-4xl bg-brand-gradient opacity-20 blur-2xl dark:opacity-30" />

            {/* Floating Phone Frame (Pure CSS / Tailwind) */}
            <div className="relative z-10 w-[310px] rounded-[44px] border-[8px] border-slate-900 bg-slate-900 p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:w-[340px]">
              {/* Camera Notch */}
              <div className="absolute left-1/2 top-4 z-20 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-slate-800" />

              {/* Screen Canvas */}
              <div className="relative min-h-[580px] overflow-hidden rounded-[36px] bg-[#FAFAFB] p-4 text-slate-900 dark:bg-[#0B0B1A] dark:text-slate-100">
                {/* Creator Store Mockup Header */}
                <div className="pt-6 text-center">
                  <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-brand-600 ring-offset-2 dark:ring-offset-slate-950">
                    <div className="flex h-full w-full items-center justify-center bg-brand-gradient text-xl font-bold text-white">
                      RV
                    </div>
                  </div>
                  <h3 className="mt-2.5 font-display text-sm font-bold">
                    Rhea Verma
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Content Strategist &amp; Mentor · 85K on Instagram
                  </p>
                  <div className="mt-2 flex justify-center gap-1">
                    <Badge variant="primary" size="sm">
                      ezsygram.com/rhea
                    </Badge>
                  </div>
                </div>

                {/* Sample Block 1: Digital Guide */}
                <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      PDF
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold">
                        Reels Growth Blueprint
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Digital eBook + 50 Hook Templates
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xs font-bold text-slate-900 dark:text-white">
                        ₹499
                      </p>
                      <span className="rounded-full bg-mint-50 px-1.5 py-0.5 text-[9px] font-bold text-mint-700 dark:bg-mint-900/40 dark:text-mint-300">
                        UPI
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl bg-brand-gradient py-1.5 text-xs font-bold text-white shadow-soft"
                  >
                    <span>Instant UPI Checkout</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Sample Block 2: 1:1 Consultation */}
                <div className="mt-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">1:1 Content Audit Call</p>
                      <p className="text-[10px] text-slate-500">
                        45-min Zoom · Slot Booking
                      </p>
                    </div>
                    <p className="font-display text-xs font-bold">₹1,999</p>
                  </div>
                </div>

                {/* Sample Block 3: Free Lead Magnet */}
                <div className="mt-2.5 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-2.5 text-center dark:border-brand-500/40 dark:bg-brand-900/20">
                  <p className="text-[11px] font-bold text-brand-700 dark:text-brand-200">
                    🎁 Free 7-Day Hook Cheat Sheet
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Enter email &amp; get instant WhatsApp delivery
                  </p>
                </div>

                {/* Bottom Trust Badge */}
                <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-slate-400">
                  <Lock className="h-3 w-3" />
                  <span>Powered by Ezsygram</span>
                </div>
              </div>
            </div>

            {/* Animated Floating Card 1: New UPI Order */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -30, y: 20 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      x: [-6, 6, -6],
                      y: [0, -10, 0],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-6 top-16 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-elevated backdrop-blur-xl dark:border-canvas-darkBorder dark:bg-canvas-darkCard/95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-50 text-mint-600 dark:bg-mint-900/40 dark:text-mint-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  New order ₹499 via UPI
                </p>
                <p className="text-[10px] text-slate-500">2 mins ago · Auto-delivered</p>
              </div>
            </motion.div>

            {/* Animated Floating Card 2: Automatic DM Sent */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 30, y: -20 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      x: [6, -6, 6],
                      y: [0, 10, 0],
                    }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -right-6 top-48 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-elevated backdrop-blur-xl dark:border-canvas-darkBorder dark:bg-canvas-darkCard/95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  DM sent automatically
                </p>
                <p className="text-[10px] text-slate-500">Trigger: Comment &quot;REELS&quot;</p>
              </div>
            </motion.div>

            {/* Animated Floating Card 3: Lead Capture Trend */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      x: [-4, 4, -4],
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-elevated backdrop-blur-xl dark:border-canvas-darkBorder dark:bg-canvas-darkCard/95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  +12 leads today
                </p>
                <p className="text-[10px] text-slate-500">WhatsApp &amp; Email captured</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

