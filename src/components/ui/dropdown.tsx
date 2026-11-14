"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error("Dropdown components must be used inside <Dropdown>");
  }
  return ctx;
}

export function Dropdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDropdown();

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        "inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-2xl",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenu({
  align = "right",
  className,
  children,
}: {
  align?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useDropdown();

  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute z-50 mt-2 min-w-[200px] rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-elevated dark:border-canvas-darkBorder dark:bg-canvas-darkCard",
        align === "right" ? "right-0" : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownSeparator() {
  return (
    <div
      role="separator"
      className="my-1 h-px bg-slate-100 dark:bg-canvas-darkBorder"
    />
  );
}

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
}

export function DropdownItem({
  icon,
  destructive = false,
  className,
  onClick,
  children,
  ...props
}: DropdownItemProps) {
  const { setOpen } = useDropdown();

  return (
    <button
      type="button"
      role="menuitem"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        "flex min-h-[38px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
        destructive
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 opacity-80">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

