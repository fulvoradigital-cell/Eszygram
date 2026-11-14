"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "destructive"
  | "default"
  | "gradient";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gradient text-white shadow-glow hover:bg-brand-gradient-hover hover:brightness-105 active:scale-[0.985]",
  gradient:
    "bg-brand-gradient text-white shadow-glow hover:bg-brand-gradient-hover hover:brightness-105 active:scale-[0.985]",
  default:
    "bg-brand-gradient text-white shadow-glow hover:bg-brand-gradient-hover hover:brightness-105 active:scale-[0.985]",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-soft active:scale-[0.985]",
  accent:
    "bg-coral-gradient text-white shadow-glow-coral hover:brightness-105 active:scale-[0.985]",
  outline:
    "border border-slate-200 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 dark:border-canvas-darkBorder dark:bg-canvas-darkCard dark:text-slate-100 dark:hover:border-brand-500 dark:hover:bg-brand-900/20",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
  destructive:
    "bg-rose-600 text-white shadow-soft hover:bg-rose-700 active:scale-[0.985]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "h-9 px-3 text-xs rounded-xl gap-1.5",
  sm: "h-10 px-4 text-sm rounded-xl gap-2",
  md: "h-11 px-5 text-sm rounded-2xl gap-2",
  lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      asChild = false,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 dark:focus-visible:ring-offset-canvas-dark",
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      fullWidth && "w-full",
      className
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      return React.cloneElement(child, {
        className: cn(buttonClasses, child.props.className),
        ...props,
      });
    }

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
