"use client";

import { useEffect } from "react";

interface StorefrontTrackerProps {
  username: string;
}

export function StorefrontTracker({ username }: StorefrontTrackerProps) {
  useEffect(() => {
    // Record page view on load
    try {
      fetch(`/api/store/${encodeURIComponent(username)}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "view",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      }).catch(() => {});
    } catch {
      // Ignore network errors in tracking
    }

    // Attach click delegate to track block link clicks
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("[data-block-id]");
      if (target) {
        const blockId = target.getAttribute("data-block-id");
        if (blockId) {
          fetch(`/api/store/${encodeURIComponent(username)}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "click",
              blockId,
            }),
          }).catch(() => {});
        }
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [username]);

  return null;
}
