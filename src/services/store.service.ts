import mongoose from "mongoose";
import QRCode from "qrcode";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { CreatorProfile } from "@/models/CreatorProfile";
import { Lead } from "@/models/Lead";
import { StoreEvent } from "@/models/StoreEvent";
import type { ProfileSeo, ProfileTheme, StoreThemePreset } from "@/types";

export const THEME_PRESETS: StoreThemePreset[] = [
  {
    id: "modern-violet",
    name: "Modern Violet",
    description: "Ezsygram signature violet gradient with sleek crisp cards",
    primaryColor: "#6D28D9",
    backgroundColor: "#FAFAFB",
    textColor: "#0F172A",
    cardBackground: "#FFFFFF",
    font: "Inter",
    buttonRadius: "rounded-xl",
    buttonStyle: "gradient",
  },
  {
    id: "sunset-warmth",
    name: "Sunset Warmth",
    description: "Warm coral and golden amber tones with soft rounded edges",
    primaryColor: "#FF7A59",
    backgroundColor: "#FFF8F5",
    textColor: "#1F2937",
    cardBackground: "#FFFFFF",
    font: "Plus Jakarta Sans",
    buttonRadius: "rounded-2xl",
    buttonStyle: "solid",
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    description: "Monochrome elegance with fine borders and high editorial typography",
    primaryColor: "#0F172A",
    backgroundColor: "#FFFFFF",
    textColor: "#0F172A",
    cardBackground: "#F8FAFC",
    font: "Inter",
    buttonRadius: "rounded-md",
    buttonStyle: "outline",
  },
  {
    id: "deep-cyber",
    name: "Deep Cyber",
    description: "Deep midnight canvas (#0B0B1A) with vibrant violet & indigo glow",
    primaryColor: "#8B5CF6",
    backgroundColor: "#0B0B1A",
    textColor: "#F8FAFC",
    cardBackground: "#13132B",
    font: "Plus Jakarta Sans",
    buttonRadius: "rounded-xl",
    buttonStyle: "glass",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    description: "Energetic mint & emerald greens for wellness, health, and fitness creators",
    primaryColor: "#10B981",
    backgroundColor: "#F2FBF7",
    textColor: "#064E3B",
    cardBackground: "#FFFFFF",
    font: "Inter",
    buttonRadius: "rounded-xl",
    buttonStyle: "solid",
  },
  {
    id: "pastel-rose",
    name: "Pastel Rose",
    description: "Soft blush pink and gentle aesthetics for lifestyle, fashion & beauty",
    primaryColor: "#EC4899",
    backgroundColor: "#FDF2F8",
    textColor: "#831843",
    cardBackground: "#FFFFFF",
    font: "Plus Jakarta Sans",
    buttonRadius: "rounded-full",
    buttonStyle: "solid",
  },
];

export async function recordStoreEvent(params: {
  creatorId: string;
  type: "view" | "click";
  blockId?: string;
  ip?: string;
  referrer?: string;
  userAgent?: string;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(params.creatorId)) {
    return;
  }

  await StoreEvent.create({
    creatorId: new mongoose.Types.ObjectId(params.creatorId),
    type: params.type,
    blockId:
      params.blockId && mongoose.Types.ObjectId.isValid(params.blockId)
        ? new mongoose.Types.ObjectId(params.blockId)
        : undefined,
    ip: params.ip,
    referrer: params.referrer,
    userAgent: params.userAgent,
  });
}

export async function recordLead(params: {
  creatorId: string;
  blockId: string;
  email?: string;
  whatsapp?: string;
  name?: string;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await dbConnect();

  await Lead.create({
    creatorId: new mongoose.Types.ObjectId(params.creatorId),
    blockId: new mongoose.Types.ObjectId(params.blockId),
    email: params.email?.toLowerCase().trim() || undefined,
    whatsapp: params.whatsapp?.trim() || undefined,
    name: params.name?.trim() || undefined,
    source: "storefront",
  });
}

export async function updateStoreTheme(
  userId: string,
  theme: Partial<ProfileTheme>
): Promise<ProfileTheme | null> {
  await dbConnect();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) return null;

  profile.theme = {
    ...profile.theme,
    ...theme,
  };

  await profile.save();
  return profile.theme;
}

export async function updateStoreSeo(
  userId: string,
  seo: Partial<ProfileSeo>
): Promise<ProfileSeo | null> {
  await dbConnect();

  const profile = await CreatorProfile.findOne({ userId });
  if (!profile) return null;

  profile.seo = {
    ...profile.seo,
    ...seo,
  };

  await profile.save();
  return profile.seo;
}

export async function generateStoreQrCode(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: "#6D28D9",
      light: "#FFFFFF",
    },
  });
}
