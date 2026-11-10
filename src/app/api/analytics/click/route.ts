import { NextRequest } from "next/server";
import { trackClickSchema } from "@/validators/store.validator";
import { incrementBlockClick } from "@/services/store.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "track_click", 60, 60_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const body = await req.json();
    const parsed = trackClickSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    await incrementBlockClick(parsed.data.blockId);
    return apiSuccess({ tracked: true });
  } catch (error) {
    return handleApiError(error);
  }
}

