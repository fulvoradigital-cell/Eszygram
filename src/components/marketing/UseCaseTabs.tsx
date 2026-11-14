"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Download,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  Palette,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const USE_CASES = [
  {
    id: "coaches",
    label: "Coaches & Consultants",
    headline: "Book discovery calls & sell strategy templates",
    subtext: "Turn high-intent followers into paid 1:1 clients without back-and-forth WhatsApp scheduling.",
    products: [
      { title: "1:1 Career Strategy Session (45m)", price: "₹2,499", type: "Booking" },
      { title: "Resume & Portfolio Review Kit", price: "₹699", type: "Digital File" },
      { title: "Free Discovery Call Intake Form", price: "FREE", type: "Lead Magnet" },
    ],
    highlight: "Automate Slot Booking + Google Meet link auto-creation",
  },
  {
    id: "course-creators",
    label: "Course Creators",
    headline: "Sell self-paced masterclasses with video lessons",
    subtext: "Host multi-chapter courses, secure video lessons, and cheat sheets with zero hosting headache.",
    products: [
      { title: "Complete Freelance Mastery Cohort", price: "₹3,999", type: "Course" },
      { title: "Cold Pitch Email Swipe Files", price: "₹499", type: "Templates" },
      { title: "Free Mini Freelance Checklist", price: "FREE", type: "Lead Magnet" },
    ],
    highlight: "Built-in Lesson Viewer + Student Progress Tracking",
  },
  {
    id: "fitness",
    label: "Fitness Trainers",
    headline: "Sell workout routines & nutrition diet blueprints",
    subtext: "Deliver monthly fitness challenges, workout PDFs, and customized meal plans with UPI payments.",
    products: [
      { title: "30-Day Fat Loss Transformation Guide", price: "₹799", type: "Digital PDF" },
      { title: "1:1 Custom Diet Consultation", price: "₹1,499", type: "Consultation" },
      { title: "Monthly VIP Fitness Membership", price: "₹999/mo", type: "Membership" },
    ],
    highlight: "Expiring Download Vaults prevent unauthorized file sharing",
  },
  {
    id: "designers",
    label: "Designers & Artists",
    headline: "Sell UI kits, Notion setups & Lightroom presets",
    subtext: "Showcase your portfolio and monetize your assets with frictionless UPI checkout.",
    products: [
      { title: "Figma SaaS Design System UI Kit", price: "₹1,299", type: "Design Asset" },
      { title: "Creator Operating System Notion Hub", price: "₹599", type: "Notion Template" },
      { title: "Moody Film Lightroom Presets Pack", price: "₹399", type: "Presets" },
    ],
    highlight: "Zip file delivery + Instant tax-compliant PDF invoices",
  },
  {
    id: "service-providers",
    label: "Service Providers",
    headline: "Accept retainer advance payments & client onboarding",
    subtext: "Collect client intake briefs and initial deposit payments directly from your Instagram bio.",
    products: [
      { title: "Monthly Social Media Management Retainer", price: "₹14,999", type: "Service" },
      { title: "Website UI/UX Audit & Action Plan", price: "₹4,999", type: "Audit" },
      { title: "Project Proposal Intake Form", price: "FREE", type: "Lead Magnet" },
    ],
    highlight: "Custom checkout fields (GSTIN, Website URL, Brief)",
  },
] as const;

export function UseCaseTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const active = USE_CASES[activeTab] ?? USE_CASES[0]!;

  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 dark:bg-canvas-darkCard/40 border-y border-slate-200/70 dark:border-canvas-darkBorder">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" dot>
            Tailored For Your Niche
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built for how you make money.
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            See how different Indian creators structure their storefronts,
            monetize their skills, and get paid with Ezsygram.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {USE_CASES.map((u, idx) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === idx
                  ? "bg-brand-gradient text-white shadow-soft font-bold"
                  : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-canvas-dark dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white border border-slate-200/80 dark:border-canvas-darkBorder"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>

        {/* Active Use Case Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-10 shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <Badge variant="primary">{active.label}</Badge>
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {active.headline}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {active.subtext}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-300">
                <CheckCircle2 className="h-4 w-4 text-mint-500 shrink-0" />
                <span>{active.highlight}</span>
              </div>
            </div>

            {/* Right Sample Storefront Products */}
            <div className="lg:col-span-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sample Storefront Items
              </p>
              {active.products.map((p, i) => (
                <div
                  key={p.title}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:bg-white hover:shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-dark/60 dark:hover:bg-canvas-dark"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {p.title}
                    </p>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {p.type} · Instant UPI
                    </span>
                  </div>
                  <span className="font-display text-base font-extrabold text-brand-600 dark:text-brand-400">
                    {p.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
