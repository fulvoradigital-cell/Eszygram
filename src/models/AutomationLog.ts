import mongoose, { Schema, Document, Model } from "mongoose";
import type { AutomationTriggerType } from "@/types";

export interface IAutomationLog extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  ruleId: mongoose.Types.ObjectId;
  ruleName: string;
  triggerType: AutomationTriggerType;
  instagramUserId?: string;
  instagramUsername: string;
  commentText: string;
  dmSentText: string;
  publicReplySent?: string;
  status: "success" | "failed" | "skipped";
  error?: string;
  createdAt: Date;
}

const AutomationLogSchema = new Schema<IAutomationLog>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ruleId: {
      type: Schema.Types.ObjectId,
      ref: "AutomationRule",
      required: true,
    },
    ruleName: {
      type: String,
      required: true,
    },
    triggerType: {
      type: String,
      enum: ["comment", "dm", "story_mention"],
      default: "comment",
    },
    instagramUserId: {
      type: String,
    },
    instagramUsername: {
      type: String,
      required: true,
      default: "anonymous_user",
    },
    commentText: {
      type: String,
      default: "",
    },
    dmSentText: {
      type: String,
      default: "",
    },
    publicReplySent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failed", "skipped"],
      default: "success",
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AutomationLogSchema.index({ creatorId: 1, createdAt: -1 });

export const AutomationLog: Model<IAutomationLog> =
  mongoose.models.AutomationLog ||
  mongoose.model<IAutomationLog>("AutomationLog", AutomationLogSchema);
