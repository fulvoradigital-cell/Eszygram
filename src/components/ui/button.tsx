import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "accent"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none";

    const variantStyles = {
      primary:
        "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft focus-visible:ring-brand-500",
      accent:
        "bg-accent-500 text-slate-900 font-semibold hover:bg-accent-600 active:bg-accent-700 shadow-soft focus-visible:ring-accent-400",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400",
      outline:
        "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-brand-500",
      ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-soft focus-visible:ring-rose-500",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-lg gap-1.5",
      md: "h-11 px-4 text-sm rounded-xl gap-2",
      lg: "h-13 px-6 text-base rounded-2xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

