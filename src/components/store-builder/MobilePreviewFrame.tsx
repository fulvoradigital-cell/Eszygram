"use client";

import React from "react";
import {
  ExternalLink,
  Instagram,
  Sparkles,
  Twitter,
  Youtube,
  Globe,
  Share2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { BlockDTO, CreatorProfileDTO, ProfileTheme } from "@/types";

interface MobilePreviewFrameProps {
  profile: CreatorProfileDTO;
  blocks: BlockDTO[];
  theme: ProfileTheme;
}

export function MobilePreviewFrame({
  profile,
  blocks,
  theme,
}: MobilePreviewFrameProps) {
  const activeBlocks = blocks.filter((b) => b.isActive);

  // Background and style styles from theme
  const bgStyle = theme.backgroundColor || "#FAFAFB";
  const primaryColor = theme.primaryColor || "#6D28D9";
  const buttonRadius = theme.buttonRadius || "rounded-xl";

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] aspect-[9/18.5] rounded-[44px] p-3.5 bg-slate-900 shadow-2xl border-[6px] border-slate-800 flex flex-col justify-between overflow-hidden select-none">
      {/* Phone Speaker & Dynamic Notch */}
      <div className="absolute top-4 inset-x-0 mx-auto w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
        <div className="w-8 h-1 rounded-full bg-slate-800" />
      </div>

      {/* Screen Container with Scrollable Area */}
      <div
        className="w-full h-full rounded-[34px] overflow-y-auto pt-10 pb-6 px-4 flex flex-col justify-between transition-colors relative"
        style={{
          backgroundColor: bgStyle,
          fontFamily: theme.font || "Inter",
        }}
      >
        {/* Profile Header */}
        <div className="text-center pt-2">
          <Avatar
            name={profile.displayName || "Creator"}
            alt={profile.displayName || "Creator"}
            src={profile.avatarUrl || undefined}
            size="lg"
            className="mx-auto shadow-md ring-2 ring-white/60 mb-2.5"
          />

          <h2
            className="text-base font-bold tracking-tight leading-snug"
            style={{ color: theme.preset === "deep-cyber" ? "#FFFFFF" : "#0F172A" }}
          >
            {profile.displayName || "Your Name"}
          </h2>

          <p
            className="text-xs mt-1 leading-relaxed max-w-[260px] mx-auto opacity-80"
            style={{ color: theme.preset === "deep-cyber" ? "#CBD5E1" : "#475569" }}
          >
            {profile.bio || "Welcome to my storefront! Explore my digital products & links below 👇"}
          </p>

          {/* Social Icons */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {profile.socialLinks.map((s, idx) => (
                <span
                  key={idx}
                  className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs opacity-75"
                  style={{ color: primaryColor }}
                >
                  {s.platform === "instagram" && <Instagram className="w-3.5 h-3.5" />}
                  {s.platform === "youtube" && <Youtube className="w-3.5 h-3.5" />}
                  {s.platform === "twitter" && <Twitter className="w-3.5 h-3.5" />}
                  {s.platform === "website" && <Globe className="w-3.5 h-3.5" />}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Blocks List */}
        <div className="my-5 space-y-2.5 flex-1">
          {activeBlocks.length === 0 ? (
            <div className="py-8 text-center text-xs opacity-50">
              No active blocks visible
            </div>
          ) : (
            activeBlocks.map((block) => {
              const data = block.data || {};

              if (block.type === "link") {
                return (
                  <div
                    key={block.id}
                    className={`w-full p-3 text-center text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 ${buttonRadius}`}
                    style={{
                      backgroundColor: primaryColor,
                      color: "#FFFFFF",
                    }}
                  >
                    <span>{(data.title as string) || "My Link"}</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </div>
                );
              }

              if (block.type === "product" || block.type === "featured_product") {
                const isFeatured = block.type === "featured_product";
                return (
                  <div
                    key={block.id}
                    className={`w-full p-3 rounded-2xl shadow-xs border transition-all text-left ${
                      isFeatured ? "border-amber-400/60 ring-2 ring-amber-400/20" : "border-black/5"
                    }`}
                    style={{
                      backgroundColor: theme.preset === "deep-cyber" ? "#1A1A35" : "#FFFFFF",
                    }}
                  >
                    {isFeatured && Boolean(data.badge) && (
                      <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 mb-1">
                        {String(data.badge)}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold truncate" style={{ color: theme.preset === "deep-cyber" ? "#FFF" : "#0F172A" }}>
                        {(data.title as string) || "Digital Product"}
                      </div>
                      <div className="text-xs font-extrabold text-emerald-600 shrink-0">
                        ₹{Number(data.priceInr) || 0}
                      </div>
                    </div>
                    {Boolean(data.description) && (
                      <div className="text-[10px] opacity-70 truncate mt-0.5" style={{ color: theme.preset === "deep-cyber" ? "#CBD5E1" : "#64748B" }}>
                        {String(data.description)}
                      </div>
                    )}
                    <div
                      className={`w-full mt-2 py-1.5 text-center text-[11px] font-bold shadow-xs ${buttonRadius}`}
                      style={{
                        backgroundColor: primaryColor,
                        color: "#FFFFFF",
                      }}
                    >
                      {(data.ctaText as string) || "Buy Now"}
                    </div>
                  </div>
                );
              }

              if (block.type === "lead_capture") {
                return (
                  <div
                    key={block.id}
                    className="w-full p-3 rounded-2xl border border-black/5 shadow-xs text-center"
                    style={{
                      backgroundColor: theme.preset === "deep-cyber" ? "#1A1A35" : "#FFFFFF",
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: theme.preset === "deep-cyber" ? "#FFF" : "#0F172A" }}>
                      {(data.headline as string) || "Get My Free Resource"}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <div className="flex-1 bg-black/5 dark:bg-white/10 rounded-lg px-2 py-1 text-[10px] text-left opacity-60">
                        Enter your email...
                      </div>
                      <div
                        className="px-2.5 py-1 text-[10px] font-bold text-white rounded-lg"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Join
                      </div>
                    </div>
                  </div>
                );
              }

              if (block.type === "text") {
                return (
                  <div key={block.id} className="text-center py-1">
                    {Boolean(data.title) && (
                      <div className="text-xs font-bold" style={{ color: theme.preset === "deep-cyber" ? "#FFF" : "#0F172A" }}>
                        {String(data.title)}
                      </div>
                    )}
                    <div className="text-[11px] opacity-75 mt-0.5" style={{ color: theme.preset === "deep-cyber" ? "#CBD5E1" : "#64748B" }}>
                      {String(data.content || "")}
                    </div>
                  </div>
                );
              }

              if (block.type === "divider") {
                return (
                  <div key={block.id} className="py-1">
                    <div className="w-full border-t border-black/10 dark:border-white/10" />
                  </div>
                );
              }

              return null;
            })
          )}
        </div>

        {/* Footer Brand Watermark */}
        <div className="pt-2 text-center">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider opacity-60">
            <Sparkles className="w-2.5 h-2.5" /> Made with Ezsygram
          </span>
        </div>
      </div>
    </div>
  );
}
