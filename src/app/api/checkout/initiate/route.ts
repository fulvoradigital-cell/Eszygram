import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { checkoutInitiateSchema } from "@/validators/order.validator";
import { initializeCheckout } from "@/services/order.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`checkout-init:${ip}`, { limit: 25, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError(
        `Too many checkout initiation requests. Please wait ${limit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    const body = await req.json();
    const validated = checkoutInitiateSchema.parse(body);

    const result = await initializeCheckout(validated);
    return apiSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
