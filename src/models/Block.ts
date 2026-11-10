import mongoose, { Document, Model, Schema } from "mongoose";

export type BlockType =
  | "link"
  | "product"
  | "featured"
  | "social-embed"
  | "lead-capture"
  | "text"
  | "divider";

export interface ClientBlock {
  _id: string;
  profileId?: string;
  type: BlockType;
  order: number;
  isActive: boolean;
  data: Record<string, any>;
  clicks: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IBlock<T = Record<string, unknown>> extends Document {
  _id: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  type: BlockType;
  order: number;
  isActive: boolean;
  data: T;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "CreatorProfile",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "link",
        "product",
        "featured",
        "social-embed",
        "lead-capture",
        "text",
        "divider",
      ],
      required: true,
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
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient sorted retrieval of active blocks
BlockSchema.index({ profileId: 1, order: 1 });

const Block: Model<IBlock> =
  mongoose.models.Block || mongoose.model<IBlock>("Block", BlockSchema);

export default Block;
