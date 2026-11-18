"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

interface DashboardOverviewClientProps {
  username: string;
  displayName: string;
  plan: string;
}

export function DashboardOverviewClient({
  username,
  displayName,
  plan,
}: DashboardOverviewClientProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://ezsygram.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const storeUrl = `${origin}/${username}`;

  function handleCopy() {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast.success("Store Link Copied", `${storeUrl} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Card className="p-5 sm:p-6 bg-gradient-to-br from-brand-violet/5 via-card to-indigo-50/20 dark:to-indigo-950/20 border-brand-violet/20 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
              Welcome back, {displayName}! 👋
            </h1>
            <Badge
              variant={plan === "business" ? "accent" : plan === "pro" ? "brand" : "neutral"}
              size="sm"
              className="uppercase text-[10px] font-extrabold"
            >
              {plan}
            </Badge>
            {plan !== "business" && (
              <Link
                href="/dashboard/settings?tab=billing"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-brand-violet to-brand-indigo hover:opacity-90 transition-opacity shadow-xs whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Upgrade Plan</span>
              </Link>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            Your storefront is live and ready for your Instagram audience.
          </p>
        </div>

        {/* Live Store Link Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-card border border-slate-border flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-muted font-mono truncate max-w-[200px] sm:max-w-xs">
              {storeUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-brand-violet hover:text-brand-violet/80 p-1 transition-colors"
              title="Copy store URL"
            >
              {copied ? <Check className="w-4 h-4 text-mint" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <Button
            asChild
            variant="default"
            size="sm"
            className="h-10 text-xs font-semibold bg-brand-violet hover:bg-brand-violet/90 text-white shrink-0"
          >
            <Link href={`/${username}`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Visit Store
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
