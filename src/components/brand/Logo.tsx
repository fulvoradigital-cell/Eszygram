"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** "full" renders the squircle icon + wordmark; "icon" renders only the squircle mark. */
  variant?: "full" | "icon";
  /** "light" = dark wordmark for light backgrounds; "dark" = white wordmark for dark backgrounds; "auto" adapts with Tailwind dark mode. */
  theme?: "light" | "dark" | "auto";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: {
    icon: 28,
    wordmark: "text-lg",
    tagline: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    icon: 36,
    wordmark: "text-xl",
    tagline: "text-[11px]",
    gap: "gap-2.5",
  },
  lg: {
    icon: 44,
    wordmark: "text-2xl",
    tagline: "text-xs",
    gap: "gap-3",
  },
  xl: {
    icon: 56,
    wordmark: "text-3xl",
    tagline: "text-xs",
    gap: "gap-3.5",
  },
} as const;

export function LogoMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const bgGradId = `ez-bg-${uid}`;
  const sheenGradId = `ez-sheen-${uid}`;
  const sparkGradId = `ez-spark-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      role="img"
      aria-label="Ezsygram logo mark"
    >
      <defs>
        <linearGradient
          id={bgGradId}
          x1="4"
          y1="4"
          x2="44"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="55%" stopColor="#5B35DF" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient
          id={sheenGradId}
          x1="8"
          y1="2"
          x2="34"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={sparkGradId}
          x1="28"
          y1="19"
          x2="38"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF9678" />
          <stop offset="100%" stopColor="#FF7A59" />
        </linearGradient>
      </defs>

      {/* Rounded-square (squircle) app-icon container */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill={`url(#${bgGradId})`}
      />
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill={`url(#${sheenGradId})`}
      />
      <rect
        x="2.6"
        y="2.6"
        width="42.8"
        height="42.8"
        rx="12.4"
        stroke="#FFFFFF"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />

      {/* Bold geometric capital E in white */}
      {/* Vertical spine */}
      <rect x="13" y="12" width="5.8" height="24" rx="2.4" fill="#FFFFFF" />
      {/* Top horizontal bar */}
      <rect x="13" y="12" width="21.5" height="5.5" rx="2.4" fill="#FFFFFF" />
      {/* Bottom horizontal bar */}
      <rect x="13" y="30.5" width="21.5" height="5.5" rx="2.4" fill="#FFFFFF" />
      {/* Middle bar with angled accent notch on right tip */}
      <path
        d="M15.4 21.25H27.4L25.1 24L27.4 26.75H15.4C14.0745 26.75 13 25.6755 13 24.35V23.65C13 22.3245 14.0745 21.25 15.4 21.25Z"
        fill="#FFFFFF"
      />

      {/* Accent spark beside the middle bar notch */}
      <path
        d="M32.8 18.8L34.05 22.75L38 24L34.05 25.25L32.8 29.2L31.55 25.25L27.6 24L31.55 22.75L32.8 18.8Z"
        fill={`url(#${sparkGradId})`}
      />
    </svg>
  );
}

export function Logo({
  variant = "full",
  theme = "auto",
  size = "md",
  showTagline = false,
  className,
}: LogoProps) {
  const scale = SIZE_MAP[size];

  const wordmarkTone =
    theme === "dark"
      ? "text-white"
      : theme === "light"
        ? "text-slate-900"
        : "text-slate-900 dark:text-white";

  const taglineTone =
    theme === "dark"
      ? "text-slate-300"
      : theme === "light"
        ? "text-slate-500"
        : "text-slate-500 dark:text-slate-400";

  return (
    <span
      className={cn(
        "inline-flex items-center select-none",
        scale.gap,
        className
      )}
    >
      <LogoMark size={scale.icon} />
      {variant === "full" && (
        <span className="inline-flex flex-col leading-none">
          <span
            className={cn(
              "font-display font-extrabold tracking-tight",
              scale.wordmark,
              wordmarkTone
            )}
          >
            Ezsy<span className="text-gradient">gram</span>
          </span>
          {showTagline && (
            <span
              className={cn(
                "mt-0.5 font-medium tracking-wide",
                scale.tagline,
                taglineTone
              )}
            >
              Sell. Automate. Grow.
            </span>
          )}
        </span>
      )}
    </span>
  );
}

