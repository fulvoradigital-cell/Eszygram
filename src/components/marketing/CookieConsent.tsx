"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "ezsygram_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (!saved) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const accept = (level: "all" | "essential") => {
    try {
      localStorage.setItem(CONSENT_KEY, level);
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Cookie consent banner"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 30, scale: 0.96 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 20, scale: 0.96 }
          }
          transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-elevated backdrop-blur-xl dark:border-canvas-darkBorder dark:bg-canvas-darkCard/95 sm:bottom-6 sm:left-6 sm:right-auto sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              <Cookie className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  We respect your privacy
                </h4>
                <button
                  type="button"
                  onClick={() => accept("essential")}
                  aria-label="Dismiss cookie notice"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Ezsygram uses cookies to secure your creator session, remember
                your theme preference, and process UPI checkouts smoothly. Read
                our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  size="xs"
                  variant="primary"
                  onClick={() => accept("all")}
                >
                  Accept All
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => accept("essential")}
                >
                  Essential Only
                </Button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

