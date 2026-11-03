import { z } from "zod";

/**
 * List of reserved subpaths and system names that cannot be claimed as usernames.
 */
export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "api",
  "app",
  "auth",
  "billing",
  "blog",
  "checkout",
  "creator",
  "creators",
  "dashboard",
  "docs",
  "download",
  "downloads",
  "explore",
  "help",
  "home",
  "legal",
  "login",
  "logout",
  "null",
  "onboarding",
  "order",
  "orders",
  "payout",
  "payouts",
  "pricing",
  "privacy",
  "product",
  "products",
  "profile",
  "register",
  "reset-password",
  "root",
  "settings",
  "signin",
  "signout",
  "signup",
  "static",
  "status",
  "store",
  "support",
  "terms",
  "undefined",
  "user",
  "users",
  "v1",
  "v2",
  "webhook",
  "webhooks",
  "www",
] as const;

/**
 * Validation schema for user registration.
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Validation schema for credentials login.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validation schema for forgot password request.
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Validation schema for resetting password.
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid reset token"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Validation schema for username availability check.
 */
export const checkUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Username can only contain lowercase letters, numbers, hyphens, and underscores"
    )
    .refine(
      (val) => !RESERVED_USERNAMES.includes(val.toLowerCase() as (typeof RESERVED_USERNAMES)[number]),
      "This username is reserved. Please choose another."
    ),
});

export type CheckUsernameInput = z.infer<typeof checkUsernameSchema>;

/**
 * Validation schema for full creator onboarding submission.
 */
export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Username can only contain lowercase letters, numbers, hyphens, and underscores"
    )
    .refine(
      (val) => !RESERVED_USERNAMES.includes(val.toLowerCase() as (typeof RESERVED_USERNAMES)[number]),
      "This username is reserved. Please choose another."
    ),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(60, "Display name cannot exceed 60 characters")
    .trim(),
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .default(""),
  avatarUrl: z
    .string()
    .url("Please provide a valid avatar URL")
    .optional()
    .or(z.literal("")),
  niche: z.string().max(50).default("Other"),
  socialLinks: z
    .object({
      instagram: z.string().optional().default(""),
      youtube: z.string().optional().default(""),
      twitter: z.string().optional().default(""),
      linkedin: z.string().optional().default(""),
      website: z.string().optional().default(""),
    })
    .default({}),
  theme: z
    .object({
      primaryColor: z.string().default("#6366f1"),
      layout: z.enum(["classic", "grid", "cards"]).default("classic"),
      background: z.enum(["default", "gradient", "minimal", "dark"]).default("default"),
    })
    .default({
      primaryColor: "#6366f1",
      layout: "classic",
      background: "default",
    }),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
