import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { getOrderMetrics, getOrdersByCreatorId } from "@/services/order.service";
import type { OrderStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const searchParams = req.nextUrl.searchParams;

    const status = (searchParams.get("status") as OrderStatus) || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = Number(searchParams.get("limit")) || 50;
    const skip = Number(searchParams.get("skip")) || 0;

    const [{ orders, total }, metrics] = await Promise.all([
      getOrdersByCreatorId(session.user.id, { status, search, limit, skip }),
      getOrderMetrics(session.user.id),
    ]);

    return apiSuccess({ orders, total, metrics });
  } catch (error) {
    return handleApiError(error);
  }
}
