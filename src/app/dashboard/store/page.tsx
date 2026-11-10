"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  Share2,
  QrCode,
  Palette,
  Layers,
  Search,
  ExternalLink,
  Save,
  Sparkles,
  Smartphone,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/providers/toast-provider";
import { SortableBlockItem } from "@/components/store/sortable-block-item";
import { BlockModal } from "@/components/store/block-modal";
import { QrCodeModal } from "@/components/store/qr-code-modal";
import { MobileStorePreview } from "@/components/store/mobile-store-preview";
import { ICreatorProfile, IThemeConfig, ISeoConfig, ThemeButtonStyle, ThemeBackgroundType } from "@/models/CreatorProfile";
import { ClientBlock, BlockType } from "@/models/Block";

const THEME_PRESETS = [
  {
    name: "Indigo Modern",
    primaryColor: "#4f46e5",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    buttonStyle: "rounded" as ThemeButtonStyle,
    backgroundType: "solid" as ThemeBackgroundType,
  },
  {
    name: "Saffron Gold",
    primaryColor: "#d97706",
    backgroundColor: "#fffbeb",
    textColor: "#451a03",
    buttonStyle: "pill" as ThemeButtonStyle,
    backgroundType: "solid" as ThemeBackgroundType,
  },
  {
    name: "Sunset Gradient",
    primaryColor: "#e11d48",
    backgroundType: "gradient" as ThemeBackgroundType,
    backgroundGradient: {
      from: "#4f46e5",
      to: "#fb7185",
      direction: "to bottom right",
    },
    textColor: "#ffffff",
    buttonStyle: "pill" as ThemeButtonStyle,
  },
  {
    name: "Midnight Pro",
    primaryColor: "#818cf8",
    backgroundColor: "#090d16",
    textColor: "#f8fafc",
    buttonStyle: "shadow" as ThemeButtonStyle,
    backgroundType: "solid" as ThemeBackgroundType,
  },
  {
    name: "Minimal Clean",
    primaryColor: "#18181b",
    backgroundColor: "#ffffff",
    textColor: "#18181b",
    buttonStyle: "outline" as ThemeButtonStyle,
    backgroundType: "solid" as ThemeBackgroundType,
  },
];

const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Plus Jakarta Sans",
  "Outfit",
  "Playfair Display",
];

