import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPasswordResetToken extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL index automatically deletes document once expiresAt is reached
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PasswordResetToken: Model<IPasswordResetToken> =
  (mongoose.models?.PasswordResetToken as Model<IPasswordResetToken>) ||
  mongoose.model<IPasswordResetToken>(
    "PasswordResetToken",
    PasswordResetTokenSchema
  );

