import { z } from "zod";

export const blockTypeSchema = z.enum([
  "link",
  "product",
  "featured_product",
  "social_embed",
  "lead_capture",
  "text",
  "divider",
]);

export const createBlockSchema = z.object({
  type: blockTypeSchema,
  order: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional().default(true),
  data: z.record(z.unknown()).default({}),
});

export const updateBlockSchema = z.object({
  isActive: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
  data: z.record(z.unknown()).optional(),
});

export const reorderBlocksSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1, "Block ID is required"),
        order: z.number().int().nonnegative("Order must be non-negative"),
      })
    )
    .min(1, "At least one item is required"),
});

export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
export type ReorderBlocksInput = z.infer<typeof reorderBlocksSchema>;
