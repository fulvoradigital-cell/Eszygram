"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientBlock, BlockType } from "@/models/Block";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: BlockType, data: Record<string, any>) => Promise<void>;
  editingBlock: ClientBlock | null;
}

export function BlockModal({
  isOpen,
  onClose,
  onSave,
  editingBlock,
}: BlockModalProps) {
  const [selectedType, setSelectedType] = React.useState<BlockType>("link");
  const [data, setData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (editingBlock) {
      setSelectedType(editingBlock.type);
      setData(editingBlock.data || {});
    } else {
      setSelectedType("link");
      setData({});
    }
  }, [editingBlock, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(selectedType, data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBlock ? `Edit ${editingBlock.type} Block` : "Add New Block"}
      description="Choose the block type and configure its content for your storefront."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector (only shown when creating a new block) */}
        {!editingBlock && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Block Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: "link", label: "Custom Link" },
                { type: "product", label: "Product" },
                { type: "featured", label: "Featured" },
                { type: "social-embed", label: "Video/Embed" },
                { type: "lead-capture", label: "Lead Capture" },
                { type: "text", label: "Text / Note" },
                { type: "divider", label: "Divider" },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setSelectedType(item.type as BlockType);
                    setData({});
                  }}
                  className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${
                    selectedType === item.type
                      ? "border-brand-600 bg-brand-50 text-brand-700 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TYPE SPECIFIC FIELDS */}
        {/* ================================================================= */}
        {selectedType === "link" && (
          <>
            <Input
              label="Title"
              placeholder="e.g. Join my Discord Community"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
            <Input
              label="Target URL"
              type="url"
              placeholder="https://..."
              value={data.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
            <Input
              label="Subtitle / Badge (Optional)"
              placeholder="e.g. Free 5,000+ developers"
              value={data.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
            <Input
              label="Thumbnail / Icon URL (Optional)"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={data.imageUrl || ""}
              onChange={(e) => updateField("imageUrl", e.target.value)}
            />
          </>
        )}

        {selectedType === "product" && (
          <>
            <Input
              label="Product Title"
              placeholder="e.g. Next.js 14 Fullstack Course"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
            <Input
              label="Price in INR (₹)"
              type="number"
              placeholder="499"
              value={data.price || ""}
              onChange={(e) => updateField("price", e.target.value)}
              required
            />
            <Input
              label="Product Image URL (Optional)"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={data.imageUrl || ""}
              onChange={(e) => updateField("imageUrl", e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Short Description
              </label>
              <textarea
                rows={2}
                placeholder="What will buyers learn or receive?"
                value={data.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <Input
              label="Button CTA Text"
              placeholder="e.g. Buy with UPI"
              value={data.buttonText || ""}
              onChange={(e) => updateField("buttonText", e.target.value)}
            />
          </>
        )}

        {selectedType === "featured" && (
          <>
            <Input
              label="Headline"
              placeholder="e.g. 1:1 Growth Consultation with Kabir"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
            <Input
              label="Subtitle"
              placeholder="e.g. 45-minute deep dive into scaling your creator revenue"
              value={data.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
            <Input
              label="Badge Tag"
              placeholder="e.g. LIMITED SLOTS"
              value={data.badge || ""}
              onChange={(e) => updateField("badge", e.target.value)}
            />
            <Input
              label="Destination URL"
              type="url"
              placeholder="https://..."
              value={data.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              required
            />
            <Input
              label="Button Text"
              placeholder="e.g. Book Consultation"
              value={data.buttonText || ""}
              onChange={(e) => updateField("buttonText", e.target.value)}
            />
          </>
        )}

        {selectedType === "social-embed" && (
          <>
            <Input
              label="Title / Caption"
              placeholder="e.g. Watch My Latest YouTube Tutorial"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
            <Input
              label="YouTube or Instagram URL"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={data.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              helperText="Paste any standard YouTube video URL for responsive inline playback"
              required
            />
          </>
        )}

        {selectedType === "lead-capture" && (
          <>
            <Input
              label="Card Title"
              placeholder="e.g. Join My Free WhatsApp Mastermind"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
            <Input
              label="Description"
              placeholder="e.g. Receive weekly algorithm growth insights & tips"
              value={data.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Collect Information
              </label>
              <select
                value={data.leadType || "both"}
                onChange={(e) => updateField("leadType", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="both">Both Email &amp; WhatsApp Phone</option>
                <option value="email">Email Only</option>
                <option value="whatsapp">WhatsApp Phone Only</option>
              </select>
            </div>
            <Input
              label="Button Text"
              placeholder="e.g. Get Instant Access"
              value={data.buttonText || ""}
              onChange={(e) => updateField("buttonText", e.target.value)}
            />
            <Input
              label="Thank You Message"
              placeholder="e.g. You're in! Check your WhatsApp."
              value={data.thankYouMessage || ""}
              onChange={(e) => updateField("thankYouMessage", e.target.value)}
            />
          </>
        )}

        {selectedType === "text" && (
          <>
            <Input
              label="Heading (Optional)"
              placeholder="e.g. About Kabir Singh"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Text Content
              </label>
              <textarea
                rows={4}
                placeholder="Write a message, announcement, or bio note for your audience..."
                value={data.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </>
        )}

        {selectedType === "divider" && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Divider Style
            </label>
            <select
              value={data.style || "solid"}
              onChange={(e) => updateField("style", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="solid">Solid Line</option>
              <option value="dashed">Dashed Line</option>
              <option value="dots">Dotted Line</option>
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            {editingBlock ? "Save Changes" : "Add to Storefront"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
