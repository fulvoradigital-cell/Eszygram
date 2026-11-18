import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IInstagramConnection extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  instagramAccountId: string;
  instagramUsername: string;
  instagramName?: string;
  profilePictureUrl?: string;
  pageId?: string;
  encryptedAccessToken?: string;
  tokenExpiresAt?: Date | null;
  isDemoMode: boolean;
  status: "connected" | "disconnected" | "expired";
  connectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InstagramConnectionSchema = new Schema<IInstagramConnection>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    instagramAccountId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    instagramUsername: {
      type: String,
      required: true,
      trim: true,
    },
    instagramName: {
      type: String,
      trim: true,
      default: "",
    },
    profilePictureUrl: {
      type: String,
      trim: true,
      default: "",
    },
    pageId: {
      type: String,
      trim: true,
    },
    encryptedAccessToken: {
      type: String,
      select: false,
    },
    tokenExpiresAt: {
      type: Date,
      default: null,
    },
    isDemoMode: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["connected", "disconnected", "expired"],
      default: "connected",
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.encryptedAccessToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const InstagramConnection: Model<IInstagramConnection> =
  (mongoose.models?.InstagramConnection as Model<IInstagramConnection>) ||
  mongoose.model<IInstagramConnection>("InstagramConnection", InstagramConnectionSchema);
