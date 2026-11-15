import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { verifyWebhookSignature } from "@/services/razorpay.service";
import { fulfillOrderByRazorpayOrderId } from "@/services/order.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return apiError("Missing Razorpay signature header.", 400, "MISSING_SIGNATURE");
    }

    const rawBody = await req.text();
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return apiError("Invalid Razorpay webhook signature.", 400, "INVALID_SIGNATURE");
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "order.paid" || event === "payment.captured") {
      const entity = payload.payload?.payment?.entity || payload.payload?.order?.entity;
      const razorpayOrderId = entity?.order_id || entity?.id;
      const razorpayPaymentId = entity?.id;

      if (razorpayOrderId) {
        await fulfillOrderByRazorpayOrderId(razorpayOrderId, razorpayPaymentId);
      }
    }

    return apiSuccess({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}
