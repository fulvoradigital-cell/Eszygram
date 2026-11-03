import { NextRequest } from "next/server";
import { apiError } from "@/lib/api-response";

interface RateLimitStore {
  [key: string]: {
    tokens: number;
    lastRefill: number;
  };
}

declare global {
  // eslint-disable-next-line no-var
  var rateLimitStores: Map<string, RateLimitStore> | undefined;
}

const stores = globalThis.rateLimitStores || new Map<string, RateLimitStore>();
if (!globalThis.rateLimitStores) {
  globalThis.rateLimitStores = stores;
}

/**
 * In-memory sliding window token bucket rate limiter for API routes.
 *
 * @param req NextRequest
 * @param prefix Unique bucket namespace (e.g. "auth_login", "check_username")
 * @param maxRequests Maximum tokens per window
 * @param windowMs Window duration in milliseconds (e.g. 60_000 for 1 minute)
 */
export function checkRateLimit(
  req: NextRequest,
  prefix: string,
  maxRequests = 5,
  windowMs = 60_000
) {
  // Extract client IP address or proxy header
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const key = `${prefix}:${ip}`;

  if (!stores.has(prefix)) {
    stores.set(prefix, {});
  }

  const store = stores.get(prefix)!;
  const now = Date.now();

  // Periodically clean up entries older than 2 * windowMs
  if (Math.random() < 0.05) {
    for (const k in store) {
      if (now - store[k].lastRefill > windowMs * 2) {
        delete store[k];
      }
    }
  }

  if (!store[key]) {
    store[key] = {
      tokens: maxRequests - 1,
      lastRefill: now,
    };
    return {
      isRateLimited: false,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  const entry = store[key];
  const elapsed = now - entry.lastRefill;

  // If window has passed, reset tokens
  if (elapsed > windowMs) {
    entry.tokens = maxRequests - 1;
    entry.lastRefill = now;
    return {
      isRateLimited: false,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    const remainingTime = Math.ceil((windowMs - elapsed) / 1000);
    return {
      isRateLimited: false,
      limit: maxRequests,
      remaining: entry.tokens,
      resetInSeconds: remainingTime,
    };
  }

  // Rate limit exceeded
  const resetInSeconds = Math.ceil((windowMs - elapsed) / 1000);
  return {
    isRateLimited: true,
    limit: maxRequests,
    remaining: 0,
    resetInSeconds,
  };
}

/**
 * Convenience helper to return a standardized 429 response if rate limited.
 */
export function rateLimitResponse(resetInSeconds: number) {
  return apiError(
    `Too many requests. Please wait ${resetInSeconds} seconds before trying again.`,
    429,
    "RATE_LIMIT_EXCEEDED",
    { retryAfterSeconds: resetInSeconds }
  );
}
