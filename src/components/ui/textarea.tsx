"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      className,
      containerClassName,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-coral-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            "flex min-h-[104px] w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-soft transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-canvas-darkCard dark:text-slate-100 dark:placeholder:text-slate-500",
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 focus:border-brand-600 dark:border-canvas-darkBorder dark:focus:border-brand-400",
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : (
          helperText && (
            <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

