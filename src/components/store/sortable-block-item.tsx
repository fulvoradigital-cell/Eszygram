"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Link as LinkIcon,
  ShoppingBag,
  Sparkles,
  Play,
  Mail,
  Type,
  Minus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MousePointerClick,
} from "lucide-react";
import { ClientBlock, BlockType } from "@/models/Block";
import { Badge } from "@/components/ui/badge";

interface SortableBlockItemProps {
  block: ClientBlock;
  onEdit: (block: ClientBlock) => void;
  onDelete: (blockId: string) => void;
  onToggleActive: (blockId: string, current: boolean) => void;
}

export function SortableBlockItem({
  block,
  onEdit,
  onDelete,
  onToggleActive,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block._id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case "link":
        return <LinkIcon className="h-4 w-4 text-brand-600" />;
      case "product":
        return <ShoppingBag className="h-4 w-4 text-emerald-600" />;
      case "featured":
        return <Sparkles className="h-4 w-4 text-accent-600" />;
      case "social-embed":
        return <Play className="h-4 w-4 text-rose-600" />;
      case "lead-capture":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "text":
        return <Type className="h-4 w-4 text-slate-600" />;
      case "divider":
        return <Minus className="h-4 w-4 text-slate-400" />;
      default:
        return <LinkIcon className="h-4 w-4 text-slate-600" />;
    }
  };

  const data = (block.data || {}) as Record<string, any>;
  const displayTitle =
    data.title ||
    (block.type === "divider" ? "Divider Line" : "Untitled Block");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between gap-3 rounded-2xl border bg-white p-3.5 shadow-soft transition-all ${
        block.isActive
          ? "border-slate-200/80 hover:border-brand-300"
          : "border-slate-200/50 bg-slate-50/70 opacity-60"
      }`}
    >
      {/* Drag Grip Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 text-slate-400 hover:text-slate-600 active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Block Type Icon & Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          {getBlockIcon(block.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900 truncate">
              {displayTitle}
            </p>
            <Badge variant="secondary" className="capitalize text-[10px] px-1.5 py-0">
              {block.type}
            </Badge>
          </div>

          {data.url && (
            <p className="text-xs text-slate-400 truncate max-w-xs">{data.url}</p>
          )}
          {data.subtitle && !data.url && (
            <p className="text-xs text-slate-400 truncate max-w-xs">{data.subtitle}</p>
          )}
        </div>
      </div>

      {/* Clicks Badge */}
      {block.clicks > 0 && (
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          <MousePointerClick className="h-3 w-3" />
          <span>{block.clicks}</span>
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onToggleActive(block._id.toString(), block.isActive)}
          className={`rounded-lg p-1.5 transition ${
            block.isActive
              ? "text-emerald-600 hover:bg-emerald-50"
              : "text-slate-400 hover:bg-slate-100"
          }`}
          title={block.isActive ? "Hide block" : "Activate block"}
        >
          {block.isActive ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onEdit(block)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          title="Edit Block"
        >
          <Edit2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(block._id.toString())}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
          title="Delete Block"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
