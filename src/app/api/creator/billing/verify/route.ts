import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { upgradePlanVerifySchema } from "@/validators/billing.validator";
import { verifyAndActivatePlanUpgrade } from "@/services/billing.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = upgradePlanVerifySchema.parse(body);

    const result = await verifyAndActivatePlanUpgrade({
      userId: session.user.id,
      plan: validated.plan,
      billingCycle: validated.billingCycle,
      razorpayOrderId: validated.razorpay_order_id,
      razorpayPaymentId: validated.razorpay_payment_id,
      razorpaySignature: validated.razorpay_signature,
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
