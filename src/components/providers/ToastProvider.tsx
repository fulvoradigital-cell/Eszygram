"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastCard, type ToastItem, type ToastVariant } from "@/components/ui/toast";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "info",
      durationMs = 4200,
    }: ToastOptions) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setItems((prev) => [...prev.slice(-4), { id, title, description, variant }]);

      if (durationMs > 0) {
        setTimeout(() => {
          dismiss(id);
        }, durationMs);
      }
    },
    [dismiss]
  );

  const toast = useMemo(
    () => ({
      success: (title: string, description?: string) =>
        showToast({ title, description, variant: "success" }),
      error: (title: string, description?: string) =>
        showToast({ title, description, variant: "error" }),
      info: (title: string, description?: string) =>
        showToast({ title, description, variant: "info" }),
      warning: (title: string, description?: string) =>
        showToast({ title, description, variant: "warning" }),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

