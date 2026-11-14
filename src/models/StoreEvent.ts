import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IStoreEvent extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  type: "view" | "click";
  blockId?: mongoose.Types.ObjectId;
  ip?: string;
  referrer?: string;
  userAgent?: string;
  createdAt: Date;
}

const StoreEventSchema = new Schema<IStoreEvent>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["view", "click"],
      required: true,
      index: true,
    },
    blockId: {
      type: Schema.Types.ObjectId,
      ref: "Block",
      sparse: true,
      index: true,
    },
    ip: {
      type: String,
      trim: true,
    },
    referrer: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

StoreEventSchema.index({ creatorId: 1, type: 1, createdAt: -1 });

export const StoreEvent: Model<IStoreEvent> =
  (mongoose.models.StoreEvent as Model<IStoreEvent>) ||
  mongoose.model<IStoreEvent>("StoreEvent", StoreEventSchema);
