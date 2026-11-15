import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { deleteCoupon } from "@/services/coupon.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const deleted = await deleteCoupon(session.user.id, params.id);

    if (!deleted) {
      return apiError("Coupon not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess({ success: true, message: "Coupon deleted successfully." });
  } catch (error) {
    return handleApiError(error);
  }
}
