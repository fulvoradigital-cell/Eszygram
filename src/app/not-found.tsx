import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-mesh px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
          <Compass className="h-7 w-7" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-coral-500">
          404 · Page Not Found
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
          This link doesn&apos;t exist yet
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page or creator handle you&apos;re looking for may have moved or
          hasn&apos;t been claimed yet.
        </p>

        <div className="mt-6 flex justify-center">
          <Link href="/">
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Ezsygram
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

