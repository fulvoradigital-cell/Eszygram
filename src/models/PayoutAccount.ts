import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { PayoutMethod } from "@/types";

export interface IPayoutAccount extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  payoutMethod: PayoutMethod;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  accountType?: "savings" | "current";
  upiVpa?: string;
  panNumber?: string;
  gstin?: string;
  isVerified: boolean;
  autoPayoutEnabled: boolean;
  minimumPayoutPaise: number;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutAccountSchema = new Schema<IPayoutAccount>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    payoutMethod: {
      type: String,
      enum: ["bank_account", "upi"],
      default: "bank_account",
      required: true,
    },
    accountHolderName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    accountNumber: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 11,
    },
    bankName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    accountType: {
      type: String,
      enum: ["savings", "current"],
      default: "savings",
    },
    upiVpa: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 80,
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 10,
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 15,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    autoPayoutEnabled: {
      type: Boolean,
      default: true,
    },
    minimumPayoutPaise: {
      type: Number,
      default: 50000, // ₹500 default minimum
    },
  },
  {
    timestamps: true,
  }
);

export const PayoutAccount: Model<IPayoutAccount> =
  (mongoose.models?.PayoutAccount as Model<IPayoutAccount>) ||
  mongoose.model<IPayoutAccount>("PayoutAccount", PayoutAccountSchema);
