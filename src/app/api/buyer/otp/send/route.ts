import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendOtpSchema } from "@/validators/buyer.validator";
import { sendBuyerOtp } from "@/services/buyer-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const ipLimit = checkRateLimit(`otp-send-ip:${ip}`, { limit: 5, windowMs: 60 * 1000 });
    if (!ipLimit.success) {
      return apiError(
        `Too many verification code requests. Please wait ${ipLimit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    const body = await req.json();
    const validated = sendOtpSchema.parse(body);

    const emailLimit = checkRateLimit(`otp-send-email:${validated.email}`, {
      limit: 3,
      windowMs: 5 * 60 * 1000,
    });
    if (!emailLimit.success) {
      return apiError(
        `Too many codes requested for this email. Please check your inbox or wait ${emailLimit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    await sendBuyerOtp(validated.email);

    return apiSuccess({
      success: true,
      message: `A 6-digit verification code was sent to ${validated.email}.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
