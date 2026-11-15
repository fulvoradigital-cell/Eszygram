export type AutomationTriggerType = "comment" | "dm" | "story_mention";

export type KeywordMatchingType = "exact" | "contains" | "any";

export type AutomationActionType = "send_dm" | "reply_comment" | "both";

export interface AutomationRuleDTO {
  id: string;
  creatorId: string;
  name: string;
  triggerType: AutomationTriggerType;
  keywords: string[];
  matchingType: KeywordMatchingType;
  actionType: AutomationActionType;
  dmMessage: string;
  dmButtonText?: string;
  dmButtonUrl?: string;
  commentReplies: string[];
  targetPostId?: string;
  linkedProductId?: string;
  linkedProductTitle?: string;
  totalTriggered: number;
  totalDmsSent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationLogDTO {
  id: string;
  creatorId: string;
  ruleId: string;
  ruleName: string;
  triggerType: AutomationTriggerType;
  instagramUserId?: string;
  instagramUsername: string;
  commentText: string;
  dmSentText: string;
  publicReplySent?: string;
  status: "success" | "failed" | "skipped";
  error?: string;
  createdAt: string;
}

export interface AutomationSimulationResult {
  matched: boolean;
  ruleId?: string;
  ruleName?: string;
  matchedKeyword?: string;
  dmMessage?: string;
  dmButtonText?: string;
  dmButtonUrl?: string;
  publicCommentReply?: string;
  message: string;
}
