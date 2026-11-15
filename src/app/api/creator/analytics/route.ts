import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { analyticsQuerySchema } from "@/validators/analytics.validator";
import { getAnalyticsReport } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(req.url);
    const rangeParam = searchParams.get("range") || "30d";
    const validated = analyticsQuerySchema.parse({ range: rangeParam });

    const report = await getAnalyticsReport(session.user.id, validated.range);
    return apiSuccess(report);
  } catch (error) {
    return handleApiError(error);
  }
}
