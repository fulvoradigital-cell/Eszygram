import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBuyerOtp extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  code: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

const BuyerOtpSchema = new Schema<IBuyerOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // MongoDB TTL index deletes expired records automatically
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const BuyerOtp: Model<IBuyerOtp> =
  (mongoose.models?.BuyerOtp as Model<IBuyerOtp>) ||
  mongoose.model<IBuyerOtp>("BuyerOtp", BuyerOtpSchema);
