import React from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund terms for digital products, courses, and slot bookings on Ezsygram.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <Badge variant="primary">Consumer Protection</Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Refund Policy
            </h1>
            <p className="text-xs text-slate-400">
              *India-appropriate draft · Last updated: November 2026
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              This Refund Policy applies to all purchases made through creator
              storefronts hosted on <strong>Ezsygram</strong>.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              1. Digital Downloads &amp; Templates
            </h2>
            <p>
              Due to the immediate digital delivery nature of downloadable files
              (PDF guides, templates, presets, spreadsheets), purchases are
              generally non-refundable once the download link has been accessed,
              except in cases of duplicate payment, defective files, or
              misrepresented content.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              2. 1:1 Consultation &amp; Slot Bookings
            </h2>
            <p>
              Buyers may cancel or reschedule a 1:1 appointment up to 24 hours
              before the scheduled session time for a full refund. Cancellations
              requested less than 24 hours prior to the session are subject to
              the individual creator&apos;s published storefront terms.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              3. Online Video Courses
            </h2>
            <p>
              Creators may optionally designate a satisfaction guarantee (e.g.,
              7-day refund window) on their course landing pages. If a creator
              offers a refund window, buyers can request a refund within that
              timeframe provided less than 25% of course lessons have been viewed.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              4. How Refunds Are Processed
            </h2>
            <p>
              Approved refunds are credited directly back to the original source of
              payment (UPI account, bank account, or card) within 5 to 7 business
              days pursuant to Indian banking clearing cycles.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

