"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  Crown,
  FileDown,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/components/providers/ToastProvider";
import type {
  BookingConfig,
  CourseChapter,
  MembershipConfig,
  OrderBumpConfig,
  ProductDTO,
  ProductFile,
  ProductType,
} from "@/types";

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  initialProduct?: ProductDTO | null;
  existingProducts?: ProductDTO[];
}

export function ProductEditorModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  existingProducts = [],
}: ProductEditorModalProps) {
  const { toast } = useToast();
  const isEditing = Boolean(initialProduct);

  const [activeTab, setActiveTab] = useState<"basics" | "pricing" | "content" | "bump">("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Basics
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<ProductType>("download");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Pricing
  const [priceInr, setPriceInr] = useState("499");
  const [compareAtPriceInr, setCompareAtPriceInr] = useState("");
  const [isUnlimitedInventory, setIsUnlimitedInventory] = useState(true);
  const [inventory, setInventory] = useState("100");

  // Content: Downloads
  const [files, setFiles] = useState<ProductFile[]>([]);

  // Content: Course
  const [chapters, setChapters] = useState<CourseChapter[]>([
    {
      id: "ch_1",
      title: "Module 1: Getting Started",
      order: 0,
      lessons: [
        {
          id: "les_1",
          title: "Introduction & Setup",
          order: 0,
          videoUrl: "",
          duration: "10:00",
          notes: "",
        },
      ],
    },
  ]);

  // Content: Booking
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [calendarUrl, setCalendarUrl] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [customQuestionInput, setCustomQuestionInput] = useState("");
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);

  // Content: Membership
  const [membershipInterval, setMembershipInterval] = useState<"monthly" | "yearly">("monthly");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Exclusive community access",
    "Monthly live Q&A calls",
    "Template library updates",
  ]);

  // Order Bump
  const [bumpEnabled, setBumpEnabled] = useState(false);
  const [bumpProductId, setBumpProductId] = useState("");
  const [bumpDiscountPriceInr, setBumpDiscountPriceInr] = useState("199");
  const [bumpHeadline, setBumpHeadline] = useState("Special 1-time offer at checkout!");

  // Populate initial values on edit
  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setSlug(initialProduct.slug);
      setType(initialProduct.type);
      setDescription(initialProduct.description || "");
      setCoverImage(initialProduct.coverImage || "");
      setPriceInr(String(initialProduct.priceInr || 0));
      setCompareAtPriceInr(
        initialProduct.compareAtPriceInr !== null && initialProduct.compareAtPriceInr !== undefined
          ? String(initialProduct.compareAtPriceInr)
          : ""
      );
      setIsUnlimitedInventory(initialProduct.inventory === null || initialProduct.inventory === undefined);
      setInventory(initialProduct.inventory ? String(initialProduct.inventory) : "100");

      setFiles(initialProduct.files || []);
      setChapters(
        initialProduct.courseContent?.length > 0
          ? initialProduct.courseContent
          : [
              {
                id: "ch_1",
                title: "Module 1: Getting Started",
                order: 0,
                lessons: [
                  {
                    id: "les_1",
                    title: "Introduction & Setup",
                    order: 0,
                    videoUrl: "",
                    duration: "10:00",
                    notes: "",
                  },
                ],
              },
            ]
      );

      if (initialProduct.bookingConfig) {
        setDurationMinutes(initialProduct.bookingConfig.durationMinutes || 30);
        setCalendarUrl(initialProduct.bookingConfig.calendarUrl || "");
        setTimezone(initialProduct.bookingConfig.timezone || "Asia/Kolkata");
        setCustomQuestions(initialProduct.bookingConfig.customQuestions || []);
      }

      if (initialProduct.membershipConfig) {
        setMembershipInterval(initialProduct.membershipConfig.interval || "monthly");
        setFeatures(initialProduct.membershipConfig.features || []);
      }

      if (initialProduct.orderBump?.enabled) {
        setBumpEnabled(true);
        setBumpProductId(initialProduct.orderBump.productId || "");
        setBumpDiscountPriceInr(
          initialProduct.orderBump.discountPricePaise
            ? String(Math.round(initialProduct.orderBump.discountPricePaise / 100))
            : "199"
        );
        setBumpHeadline(initialProduct.orderBump.headline || "");
      } else {
        setBumpEnabled(false);
      }
    } else {
      // Reset for new creation
      setTitle("");
      setSlug("");
      setType("download");
      setDescription("");
      setCoverImage("");
      setPriceInr("499");
      setCompareAtPriceInr("");
      setIsUnlimitedInventory(true);
      setFiles([]);
      setBumpEnabled(false);
      setActiveTab("basics");
    }
  }, [initialProduct, isOpen]);

  // Auto-generate clean slug from title if slug not customized
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]/g, "-"))) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60)
      );
    }
  }

  // Handle direct file upload via presigned URL / local fallback
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (!file) continue;

        // 1. Request presigned upload URL
        const presignRes = await fetch("/api/creator/storage/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            category: "file",
          }),
        });

        const presignJson = await presignRes.json();
        if (!presignRes.ok) {
          throw new Error(presignJson.error?.message || "Failed to initiate file upload.");
        }

        const { uploadUrl, s3Key, isLocal, publicUrl } = presignJson.data;

        // 2. Upload file directly
        if (isLocal) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("key", s3Key);

          const localRes = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });
          if (!localRes.ok) throw new Error("Local file upload failed.");
        } else {
          // Direct PUT to S3 / Cloudflare R2
          const s3Res = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type || "application/octet-stream" },
            body: file,
          });
          if (!s3Res.ok) throw new Error("Cloud storage upload failed.");
        }

        // Add to files state
        const newFileItem: ProductFile = {
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          size: file.size,
          s3Key,
          mimeType: file.type || "application/octet-stream",
          url: publicUrl,
        };

        setFiles((prev) => [...prev, newFileItem]);
        toast.success("File Uploaded", `${file.name} ready.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error.";
      toast.error("Upload Error", msg);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  function handleRemoveFile(fileId: string) {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }

  // Course chapter & lesson helpers
  function handleAddChapter() {
    const newOrder = chapters.length;
    setChapters((prev) => [
      ...prev,
      {
        id: `ch_${Date.now()}`,
        title: `Module ${newOrder + 1}: New Chapter`,
        order: newOrder,
        lessons: [],
      },
    ]);
  }

  function handleAddLesson(chapterId: string) {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          const newOrder = ch.lessons.length;
          return {
            ...ch,
            lessons: [
              ...ch.lessons,
              {
                id: `les_${Date.now()}`,
                title: `Lesson ${newOrder + 1}`,
                order: newOrder,
                videoUrl: "",
                duration: "10:00",
                notes: "",
              },
            ],
          };
        }
        return ch;
      })
    );
  }

  function handleUpdateLesson(
    chapterId: string,
    lessonId: string,
    field: string,
    val: string
  ) {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            lessons: ch.lessons.map((les) =>
              les.id === lessonId ? { ...les, [field]: val } : les
            ),
          };
        }
        return ch;
      })
    );
  }

  function handleDeleteLesson(chapterId: string, lessonId: string) {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            lessons: ch.lessons.filter((les) => les.id !== lessonId),
          };
        }
        return ch;
      })
    );
  }

  // Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const priceVal = Number(priceInr);
      if (isNaN(priceVal) || priceVal < 0) {
        throw new Error("Please enter a valid price in INR.");
      }

      const compareVal = compareAtPriceInr ? Number(compareAtPriceInr) : null;

      let bookingConfig: BookingConfig | undefined = undefined;
      if (type === "booking") {
        bookingConfig = {
          durationMinutes: Number(durationMinutes) || 30,
          calendarUrl: calendarUrl.trim(),
          timezone,
          customQuestions,
        };
      }

      let membershipConfig: MembershipConfig | undefined = undefined;
      if (type === "membership") {
        membershipConfig = {
          interval: membershipInterval,
          features,
        };
      }

      let orderBump: OrderBumpConfig | undefined = undefined;
      if (bumpEnabled && bumpProductId) {
        const selectedProd = existingProducts.find((p) => p.id === bumpProductId);
        orderBump = {
          enabled: true,
          productId: bumpProductId,
          productTitle: selectedProd?.title || "Special Add-on",
          discountPricePaise: Math.round((Number(bumpDiscountPriceInr) || 0) * 100),
          headline: bumpHeadline.trim() || "Add this to your order!",
        };
      }

      const payload = {
        title: title.trim(),
        slug: slug.toLowerCase().trim(),
        type,
        description: description.trim(),
        priceInr: priceVal,
        compareAtPriceInr: compareVal,
        coverImage: coverImage.trim(),
        files: type === "download" ? files : [],
        courseContent: type === "course" ? chapters : [],
        bookingConfig,
        membershipConfig,
        inventory: isUnlimitedInventory ? null : Number(inventory) || null,
        orderBump,
      };

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product.";
      toast.error("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Product: ${initialProduct?.title}` : "Create New Product"}
      size="xl"
    >
      <div className="space-y-5">
        {/* Step/Tab Bar */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-card border border-slate-border overflow-x-auto">
          {[
            { id: "basics", label: "1. Basics", icon: Package },
            { id: "pricing", label: "2. Pricing", icon: Sparkles },
            { id: "content", label: "3. Content & Delivery", icon: FileDown },
            { id: "bump", label: "4. Order Bump", icon: Plus },
          ].map((t) => {
            const isActive = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? "bg-brand-violet text-white shadow-xs"
                    : "text-slate-muted hover:text-slate-text"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: BASICS */}
          {activeTab === "basics" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "download", label: "Digital Download", desc: "PDF, ZIP, preset, file", icon: FileDown },
                    { id: "course", label: "Online Course", desc: "Video modules & chapters", icon: GraduationCap },
                    { id: "booking", label: "1:1 Session", desc: "Consultations & audits", icon: Calendar },
                    { id: "membership", label: "Membership", desc: "Recurring subscription", icon: Crown },
                  ].map((item) => {
                    const isSelected = type === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id as ProductType)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-brand-violet bg-brand-violet/10 text-brand-violet ring-2 ring-brand-violet/20"
                            : "border-slate-border bg-card hover:border-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1.5 text-brand-violet" />
                        <div className="text-xs font-bold text-slate-text">{item.label}</div>
                        <div className="text-[10px] text-slate-muted mt-0.5">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="productTitle" className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="productTitle"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 100+ Instagram Reel Hooks & Viral Scripts"
                  required
                />
              </div>

              <div>
                <label htmlFor="productSlug" className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                  Product URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative flex rounded-xl shadow-xs">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-xs font-mono">
                    /p/
                  </span>
                  <input
                    id="productSlug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="reel-hooks-scripts"
                    required
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-xl border border-slate-border bg-card text-xs font-mono text-slate-text outline-none focus:ring-2 focus:ring-brand-violet"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="productDesc" className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                  Description
                </label>
                <Textarea
                  id="productDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will buyers learn or receive? Highlight key benefits, format, and instant delivery details."
                  rows={4}
                />
              </div>

              <div>
                <ImageUpload
                  label="Product Cover Image"
                  description="Upload a high-quality cover image for your product (16:9 banner or square). This is displayed on your storefront and checkout."
                  variant="cover"
                  value={coverImage}
                  onChange={setCoverImage}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("pricing")}
                  className="shadow-brand text-xs font-semibold"
                >
                  Next: Pricing &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & INVENTORY */}
          {activeTab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priceInr" className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                    Selling Price (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex rounded-xl shadow-xs">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-xs font-bold">
                      ₹
                    </span>
                    <input
                      id="priceInr"
                      type="number"
                      value={priceInr}
                      onChange={(e) => setPriceInr(e.target.value)}
                      placeholder="499"
                      required
                      min={0}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-xl border border-slate-border bg-card text-sm font-bold text-slate-text outline-none focus:ring-2 focus:ring-brand-violet"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-muted">
                    Set 0 for free lead magnets.
                  </p>
                </div>

                <div>
                  <label htmlFor="comparePrice" className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                    Compare-At Price (₹ INR, strike-through)
                  </label>
                  <div className="relative flex rounded-xl shadow-xs">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-border bg-slate-50 dark:bg-slate-900 text-slate-muted text-xs font-bold">
                      ₹
                    </span>
                    <input
                      id="comparePrice"
                      type="number"
                      value={compareAtPriceInr}
                      onChange={(e) => setCompareAtPriceInr(e.target.value)}
                      placeholder="999"
                      min={0}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-xl border border-slate-border bg-card text-sm text-slate-text outline-none focus:ring-2 focus:ring-brand-violet"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-muted">
                    Shows buyer how much they save (e.g. ₹999 strikethrough).
                  </p>
                </div>
              </div>

              {/* Inventory Limit */}
              <div className="p-4 rounded-2xl bg-canvas border border-slate-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-text uppercase">
                      Unlimited Quantity
                    </div>
                    <p className="text-[11px] text-slate-muted">
                      Leave on for unlimited digital copies or course access.
                    </p>
                  </div>
                  <Switch
                    checked={isUnlimitedInventory}
                    onCheckedChange={(checked) => setIsUnlimitedInventory(checked)}
                  />
                </div>

                {!isUnlimitedInventory && (
                  <div className="mt-3 pt-3 border-t border-slate-border">
                    <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                      Available Stock / Seats
                    </label>
                    <Input
                      type="number"
                      value={inventory}
                      onChange={(e) => setInventory(e.target.value)}
                      min={1}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("basics")}
                >
                  &larr; Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("content")}
                  className="shadow-brand text-xs font-semibold"
                >
                  Next: Content & Delivery &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT BUILDER */}
          {activeTab === "content" && (
            <div className="space-y-4">
              {/* DOWNLOADS: File Upload */}
              {type === "download" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-text uppercase">
                        Product Files (Direct S3/R2 Upload)
                      </div>
                      <p className="text-[11px] text-slate-muted">
                        Files are stored in private storage and delivered via secure expiring download links.
                      </p>
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-slate-border rounded-2xl p-6 text-center bg-card hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mb-2">
                        {isUploading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-text">
                        {isUploading ? "Uploading file..." : "Click or drag files here"}
                      </div>
                      <p className="text-[10px] text-slate-muted mt-0.5">
                        PDF, ZIP, MP4, MP3, PNG, JPG (up to 500MB per file)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                        Uploaded Files ({files.length})
                      </div>
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-slate-border text-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FileDown className="w-4 h-4 text-brand-violet shrink-0" />
                            <span className="font-semibold text-slate-text truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-muted font-mono shrink-0">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COURSE: Chapter & Lesson Builder */}
              {type === "course" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-text uppercase">
                        Course Curriculum & Modules
                      </div>
                      <p className="text-[11px] text-slate-muted">
                        Organize lessons, video embeds (YouTube / Vimeo / MP4), and study notes.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={handleAddChapter}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Chapter
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {chapters.map((ch, chIdx) => (
                      <div key={ch.id} className="p-4 rounded-2xl bg-canvas border border-slate-border space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            value={ch.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setChapters((prev) =>
                                prev.map((c) => (c.id === ch.id ? { ...c, title: val } : c))
                              );
                            }}
                            className="text-xs font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-violet outline-none py-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => handleAddLesson(ch.id)}
                            className="text-[10px] h-7"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Lesson
                          </Button>
                        </div>

                        {ch.lessons.map((les) => (
                          <div
                            key={les.id}
                            className="p-3 rounded-xl bg-card border border-slate-border space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Input
                                value={les.title}
                                onChange={(e) =>
                                  handleUpdateLesson(ch.id, les.id, "title", e.target.value)
                                }
                                placeholder="Lesson title"
                                className="h-8 text-xs font-semibold"
                              />
                              <Input
                                value={les.duration || ""}
                                onChange={(e) =>
                                  handleUpdateLesson(ch.id, les.id, "duration", e.target.value)
                                }
                                placeholder="10:00"
                                className="w-20 h-8 text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(ch.id, les.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <Input
                              value={les.videoUrl || ""}
                              onChange={(e) =>
                                handleUpdateLesson(ch.id, les.id, "videoUrl", e.target.value)
                              }
                              placeholder="Video URL (YouTube unlisted, Vimeo, or MP4 link)"
                              className="h-8 text-xs font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOOKING: Session details */}
              {type === "booking" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                        Session Duration
                      </label>
                      <Select
                        value={String(durationMinutes)}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        options={[
                          { value: "15", label: "15 Minutes" },
                          { value: "30", label: "30 Minutes" },
                          { value: "45", label: "45 Minutes" },
                          { value: "60", label: "60 Minutes (1 Hour)" },
                          { value: "90", label: "90 Minutes" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                        Timezone
                      </label>
                      <Input
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="Asia/Kolkata"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                      Calendar Integration Link (Calendly, Cal.com, Google Meet)
                    </label>
                    <Input
                      value={calendarUrl}
                      onChange={(e) => setCalendarUrl(e.target.value)}
                      placeholder="https://calendly.com/yourname/30min"
                    />
                    <p className="mt-1 text-[11px] text-slate-muted">
                      Buyers receive this booking link automatically on payment confirmation.
                    </p>
                  </div>
                </div>
              )}

              {/* MEMBERSHIP: Interval & perks */}
              {type === "membership" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                      Billing Interval
                    </label>
                    <Select
                      value={membershipInterval}
                      onChange={(e) => setMembershipInterval(e.target.value as "monthly" | "yearly")}
                      options={[
                        { value: "monthly", label: "Monthly Recurring" },
                        { value: "yearly", label: "Yearly Recurring" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-text uppercase mb-1.5">
                      Included Member Benefits
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Add a perk (e.g. Private Telegram Channel)"
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (featureInput.trim()) {
                            setFeatures((prev) => [...prev, featureInput.trim()]);
                            setFeatureInput("");
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      {features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-canvas border border-slate-border text-xs"
                        >
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-mint" />
                            {feat}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("pricing")}
                >
                  &larr; Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("bump")}
                  className="shadow-brand text-xs font-semibold"
                >
                  Next: Order Bump &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: ORDER BUMP / UPSELL */}
          {activeTab === "bump" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-canvas border border-slate-border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-text uppercase">
                      Offer Order Bump at Checkout
                    </div>
                    <p className="text-[11px] text-slate-muted">
                      Display a high-converting 1-click add-on product on the checkout page.
                    </p>
                  </div>
                  <Switch
                    checked={bumpEnabled}
                    onCheckedChange={(checked) => setBumpEnabled(checked)}
                  />
                </div>

                {bumpEnabled && (
                  <div className="mt-4 pt-4 border-t border-slate-border space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                        Select Add-on Product
                      </label>
                      <Select
                        value={bumpProductId}
                        onChange={(e) => setBumpProductId(e.target.value)}
                        options={[
                          { value: "", label: "-- Choose a product --" },
                          ...existingProducts
                            .filter((p) => p.id !== initialProduct?.id)
                            .map((p) => ({ value: p.id, label: `${p.title} (₹${p.priceInr})` })),
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                          Special Bump Price (₹ INR)
                        </label>
                        <Input
                          type="number"
                          value={bumpDiscountPriceInr}
                          onChange={(e) => setBumpDiscountPriceInr(e.target.value)}
                          placeholder="199"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                          Pitch Headline
                        </label>
                        <Input
                          value={bumpHeadline}
                          onChange={(e) => setBumpHeadline(e.target.value)}
                          placeholder="Yes, add this to my order!"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("content")}
                >
                  &larr; Back
                </Button>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting || isUploading || !title || !slug}
                    className="shadow-brand text-xs font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        Saving...
                      </>
                    ) : isEditing ? (
                      "Update Product"
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
