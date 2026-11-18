"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
  Link as LinkIcon,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/ToastProvider";

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  variant?: "avatar" | "cover";
  className?: string;
}

export async function uploadImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (PNG, JPG, WEBP, or GIF).");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be smaller than 10MB.");
  }

  // 1. Request presigned upload URL from creator storage API
  const presignRes = await fetch("/api/creator/storage/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type || "image/jpeg",
      size: file.size,
      category: "image",
    }),
  });

  const presignJson = await presignRes.json();
  if (!presignRes.ok || !presignJson.success) {
    throw new Error(presignJson.error?.message || "Failed to initialize image upload.");
  }

  const { uploadUrl, s3Key, isLocal, publicUrl } = presignJson.data;

  // 2. Perform direct upload
  if (isLocal) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", s3Key);

    const localRes = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });
    const localJson = await localRes.json();
    if (!localRes.ok || !localJson.success) {
      throw new Error(localJson.error?.message || "Local image upload failed.");
    }
    return localJson.data.url;
  } else {
    const s3Res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/jpeg" },
      body: file,
    });
    if (!s3Res.ok) {
      throw new Error("Failed to upload image to cloud storage.");
    }
    return publicUrl || `/api/storage/download/${encodeURIComponent(s3Key)}`;
  }
}

export function ImageUpload({
  value,
  onChange,
  label,
  description,
  variant = "cover",
  className = "",
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value || "");

  async function handleFileSelect(file: File) {
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageFile(file);
      onChange(uploadedUrl);
      setUrlInputValue(uploadedUrl);
      toast.success("Image Uploaded", "Your image has been uploaded successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed.";
      toast.error("Upload Error", msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  function handleApplyManualUrl() {
    onChange(urlInputValue.trim());
    toast.success("URL Applied", "Image link updated.");
    setShowUrlInput(false);
  }

  // ----------------------------------------------------
  // 1. AVATAR VARIANT (Profile Circle)
  // ----------------------------------------------------
  if (variant === "avatar") {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-xs font-bold text-navy dark:text-white">
            {label}
          </label>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar Preview Circle with Click-to-Upload */}
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-border bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 cursor-pointer group shadow-sm hover:ring-4 hover:ring-brand-violet/20 transition-all"
          >
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-brand-violet transition-colors">
                <Camera className="w-7 h-7 mb-0.5" />
                <span className="text-[10px] font-bold">Upload</span>
              </div>
            )}

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Change</span>
            </div>

            {/* Uploading State Spinner */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin mb-1 text-brand-violet" />
                <span className="text-[9px] font-bold">Uploading</span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            {description && (
              <p className="text-xs text-slate-muted leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-semibold gap-1.5 h-8"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5 text-brand-violet" />
                )}
                <span>Upload Avatar</span>
              </Button>

              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("")}
                  disabled={isUploading}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 gap-1 h-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </Button>
              )}

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-brand-violet hover:underline inline-flex items-center gap-1 font-medium ml-1"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showUrlInput ? "Hide Link" : "Paste link instead"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Optional Direct URL Fallback Input */}
        {showUrlInput && (
          <div className="p-3 rounded-xl border border-slate-border bg-slate-subtle/50 space-y-2 animate-in fade-in duration-150">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-border bg-card text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApplyManualUrl}
                className="h-8 text-xs font-semibold px-3"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. COVER IMAGE VARIANT (Wide Banner)
  // ----------------------------------------------------
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-bold text-navy dark:text-white">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-brand-violet hover:underline inline-flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? "Hide URL" : "Paste URL instead"}</span>
        </button>
      </div>

      {description && (
        <p className="text-xs text-slate-muted leading-relaxed">
          {description}
        </p>
      )}

      {/* When Image Exists: Full Cover Preview with Floating Actions */}
      {value ? (
        <div className="relative aspect-video sm:aspect-[2.4/1] rounded-2xl overflow-hidden border border-slate-border bg-slate-subtle group shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />

          {/* Floating Actions on Top Right */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-black/70 hover:bg-black/90 text-white border-white/20 backdrop-blur-md text-xs font-semibold h-8 gap-1.5 shadow-md"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5" />
              )}
              <span>Change Cover</span>
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange("")}
              disabled={isUploading}
              className="bg-rose-600/85 hover:bg-rose-600 text-white backdrop-blur-md text-xs font-semibold h-8 gap-1 shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </Button>
          </div>

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-brand-violet" />
              <span className="text-xs font-bold">Uploading new cover...</span>
            </div>
          )}
        </div>
      ) : (
        /* Empty State: Drag & Drop Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`aspect-video sm:aspect-[2.5/1] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? "border-brand-violet bg-brand-violet/5 ring-4 ring-brand-violet/10"
              : "border-slate-border hover:border-brand-violet/60 hover:bg-slate-50 dark:hover:bg-slate-900/40 bg-card"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-brand-violet" />
              <span className="text-xs font-bold text-navy dark:text-white">
                Uploading cover image...
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-navy dark:text-white">
                  Click to upload cover image{" "}
                  <span className="font-normal text-slate-muted">or drag & drop</span>
                </p>
                <p className="text-[11px] text-slate-muted mt-0.5">
                  PNG, JPG, WEBP, or GIF up to 10MB (Recommended: 1200×630)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Manual URL Input Option */}
      {showUrlInput && (
        <div className="p-3 rounded-xl border border-slate-border bg-slate-subtle/50 space-y-2 animate-in fade-in duration-150">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              placeholder="https://images.unsplash.com/... or cloud asset URL"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-border bg-card text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet"
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApplyManualUrl}
              className="h-8 text-xs font-semibold px-3"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
