import { z } from "zod";

export const RESERVED_USERNAMES = new Set([
  "about",
  "admin",
  "administrator",
  "api",
  "app",
  "auth",
  "billing",
  "blog",
  "cancellation-policy",
  "checkout",
  "contact",
  "creator",
  "dashboard",
  "docs",
  "download",
  "downloads",
  "explore",
  "ezsygram",
  "faq",
  "features",
  "forgot-password",
  "graphql",
  "help",
  "home",
  "inbox",
  "login",
  "logout",
  "messages",
  "notifications",
  "onboarding",
  "order",
  "orders",
  "pay",
  "payouts",
  "pricing",
  "privacy",
  "product",
  "products",
  "profile",
  "refund-policy",
  "register",
  "reset-password",
  "robots.txt",
  "settings",
  "signin",
  "signout",
  "signup",
  "sitemap.xml",
  "status",
  "store",
  "support",
  "terms",
  "webhook",
  "webhooks",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase().trim());
}

export const usernameField = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username cannot exceed 30 characters")
  .regex(
    /^[a-z0-9_.-]+$/,
    "Username can only contain lowercase letters, numbers, underscores, dots, or dashes"
  )
  .refine((val) => !isReservedUsername(val), {
    message: "This username is reserved and cannot be claimed",
  });

export const checkUsernameSchema = z.object({
  username: usernameField,
});

export const socialLinkSchema = z.object({
  platform: z.enum([
    "instagram",
    "youtube",
    "twitter",
    "linkedin",
    "website",
    "threads",
  ]),
  url: z.string().trim().url("Please enter a valid URL").or(z.string().trim().min(1)),
});

export const onboardingSchema = z.object({
  username: usernameField,
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(60, "Display name must be under 60 characters"),
  bio: z
    .string()
    .trim()
    .max(250, "Bio cannot exceed 250 characters")
    .default(""),
  avatarUrl: z.string().trim().optional().default(""),
  niche: z.enum([
    "coaching",
    "courses",
    "fitness",
    "design",
    "tech",
    "finance",
    "content",
    "photography",
    "astrology",
    "culinary",
    "other",
  ]),
  socialLinks: z.array(socialLinkSchema).default([]),
});

export const updateProfileSchema = onboardingSchema.partial();

export type CheckUsernameInput = z.infer<typeof checkUsernameSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

