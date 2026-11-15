import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { getAutomationLogs } from "@/services/automation.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 30;

    const logs = await getAutomationLogs(session.user.id, limit);
    return apiSuccess(logs);
  } catch (error) {
    return handleApiError(error);
  }
}
