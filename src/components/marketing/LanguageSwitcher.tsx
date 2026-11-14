"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-soft backdrop-blur-md dark:border-canvas-darkBorder dark:bg-canvas-darkCard/70 dark:text-slate-300",
        className
      )}
    >
      <Globe className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-md px-1.5 py-0.5 transition-colors",
          lang === "en"
            ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-900/50 dark:text-brand-200"
            : "hover:text-slate-900 dark:hover:text-white opacity-70"
        )}
      >
        EN
      </button>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <button
        type="button"
        onClick={() => setLang("hi")}
        title="Hindi localization coming soon"
        className={cn(
          "rounded-md px-1.5 py-0.5 transition-colors",
          lang === "hi"
            ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-900/50 dark:text-brand-200"
            : "hover:text-slate-900 dark:hover:text-white opacity-70"
        )}
      >
        हिन्दी
      </button>
    </div>
  );
}

