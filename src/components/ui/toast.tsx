"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "info" | "warning";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, title, description, variant = "default" } = toast;

  const icons = {
    default: <Info className="h-5 w-5 text-brand-600 shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
  };

  const borders = {
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50/50",
    error: "border-rose-200 bg-rose-50/50",
    info: "border-blue-200 bg-blue-50/50",
    warning: "border-amber-200 bg-amber-50/50",
  };

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-soft-lg transition-all animate-in slide-in-from-top-2 sm:slide-in-from-bottom-2 duration-300",
        borders[variant]
      )}
    >
      {icons[variant]}
      <div className="flex-1 space-y-0.5">
        <h5 className="text-sm font-semibold text-slate-900">{title}</h5>
        {description && <p className="text-xs text-slate-600">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
