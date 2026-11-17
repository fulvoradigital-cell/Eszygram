import mongoose from "mongoose";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { AutomationRule, type IAutomationRule } from "@/models/AutomationRule";
import { AutomationLog, type IAutomationLog } from "@/models/AutomationLog";
import { Product } from "@/models/Product";
import type {
  AutomationLogDTO,
  AutomationRuleDTO,
  AutomationSimulationResult,
} from "@/types";
import type {
  CreateAutomationRuleInput,
  UpdateAutomationRuleInput,
} from "@/validators/automation.validator";
import { AppError } from "@/lib/api-response";

export function toAutomationRuleDTO(
  doc: IAutomationRule,
  productTitle?: string
): AutomationRuleDTO {
  const plain =
    typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : (doc as unknown as Record<string, unknown>);

  const keywordsRaw = Array.isArray(plain.keywords) ? plain.keywords : [];
  const commentRepliesRaw = Array.isArray(plain.commentReplies) ? plain.commentReplies : [];

  return {
    id: (plain._id || doc._id).toString(),
    creatorId: (plain.creatorId || doc.creatorId).toString(),
    name: String(plain.name || ""),
    triggerType: plain.triggerType as AutomationRuleDTO["triggerType"],
    keywords: keywordsRaw.map(String),
    matchingType: plain.matchingType as AutomationRuleDTO["matchingType"],
    actionType: plain.actionType as AutomationRuleDTO["actionType"],
    dmMessage: String(plain.dmMessage || ""),
    dmButtonText: plain.dmButtonText ? String(plain.dmButtonText) : undefined,
    dmButtonUrl: plain.dmButtonUrl ? String(plain.dmButtonUrl) : undefined,
    commentReplies: commentRepliesRaw.map(String),
    targetPostId: plain.targetPostId ? String(plain.targetPostId) : undefined,
    linkedProductId: plain.linkedProductId ? String(plain.linkedProductId) : undefined,
    linkedProductTitle: productTitle,
    totalTriggered: Number(plain.totalTriggered || 0),
    totalDmsSent: Number(plain.totalDmsSent || 0),
    isActive: Boolean(plain.isActive),
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
    updatedAt: plain.updatedAt
      ? new Date(plain.updatedAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

export function toAutomationLogDTO(doc: IAutomationLog): AutomationLogDTO {
  const plain =
    typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
      ? (doc as { toObject: () => Record<string, unknown> }).toObject()
      : (doc as unknown as Record<string, unknown>);

  return {
    id: (plain._id || doc._id).toString(),
    creatorId: (plain.creatorId || doc.creatorId).toString(),
    ruleId: (plain.ruleId || doc.ruleId).toString(),
    ruleName: String(plain.ruleName || ""),
    triggerType: plain.triggerType as AutomationLogDTO["triggerType"],
    instagramUserId: plain.instagramUserId ? String(plain.instagramUserId) : undefined,
    instagramUsername: String(plain.instagramUsername || ""),
    commentText: String(plain.commentText || ""),
    dmSentText: String(plain.dmSentText || ""),
    publicReplySent: plain.publicReplySent ? String(plain.publicReplySent) : undefined,
    status: plain.status as AutomationLogDTO["status"],
    error: plain.error ? String(plain.error) : undefined,
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string | number | Date).toISOString()
      : new Date().toISOString(),
  };
}

export function matchesKeyword(
  rule: IAutomationRule,
  commentText: string
): { matches: boolean; matchedKeyword?: string } {
  const cleanComment = commentText.toLowerCase().trim();
  const words = cleanComment.split(/\s+/).map((w) => w.replace(/[^a-z0-9_-]/g, ""));

  for (const rawKw of rule.keywords) {
    const kw = rawKw.toLowerCase().trim();
    if (!kw) continue;

    if (rule.matchingType === "exact") {
      if (cleanComment === kw || words.join(" ") === kw) {
        return { matches: true, matchedKeyword: rawKw };
      }
    } else if (rule.matchingType === "contains" || rule.matchingType === "any") {
      // Check if keyword is found as a whole word or substring
      if (words.includes(kw) || cleanComment.includes(kw)) {
        return { matches: true, matchedKeyword: rawKw };
      }
    }
  }

  return { matches: false };
}

export async function getAutomationRulesByCreatorId(
  creatorId: string
): Promise<AutomationRuleDTO[]> {
  if (!isDatabaseConfigured()) return [];
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(creatorId)) return [];

  const rules = await AutomationRule.find({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  }).sort({ createdAt: -1 });

  // Map linked product titles
  const productIds = rules
    .map((r) => r.linkedProductId)
    .filter((id): id is mongoose.Types.ObjectId => Boolean(id));

  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p.title]));

  return rules.map((r) =>
    toAutomationRuleDTO(
      r,
      r.linkedProductId ? productMap.get(r.linkedProductId.toString()) : undefined
    )
  );
}

