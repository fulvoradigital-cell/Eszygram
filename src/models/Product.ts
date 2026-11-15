import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  BookingConfig,
  CourseChapter,
  MembershipConfig,
  OrderBumpConfig,
  ProductFile,
  ProductType,
} from "@/types";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number; // in integer paise (e.g. 49900 = ₹499)
  compareAtPrice?: number | null; // in integer paise
  type: ProductType;
  coverImage?: string;
  files: ProductFile[];
  courseContent: CourseChapter[];
  bookingConfig?: BookingConfig;
  membershipConfig?: MembershipConfig;
  isActive: boolean;
  inventory?: number | null; // null = unlimited
  salesCount: number;
  orderBump?: OrderBumpConfig;
  createdAt: Date;
  updatedAt: Date;
}

const ProductFileSchema = new Schema<ProductFile>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    size: { type: Number, required: true },
    s3Key: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const CourseLessonSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    videoUrl: { type: String, trim: true },
    notes: { type: String, default: "" },
    duration: { type: String, trim: true },
    attachments: [
      {
        name: { type: String, required: true },
        s3Key: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
  },
  { _id: false }
);

const CourseChapterSchema = new Schema<CourseChapter>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    lessons: { type: [CourseLessonSchema], default: [] },
  },
  { _id: false }
);

const BookingConfigSchema = new Schema<BookingConfig>(
  {
    durationMinutes: { type: Number, default: 30 },
    calendarUrl: { type: String, trim: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    customQuestions: { type: [String], default: [] },
  },
  { _id: false }
);

const MembershipConfigSchema = new Schema<MembershipConfig>(
  {
    interval: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    features: { type: [String], default: [] },
  },
  { _id: false }
);

const OrderBumpConfigSchema = new Schema<OrderBumpConfig>(
  {
    enabled: { type: Boolean, default: false },
    productId: { type: String, trim: true },
    productTitle: { type: String, trim: true },
    discountPricePaise: { type: Number },
    headline: { type: String, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      match: [/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 10000,
    },
    price: {
      type: Number,
      required: [true, "Price in paise is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Price must be an integer amount in paise",
      },
      index: true,
    },
    compareAtPrice: {
      type: Number,
      default: null,
      validate: {
        validator: (v: number | null) => v === null || (Number.isInteger(v) && v >= 0),
        message: "Compare-at price must be an integer in paise",
      },
    },
    type: {
      type: String,
      enum: ["download", "course", "booking", "membership"],
      required: [true, "Product type is required"],
      index: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    files: {
      type: [ProductFileSchema],
      default: [],
    },
    courseContent: {
      type: [CourseChapterSchema],
      default: [],
    },
    bookingConfig: {
      type: BookingConfigSchema,
      default: undefined,
    },
    membershipConfig: {
      type: MembershipConfigSchema,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    inventory: {
      type: Number,
      default: null, // null = unlimited
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderBump: {
      type: OrderBumpConfigSchema,
      default: undefined,
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

// Slugs must be unique per creator
ProductSchema.index({ creatorId: 1, slug: 1 }, { unique: true });
ProductSchema.index({ creatorId: 1, type: 1, isActive: 1 });

export const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
