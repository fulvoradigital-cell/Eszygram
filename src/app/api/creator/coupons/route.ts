import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { createCoupon, getCouponsByCreatorId } from "@/services/coupon.service";
import { createCouponSchema } from "@/validators/order.validator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAuthSession();
    const coupons = await getCouponsByCreatorId(session.user.id);
    return apiSuccess(coupons);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = createCouponSchema.parse(body);

    const coupon = await createCoupon(session.user.id, validated);
    return apiSuccess(coupon, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