export default function StoreBuilderPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = React.useState<"blocks" | "theme" | "seo">("blocks");
  const [profile, setProfile] = React.useState<Partial<ICreatorProfile>>({});
  const [blocks, setBlocks] = React.useState<ClientBlock[]>([]);
  const [theme, setTheme] = React.useState<IThemeConfig>({
    primaryColor: "#4f46e5",
    font: "Inter",
    buttonStyle: "rounded",
    backgroundType: "solid",
    backgroundColor: "#f8fafc",
    backgroundGradient: { from: "#4f46e5", to: "#f59e0b", direction: "to bottom right" },
    textColor: "#0f172a",
  });
  const [seo, setSeo] = React.useState<ISeoConfig>({
    title: "",
    description: "",
    ogImageUrl: "",
  });

  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);
  const [editingBlock, setEditingBlock] = React.useState<ClientBlock | null>(null);
  const [isSavingTheme, setIsSavingTheme] = React.useState(false);
  const [isSavingSeo, setIsSavingSeo] = React.useState(false);
  const [showMobilePreview, setShowMobilePreview] = React.useState(false);

  // Load Storefront & Blocks Data
  React.useEffect(() => {
    async function loadStore() {
      try {
        const res = await fetch("/api/creator/store");
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data.profile || {});
          setBlocks(json.data.blocks || []);
          if (json.data.profile?.theme) {
            setTheme((prev) => ({ ...prev, ...json.data.profile.theme }));
          }
          if (json.data.profile?.seo) {
            setSeo((prev) => ({ ...prev, ...json.data.profile.seo }));
          }
        }
      } catch (err) {
        console.error("Failed to load store data:", err);
      }
    }
    loadStore();
  }, []);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drag and drop reordering handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b._id.toString() === active.id);
      const newIndex = blocks.findIndex((b) => b._id.toString() === over.id);

      const reordered = arrayMove(blocks, oldIndex, newIndex).map(
        (block, index) => ({
          ...block,
          order: index,
        })
      );

      setBlocks(reordered as ClientBlock[]);

      // Send updated orders to API
      try {
        await fetch("/api/creator/blocks/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orders: reordered.map((b) => ({
              id: b._id.toString(),
              order: b.order,
            })),
          }),
        });
      } catch (err) {
        toast({
          title: "Reorder Failed",
          description: "Could not persist new block order.",
          variant: "error",
        });
      }
    }
  };

  // Block creation & editing
  const handleSaveBlock = async (type: BlockType, data: Record<string, any>) => {
    if (editingBlock) {
      // Update block
      const res = await fetch(`/api/creator/blocks/${editingBlock._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      if (json.success && json.data?.block) {
        setBlocks((prev) =>
          prev.map((b) => (b._id === editingBlock._id ? json.data.block : b))
        );
        toast({
          title: "Block Updated",
          variant: "success",
        });
      }
    } else {
      // Create block
      const res = await fetch("/api/creator/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });
      const json = await res.json();
      if (json.success && json.data?.block) {
        setBlocks((prev) => [...prev, json.data.block]);
        toast({
          title: "Block Added",
          description: "Visible immediately on your storefront.",
          variant: "success",
        });
      }
    }
  };

  // Toggle active state
  const handleToggleActive = async (blockId: string, current: boolean) => {
    const updatedStatus = !current;
    setBlocks((prev) =>
      prev.map((b) =>
        b._id.toString() === blockId ? { ...b, isActive: updatedStatus } : b
      )
    );

    try {
      await fetch(`/api/creator/blocks/${blockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
    } catch {
      // Revert on error
      setBlocks((prev) =>
        prev.map((b) =>
          b._id.toString() === blockId ? { ...b, isActive: current } : b
        )
      );
    }
  };

  // Delete block
  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Are you sure you want to delete this block?")) return;

    setBlocks((prev) => prev.filter((b) => b._id.toString() !== blockId));

    try {
      await fetch(`/api/creator/blocks/${blockId}`, {
        method: "DELETE",
      });
      toast({
        title: "Block Deleted",
        variant: "info",
      });
    } catch {
      toast({
        title: "Delete Failed",
        variant: "error",
      });
    }
  };

  // Save Theme
  const handleSaveTheme = async () => {
    setIsSavingTheme(true);
    try {
      const res = await fetch("/api/creator/store/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "Theme Saved",
          description: "Your storefront styles have been updated live.",
          variant: "success",
        });
      }
    } catch {
      toast({
        title: "Failed to Save Theme",
        variant: "error",
      });
    } finally {
      setIsSavingTheme(false);
    }
  };

  // Save SEO
  const handleSaveSeo = async () => {
    setIsSavingSeo(true);
    try {
      const res = await fetch("/api/creator/store/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });
      const json = await res.json();
      if (json.success) {
        toast({
          title: "SEO Settings Saved",
          description: "Search and Open Graph metadata updated.",
          variant: "success",
        });
      }
    } catch {
      toast({
        title: "Failed to Save SEO",
        variant: "error",
      });
    } finally {
      setIsSavingSeo(false);
    }
  };

  const username = profile.username || "creator";
  const storeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `/${username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    toast({
      title: "Store Link Copied! 📋",
      description: storeUrl,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Storefront Builder
            </h1>
            <Badge variant="accent">Live Editor</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-mono">
            {storeUrl}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Preview Toggle for small screens */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            leftIcon={<Smartphone className="h-4 w-4" />}
          >
            {showMobilePreview ? "Hide Preview" : "Live Preview"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={<Share2 className="h-4 w-4" />}
          >
            Copy Link
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQrModalOpen(true)}
            leftIcon={<QrCode className="h-4 w-4" />}
          >
            QR Code
          </Button>

          <a href={`/${username}`} target="_blank" rel="noreferrer">
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Open Live
            </Button>
          </a>
        </div>
      </div>

      {/* Main 2-Column Grid: Editor Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================================================================= */}
        {/* LEFT COLUMN: BUILDER TABS & EDITOR (lg:col-span-7) */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Editor Tabs Navigation */}
          <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-xs">
            {[
              { id: "blocks", label: "Blocks & Links", icon: Layers },
              { id: "theme", label: "Theme & Aesthetic", icon: Palette },
              { id: "seo", label: "SEO & Social Sharing", icon: Search },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-2 flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-600 text-white shadow-soft"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* --------------------------------------------------------------- */}
          {/* TAB 1: BLOCKS EDITOR */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "blocks" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-base">Storefront Blocks</CardTitle>
                  <CardDescription>
                    Drag to reorder blocks. Changes appear instantly in the live preview.
                  </CardDescription>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingBlock(null);
                    setIsBlockModalOpen(true);
                  }}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Block
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {blocks.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
                    <p className="text-sm font-bold text-slate-800">
                      No blocks on your storefront yet
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Click the &quot;Add Block&quot; button to add custom links, products, or featured highlights.
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={blocks.map((b) => b._id.toString())}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2.5">
                        {blocks.map((block) => (
                          <SortableBlockItem
                            key={block._id.toString()}
                            block={block}
                            onEdit={(b) => {
                              setEditingBlock(b);
                              setIsBlockModalOpen(true);
                            }}
                            onDelete={handleDeleteBlock}
                            onToggleActive={handleToggleActive}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 2: THEME EDITOR */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "theme" && (
            <Card className="space-y-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Theme &amp; Appearance</CardTitle>
                    <CardDescription>
                      Customize colors, fonts, button styling, and backgrounds.
                    </CardDescription>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveTheme}
                    isLoading={isSavingTheme}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save Theme
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          setTheme((prev) => ({
                            ...prev,
                            ...preset,
                          }))
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 text-left text-xs font-semibold hover:border-brand-500 hover:bg-brand-50/30 transition"
                      >
                        <div
                          className="h-4 w-4 rounded-full border shrink-0"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        <span className="truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Color Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Brand Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.primaryColor || "#4f46e5"}
                      onChange={(e) =>
                        setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))
                      }
                      className="h-10 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                    />
                    <Input
                      value={theme.primaryColor || "#4f46e5"}
                      onChange={(e) =>
                        setTheme((prev) => ({ ...prev, primaryColor: e.target.value }))
                      }
                      placeholder="#4f46e5"
                    />
                  </div>
                </div>

                {/* Font Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Typography Font Family
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font}
                        type="button"
                        onClick={() => setTheme((prev) => ({ ...prev, font }))}
                        className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                          theme.font === font
                            ? "border-brand-600 bg-brand-50 text-brand-700 font-bold"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Style Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Button &amp; Card Corner Style
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: "rounded", label: "Rounded" },
                      { id: "pill", label: "Pill" },
                      { id: "sharp", label: "Sharp" },
                      { id: "shadow", label: "Soft Shadow" },
                      { id: "outline", label: "Outline" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() =>
                          setTheme((prev) => ({
                            ...prev,
                            buttonStyle: style.id as ThemeButtonStyle,
                          }))
                        }
                        className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                          theme.buttonStyle === style.id
                            ? "border-brand-600 bg-brand-50 text-brand-700 font-bold"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Type Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Background Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "solid", label: "Solid Color" },
                      { id: "gradient", label: "Gradient" },
                      { id: "image", label: "Custom Image" },
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() =>
                          setTheme((prev) => ({
                            ...prev,
                            backgroundType: bg.id as ThemeBackgroundType,
                          }))
                        }
                        className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                          theme.backgroundType === bg.id
                            ? "border-brand-600 bg-brand-50 text-brand-700 font-bold"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>

                  {theme.backgroundType === "solid" && (
                    <div className="pt-2 flex items-center gap-3">
                      <input
                        type="color"
                        value={theme.backgroundColor || "#f8fafc"}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            backgroundColor: e.target.value,
                          }))
                        }
                        className="h-10 w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                      />
                      <Input
                        value={theme.backgroundColor || "#f8fafc"}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            backgroundColor: e.target.value,
                          }))
                        }
                        placeholder="#f8fafc"
                      />
                    </div>
                  )}

                  {theme.backgroundType === "gradient" && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Input
                        label="From Color"
                        value={theme.backgroundGradient?.from || "#4f46e5"}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            backgroundGradient: {
                              ...prev.backgroundGradient,
                              from: e.target.value,
                            },
                          }))
                        }
                      />
                      <Input
                        label="To Color"
                        value={theme.backgroundGradient?.to || "#f59e0b"}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            backgroundGradient: {
                              ...prev.backgroundGradient,
                              to: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  )}

                  {theme.backgroundType === "image" && (
                    <div className="pt-2">
                      <Input
                        label="Image URL"
                        placeholder="https://images.unsplash.com/..."
                        value={theme.backgroundImageUrl || ""}
                        onChange={(e) =>
                          setTheme((prev) => ({
                            ...prev,
                            backgroundImageUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 3: SEO & SOCIAL SHARING */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "seo" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Search &amp; Social Previews</CardTitle>
                    <CardDescription>
                      Configure how your link in bio looks when shared on WhatsApp, Instagram, and Google.
                    </CardDescription>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveSeo}
                    isLoading={isSavingSeo}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save SEO
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Page Title"
                  placeholder={`${profile.displayName || "Creator"} - Storefront`}
                  value={seo.title || ""}
                  onChange={(e) => setSeo((prev) => ({ ...prev, title: e.target.value }))}
                  helperText="Recommended under 60 characters for Google and WhatsApp links"
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Discover courses, consultations, and digital products by Kabir Singh."
                    value={seo.description || ""}
                    onChange={(e) =>
                      setSeo((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <Input
                  label="Open Graph (OG) Image URL"
                  type="url"
                  placeholder="https://.../og-banner.jpg"
                  value={seo.ogImageUrl || ""}
                  onChange={(e) =>
                    setSeo((prev) => ({ ...prev, ogImageUrl: e.target.value }))
                  }
                  helperText="1200x630px image displayed when your link is shared on WhatsApp, iMessage, and Twitter"
                />

                {/* WhatsApp & Google Search Card Preview */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Social Card Share Preview
                  </span>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1 shadow-xs">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {seo.title || `${profile.displayName || "Creator"} | Creator Revenue OS`}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {seo.description || profile.bio || "Explore digital products, consultation slots, and exclusive resources."}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      creatorrevenueos.com/{username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: LIVE MOBILE PREVIEW (lg:col-span-5) */}
        {/* ================================================================= */}
        <div
          className={`lg:col-span-5 ${
            showMobilePreview ? "block" : "hidden lg:block"
          } lg:sticky lg:top-24`}
        >
          <div className="flex items-center justify-between pb-3 px-2">
            <span className="text-xs font-bold tracking-tight text-slate-700 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-brand-600" />
              Live Storefront Preview
            </span>
            <span className="text-[11px] text-slate-400">
              Interactive View
            </span>
          </div>

          <MobileStorePreview
            profile={profile}
            theme={theme}
            blocks={blocks}
            isInteractive={false}
          />
        </div>
      </div>

      {/* QR Code Modal Dialog */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={storeUrl}
        username={username}
      />

      {/* Block Edit / Add Modal */}
      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveBlock}
        editingBlock={editingBlock}
      />
    </div>
  );
}
