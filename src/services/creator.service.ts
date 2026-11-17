import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { CreatorProfile, type ICreatorProfile } from "@/models/CreatorProfile";
import type { CreatorNiche, CreatorProfileDTO, SocialLink } from "@/types";
import { isReservedUsername, type OnboardingInput } from "@/validators/creator.validator";
import type { UpdateProfileSettingsInput } from "@/validators/settings.validator";
import { AppError } from "@/lib/api-response";

export async function getCreatorProfileByUserId(
  userId: string
): Promise<ICreatorProfile | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return CreatorProfile.findOne({ userId });
}

export async function getCreatorProfileByUsername(
  username: string
): Promise<ICreatorProfile | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  return CreatorProfile.findOne({
    username: username.toLowerCase().trim(),
  });
}

export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string
): Promise<{ available: boolean; reason?: string }> {
  const clean = username.toLowerCase().trim();

  if (isReservedUsername(clean)) {
    return {
      available: false,
      reason: `"${clean}" is a reserved system keyword and cannot be claimed.`,
    };
  }

  if (!isDatabaseConfigured()) {
    // In disconnected dev/mock state, reserved word check already passed
    return { available: true };
  }

  await dbConnect();

  const query: Record<string, unknown> = { username: clean };
  if (excludeUserId && mongoose.Types.ObjectId.isValid(excludeUserId)) {
    query.userId = { $ne: excludeUserId };
  }

  const existing = await CreatorProfile.findOne(query).select("_id");
  if (existing) {
    return {
      available: false,
      reason: `Username "${clean}" is already claimed by another creator.`,
    };
  }

  return { available: true };
}

export async function upsertCreatorOnboarding(
  userId: string,
  data: OnboardingInput
): Promise<ICreatorProfile> {
  await dbConnect();

  const availability = await isUsernameAvailable(data.username, userId);
  if (!availability.available) {
    throw new Error(availability.reason || "Username is not available.");
  }

  const existing = await CreatorProfile.findOne({ userId });

  if (existing) {
    existing.username = data.username.toLowerCase().trim();
    existing.displayName = data.displayName.trim();
    existing.bio = data.bio?.trim() || "";
    if (data.avatarUrl) existing.avatarUrl = data.avatarUrl.trim();
    existing.niche = data.niche;
    existing.socialLinks = data.socialLinks || [];
    existing.onboardingCompleted = true;
    await existing.save();
    return existing;
  }

  const newProfile = await CreatorProfile.create({
    userId: new mongoose.Types.ObjectId(userId),
    username: data.username.toLowerCase().trim(),
    displayName: data.displayName.trim(),
    bio: data.bio?.trim() || "",
    avatarUrl: data.avatarUrl?.trim() || "",
    niche: data.niche,
    socialLinks: data.socialLinks || [],
    onboardingCompleted: true,
  });

  return newProfile;
}

export function toCreatorProfileDTO(profile: ICreatorProfile): CreatorProfileDTO {
  const plain =
    typeof (profile as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (profile as { toObject: () => Record<string, unknown> }).toObject()
      : (profile as unknown as Record<string, unknown>);

  const socialLinksRaw = Array.isArray(plain.socialLinks) ? plain.socialLinks : [];
  const themeRaw = (plain.theme as Record<string, unknown>) || {};
  const seoRaw = (plain.seo as Record<string, unknown>) || {};

  return {
    id: (plain._id || profile._id).toString(),
    userId: (plain.userId || profile.userId).toString(),
    username: String(plain.username || ""),
    displayName: String(plain.displayName || ""),
    bio: String(plain.bio || ""),
    avatarUrl: String(plain.avatarUrl || ""),
    niche: (plain.niche as CreatorNiche) || "other",
    socialLinks: socialLinksRaw.map((s: unknown) => {
      const item = (s as Record<string, unknown>) || {};
      return {
        platform: item.platform as SocialLink["platform"],
        url: String(item.url || ""),
      };
    }),
    theme: {
      preset: String(themeRaw.preset || "modern-violet"),
      primaryColor: String(themeRaw.primaryColor || "#6D28D9"),
      backgroundColor: String(themeRaw.backgroundColor || "#FAFAFB"),
      font: String(themeRaw.font || "Inter"),
      buttonRadius: String(themeRaw.buttonRadius || "rounded-xl"),
      cardStyle: (themeRaw.cardStyle as "glass" | "solid" | "bordered") || "solid",
    },
    seo: {
      metaTitle: String(seoRaw.metaTitle || ""),
      metaDescription: String(seoRaw.metaDescription || ""),
      ogImage: String(seoRaw.ogImage || ""),
    },
    onboardingCompleted: Boolean(plain.onboardingCompleted),
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
    updatedAt: plain.updatedAt
      ? new Date(plain.updatedAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

export async function updateCreatorProfileSettings(
  userId: string,
  data: UpdateProfileSettingsInput
): Promise<CreatorProfileDTO> {
  if (!isDatabaseConfigured()) {
    throw new AppError("Database not configured", 503, "DB_ERROR");
  }
  await dbConnect();

  const profile = await CreatorProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!profile) {
    throw new AppError("Creator profile not found", 404, "NOT_FOUND");
  }

  profile.displayName = data.displayName.trim();
  profile.bio = data.bio?.trim() || "";
  if (data.avatarUrl !== undefined) {
    profile.avatarUrl = data.avatarUrl.trim();
  }
  if (data.niche) {
    profile.niche = data.niche as CreatorNiche;
  }
  if (data.socialLinks) {
    profile.socialLinks = data.socialLinks;
  }

  await profile.save();
  return toCreatorProfileDTO(profile);
}

