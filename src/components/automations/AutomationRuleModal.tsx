"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Film,
  HelpCircle,
  Image as ImageIcon,
  Instagram,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/providers/ToastProvider";
import type {
  AutomationActionType,
  AutomationRuleDTO,
  AutomationTriggerType,
  InstagramMediaItem,
  KeywordMatchingType,
  ProductDTO,
} from "@/types";

interface AutomationRuleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
  initialRule?: AutomationRuleDTO | null;
  products: ProductDTO[];
  username: string;
  instagramConnected?: boolean;
}

const PRESET_KEYWORDS = ["LINK", "SEND", "GUIDE", "COURSE", "PRICE", "EBOOK", "TEMPLATE", "YES"];

export function AutomationRuleModal({
  open,
  onClose,
  onSave,
  initialRule,
  products,
  username,
  instagramConnected = false,
}: AutomationRuleModalProps) {
  const { toast } = useToast();
  const isEditing = Boolean(initialRule);

  // Form State
  const [name, setName] = useState(initialRule?.name || "");
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>(
    initialRule?.triggerType || "comment"
  );
  const [targetScope, setTargetScope] = useState<"all" | "specific">(
    initialRule?.targetPostId ? "specific" : "all"
  );
  const [targetPostId, setTargetPostId] = useState<string>(
    initialRule?.targetPostId || ""
  );
  const [mediaItems, setMediaItems] = useState<InstagramMediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    if (!open || targetScope !== "specific" || !instagramConnected) return;
    let active = true;
    setLoadingMedia(true);
    fetch("/api/creator/instagram/media")
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.success && Array.isArray(json.data?.media)) {
          setMediaItems(json.data.media);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingMedia(false);
      });
    return () => {
      active = false;
    };
  }, [open, targetScope, instagramConnected]);
  const [keywords, setKeywords] = useState<string[]>(
    initialRule?.keywords || ["LINK", "SEND"]
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [matchingType, setMatchingType] = useState<KeywordMatchingType>(
    initialRule?.matchingType || "contains"
  );
  const [actionType, setActionType] = useState<AutomationActionType>(
    initialRule?.actionType || "both"
  );

  // DM Message
  const [dmMessage, setDmMessage] = useState(
    initialRule?.dmMessage ||
      "Hey {username}! Here is the link you requested. Tap the button below to get instant access 👇"
  );
  const [dmButtonText, setDmButtonText] = useState(
    initialRule?.dmButtonText || "Get Instant Access"
  );
  const [dmButtonUrl, setDmButtonUrl] = useState(
    initialRule?.dmButtonUrl || (username ? `https://ezsygram.com/${username}` : "")
  );

  // Product linkage
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialRule?.linkedProductId || ""
  );

  // Public Comment Replies
  const [commentReplies, setCommentReplies] = useState<string[]>(
    initialRule?.commentReplies && initialRule.commentReplies.length > 0
      ? initialRule.commentReplies
      : [
          "Check your DMs! 🚀",
          "Sent it over! Check your requests inbox ✨",
          "Sent! Let me know if you have any questions 👍",
        ]
  );
  const [replyInput, setReplyInput] = useState("");

  const [isActive, setIsActive] = useState(
    initialRule?.isActive !== undefined ? initialRule.isActive : true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle keyword add
  function handleAddKeyword(kw: string) {
    const clean = kw.toUpperCase().trim();
    if (clean && !keywords.includes(clean)) {
      setKeywords([...keywords, clean]);
      setKeywordInput("");
    }
  }

  function handleRemoveKeyword(kw: string) {
    setKeywords(keywords.filter((k) => k !== kw));
  }

  // Handle comment reply add
  function handleAddReply() {
    const clean = replyInput.trim();
    if (clean && !commentReplies.includes(clean)) {
      setCommentReplies([...commentReplies, clean]);
      setReplyInput("");
    }
  }

  function handleRemoveReply(index: number) {
    setCommentReplies(commentReplies.filter((_, idx) => idx !== index));
  }

  // Link product changes button URL
  function handleSelectProduct(prodId: string) {
    setSelectedProductId(prodId);
    if (prodId) {
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        setDmButtonUrl(`https://ezsygram.com/${username}/p/${prod.slug}`);
        if (!initialRule) {
          setDmButtonText(`Get ${prod.title.slice(0, 20)}`);
        }
      }
    }
  }

  // Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name Required", "Please enter a rule name.");
      return;
    }
    if (keywords.length === 0) {
      toast.error("Keywords Required", "Add at least one trigger keyword.");
      return;
    }
    if (!dmMessage.trim()) {
      toast.error("DM Message Required", "Please enter the direct message text.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        triggerType,
        keywords,
        matchingType,
        actionType,
        dmMessage: dmMessage.trim(),
        dmButtonText: dmButtonText.trim() || undefined,
        dmButtonUrl: dmButtonUrl.trim() || undefined,
        commentReplies: commentReplies.filter(Boolean),
        targetPostId: targetScope === "specific" ? targetPostId.trim() || "" : "",
        linkedProductId: selectedProductId || undefined,
        isActive,
      };

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving rule.";
      toast.error("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !isSubmitting && onClose()}
      title={isEditing ? `Edit Automation: ${initialRule?.name}` : "New Instagram Automation"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-1">
        {/* Rule Name & Active Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-text mb-1">
              Rule Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Reels Link & Ebook Delivery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 sm:self-end pb-1">
            <span className="text-xs font-semibold text-slate-muted">
              {isActive ? "Active" : "Disabled"}
            </span>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
              aria-label="Toggle automation rule active status"
            />
          </div>
        </div>

        {/* Step 0: Target Post or Reel */}
        <div className="p-4 rounded-2xl bg-card border border-slate-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>Target Post or Reel</span>
            </h3>

            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-canvas border border-slate-border">
              <button
                type="button"
                onClick={() => {
                  setTargetScope("all");
                  setTargetPostId("");
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  targetScope === "all"
                    ? "bg-brand-violet text-white"
                    : "text-slate-muted hover:text-navy"
                }`}
              >
                Any Post or Reel
              </button>
              <button
                type="button"
                onClick={() => setTargetScope("specific")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  targetScope === "specific"
                    ? "bg-brand-violet text-white"
                    : "text-slate-muted hover:text-navy"
                }`}
              >
                Specific Post / Reel
              </button>
            </div>
          </div>

          {targetScope === "all" ? (
            <p className="text-[11px] text-slate-muted leading-relaxed">
              This rule will automatically listen for matching comments across <strong>all posts and Reels</strong> on your connected Instagram account.
            </p>
          ) : (
            <div className="space-y-2.5">
              {!instagramConnected ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300">
                  Connect your Instagram account on the Automations page to browse and pick a specific Reel or Post, or enter a Media ID manually below.
                </div>
              ) : loadingMedia ? (
                <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-muted">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-violet" />
                  <span>Loading your Instagram Reels &amp; Posts...</span>
                </div>
              ) : mediaItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {mediaItems.map((item) => {
                    const isSelected = targetPostId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTargetPostId(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "border-brand-violet bg-brand-violet/10 ring-2 ring-brand-violet/20"
                            : "border-slate-border bg-canvas hover:border-brand-violet/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-subtle border border-slate-border flex items-center justify-center shrink-0 overflow-hidden">
                          {item.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumbnailUrl}
                              alt="Media preview"
                              className="w-full h-full object-cover"
                            />
                          ) : item.mediaProductType === "REELS" ? (
                            <Film className="w-4 h-4 text-pink-500" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-brand-violet" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-extrabold uppercase text-pink-600 dark:text-pink-400">
                              {item.mediaProductType === "REELS" ? "Reel" : "Post"}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-brand-violet shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-navy line-clamp-2 leading-snug">
                            {item.caption}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-slate-muted">
                  No recent Instagram Reels or Posts found. You can still enter a specific Media ID below.
                </p>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-muted mb-1">
                  Target Media ID (auto-filled when you pick above)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 17948293018472910"
                  value={targetPostId}
                  onChange={(e) => setTargetPostId(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Trigger & Keywords */}
        <div className="p-4 rounded-2xl bg-card border border-slate-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-violet" />
              <span>1. Trigger Keywords</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-muted">Match condition:</span>
              <select
                value={matchingType}
                onChange={(e) => setMatchingType(e.target.value as KeywordMatchingType)}
                className="text-xs font-semibold rounded-lg bg-slate-subtle border border-slate-border px-2 py-1 text-slate-text"
              >
                <option value="contains">Contains keyword</option>
                <option value="exact">Exact match</option>
                <option value="any">Any word in comment</option>
              </select>
            </div>
          </div>

          {/* Trigger Keywords Tags */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-subtle/50 border border-slate-border">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-violet text-white shadow-2xs"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:opacity-75"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                placeholder={keywords.length === 0 ? "Type keyword & press Enter..." : "+ Add keyword"}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddKeyword(keywordInput);
                  }
                }}
                className="bg-transparent border-0 text-xs focus:outline-none flex-1 min-w-[120px] text-slate-text placeholder:text-slate-muted"
              />
            </div>

            {/* Preset Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-muted font-medium">Quick Add:</span>
              {PRESET_KEYWORDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleAddKeyword(k)}
                  disabled={keywords.includes(k)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-border/50 text-slate-text hover:bg-brand-violet/10 hover:text-brand-violet transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  +{k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: DM Message & Button */}
        <div className="p-4 rounded-2xl bg-card border border-slate-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-brand-violet" />
              <span>2. Automated Direct Message (DM)</span>
            </h3>

            {products.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-muted">Link Product:</span>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="text-xs font-medium rounded-lg bg-slate-subtle border border-slate-border px-2 py-1 text-slate-text max-w-[180px] truncate"
                >
                  <option value="">Custom URL / None</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-text">
                DM Message Text <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setDmMessage((prev) => `${prev} {username}`)}
                className="text-[10px] text-brand-violet font-semibold hover:underline"
              >
                + Insert &#123;username&#125;
              </button>
            </div>
            <Textarea
              rows={3}
              value={dmMessage}
              onChange={(e) => setDmMessage(e.target.value)}
              placeholder="Hey {username}! Here is your link..."
              required
              className="text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1">
                CTA Button Label
              </label>
              <Input
                type="text"
                placeholder="Get Instant Access"
                value={dmButtonText}
                onChange={(e) => setDmButtonText(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-text mb-1">
                Button Destination URL
              </label>
              <Input
                type="url"
                placeholder="https://ezsygram.com/yourstore/p/slug"
                value={dmButtonUrl}
                onChange={(e) => setDmButtonUrl(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Public Comment Auto-Replies */}
        <div className="p-4 rounded-2xl bg-card border border-slate-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy font-display flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-brand-violet" />
              <span>3. Public Comment Replies (Randomized)</span>
            </h3>
            <span className="text-[11px] text-slate-muted">Rotates to avoid spam flags</span>
          </div>

          <div className="space-y-2">
            {commentReplies.map((reply, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-subtle/60 border border-slate-border text-xs"
              >
                <span className="text-slate-text truncate flex-1">&ldquo;{reply}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => handleRemoveReply(idx)}
                  className="text-slate-muted hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2 pt-1">
              <Input
                type="text"
                placeholder="Add another reply variation..."
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddReply();
                  }
                }}
                className="h-9 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReply}
                disabled={!replyInput.trim()}
                className="h-9 px-3 text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 shadow-md shadow-brand-violet/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Rule...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isEditing ? "Update Automation" : "Create Automation"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
