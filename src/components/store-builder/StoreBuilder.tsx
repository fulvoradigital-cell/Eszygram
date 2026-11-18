"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Palette,
  Plus,
  QrCode,
  Share2,
  Sparkles,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/ToastProvider";
import { SortableBlockList } from "./SortableBlockList";
import { AddBlockModal } from "./AddBlockModal";
import { EditBlockModal } from "./EditBlockModal";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { SeoCustomizer } from "./SeoCustomizer";
import { ShareQrCard } from "./ShareQrCard";
import { MobilePreviewFrame } from "./MobilePreviewFrame";
import type { BlockDTO, BlockType, CreatorProfileDTO, ProfileSeo, ProfileTheme } from "@/types";

interface StoreBuilderProps {
  initialProfile: CreatorProfileDTO;
  initialBlocks: BlockDTO[];
}

export function StoreBuilder({ initialProfile, initialBlocks }: StoreBuilderProps) {
  const { toast } = useToast();

  const [profile, setProfile] = useState<CreatorProfileDTO>(initialProfile);
  const [blocks, setBlocks] = useState<BlockDTO[]>(initialBlocks);
  const [theme, setTheme] = useState<ProfileTheme>(initialProfile.theme);
  const [seo, setSeo] = useState<ProfileSeo>(initialProfile.seo);

  const [activeTab, setActiveTab] = useState<"blocks" | "theme" | "seo" | "share">("blocks");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockDTO | null>(null);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const themeSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (themeSaveTimerRef.current) {
        clearTimeout(themeSaveTimerRef.current);
      }
    };
  }, []);

  // 1. Add Block
  async function handleAddBlock(type: BlockType, data: Record<string, unknown>) {
    try {
      const res = await fetch("/api/creator/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create block");

      setBlocks((prev) => [...prev, json.data]);
      toast.success("Block Added", "New block added to your storefront.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating block";
      toast.error("Error", msg);
    }
  }

  // 2. Edit Block
  async function handleSaveBlock(id: string, data: Record<string, unknown>) {
    try {
      const res = await fetch(`/api/creator/blocks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update block");

      setBlocks((prev) => prev.map((b) => (b.id === id ? json.data : b)));
      toast.success("Block Updated", "Your changes have been saved.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating block";
      toast.error("Error", msg);
    }
  }

  // 3. Toggle Active
  async function handleToggleActive(id: string, isActive: boolean) {
    // Optimistic update
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, isActive } : b)));

    try {
      const res = await fetch(`/api/creator/blocks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch {
      // Revert on error
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !isActive } : b)));
      toast.error("Error", "Could not toggle block visibility.");
    }
  }

  // 4. Delete Block
  async function handleDeleteBlock(id: string) {
    if (!confirm("Are you sure you want to delete this block?")) return;

    const previous = blocks;
    setBlocks((prev) => prev.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/creator/blocks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete block");
      toast.success("Block Deleted", "Block removed from your storefront.");
    } catch {
      setBlocks(previous);
      toast.error("Error", "Could not delete block.");
    }
  }

  // 5. Reorder Blocks
  async function handleReorder(newBlocks: BlockDTO[]) {
    setBlocks(newBlocks);

    try {
      await fetch("/api/creator/blocks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: newBlocks.map((b, idx) => ({ id: b.id, order: idx })),
        }),
      });
    } catch {
      toast.error("Reorder Error", "Failed to persist block ordering.");
    }
  }

  // 6. Update Theme (silent debounced auto-save so color changes don't spam toasts)
  async function handleUpdateTheme(newTheme: Partial<ProfileTheme>) {
    const updated = { ...theme, ...newTheme };
    setTheme(updated);

    if (themeSaveTimerRef.current) {
      clearTimeout(themeSaveTimerRef.current);
    }

    themeSaveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/creator/theme", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error("Failed to update theme");
      } catch {
        toast.error("Error", "Could not save theme changes.");
      }
    }, 350);
  }

  // 7. Update SEO
  async function handleUpdateSeo(newSeo: Partial<ProfileSeo>) {
    const updated = { ...seo, ...newSeo };
    setSeo(updated);

    try {
      const res = await fetch("/api/creator/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to update SEO");
      toast.success("SEO Updated", "Search & social metadata updated.");
    } catch {
      toast.error("Error", "Could not save SEO changes.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy font-display">
            Storefront Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted">
            Customize blocks, colors, and live mobile layout for{" "}
            <span className="font-semibold text-brand-violet">ezsygram.com/{profile.username}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Preview Trigger Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="lg:hidden text-xs font-semibold"
          >
            <Smartphone className="w-3.5 h-3.5 mr-1.5 text-brand-violet" />
            Live Preview
          </Button>

          <Button
            asChild
            variant="primary"
            size="sm"
            className="text-xs font-semibold shadow-brand"
          >
            <Link href={`/${profile.username}`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Live Store
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Builder Grid: Left editor (2 cols), Right preview (1 col on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tabs & Editors (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-card border border-slate-border overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("blocks")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "blocks"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Blocks ({blocks.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("theme")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "theme"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Theme & Style
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "seo"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              SEO
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("share")}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "share"
                  ? "bg-brand-violet text-white shadow-xs"
                  : "text-slate-muted hover:text-slate-text"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              Share & QR
            </button>
          </div>

          {/* TAB 1: BLOCKS */}
          {activeTab === "blocks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-navy font-display">
                    Storefront Content Blocks
                  </h2>
                  <p className="text-xs text-slate-muted">
                    Drag the handle to reorder blocks in real time.
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="primary"
                  size="sm"
                  className="shadow-brand text-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Add Block</span>
                </Button>
              </div>

              <SortableBlockList
                blocks={blocks}
                onReorder={handleReorder}
                onToggleActive={handleToggleActive}
                onEdit={(b) => setEditingBlock(b)}
                onDelete={handleDeleteBlock}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 2: THEME */}
          {activeTab === "theme" && (
            <ThemeCustomizer
              currentTheme={theme}
              onUpdateTheme={handleUpdateTheme}
            />
          )}

          {/* TAB 3: SEO */}
          {activeTab === "seo" && (
            <SeoCustomizer
              currentSeo={seo}
              onUpdateSeo={handleUpdateSeo}
            />
          )}

          {/* TAB 4: SHARE & QR */}
          {activeTab === "share" && (
            <ShareQrCard username={profile.username} />
          )}
        </div>

        {/* Right Column: Sticky Live Mobile Phone Preview (5 cols on lg) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-24">
          <div className="p-4 rounded-3xl bg-canvas border border-slate-border">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-text">
                <Smartphone className="w-4 h-4 text-brand-violet" />
                Live Mobile Preview
              </div>
              <span className="text-[11px] font-semibold text-mint flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                Syncing live
              </span>
            </div>

            <MobilePreviewFrame
              profile={profile}
              blocks={blocks}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Mobile Preview Modal / Drawer */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-canvas w-full max-h-[92vh] rounded-t-[32px] p-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-border">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-text">
                Mobile Preview
              </span>
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-muted hover:text-slate-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <MobilePreviewFrame
                profile={profile}
                blocks={blocks}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Block Modal */}
      <AddBlockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBlock={handleAddBlock}
      />

      {/* Edit Block Modal */}
      <EditBlockModal
        block={editingBlock}
        isOpen={Boolean(editingBlock)}
        onClose={() => setEditingBlock(null)}
        onSave={handleSaveBlock}
      />
    </div>
  );
}
