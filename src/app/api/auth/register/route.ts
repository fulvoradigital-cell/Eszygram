import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createUser } from "@/services/user.service";
import { registerSchema } from "@/validators/auth.validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`register:${ip}`, { limit: 10, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError(
        `Too many registration attempts. Please try again in ${limit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    const user = await createUser({
      name: validated.name,
      email: validated.email,
      password: validated.password,
    });

    return apiSuccess(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

