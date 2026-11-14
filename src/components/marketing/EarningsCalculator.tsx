"use client";

import React, { useId, useMemo, useState } from "react";
import { Calculator, IndianRupee, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export function EarningsCalculator() {
  const [followers, setFollowers] = useState(25000);
  const [conversionRate, setConversionRate] = useState(2.0); // 2.0%
  const [avgPrice, setAvgPrice] = useState(499); // ₹499

  const audienceId = useId();
  const convId = useId();
  const priceId = useId();

  const calculations = useMemo(() => {
    // Monthly buyers estimate
    const monthlyBuyers = Math.max(1, Math.round(followers * (conversionRate / 100)));
    // Total monthly GMV estimate in Rupees
    const monthlyRevenueRupees = monthlyBuyers * avgPrice;
    // Platform fee (Pro plan is 5%)
    const platformFeeRupees = Math.round(monthlyRevenueRupees * 0.05);
    // Take-home creator earnings
    const netEarningsRupees = monthlyRevenueRupees - platformFeeRupees;

    return {
      monthlyBuyers,
      monthlyRevenueRupees,
      platformFeeRupees,
      netEarningsRupees,
    };
  }, [followers, conversionRate, avgPrice]);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="primary" dot>
            Revenue Potential
          </Badge>
          <h2 className="font-display text-fluid-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Estimate your monthly earnings
          </h2>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            See what happens when you turn just 1% to 3% of your Instagram
            followers into paying buyers with UPI instant checkout.
          </p>
        </div>

        {/* Interactive Calculator Container */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-10 shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Interactive Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Followers */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <label htmlFor={audienceId} className="text-slate-700 dark:text-slate-200">
                    Instagram Followers
                  </label>
                  <span className="font-display font-extrabold text-brand-600 dark:text-brand-400">
                    {followers.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  id={audienceId}
                  type="range"
                  min="2000"
                  max="250000"
                  step="1000"
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-canvas-darkBorder accent-brand-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>2K</span>
                  <span>50K</span>
                  <span>100K</span>
                  <span>250K+</span>
                </div>
              </div>

              {/* Slider 2: Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <label htmlFor={convId} className="text-slate-700 dark:text-slate-200">
                    Monthly Conversion Rate
                  </label>
                  <span className="font-display font-extrabold text-brand-600 dark:text-brand-400">
                    {conversionRate.toFixed(1)}%
                  </span>
                </div>
                <input
                  id={convId}
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-canvas-darkBorder accent-brand-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.5% (Conservative)</span>
                  <span>2.0% (Average)</span>
                  <span>5.0% (Engaged Audience)</span>
                </div>
              </div>

              {/* Slider 3: Average Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <label htmlFor={priceId} className="text-slate-700 dark:text-slate-200">
                    Average Product / Session Price
                  </label>
                  <span className="font-display font-extrabold text-brand-600 dark:text-brand-400">
                    ₹{avgPrice}
                  </span>
                </div>
                <input
                  id={priceId}
                  type="range"
                  min="199"
                  max="4999"
                  step="100"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-canvas-darkBorder accent-brand-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹199 (Templates)</span>
                  <span>₹999 (Mini-Course)</span>
                  <span>₹4,999 (Consultation)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Earnings Summary Display */}
            <div className="lg:col-span-5 rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50/80 via-white to-white p-7 text-center shadow-card dark:border-brand-500/30 dark:from-brand-900/20 dark:via-canvas-dark dark:to-canvas-dark">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Estimated Monthly Take-Home
                </span>
                <p className="font-display text-fluid-3xl font-extrabold text-gradient leading-tight">
                  {formatINR(calculations.netEarningsRupees * 100)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ~{calculations.monthlyBuyers.toLocaleString("en-IN")} sales / month
                </p>
              </div>

              {/* Metric Breakdown */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-canvas-darkBorder space-y-2.5 text-xs text-left">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Gross Monthly Sales</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatINR(calculations.monthlyRevenueRupees * 100)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Pro Fee (5%)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    -{formatINR(calculations.platformFeeRupees * 100)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Annual Projected Income</span>
                  <span className="font-bold text-mint-600 dark:text-mint-400">
                    {formatINR(calculations.netEarningsRupees * 12 * 100)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-white/70 dark:bg-canvas-darkCard/60 p-2.5 text-[10px] text-slate-400">
                *Clearly labeled estimate based on input sliders. Actual earnings
                depend on content consistency, niche demand, and follower engagement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

