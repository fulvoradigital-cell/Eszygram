"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-brand-gradient px-6 py-14 text-center text-white shadow-elevated sm:px-12 sm:py-20">
          {/* Subtle Background Glow Rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-coral-500/20 blur-2xl"
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-coral-300" />
              <span>Free to start · Instant UPI setup · No credit card</span>
            </div>

            <h2 className="font-display text-fluid-3xl sm:text-fluid-hero font-extrabold tracking-tight text-white leading-tight">
              Your audience is ready. <br className="hidden sm:inline" />
              Start selling today.
            </h2>

            <p className="text-fluid-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Indian creators, coaches, and small businesses
              turning comments into customers. Launch your store in 5 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  className="bg-white text-slate-950 hover:bg-slate-100 font-bold shadow-soft"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start free
                </Button>
              </Link>

              <Link href="/features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  className="border-white/40 text-white hover:bg-white/15"
                >
                  Explore all features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

