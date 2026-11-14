"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { LanguageSwitcher } from "@/components/marketing/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Automation", href: "#automation" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-slate-200/80 bg-white/80 py-3 shadow-soft backdrop-blur-xl dark:border-canvas-darkBorder/80 dark:bg-canvas-dark/80"
            : "bg-transparent py-5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo variant="full" size="md" showTagline />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1.5 shadow-soft backdrop-blur-md dark:border-canvas-darkBorder dark:bg-canvas-darkCard/70 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden items-center gap-3 sm:flex">
            <LanguageSwitcher />
            <ThemeToggle />

            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>

            <Link href="/auth/signup">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Start free
              </Button>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft transition-colors dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-200"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Animated Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-white/95 px-6 pb-8 pt-6 backdrop-blur-2xl dark:bg-canvas-dark/95 sm:hidden"
          >
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-canvas-darkBorder">
              <Logo variant="full" size="md" showTagline />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center space-y-4 py-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-2xl font-bold tracking-tight text-slate-900 transition-colors hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="space-y-4 border-t border-slate-100 pt-6 dark:border-canvas-darkBorder">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Language</span>
                <LanguageSwitcher />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth size="lg">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Start free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

