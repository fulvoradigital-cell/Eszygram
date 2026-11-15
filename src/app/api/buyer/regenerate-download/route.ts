import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { COOKIE_NAME, verifyBuyerToken } from "@/services/buyer-auth.service";
import { regenerateDownloadSchema } from "@/validators/buyer.validator";
import { regenerateDownloadTokensForOrder } from "@/services/buyer-purchases.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return apiError("Please log in to refresh download links.", 401, "UNAUTHORIZED");
    }

    const session = verifyBuyerToken(token);
    if (!session) {
      return apiError("Session expired. Please log in again.", 401, "SESSION_EXPIRED");
    }

    const body = await req.json();
    const validated = regenerateDownloadSchema.parse(body);

    const tokens = await regenerateDownloadTokensForOrder(
      session.email,
      validated.orderId
    );

    return apiSuccess({
      success: true,
      message: "Fresh download link generated (valid for 24 hours).",
      tokens,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
