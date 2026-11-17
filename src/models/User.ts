import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { UserPlan, UserRole, UserStatus } from "@/types";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  plan: UserPlan;
  planExpiresAt: Date | null;
  status: UserStatus;
  avatarUrl?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["creator", "buyer", "admin"],
      default: "creator",
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },
    planExpiresAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User: Model<IUser> =
  (mongoose.models?.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

