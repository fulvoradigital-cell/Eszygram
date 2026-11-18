import crypto from "crypto";
import { dbConnect, isDatabaseConfigured } from "@/lib/db";
import { decryptSecret } from "@/lib/encryption";
import { AutomationRule } from "@/models/AutomationRule";
import { AutomationLog } from "@/models/AutomationLog";
import { InstagramConnection } from "@/models/InstagramConnection";
import { matchesKeyword } from "./automation.service";

/**
 * Handles Meta Webhook verification handshake for GET /api/webhooks/instagram
 */
export function verifyInstagramWebhook(
  mode: string | null,
  token: string | null,
  challenge: string | null
): string | null {
  const verifyToken = process.env.META_VERIFY_TOKEN || "ezsygram_meta_verify_token";

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return challenge;
  }

  return null;
}

/**
 * Verifies X-Hub-Signature-256 header sent with Meta POST webhooks
 */
export function verifyMetaWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret || appSecret.startsWith("your-") || appSecret.includes("placeholder")) {
    // In dev / test mode without configured Meta App Secret, accept webhook
    return true;
  }

  if (!signatureHeader) return false;

  const [prefix, hash] = signatureHeader.split("=");
  if (prefix !== "sha256" || !hash) return false;

  const expectedHash = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

  const hashBuffer = Buffer.from(hash, "utf-8");
  const expectedBuffer = Buffer.from(expectedHash, "utf-8");

  if (hashBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
}

interface InstagramCommentValue {
  from: {
    id: string;
    username: string;
  };
  media: {
    id: string;
    media_product_type?: string;
  };
  id: string; // comment_id
  text: string;
}

interface InstagramWebhookEntry {
  id: string;
  time: number;
  changes?: Array<{
    field: string;
    value: InstagramCommentValue;
  }>;
}

export interface InstagramWebhookPayload {
  object?: string;
  entry?: InstagramWebhookEntry[];
}

/**
 * Sends a DM via Meta Graph Send API
 */
async function sendMetaDirectMessage({
  recipientId,
  messageText,
  buttonText,
  buttonUrl,
  pageAccessToken,
}: {
  recipientId: string;
  messageText: string;
  buttonText?: string;
  buttonUrl?: string;
  pageAccessToken?: string;
}): Promise<boolean> {
  const token = pageAccessToken || process.env.META_PAGE_ACCESS_TOKEN;
  if (!token || token.includes("placeholder")) {
    console.log(`\n🤖 [DEV META DM SENT] To IG User ${recipientId}: "${messageText}" [Button: ${buttonText} -> ${buttonUrl}]\n`);
    return true;
  }

  try {
    const payload = buttonText && buttonUrl
      ? {
          recipient: { id: recipientId },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [
                  {
                    title: "Ezsygram Product Access",
                    subtitle: messageText,
                    buttons: [
                      {
                        type: "web_url",
                        url: buttonUrl,
                        title: buttonText,
                      },
                    ],
                  },
                ],
              },
            },
          },
        }
      : {
          recipient: { id: recipientId },
          message: { text: messageText },
        };

    const res = await fetch("https://graph.facebook.com/v21.0/me/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to send Meta DM:", err);
    return false;
  }
}

/**
 * Replies publicly to an Instagram comment
 */
async function replyToInstagramComment({
  commentId,
  replyText,
  pageAccessToken,
}: {
  commentId: string;
  replyText: string;
  pageAccessToken?: string;
}): Promise<boolean> {
  const token = pageAccessToken || process.env.META_PAGE_ACCESS_TOKEN;
  if (!token || token.includes("placeholder")) {
    console.log(`\n💬 [DEV META COMMENT REPLY] On comment ${commentId}: "${replyText}"\n`);
    return true;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${commentId}/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyText }),
      }
    );

    return res.ok;
  } catch (err) {
    console.error("Failed to reply to comment:", err);
    return false;
  }
}

