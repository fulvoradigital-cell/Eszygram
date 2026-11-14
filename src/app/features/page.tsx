import React from "react";
import type { Metadata } from "next";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  Download,
  GanttChartSquare,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Features — Storefront, UPI Payments & Instagram Automation",
  description:
    "Explore Ezsygram's full suite of creator tools: Link-in-bio storefront, digital products, course hosting, instant UPI checkout, and automated Instagram DMs.",
};

const FEATURE_PILLARS = [
  {
    icon: <GanttChartSquare className="h-6 w-6 text-brand-600" />,
    title: "1. Link-in-Bio Storefront Builder",
    description:
      "A fast, mobile-first storefront engineered specifically for Instagram in-app browsers. Drag, drop, and customize blocks in seconds.",
    bullets: [
      "6+ Indian creator theme presets with dark mode support",
      "Block types for digital files, courses, bookings, lead magnets, and text",
      "Real-time live mobile preview while you build",
      "Customizable SEO title, description, and social OG preview image",
    ],
  },
  {
    icon: <Download className="h-6 w-6 text-coral-500" />,
    title: "2. Digital Products & Video Courses",
    description:
      "Sell any format: eBooks, guides, spreadsheets, templates, multi-chapter video masterclasses, and 1:1 consultation appointments.",
    bullets: [
      "Private S3-compatible file storage with expiring signed download URLs",
      "Video course viewer with organized modules and progress tracking",
      "Interactive 1:1 appointment calendar with slot booking",
      "Pay-what-you-want and fixed pricing tiers stored securely in paise",
    ],
  },
  {
    icon: <Zap className="h-6 w-6 text-mint-500" />,
    title: "3. UPI-First 1-Page Instant Checkout",
    description:
      "Frictionless guest checkout tailored for Indian buyers. No account creation or password hurdle required to purchase.",
    bullets: [
      "Direct UPI Intent opening Google Pay, PhonePe, Paytm, or BHIM with 1 tap",
      "Dynamic on-screen QR codes for desktop-to-mobile payment",
      "Debit, credit cards, and netbanking fallback via Razorpay",
      "Automatic tax-compliant PDF invoices sent to buyer email upon payment",
    ],
  },
  {
    icon: <Bot className="h-6 w-6 text-indigo-600" />,
    title: "4. Official Instagram Comment & DM Automation",
    description:
      "Turn your Instagram content into a 24/7 automated sales machine powered by Meta's official Graph API.",
    bullets: [
      "Trigger instant private DMs when followers comment target keywords",
      "Automated public comment replies with randomized variations",
      "Smart follow-up messages if the buyer does not complete purchase",
      "Full analytics on Reel views, comment triggers, DM opens, and revenue",
    ],
  },
  {
    icon: <Wallet className="h-6 w-6 text-amber-500" />,
    title: "5. Transparent Ledger & Direct Bank Payouts",
    description:
      "Maintain 100% financial clarity. Every order, fee, and refund is recorded in an immutable creator ledger.",
    bullets: [
      "Real-time available vs. pending balance tracking",
      "Transparent platform fee deduction (10% Free, 5% Pro, 0-2% Business)",
      "Instant payout requests to Indian bank account (NEFT/IMPS) or UPI ID",
      "Detailed financial transaction logs and CSV export",
    ],
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="primary" dot>
              Product Architecture
            </Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built for speed. Built to convert.
            </h1>
            <p className="text-fluid-lg text-slate-600 dark:text-slate-300">
              Ezsygram replaces 5 different fragmented tools with one cohesive,
              production-grade creator revenue platform.
            </p>
          </div>

          {/* Feature Deep Dive Pillars */}
          <div className="space-y-12">
            {FEATURE_PILLARS.map((pillar, index) => (
              <div
                key={pillar.title}
                className="rounded-4xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-card dark:border-canvas-darkBorder dark:bg-canvas-darkCard"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-canvas-darkBorder">
                    {pillar.icon}
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {pillar.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                      {pillar.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                      {pillar.bullets.map((b) => (
                        <div
                          key={b}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                        >
                          <CheckCircle2 className="h-4 w-4 text-mint-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <CtaBand />
        </div>
      </main>

      <Footer />
    </div>
  );
}

