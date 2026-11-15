import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { sendOtpSchema } from "@/validators/buyer.validator";
import { sendBuyerOtp } from "@/services/buyer-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = sendOtpSchema.parse(body);

    await sendBuyerOtp(validated.email);

    return apiSuccess({
      success: true,
      message: `A 6-digit verification code was sent to ${validated.email}.`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