/**
 * Ingestion handler for Instagram webhooks
 */
export async function processInstagramWebhookPayload(
  payload: InstagramWebhookPayload
): Promise<{ processed: number }> {
  if (!isDatabaseConfigured()) return { processed: 0 };
  await dbConnect();

  const entries: InstagramWebhookEntry[] = payload.entry || [];
  let processedCount = 0;

  for (const entry of entries) {
    // Scope to the creator who owns this connected Instagram account
    const igConnection = entry.id
      ? await InstagramConnection.findOne({
          instagramAccountId: entry.id,
          status: "connected",
        }).select("+encryptedAccessToken")
      : null;

    let creatorAccessToken: string | undefined;
    if (igConnection?.encryptedAccessToken && !igConnection.isDemoMode) {
      try {
        creatorAccessToken = decryptSecret(igConnection.encryptedAccessToken);
      } catch (err) {
        console.error("Failed to decrypt creator Instagram access token:", err);
      }
    }

    const changes = entry.changes || [];
    for (const change of changes) {
      if (change.field === "comments" && change.value) {
        const comment = change.value;
        const commentText = comment.text || "";
        const mediaId = comment.media?.id || "";
        const fromUser = comment.from || { id: "unknown", username: "user" };

        // Query active rules scoped to the connected creator (or global fallback in dev)
        const ruleQuery: Record<string, unknown> = {
          isActive: true,
          triggerType: "comment",
        };
        if (igConnection) {
          ruleQuery.creatorId = igConnection.creatorId;
        } else if (process.env.NODE_ENV === "production") {
          // In production, ignore webhooks for unconnected Instagram accounts
          continue;
        }

        const activeRules = await AutomationRule.find(ruleQuery);

        for (const rule of activeRules) {
          // If rule targets a specific post/reel, only trigger for that media ID
          if (rule.targetPostId && rule.targetPostId.trim() !== "" && rule.targetPostId !== mediaId) {
            continue;
          }

          const match = matchesKeyword(rule, commentText);
          if (match.matches) {
            processedCount++;

            // Pick randomized comment reply
            const replies = rule.commentReplies || [];
            const randomReply =
              replies.length > 0
                ? replies[Math.floor(Math.random() * replies.length)]
                : undefined;
            const publicReply = randomReply || "Check your DMs! 🚀";

            const formattedDm = rule.dmMessage.replace(
              /\{username\}/gi,
              `@${fromUser.username}`
            );

            // 1. Send DM using the creator's decrypted access token
            if (rule.actionType === "send_dm" || rule.actionType === "both") {
              await sendMetaDirectMessage({
                recipientId: fromUser.id,
                messageText: formattedDm,
                buttonText: rule.dmButtonText,
                buttonUrl: rule.dmButtonUrl,
                pageAccessToken: creatorAccessToken,
              });
            }

            // 2. Reply to comment publicly
            if (rule.actionType === "reply_comment" || rule.actionType === "both") {
              await replyToInstagramComment({
                commentId: comment.id,
                replyText: publicReply,
                pageAccessToken: creatorAccessToken,
              });
            }

            // 3. Log execution
            await AutomationLog.create({
              creatorId: rule.creatorId,
              ruleId: rule._id,
              ruleName: rule.name,
              triggerType: "comment",
              instagramUserId: fromUser.id,
              instagramUsername: fromUser.username,
              commentText,
              dmSentText: formattedDm,
              publicReplySent:
                rule.actionType === "both" || rule.actionType === "reply_comment"
                  ? publicReply
                  : undefined,
              status: "success",
            });

            // 4. Increment counters
            await AutomationRule.findByIdAndUpdate(rule._id, {
              $inc: { totalTriggered: 1, totalDmsSent: 1 },
            });

            break; // Stop after first matched rule for this comment
          }
        }
      }
    }
  }

  return { processed: processedCount };
}
