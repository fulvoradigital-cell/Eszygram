"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Heart,
  Instagram,
  Loader2,
  MessageCircle,
  Play,
  Send,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/ToastProvider";
import type { AutomationRuleDTO, AutomationSimulationResult } from "@/types";

interface AutomationSimulatorProps {
  rules: AutomationRuleDTO[];
  creatorDisplayName: string;
  username: string;
  avatarUrl?: string;
}

export function AutomationSimulator({
  rules,
  creatorDisplayName,
  username,
  avatarUrl,
}: AutomationSimulatorProps) {
  const { toast } = useToast();

  const [commentText, setCommentText] = useState("LINK");
  const [testUsername, setTestUsername] = useState("rahul_growth");
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<AutomationSimulationResult | null>(null);

  async function handleSimulate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    setIsSimulating(true);
    try {
      const res = await fetch("/api/creator/automations/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentText: commentText.trim(),
          instagramUsername: testUsername.trim().replace(/^@/, ""),
          ruleId: selectedRuleId || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Simulation failed.");
      }

      setResult(json.data);
      if (json.data.matched) {
        toast.success("Trigger Matched!", json.data.message);
      } else {
        toast.warning("No Match", json.data.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Simulation error.";
      toast.error("Error", msg);
    } finally {
      setIsSimulating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-navy font-display flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-600" />
            <span>Interactive Reels Comment-to-DM Simulator</span>
          </h2>
          <p className="text-xs text-slate-muted">
            Test how Ezsygram listens to Reel comments, matches keywords, auto-replies, and dispatches DMs in real time.
          </p>
        </div>

        {/* Optional Rule Filter */}
        {rules.length > 0 && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-xs text-slate-muted font-medium">Test Rule:</span>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="text-xs rounded-xl bg-card border border-slate-border px-3 py-1.5 text-slate-text max-w-[200px] truncate"
            >
              <option value="">All Active Rules</option>
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Instagram Reel Mockup (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-3xl border-slate-border bg-card shadow-sm overflow-hidden border">
            {/* Reel Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-slate-border bg-slate-subtle/30">
              <div className="flex items-center gap-2.5">
                <Avatar
                  name={creatorDisplayName}
                  alt={creatorDisplayName}
                  src={avatarUrl}
                  size="xs"
                />
                <div>
                  <p className="text-xs font-bold text-navy">@{username}</p>
                  <p className="text-[10px] text-slate-muted">Original audio</p>
                </div>
              </div>
              <Badge variant="outline" size="sm" className="text-[10px]">
                Reel
              </Badge>
            </div>

            {/* Reel Video Canvas */}
            <div className="aspect-[9/10] bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 relative flex flex-col justify-between p-4 text-white">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center m-auto shadow-md">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              </div>

              {/* Overlay Caption & Audio */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-sm">@{username}</p>
                <p className="text-[11px] leading-relaxed text-white/90">
                  Drop <strong className="text-amber-300">&ldquo;LINK&rdquo;</strong> in the comments below and our automation will instantly DM you full access! 🚀
                </p>
              </div>

              {/* Side Floating Action Icons */}
              <div className="absolute right-3 bottom-14 flex flex-col items-center gap-3 text-white/80">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold">12.4k</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold">342</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Simulated Live Comments Area */}
            <div className="p-3.5 bg-card border-t border-slate-border space-y-3">
              {/* User Comment */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                  {testUsername[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-navy text-[11px]">
                    @{testUsername}
                  </p>
                  <p className="text-slate-text text-xs mt-0.5 bg-slate-subtle/70 px-2.5 py-1 rounded-xl inline-block">
                    {commentText}
                  </p>

                  {/* Public Bot Reply (rendered if simulated) */}
                  {result?.matched && result.publicCommentReply && (
                    <div className="mt-2 ml-4 flex items-start gap-2">
                      <Avatar
                        name={creatorDisplayName}
                        alt={creatorDisplayName}
                        src={avatarUrl}
                        size="xs"
                        className="w-5 h-5 text-[9px]"
                      />
                      <div className="min-w-0 flex-1 text-[11px]">
                        <span className="font-bold text-navy">@{username}</span>{" "}
                        <span className="text-slate-muted">
                          {result.publicCommentReply}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-muted font-medium">Test:</span>
                {["LINK", "Send link pls", "COURSE", "PRICE", "GUIDE"].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setCommentText(kw);
                      handleSimulate();
                    }}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-subtle hover:bg-brand-violet/10 hover:text-brand-violet border border-slate-border transition-colors"
                  >
                    &ldquo;{kw}&rdquo;
                  </button>
                ))}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSimulate} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Type a comment to test..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-subtle border border-slate-border focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet text-slate-text"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  disabled={isSimulating || !commentText.trim()}
                  className="h-8 px-3 text-xs shrink-0"
                >
                  {isSimulating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Right: Live Automated Response Inspector (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 border-slate-border bg-card shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-border pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-violet" />
                <span>Simulation Results</span>
              </h3>
              {result && (
                <Badge
                  variant={result.matched ? "success" : "outline"}
                  size="sm"
                >
                  {result.matched ? "Matched & Dispatched" : "No Trigger"}
                </Badge>
              )}
            </div>

            {!result ? (
              <div className="py-12 text-center space-y-2">
                <Zap className="w-8 h-8 text-slate-muted mx-auto opacity-50" />
                <p className="text-xs text-slate-muted max-w-sm mx-auto">
                  Type a comment on the Reel to the left and click Send to test how your rules match keywords and dispatch DMs.
                </p>
              </div>
            ) : !result.matched ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs space-y-2">
                <p className="font-bold text-amber-900 dark:text-amber-300">
                  No Trigger Match
                </p>
                <p className="text-slate-muted leading-relaxed">
                  The comment &ldquo;{commentText}&rdquo; did not match any of your active keyword rules. Check your rule keywords and matching condition (contains vs exact).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Keyword Match Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-subtle/50 border border-slate-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-muted">Triggered Rule:</span>
                    <p className="font-bold text-navy">{result.ruleName}</p>
                  </div>
                  <div>
                    <span className="text-slate-muted">Matched Keyword:</span>
                    <p className="font-mono font-bold text-brand-violet">
                      &ldquo;{result.matchedKeyword}&rdquo;
                    </p>
                  </div>
                </div>

                {/* 2. Public Comment Reply Preview */}
                {result.publicCommentReply && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-muted uppercase tracking-wider">
                      Public Comment Auto-Reply
                    </p>
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-900 dark:text-emerald-300 italic font-medium">
                        &ldquo;{result.publicCommentReply}&rdquo;
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Direct Message (DM) Preview */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-muted uppercase tracking-wider">
                    Automated Direct Message (DM)
                  </p>

                  <div className="p-4 rounded-3xl bg-slate-subtle/70 border border-slate-border/80 max-w-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={creatorDisplayName}
                        alt={creatorDisplayName}
                        src={avatarUrl}
                        size="xs"
                      />
                      <span className="text-xs font-bold text-navy">
                        @{username}
                      </span>
                    </div>

                    {/* Chat Bubble */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-border text-xs leading-relaxed text-slate-text shadow-2xs space-y-3">
                      <p className="whitespace-pre-line">{result.dmMessage}</p>

                      {result.dmButtonText && (
                        <div className="pt-1 border-t border-slate-border">
                          <a
                            href={result.dmButtonUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-brand-violet text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity"
                          >
                            <span>{result.dmButtonText}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
