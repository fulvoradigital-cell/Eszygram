"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableBlockItem } from "./SortableBlockItem";
import type { BlockDTO } from "@/types";

interface SortableBlockListProps {
  blocks: BlockDTO[];
  onReorder: (newBlocks: BlockDTO[]) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onEdit: (block: BlockDTO) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export function SortableBlockList({
  blocks,
  onReorder,
  onToggleActive,
  onEdit,
  onDelete,
  onOpenAddModal,
}: SortableBlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance before drag starts to allow clean clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((item) => item.id === active.id);
      const newIndex = blocks.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(blocks, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }));

      onReorder(reordered);
    }
  }

  if (blocks.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-canvas">
        <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-navy font-display mb-1">
          Your storefront is empty
        </h3>
        <p className="text-xs sm:text-sm text-slate-muted max-w-sm mx-auto mb-5">
          Add links to your products, courses, WhatsApp group, portfolio, or latest YouTube video.
        </p>
        <Button
          onClick={onOpenAddModal}
          variant="primary"
          size="sm"
          className="shadow-brand gap-1.5"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add First Block</span>
        </Button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2.5">
          {blocks.map((block) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
