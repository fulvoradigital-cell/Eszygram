import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { LeadCaptureForm } from "./LeadCaptureForm";
import type { BlockDTO, ProfileTheme } from "@/types";

interface StorefrontBlockProps {
  block: BlockDTO;
  theme: ProfileTheme;
  username: string;
}

export function StorefrontBlock({ block, theme, username }: StorefrontBlockProps) {
  const data = block.data || {};
  const primaryColor = theme.primaryColor || "#6D28D9";
  const buttonRadius = theme.buttonRadius || "rounded-xl";
  const isDark = theme.preset === "deep-cyber";
  const cardBg = isDark ? "#13132B" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#0F172A";

  // 1. LINK BLOCK
  if (block.type === "link") {
    const title = (data.title as string) || "Visit Link";
    const rawUrl = (data.url as string) || "#";
    const href = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-block-id={block.id}
        className={`w-full min-h-[48px] px-5 py-3.5 text-center text-sm font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.985] flex items-center justify-between gap-3 border border-black/5 ${buttonRadius}`}
        style={{
          backgroundColor: primaryColor,
          color: "#FFFFFF",
        }}
      >
        <div className="w-5" /> {/* spacer for centered title */}
        <span className="truncate">{title}</span>
        <ExternalLink className="w-4 h-4 opacity-80 shrink-0" />
      </a>
    );
  }

  // 2. PRODUCT BLOCK
  if (block.type === "product") {
    const title = (data.title as string) || "Digital Product";
    const priceInr = Number(data.priceInr) || 0;
    const description = (data.description as string) || "";
    const ctaText = (data.ctaText as string) || "Buy Now";
    const slug = (data.slug as string) || "";
    const rawUrl = (data.url as string) || "#";
    const href = slug
      ? `/${username}/p/${slug}`
      : rawUrl.startsWith("http")
      ? rawUrl
      : rawUrl !== "#"
      ? `https://${rawUrl}`
      : "#";

    return (
      <div
        className="w-full p-4 sm:p-5 rounded-3xl border border-black/5 shadow-sm text-left transition-all hover:shadow-md"
        style={{ backgroundColor: cardBg }}
      >
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-bold truncate leading-snug" style={{ color: textColor }}>
            {title}
          </h3>
          <div className="text-base font-extrabold text-emerald-600 shrink-0">
            ₹{priceInr}
          </div>
        </div>

        {description && (
          <p className="text-xs opacity-75 leading-relaxed line-clamp-2 mb-4" style={{ color: textColor }}>
            {description}
          </p>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-block-id={block.id}
          className={`w-full py-2.5 px-4 text-center text-xs font-bold shadow-xs transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 ${buttonRadius}`}
          style={{
            backgroundColor: primaryColor,
            color: "#FFFFFF",
          }}
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    );
  }

  // 3. FEATURED PRODUCT BLOCK
  if (block.type === "featured_product") {
    const title = (data.title as string) || "Featured Product";
    const priceInr = Number(data.priceInr) || 0;
    const description = (data.description as string) || "";
    const badge = (data.badge as string) || "Bestseller";
    const ctaText = (data.ctaText as string) || "Get Instant Access";
    const slug = (data.slug as string) || "";
    const rawUrl = (data.url as string) || "#";
    const href = slug
      ? `/${username}/p/${slug}`
      : rawUrl.startsWith("http")
      ? rawUrl
      : rawUrl !== "#"
      ? `https://${rawUrl}`
      : "#";

    return (
      <div
        className="w-full p-5 sm:p-6 rounded-3xl border-2 border-amber-400/80 ring-4 ring-amber-400/10 shadow-lg text-left relative overflow-hidden"
        style={{ backgroundColor: cardBg }}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
            <Sparkles className="w-3 h-3" />
            {badge}
          </span>
          <div className="text-lg font-black text-emerald-600">
            ₹{priceInr}
          </div>
        </div>

        <h3 className="text-lg font-extrabold leading-snug mb-1" style={{ color: textColor }}>
          {title}
        </h3>

        {description && (
          <p className="text-xs opacity-80 leading-relaxed mb-4" style={{ color: textColor }}>
            {description}
          </p>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-block-id={block.id}
          className={`w-full py-3 px-5 text-center text-sm font-bold shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${buttonRadius}`}
          style={{
            backgroundColor: primaryColor,
            color: "#FFFFFF",
          }}
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-4 h-4 opacity-80" />
        </a>
      </div>
    );
  }

  // 4. SOCIAL EMBED
  if (block.type === "social_embed") {
    const rawUrl = (data.url as string) || "";
    const title = (data.title as string) || "Embedded Video";

    // Extract YouTube embed video id
    let ytId: string | null = null;
    if (rawUrl.includes("youtube.com/watch?v=")) {
      ytId = new URL(rawUrl).searchParams.get("v");
    } else if (rawUrl.includes("youtu.be/")) {
      ytId = rawUrl.split("youtu.be/")[1]?.split("?")[0] || null;
    }

    if (ytId) {
      return (
        <div className="w-full rounded-2xl overflow-hidden shadow-sm aspect-video bg-black/5">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}`}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <a
        href={rawUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-block-id={block.id}
        className={`w-full p-4 rounded-2xl border border-black/5 shadow-xs flex items-center justify-between text-xs font-semibold ${buttonRadius}`}
        style={{ backgroundColor: cardBg, color: textColor }}
      >
        <span className="truncate">{title}</span>
        <ExternalLink className="w-4 h-4 opacity-70" />
      </a>
    );
  }

  // 5. LEAD CAPTURE
  if (block.type === "lead_capture") {
    return (
      <LeadCaptureForm
        username={username}
        blockId={block.id}
        headline={(data.headline as string) || "Join my mailing list"}
        subheadline={(data.subheadline as string) || ""}
        captureType={(data.captureType as "email" | "whatsapp" | "both") || "email"}
        buttonText={(data.buttonText as string) || "Subscribe"}
        primaryColor={primaryColor}
        buttonRadius={buttonRadius}
        cardBackground={cardBg}
        textColor={textColor}
      />
    );
  }

  // 6. TEXT / HEADER
  if (block.type === "text") {
    const title = (data.title as string) || "";
    const content = (data.content as string) || "";
    const align = (data.align as "left" | "center" | "right") || "center";

    return (
      <div className={`w-full py-2 text-${align}`}>
        {title && (
          <h3 className="text-sm font-bold mb-1" style={{ color: textColor }}>
            {title}
          </h3>
        )}
        <p className="text-xs opacity-80 leading-relaxed" style={{ color: textColor }}>
          {content}
        </p>
      </div>
    );
  }

  // 7. DIVIDER
  if (block.type === "divider") {
    const style = (data.style as string) || "solid";

    if (style === "space") {
      return <div className="h-6" />;
    }

    if (style === "dots") {
      return (
        <div className="flex items-center justify-center gap-1.5 py-4 opacity-30">
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
        </div>
      );
    }

    return (
      <div className="py-3">
        <div
          className={`w-full border-t border-black/10 dark:border-white/10 ${
            style === "dashed" ? "border-dashed" : "border-solid"
          }`}
        />
      </div>
    );
  }

  return null;
}
