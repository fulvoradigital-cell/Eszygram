import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  blockId: mongoose.Types.ObjectId;
  email?: string;
  phone?: string;
  name?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "CreatorProfile",
      required: true,
      index: true,
    },
    blockId: {
      type: Schema.Types.ObjectId,
      ref: "Block",
      required: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      default: "lead-capture",
    },
  },
  {
    timestamps: true,
  }
);

LeadSchema.index({ profileId: 1, createdAt: -1 });

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;

