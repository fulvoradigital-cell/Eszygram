import mongoose, { Schema, Document, Model } from "mongoose";
import type { OrderStatus, PaymentMethod, DownloadToken } from "@/types";

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  creatorId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productTitle: string;
  productType: string;
  productCoverImage?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  amountPaise: number; // Final amount in paise
  basePricePaise: number; // Original product price in paise
  discountAmountPaise: number; // Coupon discount in paise
  orderBumpIncluded: boolean;
  orderBumpProductId?: mongoose.Types.ObjectId;
  orderBumpPricePaise: number;
  platformFeePaise: number;
  creatorEarningsPaise: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  downloadTokens: DownloadToken[];
  customAnswers?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const DownloadTokenSchema = new Schema<DownloadToken>(
  {
    token: { type: String, required: true },
    productId: { type: String, required: true },
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
    maxDownloads: { type: Number, default: 5 },
    expiresAt: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["download", "course", "booking", "membership"],
    },
    productCoverImage: {
      type: String,
      default: "",
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    buyerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    buyerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 0,
    },
    basePricePaise: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmountPaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderBumpIncluded: {
      type: Boolean,
      default: false,
    },
    orderBumpProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    orderBumpPricePaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    platformFeePaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    creatorEarningsPaise: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "free"],
      default: "upi",
    },
    razorpayOrderId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    downloadTokens: {
      type: [DownloadTokenSchema],
      default: [],
    },
    customAnswers: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ creatorId: 1, createdAt: -1 });
OrderSchema.index({ creatorId: 1, status: 1 });
OrderSchema.index({ buyerEmail: 1, createdAt: -1 });

export const Order: Model<IOrder> =
  (mongoose.models?.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
