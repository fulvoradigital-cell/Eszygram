import React from "react";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { CtaBand } from "@/components/marketing/CtaBand";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { PricingSection } from "@/components/marketing/PricingSection";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing Plans — Free, Pro & Business",
  description:
    "Transparent pricing for Indian creators. Start free, upgrade for Instagram automation, lower platform fees, and custom domain.",
};

const COMPARISON_ROWS = [
  { feature: "Storefront Products Limit", free: "3 Products", pro: "Unlimited", biz: "Unlimited" },
  { feature: "Platform Fee", free: "10%", pro: "5%", biz: "0% to 2%" },
  { feature: "UPI Instant Checkout", free: "Yes", pro: "Yes", biz: "Yes" },
  { feature: "Instagram Comment-to-DM Automation", free: "No", pro: "Yes", biz: "Yes" },
  { feature: "Video Course Lesson Viewer", free: "No", pro: "Yes", biz: "Yes" },
  { feature: "Custom Coupons & Order Bumps", free: "No", pro: "Yes", biz: "Yes" },
  { feature: "Remove Ezsygram Badge", free: "No", pro: "Yes", biz: "Yes" },
  { feature: "Custom Domain (yourname.com)", free: "No", pro: "No", biz: "Yes" },
  { feature: "Tax-Compliant PDF Invoices", free: "Standard", pro: "Automatic", biz: "Automatic + GSTIN" },
  { feature: "Audience CSV Export", free: "Yes", pro: "Yes", biz: "Yes" },
  { feature: "Support SLA", free: "Community", pro: "Standard Email", biz: "VIP WhatsApp 24/7" },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <PricingSection />

        {/* Feature Comparison Matrix Table */}
        <section className="py-16 sm:py-24 bg-white/70 dark:bg-canvas-darkCard/50 border-t border-slate-200/80 dark:border-canvas-darkBorder">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3">
              <Badge variant="primary">Deep Comparison</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Detailed Plan Feature Matrix
              </h2>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-soft dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50 dark:border-canvas-darkBorder dark:bg-white/[0.03]">
                    <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Feature</th>
                    <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white text-center">Free</th>
                    <th className="p-4 sm:p-5 font-bold text-brand-600 dark:text-brand-400 text-center">Pro</th>
                    <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white text-center">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-canvas-darkBorder">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                      <td className="p-4 sm:p-5 font-medium text-slate-800 dark:text-slate-200">
                        {row.feature}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-slate-600 dark:text-slate-400">
                        {row.free}
                      </td>
                      <td className="p-4 sm:p-5 text-center font-bold text-brand-700 dark:text-brand-300">
                        {row.pro}
                      </td>
                      <td className="p-4 sm:p-5 text-center font-semibold text-slate-900 dark:text-white">
                        {row.biz}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <FaqAccordion />
        <CtaBand />
      </main>

      <Footer />
    </div>
  );
}

