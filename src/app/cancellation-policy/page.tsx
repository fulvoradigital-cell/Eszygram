import React from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "Subscription cancellation terms for Ezsygram Pro and Business plans.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas-light text-slate-900 antialiased dark:bg-canvas-dark dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <Badge variant="primary">Billing &amp; Subscriptions</Badge>
            <h1 className="font-display text-fluid-hero font-extrabold tracking-tight text-slate-900 dark:text-white">
              Cancellation Policy
            </h1>
            <p className="text-xs text-slate-400">
              *India-appropriate draft · Last updated: November 2026
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              This Cancellation Policy outlines how creators can manage, pause,
              or cancel paid subscription plans (Pro or Business) on{" "}
              <strong>Ezsygram</strong>.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              1. Anytime Cancellation
            </h2>
            <p>
              You can cancel your paid subscription at any time directly from
              your Ezsygram Dashboard under <strong>Settings &gt; Billing</strong>.
              There are no long-term lock-ins or cancellation penalties.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              2. Effect of Cancellation
            </h2>
            <p>
              When you cancel, your paid subscription remains active until the end
              of your current pre-paid billing cycle (monthly or yearly). After
              that date, your account transitions gracefully to the Free plan.
              Your existing products and storefront stay live; however, features
              exclusive to paid tiers (such as Instagram DM automation and badge
              removal) will be paused.
            </p>

            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white pt-4">
              3. Recurring Mandates (e-Mandate / UPI Autopay)
            </h2>
            <p>
              In compliance with Reserve Bank of India (RBI) recurring payment
              directives, you receive notification prior to any automated renewal.
              You may revoke recurring mandates directly from your UPI app or
              through our dashboard.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

