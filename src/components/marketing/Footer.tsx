"use client";

import React from "react";
import Link from "next/link";
import { Heart, Instagram, Mail, ShieldCheck, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/marketing/LanguageSwitcher";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 dark:border-canvas-darkBorder dark:bg-canvas-dark dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Col (5 cols) */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="inline-block">
              <Logo variant="full" size="md" showTagline />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              The all-in-one link-in-bio storefront and Instagram DM automation
              platform built for Indian creators, coaches, educators, and small
              businesses. Sell digital products, courses, and sessions with
              instant UPI payments.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-300"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-300"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Col (2 cols) */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#automation" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Instagram Automation
                </a>
              </li>
            </ul>
          </div>

          {/* Company Col (2 cols) */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Col (3 cols) */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-brand-600 dark:hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 dark:border-canvas-darkBorder">
          <p>© {new Date().getFullYear()} Ezsygram. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Made in India 🇮🇳
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

