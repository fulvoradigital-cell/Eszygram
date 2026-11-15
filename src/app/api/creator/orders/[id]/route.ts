import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { getOrderById } from "@/services/order.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuthSession();
    const order = await getOrderById(params.id);

    if (!order || order.creatorId !== session.user.id) {
      return apiError("Order not found or unauthorized.", 404, "NOT_FOUND");
    }

    return apiSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}
