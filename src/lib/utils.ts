import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and resolves Tailwind utility conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an integer amount in paise into Indian Rupee currency display.
 */
export function formatINR(
  paise: number,
  options?: { showDecimals?: boolean }
): string {
  const rupees = paise / 100;
  const showDecimals = options?.showDecimals ?? paise % 100 !== 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);
}

/**
 * Extracts up to two uppercase initials from a display name for avatars.
 */
export function getInitials(name?: string | null): string {
  if (!name) return "EZ";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "EZ";
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + second).toUpperCase() || "EZ";
}

/**
 * Resolves the canonical public application URL without trailing slash.
 */
export function getAppUrl(): string {
  const raw =
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

