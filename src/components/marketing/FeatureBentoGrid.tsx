"use client";

import React from "react";
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  Check,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  GanttChartSquare,
  Gift,
  Layers,
  MessageCircle,
  QrCode,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureBentoGrid() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" dot>
            Complete Creator Revenue Engine
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything you need to sell, automate, and grow.
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            No messy plugins or third-party workarounds. One seamless,
            mobile-first platform built specifically for Indian creators.
          </p>
        </div>

        {/* Bento Grid Layout (9 Core Capabilities) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Storefront Builder */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <GanttChartSquare className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Link-in-Bio Storefront
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Drag-and-drop builder with blocks for digital guides, video
                courses, 1:1 sessions, and lead magnets. 6+ gorgeous theme
                presets.
              </p>
            </div>

            {/* Mini Visual */}
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 space-y-2 dark:border-canvas-darkBorder dark:bg-white/5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300">
                  <span className="h-2 w-2 rounded-full bg-brand-600" />
                  Drag &amp; Drop Blocks
                </span>
                <span className="text-[11px] text-slate-400">Mobile Preview</span>
              </div>
              <div className="h-7 rounded-xl bg-white dark:bg-canvas-darkBorder/60 flex items-center px-3 text-[11px] font-medium text-slate-600 dark:text-slate-300 shadow-sm justify-between">
                <span>Featured Masterclass</span>
                <span className="text-brand-600 font-bold">₹999</span>
              </div>
            </div>
          </div>

          {/* 2. Sell Anything */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Sell Any Digital Format
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                eBooks, templates, presets, multi-chapter video courses with lesson
                viewers, 1:1 slot bookings, and monthly memberships.
              </p>
            </div>

            {/* Mini Visual */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
              <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 dark:border-canvas-darkBorder dark:bg-white/5">
                <p className="text-slate-900 dark:text-white font-bold">Digital Files</p>
                <p className="text-[10px] text-slate-400">Expiring Signed URLs</p>
              </div>
              <div className="rounded-xl border border-slate-200/60 bg-white p-2.5 dark:border-canvas-darkBorder dark:bg-white/5">
                <p className="text-slate-900 dark:text-white font-bold">Video Courses</p>
                <p className="text-[10px] text-slate-400">Chapters &amp; Lessons</p>
              </div>
            </div>
          </div>

          {/* 3. UPI-First Checkout */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-50 text-mint-600 dark:bg-mint-900/40 dark:text-mint-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                UPI-First 1-Page Checkout
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                One-tap UPI intent apps, dynamic QR codes, credit/debit cards, and
                netbanking. Guest checkout with zero buyer account friction.
              </p>
            </div>

            {/* Mini Visual */}
            <div className="mt-6 rounded-2xl bg-mint-50/70 p-3 text-xs dark:bg-mint-900/20 border border-mint-200/80 dark:border-mint-500/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-mint-800 dark:text-mint-200">
                  Instant UPI Intent
                </p>
                <p className="text-[10px] text-mint-700/80 dark:text-mint-300">
                  92% conversion in India
                </p>
              </div>
              <Badge variant="success" dot>
                Direct Bank
              </Badge>
            </div>
          </div>

          {/* 4. Instagram Comment-to-DM (Featured Card - Spans 2 cols on tablet/desktop) */}
          <div className="lg:col-span-2 rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50/60 via-white to-white p-7 shadow-elevated transition-all hover:-translate-y-1 hover:border-brand-400 dark:border-brand-500/40 dark:from-brand-900/20 dark:via-canvas-darkCard dark:to-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <Badge variant="primary" dot>
                  Superpower
                </Badge>
              </div>
              <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                Instagram Comment-to-DM Automation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                When followers comment a keyword like &quot;LINK&quot; or &quot;COURSE&quot;
                on any Reel or post, Ezsygram instantly sends a private DM with the
                purchase link, replies to the comment with random variations, and
                tracks attributed sales.
              </p>
            </div>

            {/* Mini Interactive Demo Preview */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-dark">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Reel Comment Trigger
                </span>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  @priya_fit: &quot;LINK please!&quot;
                </p>
                <p className="mt-1 text-[11px] text-mint-600 dark:text-mint-400 font-medium">
                  ✓ Public reply: &quot;Check your DM! 🚀&quot;
                </p>
              </div>
              <div className="rounded-2xl border border-brand-200 bg-brand-gradient p-3 text-white shadow-glow">
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  Instant Private DM
                </span>
                <p className="mt-1 font-semibold">
                  Here is your workout guide! Tap below to get instant access.
                </p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-[10px] font-bold">
                  Buy for ₹499 (UPI) →
                </div>
              </div>
            </div>
          </div>

          {/* 5. Coupons, Order Bumps & Upsells */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Coupons &amp; Order Bumps
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Boost average order value by 35% with 1-click checkout order bumps,
                flat or percentage discount codes, and usage limits.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-xs dark:border-amber-700/40 dark:bg-amber-950/20">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Order Bump: +₹199
              </p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300">
                Add 100+ Canva Editable Templates
              </p>
            </div>
          </div>

          {/* 6. Lead Capture & Customer List */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Lead Capture &amp; Contacts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Own your audience. Collect WhatsApp numbers and verified emails with
                free lead magnets. Filter, tag, and export CSV anytime.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-canvas-darkBorder dark:bg-white/5 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Audience List</span>
                <span className="text-brand-600">CSV Export</span>
              </div>
              <p className="text-[10px] text-slate-400">
                100% creator owned · Zero lock-in
              </p>
            </div>
          </div>

          {/* 7. Real-Time Analytics */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Creator Analytics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Live revenue charts, conversion rates, block click analytics, top
                selling products, and DM attribution tracking.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-canvas-darkBorder dark:bg-white/5 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Conversion Rate</p>
                <p className="font-display text-base font-bold text-mint-600">
                  4.8%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Total Views</p>
                <p className="font-display text-base font-bold">14,280</p>
              </div>
            </div>
          </div>

          {/* 8. Automatic GST-Ready Invoices */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Automatic Invoices
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Every successful order automatically generates an itemized,
                tax-compliant PDF invoice delivered straight to the buyer&apos;s email.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-xs dark:border-emerald-700/40 dark:bg-emerald-950/20 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium text-emerald-900 dark:text-emerald-200">
                GST &amp; PAN compliant invoices generated automatically
              </span>
            </div>
          </div>

          {/* 9. Instant Payouts Tracking */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Transparent Ledger &amp; Payouts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Double-entry creator ledger. Real-time balance tracking, clear
                platform fee breakdown, and payouts directly to your Indian bank
                account or UPI ID.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-canvas-darkBorder dark:bg-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Available Balance</p>
                <p className="font-display text-base font-bold text-slate-900 dark:text-white">
                  ₹28,450
                </p>
              </div>
              <Badge variant="accent">Instant Request</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

