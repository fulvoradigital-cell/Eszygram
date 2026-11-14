"use client";

import React, { useEffect, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerSide = "right" | "left" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: DrawerSide;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = "right",
  children,
  footer,
  className,
}: DrawerProps) {
  const titleId = useId();
  const descId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const positionClasses =
    side === "bottom"
      ? "inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-3xl border-t"
      : side === "left"
        ? "inset-y-0 left-0 h-full w-full max-w-md rounded-r-3xl border-r"
        : "inset-y-0 right-0 h-full w-full max-w-md rounded-l-3xl border-l";

  const initialPos = shouldReduceMotion
    ? { opacity: 1 }
    : side === "bottom"
      ? { y: "100%" }
      : side === "left"
        ? { x: "-100%" }
        : { x: "100%" };

  const exitPos = shouldReduceMotion
    ? { opacity: 0 }
    : side === "bottom"
      ? { y: "100%" }
      : side === "left"
        ? { x: "-100%" }
        : { x: "100%" };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={initialPos}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={exitPos}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              duration: shouldReduceMotion ? 0 : undefined,
            }}
            className={cn(
              "fixed z-10 flex flex-col border-slate-200/80 bg-white shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard",
              positionClasses,
              className
            )}
          >
            {side === "bottom" && (
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-canvas-darkBorder" />
            )}

            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-canvas-darkBorder">
              <div className="space-y-1">
                {title && (
                  <h2
                    id={titleId}
                    className="font-display text-lg font-bold text-slate-900 dark:text-white"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descId}
                    className="text-sm text-slate-500 dark:text-slate-400"
                  >
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-canvas-darkBorder">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

