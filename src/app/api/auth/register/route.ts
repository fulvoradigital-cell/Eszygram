import { NextRequest } from "next/server";
import { registerSchema } from "@/validators/auth.validator";
import { findUserByEmail, createCredentialsUser } from "@/services/user.service";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting on registration (5 attempts per minute per IP)
    const rateLimit = checkRateLimit(req, "auth_register", 5, 60_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const body = await req.json();

    // 2. Strict Zod validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const { email } = parsed.data;

    // 3. Uniqueness check
    const existing = await findUserByEmail(email);
    if (existing) {
      return apiError(
        "An account with this email address already exists. Please log in instead.",
        409,
        "EMAIL_EXISTS"
      );
    }

    // 4. Create user
    const newUser = await createCredentialsUser(parsed.data);

    // 5. Return sanitized user data without exposing passwordHash
    return apiSuccess(
      {
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          plan: newUser.plan,
          onboardingCompleted: newUser.onboardingCompleted,
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
