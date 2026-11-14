"use client";

import React, { useState } from "react";
import {
  Link as LinkIcon,
  Package,
  Sparkles,
  Video,
  Mail,
  Type,
  Minus,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { BlockType } from "@/types";

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (type: BlockType, data: Record<string, unknown>) => Promise<void>;
}

const BLOCK_OPTIONS: {
  type: BlockType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    type: "link",
    title: "Standard Link",
    desc: "Direct link to your website, WhatsApp, portfolio, or community",
    icon: LinkIcon,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
  },
  {
    type: "product",
    title: "Product Card",
    desc: "Digital product or course with price in INR and buy CTA",
    icon: Package,
    color: "text-coral bg-coral/10",
  },
  {
    type: "featured_product",
    title: "Featured Spotlight",
    desc: "Highlighted hero card with bestseller badge and standout styling",
    icon: Sparkles,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
  },
  {
    type: "social_embed",
    title: "Video / Embed",
    desc: "Embed a YouTube video or reel directly into your storefront",
    icon: Video,
    color: "text-red-500 bg-red-50 dark:bg-red-950/40",
  },
  {
    type: "lead_capture",
    title: "Lead Magnet Capture",
    desc: "Collect customer emails or WhatsApp numbers with 1-click submit",
    icon: Mail,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    type: "text",
    title: "Header / Text",
    desc: "Section title, announcement, or bio text for organization",
    icon: Type,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40",
  },
  {
    type: "divider",
    title: "Divider",
    desc: "Visual line or spacing between sections",
    icon: Minus,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-800",
  },
];

export function AddBlockModal({ isOpen, onClose, onAddBlock }: AddBlockModalProps) {
  const [selectedType, setSelectedType] = useState<BlockType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [priceInr, setPriceInr] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("Buy Now");
  const [badge, setBadge] = useState("Bestseller");
  const [embedPlatform, setEmbedPlatform] = useState<"youtube" | "instagram">("youtube");
  const [headline, setHeadline] = useState("Get My Free Guide");
  const [subheadline, setSubheadline] = useState("Drop your email to receive it instantly.");
  const [captureType, setCaptureType] = useState<"email" | "whatsapp" | "both">("email");
  const [dividerStyle, setDividerStyle] = useState<"solid" | "dashed" | "dots" | "space">("solid");

  function resetForm() {
    setSelectedType(null);
    setTitle("");
    setUrl("");
    setPriceInr("");
    setDescription("");
    setCtaText("Buy Now");
    setBadge("Bestseller");
    setEmbedPlatform("youtube");
    setHeadline("Get My Free Guide");
    setSubheadline("Drop your email to receive it instantly.");
    setCaptureType("email");
    setDividerStyle("solid");
    setIsSubmitting(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;
    setIsSubmitting(true);

    let data: Record<string, unknown> = {};

    if (selectedType === "link") {
      data = {
        title: title.trim() || "Link",
        url: url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`,
      };
    } else if (selectedType === "product") {
      data = {
        title: title.trim(),
        priceInr: Number(priceInr) || 0,
        description: description.trim(),
        url: url.trim() ? (url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`) : "#",
        ctaText: ctaText.trim() || "Buy Now",
      };
    } else if (selectedType === "featured_product") {
      data = {
        title: title.trim(),
        priceInr: Number(priceInr) || 0,
        description: description.trim(),
        badge: badge.trim(),
        url: url.trim() ? (url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`) : "#",
        ctaText: ctaText.trim() || "Buy Now",
      };
    } else if (selectedType === "social_embed") {
      data = {
        platform: embedPlatform,
        url: url.trim(),
        title: title.trim() || "Video",
      };
    } else if (selectedType === "lead_capture") {
      data = {
        headline: headline.trim(),
        subheadline: subheadline.trim(),
        captureType,
        buttonText: "Claim Free Access",
      };
    } else if (selectedType === "text") {
      data = {
        title: title.trim(),
        content: description.trim(),
        align: "center",
      };
    } else if (selectedType === "divider") {
      data = {
        style: dividerStyle,
      };
    }

    try {
      await onAddBlock(selectedType, data);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={isOpen} onClose={handleClose} title="Add Storefront Block" size="md">
      {!selectedType ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[65vh] overflow-y-auto pr-1">
          {BLOCK_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelectedType(opt.type)}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-border bg-card hover:border-brand-violet/40 hover:bg-brand-violet/5 transition-all text-left group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${opt.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-text group-hover:text-brand-violet transition-colors">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-slate-muted leading-tight mt-0.5">
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-border">
            <button
              type="button"
              onClick={() => setSelectedType(null)}
              className="p-1 rounded-lg text-slate-muted hover:text-slate-text"
              title="Back to types"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">
              Configure {selectedType.replace("_", " ")} Block
            </span>
          </div>

          {/* Form fields based on selectedType */}
          {selectedType === "link" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Join My Free WhatsApp Community"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Destination URL
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  required
                />
              </div>
            </>
          )}

          {(selectedType === "product" || selectedType === "featured_product") && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Product Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 100+ Instagram Reel Hooks & Scripts"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                    Price (₹ INR)
                  </label>
                  <Input
                    type="number"
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                    placeholder="499"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                    CTA Button Text
                  </label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Buy Now"
                  />
                </div>
              </div>
              {selectedType === "featured_product" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                    Badge Label
                  </label>
                  <Input
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Bestseller"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Short Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instant PDF download + video walkthrough"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Checkout / Product Link (optional)
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://ezsygram.com/checkout/..."
                />
              </div>
            </>
          )}

          {selectedType === "social_embed" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Platform
                </label>
                <Select
                  value={embedPlatform}
                  onChange={(e) => setEmbedPlatform(e.target.value as "youtube" | "instagram")}
                  options={[
                    { value: "youtube", label: "YouTube Video" },
                    { value: "instagram", label: "Instagram Reel / Post" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Video / Post URL
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Title (optional)
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Watch my latest tutorial"
                />
              </div>
            </>
          )}

          {selectedType === "lead_capture" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Headline
                </label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Free 7-Day Fitness Blueprint"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Subheadline
                </label>
                <Input
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Drop your email to get instant access"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Collect
                </label>
                <Select
                  value={captureType}
                  onChange={(e) => setCaptureType(e.target.value as "email" | "whatsapp" | "both")}
                  options={[
                    { value: "email", label: "Email Address" },
                    { value: "whatsapp", label: "WhatsApp Number" },
                    { value: "both", label: "Email & WhatsApp" },
                  ]}
                />
              </div>
            </>
          )}

          {selectedType === "text" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Heading (optional)
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Favorite Tools"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Content / Paragraph
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Everything I use to film, edit, and run my business."
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          {selectedType === "divider" && (
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Divider Style
              </label>
              <Select
                value={dividerStyle}
                onChange={(e) => setDividerStyle(e.target.value as "solid" | "dashed" | "dots" | "space")}
                options={[
                  { value: "solid", label: "Solid Line" },
                  { value: "dashed", label: "Dashed Line" },
                  { value: "dots", label: "Centered Dots" },
                  { value: "space", label: "Blank Space" },
                ]}
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="shadow-brand"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Adding...
                </>
              ) : (
                "Add to Storefront"
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
