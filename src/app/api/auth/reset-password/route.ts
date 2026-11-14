import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { consumePasswordResetToken } from "@/services/password-reset.service";
import { resetPasswordSchema } from "@/validators/auth.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`reset-pw:${ip}`, { limit: 10, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError(
        `Too many attempts. Please try again in ${limit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    const body = await req.json();
    const validated = resetPasswordSchema.parse(body);

    const success = await consumePasswordResetToken(
      validated.token,
      validated.password
    );

    if (!success) {
      return apiError(
        "Invalid, expired, or previously consumed password reset link.",
        400,
        "INVALID_RESET_TOKEN"
      );
    }

    return apiSuccess({
      message:
        "Your password has been successfully updated. You can now log in with your new credentials.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

