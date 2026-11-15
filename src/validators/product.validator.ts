import { z } from "zod";

export const productTypeSchema = z.enum([
  "download",
  "course",
  "booking",
  "membership",
]);

export const productFileSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "File name is required"),
  size: z.number().int().nonnegative(),
  s3Key: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  url: z.string().optional(),
});

export const courseLessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Lesson title is required"),
  order: z.number().int().nonnegative().default(0),
  videoUrl: z.string().trim().optional(),
  notes: z.string().optional(),
  duration: z.string().trim().optional(),
});

export const courseChapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Chapter title is required"),
  order: z.number().int().nonnegative().default(0),
  lessons: z.array(courseLessonSchema).default([]),
});

export const bookingConfigSchema = z.object({
  durationMinutes: z.number().int().min(5).max(360).default(30),
  calendarUrl: z.string().trim().optional(),
  timezone: z.string().trim().default("Asia/Kolkata"),
  customQuestions: z.array(z.string().trim()).default([]),
});

export const membershipConfigSchema = z.object({
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  features: z.array(z.string().trim()).default([]),
});

export const orderBumpConfigSchema = z.object({
  enabled: z.boolean().default(false),
  productId: z.string().trim().optional(),
  productTitle: z.string().trim().optional(),
  discountPriceInr: z.number().nonnegative().optional(),
  discountPricePaise: z.number().int().nonnegative().optional(),
  headline: z.string().trim().optional(),
});

export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Product title must be at least 2 characters")
    .max(120, "Product title cannot exceed 120 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  type: productTypeSchema,
  description: z.string().trim().max(10000).optional().default(""),
  // Accept price in INR (e.g. 499) from UI and convert to paise, or directly as paise
  priceInr: z.number().nonnegative("Price cannot be negative").optional(),
  pricePaise: z.number().int().nonnegative().optional(),
  compareAtPriceInr: z.number().nonnegative().optional().nullable(),
  compareAtPricePaise: z.number().int().nonnegative().optional().nullable(),
  coverImage: z.string().trim().optional().default(""),
  files: z.array(productFileSchema).default([]),
  courseContent: z.array(courseChapterSchema).default([]),
  bookingConfig: bookingConfigSchema.optional(),
  membershipConfig: membershipConfigSchema.optional(),
  isActive: z.boolean().default(true),
  inventory: z.number().int().nonnegative().optional().nullable(),
  orderBump: orderBumpConfigSchema.optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const uploadPresignSchema = z.object({
  filename: z.string().trim().min(1, "Filename is required"),
  mimeType: z.string().trim().min(1, "Mime type is required"),
  size: z.number().int().positive("Size must be greater than 0"),
  category: z.enum(["file", "image", "course"]).default("file"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UploadPresignInput = z.infer<typeof uploadPresignSchema>;
