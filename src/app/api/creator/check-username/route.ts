import { NextRequest } from "next/server";
import { checkUsernameSchema } from "@/validators/auth.validator";
import { checkUsernameAvailability } from "@/services/user.service";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Rate limiting (40 requests per minute)
    const rateLimit = checkRateLimit(req, "check_username", 40, 60_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const { searchParams } = new URL(req.url);
    const rawUsername = searchParams.get("username") || "";

    // 2. Strict Zod validation
    const parsed = checkUsernameSchema.safeParse({ username: rawUsername });
    if (!parsed.success) {
      const errorMsg =
        parsed.error.errors[0]?.message || "Invalid username format";
      return apiSuccess({
        username: rawUsername,
        available: false,
        reason: errorMsg,
      });
    }

    const { username } = parsed.data;

    // 3. Availability check against reserved words & existing database records
    const result = await checkUsernameAvailability(username);

    return apiSuccess({
      username,
      available: result.available,
      reason: result.reason,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
