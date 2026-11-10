"use client";

import * as React from "react";
import {
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Play,
  Mail,
  Send,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  IndianRupee,
} from "lucide-react";
import { ICreatorProfile, IThemeConfig } from "@/models/CreatorProfile";
import { ClientBlock } from "@/models/Block";
import { formatINR } from "@/lib/utils";

interface MobileStorePreviewProps {
  profile: Partial<ICreatorProfile>;
  theme: IThemeConfig;
  blocks: Array<Partial<ClientBlock>>;
  isInteractive?: boolean;
  onBlockClick?: (blockId: string) => void;
  onLeadSubmit?: (blockId: string, data: { email?: string; phone?: string; name?: string }) => Promise<void>;
}

export function MobileStorePreview({
  profile,
  theme,
  blocks,
  isInteractive = false,
  onBlockClick,
  onLeadSubmit,
}: MobileStorePreviewProps) {
  const [submittedLeads, setSubmittedLeads] = React.useState<Record<string, boolean>>({});
  const [leadInputs, setLeadInputs] = React.useState<Record<string, { email: string; phone: string; name: string }>>({});
  const [loadingLeads, setLoadingLeads] = React.useState<Record<string, boolean>>({});

  // Background styling calculation
  const getBackgroundStyle = () => {
    if (theme.backgroundType === "gradient") {
      const dir = theme.backgroundGradient?.direction || "to bottom right";
      const from = theme.backgroundGradient?.from || "#6366f1";
      const to = theme.backgroundGradient?.to || "#f59e0b";
      return { background: `linear-gradient(${dir}, ${from}, ${to})` };
    }
    if (theme.backgroundType === "image" && theme.backgroundImageUrl) {
      return {
        backgroundImage: `url(${theme.backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor: theme.backgroundColor || "#f8fafc" };
  };

  // Button styling classes based on theme
  const getButtonShapeClass = () => {
    switch (theme.buttonStyle) {
      case "pill":
        return "rounded-full";
      case "sharp":
        return "rounded-none";
      case "shadow":
        return "rounded-2xl shadow-soft-lg";
      case "outline":
        return "rounded-2xl border-2";
      case "rounded":
      default:
        return "rounded-2xl";
    }
  };

  const activeBlocks = blocks.filter((b) => b.isActive !== false);

  const handleLeadSubmit = async (blockId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!isInteractive || !onLeadSubmit) return;

    const input = leadInputs[blockId] || { email: "", phone: "", name: "" };
    if (!input.email && !input.phone) return;

    setLoadingLeads((prev) => ({ ...prev, [blockId]: true }));
    try {
      await onLeadSubmit(blockId, input);
      setSubmittedLeads((prev) => ({ ...prev, [blockId]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeads((prev) => ({ ...prev, [blockId]: false }));
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div
      className="relative mx-auto flex w-full max-w-[380px] flex-col overflow-hidden rounded-[40px] border-[10px] border-slate-900 bg-white shadow-2xl transition-all"
      style={{
        minHeight: "680px",
        fontFamily: theme.font ? `var(--font-${theme.font.toLowerCase()}), sans-serif` : "inherit",
      }}
    >
      {/* Phone Notch & Speaker */}
      <div className="absolute top-0 inset-x-0 z-20 flex justify-center">
        <div className="h-5 w-32 rounded-b-2xl bg-slate-900 flex items-center justify-center">
          <div className="h-1.5 w-10 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* Screen Viewport with Theme Background */}
      <div
        className="flex-1 overflow-y-auto px-5 pt-10 pb-8 text-center transition-colors"
        style={getBackgroundStyle()}
      >
        {/* Creator Profile Header */}
        <div className="flex flex-col items-center">
          <div
            className="relative h-20 w-20 overflow-hidden rounded-full border-2 p-0.5 shadow-soft transition-transform hover:scale-105"
            style={{ borderColor: theme.primaryColor || "#6366f1" }}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || "Creator"}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: theme.primaryColor || "#6366f1" }}
              >
                {(profile.displayName || "C").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2
            className="mt-3 text-lg font-extrabold tracking-tight"
            style={{ color: theme.textColor || "#0f172a" }}
          >
            {profile.displayName || "Creator Name"}
          </h2>

          <p className="text-xs font-semibold opacity-75" style={{ color: theme.textColor }}>
            @{profile.username || "handle"}
          </p>

          {profile.bio && (
            <p
              className="mt-2 text-xs leading-relaxed max-w-[280px] whitespace-pre-line opacity-90"
              style={{ color: theme.textColor || "#334155" }}
            >
              {profile.bio}
            </p>
          )}

          {/* Social Icons Row */}
          {profile.socialLinks && (
            <div className="mt-3 flex items-center justify-center gap-3">
              {profile.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/70 backdrop-blur-sm p-1.5 text-slate-700 shadow-xs hover:scale-110 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={
                    profile.socialLinks.youtube.startsWith("http")
                      ? profile.socialLinks.youtube
                      : `https://youtube.com/@${profile.socialLinks.youtube.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/70 backdrop-blur-sm p-1.5 text-slate-700 shadow-xs hover:scale-110 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4 text-red-600" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${profile.socialLinks.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/70 backdrop-blur-sm p-1.5 text-slate-700 shadow-xs hover:scale-110 transition"
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-4 w-4 text-sky-500" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={
                    profile.socialLinks.linkedin.startsWith("http")
                      ? profile.socialLinks.linkedin
                      : `https://linkedin.com/in/${profile.socialLinks.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/70 backdrop-blur-sm p-1.5 text-slate-700 shadow-xs hover:scale-110 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-blue-600" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={
                    profile.socialLinks.website.startsWith("http")
                      ? profile.socialLinks.website
                      : `https://${profile.socialLinks.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/70 backdrop-blur-sm p-1.5 text-slate-700 shadow-xs hover:scale-110 transition"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4 text-slate-700" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Blocks Feed */}
        <div className="mt-6 space-y-3.5">
          {activeBlocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 text-center text-xs text-slate-500">
              No blocks active yet. Add links, products, or featured cards in the editor.
            </div>
          ) : (
            activeBlocks.map((block) => {
              const data = (block.data || {}) as Record<string, any>;
              const blockId = block._id ? block._id.toString() : block.order?.toString() || Math.random().toString();

              // -------------------------------------------------------------
              // 1. LINK BLOCK
              // -------------------------------------------------------------
              if (block.type === "link") {
                return (
                  <a
                    key={blockId}
                    href={isInteractive ? data.url || "#" : "#"}
                    target={isInteractive && data.url ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={() => onBlockClick && onBlockClick(blockId)}
                    className={`group relative flex items-center justify-between border bg-white p-3.5 shadow-soft transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] ${getButtonShapeClass()}`}
                    style={{
                      borderColor: theme.buttonStyle === "outline" ? theme.primaryColor : "#f1f5f9",
                    }}
                  >
                    <div className="flex items-center gap-3 text-left min-w-0">
                      {data.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={data.imageUrl}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-xl object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 truncate transition-colors">
                          {data.title || "Untitled Link"}
                        </p>
                        {data.subtitle && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {data.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-700 transition" />
                  </a>
                );
              }

              // -------------------------------------------------------------
              // 2. PRODUCT BLOCK
              // -------------------------------------------------------------
              if (block.type === "product") {
                return (
                  <div
                    key={blockId}
                    className={`relative overflow-hidden border border-slate-100 bg-white text-left shadow-soft ${getButtonShapeClass()}`}
                  >
                    {data.imageUrl && (
                      <div className="h-32 w-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={data.imageUrl}
                          alt={data.title || "Product"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {data.title || "Digital Product"}
                        </h4>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700 border border-emerald-200">
                          {data.price ? formatINR(Number(data.price)) : "₹499"}
                        </span>
                      </div>
                      {data.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {data.description}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => onBlockClick && onBlockClick(blockId)}
                        className={`w-full py-2.5 px-3 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-1.5 ${getButtonShapeClass()}`}
                        style={{ backgroundColor: theme.primaryColor || "#6366f1" }}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{data.buttonText || "Instant UPI Checkout"}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // -------------------------------------------------------------
              // 3. FEATURED BLOCK (HERO / SPOTLIGHT)
              // -------------------------------------------------------------
              if (block.type === "featured") {
                return (
                  <div
                    key={blockId}
                    className={`relative overflow-hidden border p-5 text-left text-white shadow-soft-lg ${getButtonShapeClass()}`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor || "#4f46e5"}, #312e81)`,
                      borderColor: "transparent",
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                      <Sparkles className="h-3 w-3" />
                      <span>{data.badge || "Featured"}</span>
                    </div>
                    <h3 className="mt-1 text-base font-black leading-tight text-white">
                      {data.title || "Featured Headline"}
                    </h3>
                    {data.subtitle && (
                      <p className="mt-1 text-xs text-slate-200 leading-relaxed">
                        {data.subtitle}
                      </p>
                    )}
                    {data.buttonText && (
                      <a
                        href={isInteractive ? data.url || "#" : "#"}
                        target={isInteractive && data.url ? "_blank" : undefined}
                        rel="noreferrer"
                        onClick={() => onBlockClick && onBlockClick(blockId)}
                        className={`mt-3 inline-flex items-center gap-1.5 bg-white py-2 px-3.5 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-50 ${getButtonShapeClass()}`}
                      >
                        <span>{data.buttonText}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                );
              }

              // -------------------------------------------------------------
              // 4. SOCIAL EMBED BLOCK
              // -------------------------------------------------------------
              if (block.type === "social-embed") {
                const embedUrl = getYoutubeEmbedUrl(data.url);
                return (
                  <div
                    key={blockId}
                    className={`overflow-hidden border border-slate-100 bg-white shadow-soft text-left ${getButtonShapeClass()}`}
                  >
                    {embedUrl ? (
                      <div className="relative aspect-video w-full bg-slate-900">
                        <iframe
                          src={embedUrl}
                          title={data.title || "Video"}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
                        <Play className="h-8 w-8 text-rose-500 mb-1" />
                        <span className="text-xs font-bold">{data.title || "Video Embed"}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                          {data.url || "Paste YouTube video link"}
                        </span>
                      </div>
                    )}
                    {data.title && (
                      <div className="p-3">
                        <p className="text-xs font-bold text-slate-900">{data.title}</p>
                      </div>
                    )}
                  </div>
                );
              }

              // -------------------------------------------------------------
              // 5. LEAD CAPTURE BLOCK
              // -------------------------------------------------------------
              if (block.type === "lead-capture") {
                const isSubmitted = submittedLeads[blockId];
                const isLoading = loadingLeads[blockId];

                return (
                  <div
                    key={blockId}
                    className={`border border-slate-100 bg-white p-4 text-left shadow-soft ${getButtonShapeClass()}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Mail className="h-4 w-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {data.title || "Join My VIP Community"}
                      </h4>
                    </div>

                    {data.description && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        {data.description}
                      </p>
                    )}

                    {isSubmitted ? (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{data.thankYouMessage || "Thank you! You are subscribed."}</span>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => handleLeadSubmit(blockId, e)}
                        className="mt-3 space-y-2"
                      >
                        {(data.leadType === "whatsapp" || data.leadType === "both") && (
                          <input
                            type="tel"
                            placeholder="WhatsApp Number (e.g. 9876543210)"
                            value={leadInputs[blockId]?.phone || ""}
                            onChange={(e) =>
                              setLeadInputs((prev) => ({
                                ...prev,
                                [blockId]: {
                                  ...(prev[blockId] || { email: "", name: "" }),
                                  phone: e.target.value,
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required={data.leadType === "whatsapp"}
                          />
                        )}

                        {(data.leadType === "email" || data.leadType === "both" || !data.leadType) && (
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={leadInputs[blockId]?.email || ""}
                            onChange={(e) =>
                              setLeadInputs((prev) => ({
                                ...prev,
                                [blockId]: {
                                  ...(prev[blockId] || { phone: "", name: "" }),
                                  email: e.target.value,
                                },
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required={data.leadType !== "whatsapp"}
                          />
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full py-2 px-3 text-xs font-bold text-white shadow-soft transition hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-1.5 ${getButtonShapeClass()}`}
                          style={{ backgroundColor: theme.primaryColor || "#6366f1" }}
                        >
                          {isLoading ? (
                            <span>Submitting...</span>
                          ) : (
                            <>
                              <span>{data.buttonText || "Subscribe"}</span>
                              <Send className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                );
              }

              // -------------------------------------------------------------
              // 6. TEXT BLOCK
              // -------------------------------------------------------------
              if (block.type === "text") {
                return (
                  <div
                    key={blockId}
                    className="p-2 text-left"
                    style={{ color: theme.textColor || "#0f172a" }}
                  >
                    {data.title && (
                      <h4 className="text-sm font-extrabold tracking-tight mb-1">
                        {data.title}
                      </h4>
                    )}
                    {data.content && (
                      <p className="text-xs leading-relaxed opacity-85 whitespace-pre-line">
                        {data.content}
                      </p>
                    )}
                  </div>
                );
              }

              // -------------------------------------------------------------
              // 7. DIVIDER BLOCK
              // -------------------------------------------------------------
              if (block.type === "divider") {
                return (
                  <div key={blockId} className="py-2">
                    <hr
                      className={
                        data.style === "dashed"
                          ? "border-dashed border-slate-300"
                          : data.style === "dots"
                          ? "border-dotted border-slate-400"
                          : "border-slate-200"
                      }
                    />
                  </div>
                );
              }

              return null;
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-black/5 text-center">
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Powered by Creator Revenue OS 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
}
