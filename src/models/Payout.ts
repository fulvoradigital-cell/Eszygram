import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { PayoutMethod, PayoutStatus } from "@/types";

export interface IPayout extends Document {
  _id: mongoose.Types.ObjectId;
  payoutNumber: string;
  creatorId: mongoose.Types.ObjectId;
  amountPaise: number;
  destinationType: PayoutMethod;
  destinationSummary: string;
  status: PayoutStatus;
  utr?: string;
  failureReason?: string;
  settledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    payoutNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 100, // At least ₹1
    },
    destinationType: {
      type: String,
      enum: ["bank_account", "upi"],
      required: true,
    },
    destinationSummary: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "settled", "failed"],
      default: "pending",
      index: true,
    },
    utr: {
      type: String,
      trim: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    settledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PayoutSchema.index({ creatorId: 1, createdAt: -1 });

export const Payout: Model<IPayout> =
  (mongoose.models.Payout as Model<IPayout>) ||
  mongoose.model<IPayout>("Payout", PayoutSchema);
