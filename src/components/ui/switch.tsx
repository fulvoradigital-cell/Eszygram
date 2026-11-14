"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  id?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  size = "md",
  id,
  className,
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  const trackClasses =
    size === "sm" ? "h-6 w-10 p-0.5" : "h-7 w-12 p-1";
  const thumbClasses =
    size === "sm"
      ? checked
        ? "h-5 w-5 translate-x-4"
        : "h-5 w-5 translate-x-0"
      : checked
        ? "h-5 w-5 translate-x-5"
        : "h-5 w-5 translate-x-0";

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                "block text-sm font-medium text-slate-900 dark:text-slate-100",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-canvas-dark",
          checked
            ? "bg-brand-gradient"
            : "bg-slate-200 dark:bg-canvas-darkBorder",
          trackClasses
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform duration-200",
            thumbClasses
          )}
        />
      </button>
    </div>
  );
}

