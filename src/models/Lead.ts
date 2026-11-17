import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  blockId: mongoose.Types.ObjectId;
  email?: string;
  whatsapp?: string;
  name?: string;
  source: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
      index: true,
    },
    blockId: {
      type: Schema.Types.ObjectId,
      ref: "Block",
      required: [true, "Block ID is required"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      default: "storefront",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

LeadSchema.index({ creatorId: 1, createdAt: -1 });

export const Lead: Model<ILead> =
  (mongoose.models?.Lead as Model<ILead>) ||
  mongoose.model<ILead>("Lead", LeadSchema);
