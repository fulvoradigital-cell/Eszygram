import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISocialLinks {
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export type ThemeButtonStyle =
  | "rounded"
  | "pill"
  | "sharp"
  | "shadow"
  | "outline";

export type ThemeBackgroundType = "solid" | "gradient" | "image";

export interface IThemeConfig {
  primaryColor: string;
  font: string;
  buttonStyle: ThemeButtonStyle;
  backgroundType: ThemeBackgroundType;
  backgroundColor: string;
  backgroundGradient: {
    from: string;
    to: string;
    direction?: string;
  };
  backgroundImageUrl?: string;
  textColor: string;
}

export interface ISeoConfig {
  title?: string;
  description?: string;
  ogImageUrl?: string;
}

export interface ICreatorProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  niche: string;
  socialLinks: ISocialLinks;
  theme: IThemeConfig;
  seo: ISeoConfig;
  createdAt: Date;
  updatedAt: Date;
}

const CreatorProfileSchema = new Schema<ICreatorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_-]+$/,
        "Username can only contain lowercase alphanumeric characters, dashes, and underscores",
      ],
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
      maxlength: [60, "Display name cannot exceed 60 characters"],
    },
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    niche: {
      type: String,
      default: "",
      trim: true,
    },
    socialLinks: {
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    theme: {
      primaryColor: { type: String, default: "#6366f1" },
      font: { type: String, default: "Inter" },
      buttonStyle: {
        type: String,
        enum: ["rounded", "pill", "sharp", "shadow", "outline"],
        default: "rounded",
      },
      backgroundType: {
        type: String,
        enum: ["solid", "gradient", "image"],
        default: "solid",
      },
      backgroundColor: { type: String, default: "#f8fafc" },
      backgroundGradient: {
        from: { type: String, default: "#6366f1" },
        to: { type: String, default: "#f59e0b" },
        direction: { type: String, default: "to bottom right" },
      },
      backgroundImageUrl: { type: String, default: "" },
      textColor: { type: String, default: "#0f172a" },
    },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      ogImageUrl: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const CreatorProfile: Model<ICreatorProfile> =
  mongoose.models.CreatorProfile ||
  mongoose.model<ICreatorProfile>("CreatorProfile", CreatorProfileSchema);

export default CreatorProfile;
