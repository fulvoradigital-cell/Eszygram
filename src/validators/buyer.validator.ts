import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export const regenerateDownloadSchema = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),
});

export const courseProgressSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  lessonId: z.string().trim().min(1, "Lesson ID is required"),
  completed: z.boolean().optional().default(true),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type RegenerateDownloadInput = z.infer<typeof regenerateDownloadSchema>;
export type CourseProgressInput = z.infer<typeof courseProgressSchema>;
