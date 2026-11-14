"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Link as LinkIcon,
  Package,
  Sparkles,
  Video,
  Mail,
  Type,
  Minus,
  Pencil,
  Trash2,
  MousePointerClick,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { BlockDTO, BlockType } from "@/types";

interface SortableBlockItemProps {
  block: BlockDTO;
  onToggleActive: (id: string, active: boolean) => void;
  onEdit: (block: BlockDTO) => void;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG: Record<
  BlockType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  link: { label: "Link", icon: LinkIcon, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40" },
  product: { label: "Product", icon: Package, color: "text-coral bg-coral/10" },
  featured_product: { label: "Featured", icon: Sparkles, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
  social_embed: { label: "Embed", icon: Video, color: "text-red-500 bg-red-50 dark:bg-red-950/40" },
  lead_capture: { label: "Lead Form", icon: Mail, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
  text: { label: "Header & Text", icon: Type, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40" },
  divider: { label: "Divider", icon: Minus, color: "text-slate-500 bg-slate-100 dark:bg-slate-800" },
};

export function SortableBlockItem({
  block,
  onToggleActive,
  onEdit,
  onDelete,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const config = TYPE_CONFIG[block.type] || TYPE_CONFIG.link;
  const Icon = config.icon;

  const data = block.data || {};
  const title =
    (data.title as string) ||
    (data.headline as string) ||
    (data.content as string) ||
    config.label;

  const subtitle =
    (data.url as string) ||
    (data.subheadline as string) ||
    (data.priceInr ? `₹${data.priceInr}` : null);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-card border transition-all ${
        block.isActive
          ? "border-slate-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
          : "border-dashed border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-900/30"
      }`}
    >
      {/* Left: Drag Handle + Icon + Text */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 touch-none"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-text truncate">
              {title}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-muted shrink-0">
              {config.label}
            </span>
          </div>

          {subtitle && (
            <p className="text-xs text-slate-muted truncate font-mono mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Clicks + Active Switch + Edit + Delete */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {block.clicks > 0 && (
          <div
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-muted px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800"
            title={`${block.clicks} clicks recorded`}
          >
            <MousePointerClick className="w-3 h-3 text-brand-violet" />
            <span>{block.clicks}</span>
          </div>
        )}

        <Switch
          checked={block.isActive}
          onCheckedChange={(checked) => onToggleActive(block.id, checked)}
          aria-label={`Toggle active for ${title}`}
        />

        <button
          type="button"
          onClick={() => onEdit(block)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-violet hover:bg-brand-violet/10 transition-colors"
          title="Edit block"
          aria-label={`Edit ${title}`}
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(block.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Delete block"
          aria-label={`Delete ${title}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
