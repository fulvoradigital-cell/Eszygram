import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { CreatorProfile, type ICreatorProfile } from "@/models/CreatorProfile";
import type { CreatorNiche, CreatorProfileDTO } from "@/types";
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
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    username: profile.username,
    displayName: profile.displayName,
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    niche: profile.niche,
    socialLinks: profile.socialLinks || [],
    theme: profile.theme || {
      preset: "modern-violet",
      primaryColor: "#6D28D9",
      backgroundColor: "#FAFAFB",
      font: "Inter",
    },
    seo: profile.seo || {
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
    },
    onboardingCompleted: profile.onboardingCompleted,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
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

