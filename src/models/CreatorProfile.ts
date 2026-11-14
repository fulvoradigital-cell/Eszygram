import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { CreatorNiche, ProfileSeo, ProfileTheme, SocialLink } from "@/types";

export interface ICreatorProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  niche: CreatorNiche;
  socialLinks: SocialLink[];
  theme: ProfileTheme;
  seo: ProfileSeo;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<SocialLink>(
  {
    platform: {
      type: String,
      enum: ["instagram", "youtube", "twitter", "linkedin", "website", "threads"],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const ThemeSchema = new Schema<ProfileTheme>(
  {
    preset: { type: String, default: "modern-violet" },
    primaryColor: { type: String, default: "#6D28D9" },
    backgroundColor: { type: String, default: "#FAFAFB" },
    font: { type: String, default: "Inter" },
    buttonRadius: { type: String, default: "rounded-xl" },
    cardStyle: { type: String, enum: ["glass", "solid", "bordered"], default: "solid" },
  },
  { _id: false }
);

const SeoSchema = new Schema<ProfileSeo>(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
  { _id: false }
);

const CreatorProfileSchema = new Schema<ICreatorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_.-]+$/, "Username can only contain letters, numbers, underscores, dashes, and periods"],
      index: true,
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
    niche: {
      type: String,
      enum: [
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
      ],
      default: "other",
      index: true,
    },
    socialLinks: {
      type: [SocialLinkSchema],
      default: [],
    },
    theme: {
      type: ThemeSchema,
      default: () => ({
        preset: "modern-violet",
        primaryColor: "#6D28D9",
        backgroundColor: "#FAFAFB",
        font: "Inter",
        buttonRadius: "rounded-xl",
        cardStyle: "solid",
      }),
    },
    seo: {
      type: SeoSchema,
      default: () => ({
        metaTitle: "",
        metaDescription: "",
        ogImage: "",
      }),
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const CreatorProfile: Model<ICreatorProfile> =
  (mongoose.models.CreatorProfile as Model<ICreatorProfile>) ||
  mongoose.model<ICreatorProfile>("CreatorProfile", CreatorProfileSchema);

