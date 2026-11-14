import React from "react";
import type { Metadata } from "next";
import { Award, Heart, Shield, Sparkles, Target, Users } from "lucide-react";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About Us — Empowering Indian Creators",
  description:
    "Learn about Ezsygram's mission to help Indian creators, coaches, and educators monetize their passion with UPI payments and Instagram automation.",
};

const VALUES = [
  {
    title: "India-First Infrastructure",
    description:
      "We engineered every screen for Indian mobile networks, Instagram in-app browsers, and UPI-first instant payments.",
    icon: <Sparkles className="h-6 w-6 text-brand-600" />,
  },
  {
    title: "100% Audience Ownership",
    description:
      "Your audience is yours. You own all emails, phone numbers, and purchase data with unhindered CSV export anytime.",
    icon: <Users className="h-6 w-6 text-coral-500" />,
  },
  {
    title: "Zero Hidden Fees",
    description:
      "Transparent platform pricing. No surprise gateway deductions, no hidden locks, and no hostage data.",
    icon: <Shield className="h-6 w-6 text-mint-500" />,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="primary" dot>
              Our Mission
            </Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Sell. Automate. Grow.
            </h1>
            <p className="text-fluid-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Ezsygram was founded with a singular purpose: empowering Indian
              creators, educators, and indie entrepreneurs to convert attention
              into sustainable, independent income.
            </p>
          </div>

          {/* Story Section */}
          <div className="rounded-4xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-card dark:border-canvas-darkBorder dark:bg-canvas-darkCard space-y-6">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Why we built Ezsygram
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                In India, over 80 million people create content across Instagram,
                YouTube, and WhatsApp. Yet, monetizing digital guides, coaching
                calls, or courses was needlessly broken. Creators spent hours
                manually replying to comments, sending UPI QR screenshots on
                WhatsApp, and chasing payment confirmations.
              </p>
              <p>
                Foreign platforms did not support Indian UPI rails, charged
                exorbitant dollar-denominated monthly subscriptions, or took up
                to 20% of creator earnings.
              </p>
              <p>
                We built <strong>Ezsygram</strong> to be the definitive platform
                for the Indian creator economy: lightning-fast mobile link-in-bio
                storefronts, UPI-first checkout with zero buyer friction, and
                official Instagram comment-to-DM automation that closes sales
                while creators sleep.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-darkCard space-y-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-canvas-darkBorder">
                  {val.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {val.description}
                </p>
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

