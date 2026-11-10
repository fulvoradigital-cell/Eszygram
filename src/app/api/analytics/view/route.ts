import { NextRequest } from "next/server";
import { trackViewSchema } from "@/validators/store.validator";
import { recordDailyPageView } from "@/services/store.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "track_view", 60, 60_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const body = await req.json();
    const parsed = trackViewSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    await recordDailyPageView(parsed.data.profileId);
    return apiSuccess({ tracked: true });
  } catch (error) {
    return handleApiError(error);
  }
}

