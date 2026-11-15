import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { COOKIE_NAME, verifyBuyerToken } from "@/services/buyer-auth.service";
import { getBuyerPurchases } from "@/services/buyer-purchases.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return apiError("Please log in to view your purchases.", 401, "UNAUTHORIZED");
    }

    const session = verifyBuyerToken(token);
    if (!session) {
      return apiError("Session expired. Please log in again.", 401, "SESSION_EXPIRED");
    }

    const purchases = await getBuyerPurchases(session.email);
    return apiSuccess(purchases);
  } catch (error) {
    return handleApiError(error);
  }
}
