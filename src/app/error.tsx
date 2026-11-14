"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Route Error]", error.message);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-mesh px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard">
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-50 text-coral-600 dark:bg-coral-700/20 dark:text-coral-300">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We hit an unexpected bump loading this page. Try refreshing or head
          back to the home screen.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Try again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              fullWidth
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

