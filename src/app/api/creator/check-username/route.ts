import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isUsernameAvailable } from "@/services/creator.service";
import { checkUsernameSchema } from "@/validators/creator.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`check-un:${ip}`, { limit: 60, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError("Too many requests. Please slow down.", 429, "RATE_LIMITED");
    }

    const body = await req.json();
    const parsed = checkUsernameSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid username format.";
      return apiSuccess({
        available: false,
        reason: firstIssue,
      });
    }

    const result = await isUsernameAvailable(parsed.data.username);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

