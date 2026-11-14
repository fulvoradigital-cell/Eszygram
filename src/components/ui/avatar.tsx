"use client";

import React, { useState } from "react";
import { cn, getInitials } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  src?: string | null;
  alt: string;
  name?: string | null;
  size?: AvatarSize;
  ring?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "h-7 w-7 text-[11px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  ring = false,
  className,
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(src && !imgFailed);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gradient font-display font-bold text-white select-none",
        SIZE_CLASSES[size],
        ring && "ring-2 ring-brand-600 ring-offset-2 dark:ring-offset-canvas-dark",
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? ""}
          alt={alt}
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-label={alt}>{getInitials(name ?? alt)}</span>
      )}
    </span>
  );
}