export async function getAutomationRuleById(
  ruleId: string,
  creatorId: string
): Promise<AutomationRuleDTO | null> {
  if (!isDatabaseConfigured()) return null;
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(ruleId)) return null;

  const rule = await AutomationRule.findOne({
    _id: new mongoose.Types.ObjectId(ruleId),
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });

  if (!rule) return null;

  let productTitle: string | undefined = undefined;
  if (rule.linkedProductId) {
    const prod = await Product.findById(rule.linkedProductId);
    productTitle = prod?.title;
  }

  return toAutomationRuleDTO(rule, productTitle);
}

export async function createAutomationRule(
  creatorId: string,
  input: CreateAutomationRuleInput
): Promise<AutomationRuleDTO> {
  await dbConnect();

  const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

  const rule = await AutomationRule.create({
    creatorId: creatorObjectId,
    name: input.name.trim(),
    triggerType: input.triggerType,
    keywords: input.keywords.map((k) => k.trim()),
    matchingType: input.matchingType,
    actionType: input.actionType,
    dmMessage: input.dmMessage.trim(),
    dmButtonText: input.dmButtonText?.trim() || undefined,
    dmButtonUrl: input.dmButtonUrl?.trim() || undefined,
    commentReplies: input.commentReplies.map((r) => r.trim()).filter(Boolean),
    targetPostId: input.targetPostId?.trim() || undefined,
    linkedProductId:
      input.linkedProductId && mongoose.Types.ObjectId.isValid(input.linkedProductId)
        ? new mongoose.Types.ObjectId(input.linkedProductId)
        : undefined,
    isActive: input.isActive ?? true,
    totalTriggered: 0,
    totalDmsSent: 0,
  });

  return toAutomationRuleDTO(rule);
}

export async function updateAutomationRule(
  creatorId: string,
  ruleId: string,
  input: UpdateAutomationRuleInput
): Promise<AutomationRuleDTO | null> {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(ruleId) || !mongoose.Types.ObjectId.isValid(creatorId)) {
    return null;
  }

  const updateFields: Record<string, unknown> = {};

  if (input.name !== undefined) updateFields.name = input.name.trim();
  if (input.triggerType !== undefined) updateFields.triggerType = input.triggerType;
  if (input.keywords !== undefined)
    updateFields.keywords = input.keywords.map((k) => k.trim());
  if (input.matchingType !== undefined) updateFields.matchingType = input.matchingType;
  if (input.actionType !== undefined) updateFields.actionType = input.actionType;
  if (input.dmMessage !== undefined) updateFields.dmMessage = input.dmMessage.trim();
  if (input.dmButtonText !== undefined) updateFields.dmButtonText = input.dmButtonText.trim();
  if (input.dmButtonUrl !== undefined) updateFields.dmButtonUrl = input.dmButtonUrl.trim();
  if (input.commentReplies !== undefined)
    updateFields.commentReplies = input.commentReplies.map((r) => r.trim()).filter(Boolean);
  if (input.targetPostId !== undefined) updateFields.targetPostId = input.targetPostId.trim();
  if (input.linkedProductId !== undefined) {
    updateFields.linkedProductId =
      input.linkedProductId && mongoose.Types.ObjectId.isValid(input.linkedProductId)
        ? new mongoose.Types.ObjectId(input.linkedProductId)
        : null;
  }
  if (input.isActive !== undefined) updateFields.isActive = input.isActive;

  const rule = await AutomationRule.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(ruleId),
      creatorId: new mongoose.Types.ObjectId(creatorId),
    },
    { $set: updateFields },
    { new: true }
  );

  return rule ? toAutomationRuleDTO(rule) : null;
}

