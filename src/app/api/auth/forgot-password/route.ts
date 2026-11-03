import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/validators/auth.validator";
import { createPasswordResetToken } from "@/services/user.service";
import { sendPasswordResetEmail } from "@/lib/email";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (3 forgot password attempts per 5 minutes per IP)
    const rateLimit = checkRateLimit(req, "auth_forgot_password", 3, 300_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const body = await req.json();

    // 2. Strict Zod validation
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const { email } = parsed.data;

    // 3. Generate token (silent response to prevent user enumeration)
    const result = await createPasswordResetToken(email);
    if (result) {
      await sendPasswordResetEmail(result.user.email, result.user.name, result.token);
    }

    // Always return success message for security
    return apiSuccess({
      message:
        "If an account exists with this email address, a password reset link has been dispatched.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
