import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  createPasswordResetToken,
  sendPasswordResetEmail,
} from "@/services/password-reset.service";
import { forgotPasswordSchema } from "@/validators/auth.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`forgot-pw:${ip}`, { limit: 5, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError(
        `Too many password reset requests. Please try again in ${limit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    const body = await req.json();
    const validated = forgotPasswordSchema.parse(body);

    const token = await createPasswordResetToken(validated.email);
    if (token) {
      await sendPasswordResetEmail(validated.email, token);
    }

    // Always return generic success to prevent email enumeration
    return apiSuccess({
      message:
        "If an account exists with this email address, a password reset link has been dispatched.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

