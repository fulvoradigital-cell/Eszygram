import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { checkoutVerifySchema } from "@/validators/order.validator";
import { verifyAndFulfillOrder } from "@/services/order.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = checkoutVerifySchema.parse(body);

    const order = await verifyAndFulfillOrder({
      orderId: validated.orderId,
      razorpayOrderId: validated.razorpay_order_id,
      razorpayPaymentId: validated.razorpay_payment_id,
      razorpaySignature: validated.razorpay_signature,
    });

    return apiSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}