export async function deleteAutomationRule(
  creatorId: string,
  ruleId: string
): Promise<boolean> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(ruleId)) return false;
  await dbConnect();

  const res = await AutomationRule.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(ruleId),
    creatorId: new mongoose.Types.ObjectId(creatorId),
  });

  return Boolean(res);
}

/**
 * Interactive Instagram Comment Automation Simulator
 */
export async function simulateCommentAutomation({
  creatorId,
  ruleId,
  commentText,
  instagramUsername = "insta_user",
}: {
  creatorId: string;
  ruleId?: string;
  commentText: string;
  instagramUsername?: string;
}): Promise<AutomationSimulationResult> {
  await dbConnect();

  const query: Record<string, unknown> = {
    creatorId: new mongoose.Types.ObjectId(creatorId),
    isActive: true,
  };

  if (ruleId && mongoose.Types.ObjectId.isValid(ruleId)) {
    query._id = new mongoose.Types.ObjectId(ruleId);
  }

  const rules = await AutomationRule.find(query).sort({ createdAt: -1 });

  for (const rule of rules) {
    const matchRes = matchesKeyword(rule, commentText);

    if (matchRes.matches) {
      // Pick random public reply
      const replies = rule.commentReplies || [];
      const publicReply =
        replies.length > 0
          ? replies[Math.floor(Math.random() * replies.length)]
          : "Check your DMs! 🚀";

      // Interpolate username in DM message
      const formattedDm = rule.dmMessage.replace(
        /\{username\}/gi,
        `@${instagramUsername}`
      );

      // Record in logs
      await AutomationLog.create({
        creatorId: rule.creatorId,
        ruleId: rule._id,
        ruleName: rule.name,
        triggerType: rule.triggerType,
        instagramUsername,
        commentText: commentText.trim(),
        dmSentText: formattedDm,
        publicReplySent:
          rule.actionType === "both" || rule.actionType === "reply_comment"
            ? publicReply
            : undefined,
        status: "success",
      });

      // Increment counters
      await AutomationRule.findByIdAndUpdate(rule._id, {
        $inc: { totalTriggered: 1, totalDmsSent: 1 },
      });

      return {
        matched: true,
        ruleId: rule._id.toString(),
        ruleName: rule.name,
        matchedKeyword: matchRes.matchedKeyword,
        dmMessage: formattedDm,
        dmButtonText: rule.dmButtonText || "Get Instant Access",
        dmButtonUrl: rule.dmButtonUrl || "https://ezsygram.com",
        publicCommentReply:
          rule.actionType === "both" || rule.actionType === "reply_comment"
            ? publicReply
            : undefined,
        message: `Successfully matched rule "${rule.name}" via keyword "${matchRes.matchedKeyword}"!`,
      };
    }
  }

  return {
    matched: false,
    message: `No active automation rules matched the comment: "${commentText}".`,
  };
}

export async function getAutomationLogs(
  creatorId: string,
  limit = 30
): Promise<AutomationLogDTO[]> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(creatorId)) return [];
  await dbConnect();

  const logs = await AutomationLog.find({
    creatorId: new mongoose.Types.ObjectId(creatorId),
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return logs.map(toAutomationLogDTO);
}
