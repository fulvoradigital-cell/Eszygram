"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { BlockDTO } from "@/types";

interface EditBlockModalProps {
  block: BlockDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Record<string, unknown>) => Promise<void>;
}

export function EditBlockModal({ block, isOpen, onClose, onSave }: EditBlockModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (block) {
      setFormData(block.data || {});
    }
  }, [block]);

  if (!block) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!block) return;
    setIsSubmitting(true);
    try {
      await onSave(block.id, formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(key: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={`Edit ${block.type.replace("_", " ")} Block`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {block.type === "link" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Title
              </label>
              <Input
                value={(formData.title as string) || ""}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Destination URL
              </label>
              <Input
                value={(formData.url as string) || ""}
                onChange={(e) => updateField("url", e.target.value)}
                required
              />
            </div>
          </>
        )}

        {(block.type === "product" || block.type === "featured_product") && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Product Title
              </label>
              <Input
                value={(formData.title as string) || ""}
                onChange={(e) => updateField("title", e.target.value)}
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
                  value={String(formData.priceInr || "")}
                  onChange={(e) => updateField("priceInr", Number(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  CTA Button Text
                </label>
                <Input
                  value={(formData.ctaText as string) || "Buy Now"}
                  onChange={(e) => updateField("ctaText", e.target.value)}
                />
              </div>
            </div>
            {block.type === "featured_product" && (
              <div>
                <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                  Badge Label
                </label>
                <Input
                  value={(formData.badge as string) || ""}
                  onChange={(e) => updateField("badge", e.target.value)}
                  placeholder="Bestseller"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Short Description
              </label>
              <Textarea
                value={(formData.description as string) || ""}
                onChange={(e) => updateField("description", e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Product / Checkout Link
              </label>
              <Input
                value={(formData.url as string) || ""}
                onChange={(e) => updateField("url", e.target.value)}
              />
            </div>
          </>
        )}

        {block.type === "social_embed" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Video / Reel URL
              </label>
              <Input
                value={(formData.url as string) || ""}
                onChange={(e) => updateField("url", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Title (optional)
              </label>
              <Input
                value={(formData.title as string) || ""}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
          </>
        )}

        {block.type === "lead_capture" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Headline
              </label>
              <Input
                value={(formData.headline as string) || ""}
                onChange={(e) => updateField("headline", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Subheadline
              </label>
              <Input
                value={(formData.subheadline as string) || ""}
                onChange={(e) => updateField("subheadline", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Collect
              </label>
              <Select
                value={(formData.captureType as string) || "email"}
                onChange={(e) => updateField("captureType", e.target.value)}
                options={[
                  { value: "email", label: "Email Address" },
                  { value: "whatsapp", label: "WhatsApp Number" },
                  { value: "both", label: "Email & WhatsApp" },
                ]}
              />
            </div>
          </>
        )}

        {block.type === "text" && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Heading (optional)
              </label>
              <Input
                value={(formData.title as string) || ""}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
                Content / Paragraph
              </label>
              <Textarea
                value={(formData.content as string) || ""}
                onChange={(e) => updateField("content", e.target.value)}
                rows={3}
                required
              />
            </div>
          </>
        )}

        {block.type === "divider" && (
          <div>
            <label className="block text-xs font-semibold text-slate-text uppercase mb-1">
              Divider Style
            </label>
            <Select
              value={(formData.style as string) || "solid"}
              onChange={(e) => updateField("style", e.target.value)}
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
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
