import React from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing the use of Ezsygram platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <Badge variant="primary">Legal</Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400">
              *India-appropriate draft · Last updated: November 2026
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              Welcome to <strong>Ezsygram</strong> (&quot;Platform&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;).
              By accessing or using Ezsygram, you agree to be bound by these Terms
              of Service and all applicable laws and regulations of India.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              1. Platform Overview
            </h2>
            <p>
              Ezsygram provides software tools enabling Indian creators,
              coaches, and businesses to build link-in-bio storefronts, sell
              digital products and courses, accept UPI and digital payments via
              licensed payment aggregator partners, and automate interactions
              using official Meta Instagram APIs.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              2. Creator Accounts &amp; Conduct
            </h2>
            <p>
              You must be at least 18 years of age and legally competent to enter
              into contracts in India. You agree not to upload, sell, or promote
              illegal goods, counterfeit products, adult content, fraudulent
              schemes, hate speech, or content infringing any intellectual
              property rights.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              3. Payments, Fees &amp; Payouts
            </h2>
            <p>
              All prices in India are stored and processed in Indian Rupees (INR).
              Platform fees are charged per your selected plan (Free: 10%, Pro:
              5%, Business: 0%–2%). Payouts are made directly to your verified
              Indian bank account or UPI ID. Creators are solely responsible for
              complying with applicable Indian tax and GST laws.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              4. Instagram &amp; Meta API Compliance
            </h2>
            <p>
              Use of our Instagram automation features is subject to Meta&apos;s
              Terms of Service and Developer Policies. You must not use automation
              for unsolicited spam or deceptive marketing. We reserve the right
              to throttle or suspend automation for accounts violating Meta rules.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              5. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the
              laws of the Republic of India. Any disputes arising hereunder shall
              be subject to the exclusive jurisdiction of the competent courts of
              India.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

