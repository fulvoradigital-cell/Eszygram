import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { simulateCommentAutomation } from "@/services/automation.service";
import { simulateAutomationSchema } from "@/validators/automation.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = simulateAutomationSchema.parse(body);

    const result = await simulateCommentAutomation({
      creatorId: session.user.id,
      ruleId: validated.ruleId,
      commentText: validated.commentText,
      instagramUsername: validated.instagramUsername,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
