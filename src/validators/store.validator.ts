import { z } from "zod";

export const blockTypeEnum = z.enum([
  "link",
  "product",
  "featured",
  "social-embed",
  "lead-capture",
  "text",
  "divider",
]);

/**
 * Validation schema for creating a block.
 */
export const createBlockSchema = z.object({
  type: blockTypeEnum,
  isActive: z.boolean().optional().default(true),
  data: z.record(z.any()).default({}),
});

export type CreateBlockInput = z.infer<typeof createBlockSchema>;

/**
 * Validation schema for updating a block.
 */
export const updateBlockSchema = z.object({
  isActive: z.boolean().optional(),
  data: z.record(z.any()).optional(),
});

export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;

/**
 * Validation schema for reordering blocks.
 */
export const reorderBlocksSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string().min(1, "Block ID is required"),
      order: z.number().int().min(0),
    })
  ),
});

export type ReorderBlocksInput = z.infer<typeof reorderBlocksSchema>;

/**
 * Validation schema for updating storefront theme.
 */
export const updateThemeSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color format"),
  font: z.string().min(1, "Font family is required"),
  buttonStyle: z.enum(["rounded", "pill", "sharp", "shadow", "outline"]),
  backgroundType: z.enum(["solid", "gradient", "image"]),
  backgroundColor: z.string(),
  backgroundGradient: z.object({
    from: z.string(),
    to: z.string(),
    direction: z.string().optional(),
  }),
  backgroundImageUrl: z.string().optional().or(z.literal("")),
  textColor: z.string(),
});

export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;

/**
 * Validation schema for updating SEO and Open Graph settings.
 */
export const updateSeoSchema = z.object({
  title: z.string().max(100, "Title cannot exceed 100 characters").optional(),
  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional(),
  ogImageUrl: z
    .string()
    .url("Invalid OG Image URL")
    .optional()
    .or(z.literal("")),
});

export type UpdateSeoInput = z.infer<typeof updateSeoSchema>;

/**
 * Validation schema for lead capture submissions.
 */
export const leadCaptureSchema = z
  .object({
    profileId: z.string().min(1, "Profile ID is required"),
    blockId: z.string().min(1, "Block ID is required"),
    name: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => Boolean((data.email && data.email.trim()) || (data.phone && data.phone.trim())),
    {
      message: "Please provide either an email address or a WhatsApp phone number",
      path: ["email"],
    }
  );

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;

/**
 * Validation schema for tracking clicks.
 */
export const trackClickSchema = z.object({
  blockId: z.string().min(1, "Block ID is required"),
});

export type TrackClickInput = z.infer<typeof trackClickSchema>;

/**
 * Validation schema for tracking page views.
 */
export const trackViewSchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
});

export type TrackViewInput = z.infer<typeof trackViewSchema>;

