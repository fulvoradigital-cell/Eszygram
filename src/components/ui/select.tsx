"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      options,
      placeholder,
      children,
      className,
      containerClassName,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "flex h-11 w-full appearance-none rounded-2xl border bg-white px-4 pr-10 text-sm text-slate-900 shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600/25 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-canvas-darkCard dark:text-slate-100",
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-brand-600 dark:border-canvas-darkBorder dark:focus:border-brand-400",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>

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

Select.displayName = "Select";

