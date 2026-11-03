import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "creator" | "admin";
export type UserPlan = "free" | "starter" | "pro";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  plan: UserPlan;
  onboardingCompleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
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
      required: false, // Optional for OAuth accounts
      select: false, // Always omit from queries unless explicitly selected
    },
    role: {
      type: String,
      enum: ["creator", "admin"],
      default: "creator",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro"],
      default: "free",
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in Next.js HMR
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
