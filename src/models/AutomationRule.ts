import mongoose, { Schema, Document, Model } from "mongoose";
import type {
  AutomationActionType,
  AutomationTriggerType,
  KeywordMatchingType,
} from "@/types";

export interface IAutomationRule extends Document {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  name: string;
  triggerType: AutomationTriggerType;
  keywords: string[];
  matchingType: KeywordMatchingType;
  actionType: AutomationActionType;
  dmMessage: string;
  dmButtonText?: string;
  dmButtonUrl?: string;
  commentReplies: string[];
  targetPostId?: string; // specific reel/post ID or undefined for all
  linkedProductId?: mongoose.Types.ObjectId;
  totalTriggered: number;
  totalDmsSent: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationRuleSchema = new Schema<IAutomationRule>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    triggerType: {
      type: String,
      enum: ["comment", "dm", "story_mention"],
      default: "comment",
    },
    keywords: {
      type: [String],
      required: true,
      default: [],
    },
    matchingType: {
      type: String,
      enum: ["exact", "contains", "any"],
      default: "contains",
    },
    actionType: {
      type: String,
      enum: ["send_dm", "reply_comment", "both"],
      default: "both",
    },
    dmMessage: {
      type: String,
      required: true,
      trim: true,
    },
    dmButtonText: {
      type: String,
      trim: true,
    },
    dmButtonUrl: {
      type: String,
      trim: true,
    },
    commentReplies: {
      type: [String],
      default: [],
    },
    targetPostId: {
      type: String,
      trim: true,
    },
    linkedProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    totalTriggered: {
      type: Number,
      default: 0,
    },
    totalDmsSent: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

AutomationRuleSchema.index({ creatorId: 1, isActive: 1 });

export const AutomationRule: Model<IAutomationRule> =
  mongoose.models.AutomationRule ||
  mongoose.model<IAutomationRule>("AutomationRule", AutomationRuleSchema);
