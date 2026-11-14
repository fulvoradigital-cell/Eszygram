"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: React.ReactNode; border: string; iconWrap: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-mint-600 dark:text-mint-400" />,
    border: "border-mint-200 dark:border-mint-500/30",
    iconWrap: "bg-mint-50 dark:bg-mint-500/15",
  },
  error: {
    icon: <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
    border: "border-rose-200 dark:border-rose-500/30",
    iconWrap: "bg-rose-50 dark:bg-rose-500/15",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
    border: "border-amber-200 dark:border-amber-500/30",
    iconWrap: "bg-amber-50 dark:bg-amber-500/15",
  },
  info: {
    icon: <Info className="h-4 w-4 text-brand-600 dark:text-brand-300" />,
    border: "border-brand-200 dark:border-brand-500/30",
    iconWrap: "bg-brand-50 dark:bg-brand-500/15",
  },
};

export function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const style = VARIANT_STYLES[item.variant];

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-elevated dark:bg-canvas-darkCard",
        style.border
      )}
    >
      <div
        className={cn(
          "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          style.iconWrap
        )}
      >
        {style.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {item.description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

