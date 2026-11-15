import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { checkoutInitiateSchema } from "@/validators/order.validator";
import { initializeCheckout } from "@/services/order.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = checkoutInitiateSchema.parse(body);

    const result = await initializeCheckout(validated);
    return apiSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
