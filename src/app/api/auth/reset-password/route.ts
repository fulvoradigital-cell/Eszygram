import { NextRequest } from "next/server";
import { resetPasswordSchema } from "@/validators/auth.validator";
import { resetPasswordWithToken } from "@/services/user.service";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (5 reset attempts per 10 minutes per IP)
    const rateLimit = checkRateLimit(req, "auth_reset_password", 5, 600_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const body = await req.json();

    // 2. Strict Zod validation
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const { token, password } = parsed.data;

    // 3. Reset password
    const user = await resetPasswordWithToken(token, password);
    if (!user) {
      return apiError(
        "Invalid or expired password reset link. Please request a new link.",
        400,
        "INVALID_TOKEN"
      );
    }

    return apiSuccess({
      message: "Password has been successfully updated. You can now log in.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
