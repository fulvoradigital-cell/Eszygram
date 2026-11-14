import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  primary:
    "bg-brand-50 text-brand-700 border border-brand-200/80 dark:bg-brand-900/40 dark:text-brand-200 dark:border-brand-700/60",
  accent:
    "bg-coral-50 text-coral-700 border border-coral-200/80 dark:bg-coral-700/20 dark:text-coral-200 dark:border-coral-500/30",
  success:
    "bg-mint-50 text-mint-700 border border-mint-200/80 dark:bg-mint-700/20 dark:text-mint-200 dark:border-mint-500/30",
  warning:
    "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700/50",
  danger:
    "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-700/50",
  outline:
    "border border-slate-200 text-slate-700 dark:border-canvas-darkBorder dark:text-slate-300",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-slate-500",
  primary: "bg-brand-600 dark:bg-brand-400",
  accent: "bg-coral-500",
  success: "bg-mint-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  outline: "bg-slate-400",
};

export function Badge({
  variant = "default",
  size = "sm",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-tight",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSES[variant])}
        />
      )}
      {children}
    </span>
  );
}

