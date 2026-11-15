import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import {
  deleteAutomationRule,
  getAutomationRuleById,
  updateAutomationRule,
} from "@/services/automation.service";
import { updateAutomationRuleSchema } from "@/validators/automation.validator";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const rule = await getAutomationRuleById(params.id, session.user.id);

    if (!rule) {
      return apiError("Automation rule not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess(rule);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = updateAutomationRuleSchema.parse(body);

    const updated = await updateAutomationRule(
      session.user.id,
      params.id,
      validated
    );

    if (!updated) {
      return apiError("Automation rule not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const deleted = await deleteAutomationRule(session.user.id, params.id);

    if (!deleted) {
      return apiError("Automation rule not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess({ success: true, message: "Rule deleted successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}
