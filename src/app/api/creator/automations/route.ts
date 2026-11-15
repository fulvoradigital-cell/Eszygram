import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import {
  createAutomationRule,
  getAutomationRulesByCreatorId,
} from "@/services/automation.service";
import { createAutomationRuleSchema } from "@/validators/automation.validator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAuthSession();
    const rules = await getAutomationRulesByCreatorId(session.user.id);
    return apiSuccess(rules);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = createAutomationRuleSchema.parse(body);

    const rule = await createAutomationRule(session.user.id, validated);
    return apiSuccess(rule, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
