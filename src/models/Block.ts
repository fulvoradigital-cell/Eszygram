import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { BlockType } from "@/types";

export interface IBlock extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: BlockType;
  order: number;
  isActive: boolean;
  data: Record<string, unknown>;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: [
        "link",
        "product",
        "featured_product",
        "social_embed",
        "lead_capture",
        "text",
        "divider",
      ],
      required: [true, "Block type is required"],
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
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

// Compound index for efficient user block queries sorted by order
BlockSchema.index({ userId: 1, order: 1 });

export const Block: Model<IBlock> =
  (mongoose.models?.Block as Model<IBlock>) ||
  mongoose.model<IBlock>("Block", BlockSchema);
