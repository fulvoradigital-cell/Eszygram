import { z } from "zod";

export const updateProfileSettingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(60, "Display name cannot exceed 60 characters"),
  bio: z.string().trim().max(250, "Bio cannot exceed 250 characters").optional().default(""),
  avatarUrl: z.string().trim().optional().or(z.literal("")),
  niche: z.string().default("other"),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(["instagram", "youtube", "twitter", "linkedin", "website", "threads"]),
        url: z.string().trim().min(1, "URL is required"),
      })
    )
    .default([]),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters").max(100),
});

export type UpdateProfileSettingsInput = z.infer<typeof updateProfileSettingsSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
