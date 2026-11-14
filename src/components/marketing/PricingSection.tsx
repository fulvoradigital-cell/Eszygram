"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/marketing-data";

export { PLANS };

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" dot>
            Simple, Transparent Pricing
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Plans that grow with your income
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            Start completely free. Upgrade to Pro when you want Instagram DM
            automation and lower platform fees. No hidden charges.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span
              className={`text-sm font-semibold ${
                billingCycle === "monthly"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400"
              }`}
            >
              Monthly
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === "yearly"}
              onClick={() =>
                setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
              }
              className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full bg-slate-200 p-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:bg-canvas-darkBorder"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-brand-gradient shadow-md transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-semibold ${
                  billingCycle === "yearly"
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400"
                }`}
              >
                Yearly
              </span>
              <span className="rounded-full bg-mint-50 px-2 py-0.5 text-[10px] font-bold text-mint-700 dark:bg-mint-900/40 dark:text-mint-300">
                2 Months Free
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const period = billingCycle === "monthly" ? "/month" : "/year";

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                  plan.popular
                    ? "border-2 border-brand-500 bg-white shadow-glow dark:bg-canvas-darkCard dark:border-brand-400 sm:-translate-y-2"
                    : "border border-slate-200/80 bg-white shadow-card dark:border-canvas-darkBorder dark:bg-canvas-darkCard"
                }`}
              >
                {/* Popular Highlight Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold text-white shadow-soft">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Tagline */}
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">
                        {price === 0 ? "₹0" : `₹${price.toLocaleString("en-IN")}`}
                      </span>
                      {price > 0 && (
                        <span className="text-xs font-semibold text-slate-400">
                          {period}
                        </span>
                      )}
                    </div>
                    <Badge variant="accent" size="sm" className="mt-2">
                      {plan.feePercent}
                    </Badge>
                  </div>

                  {/* CTA Button */}
                  <Link href={plan.href} className="block">
                    <Button
                      fullWidth
                      variant={plan.popular ? "primary" : "outline"}
                      size="md"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Feature List */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-canvas-darkBorder">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Included features:
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-mint-500 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((nf) => (
                        <li
                          key={nf}
                          className="flex items-start gap-2 text-slate-400 dark:text-slate-500 opacity-60"
                        >
                          <X className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{nf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 text-center text-[11px] text-slate-400 border-t border-slate-100 dark:border-canvas-darkBorder">
                  Cancel anytime · Instant activation
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

