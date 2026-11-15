import { z } from "zod";

export const triggerTypeSchema = z.enum(["comment", "dm", "story_mention"]);
export const matchingTypeSchema = z.enum(["exact", "contains", "any"]);
export const actionTypeSchema = z.enum(["send_dm", "reply_comment", "both"]);

export const createAutomationRuleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Rule name must be at least 2 characters")
    .max(80, "Rule name cannot exceed 80 characters"),
  triggerType: triggerTypeSchema.default("comment"),
  keywords: z
    .array(z.string().trim().min(1))
    .min(1, "At least one trigger keyword is required"),
  matchingType: matchingTypeSchema.default("contains"),
  actionType: actionTypeSchema.default("both"),
  dmMessage: z
    .string()
    .trim()
    .min(2, "DM message must be at least 2 characters")
    .max(1000, "DM message cannot exceed 1000 characters"),
  dmButtonText: z.string().trim().max(40).optional(),
  dmButtonUrl: z
    .string()
    .trim()
    .url("Button URL must be a valid URL (e.g. https://...)")
    .optional()
    .or(z.literal("")),
  commentReplies: z.array(z.string().trim()).default([]),
  targetPostId: z.string().trim().optional(),
  linkedProductId: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});

export const updateAutomationRuleSchema = createAutomationRuleSchema.partial();

export const simulateAutomationSchema = z.object({
  ruleId: z.string().trim().optional(),
  commentText: z.string().trim().min(1, "Comment text is required"),
  instagramUsername: z.string().trim().min(1).default("insta_user"),
});

export type CreateAutomationRuleInput = z.infer<typeof createAutomationRuleSchema>;
export type UpdateAutomationRuleInput = z.infer<typeof updateAutomationRuleSchema>;
export type SimulateAutomationInput = z.infer<typeof simulateAutomationSchema>;
