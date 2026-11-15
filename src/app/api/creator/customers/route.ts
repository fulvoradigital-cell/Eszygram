import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { customerQuerySchema } from "@/validators/customer.validator";
import { getCreatorCustomers } from "@/services/customer.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const { searchParams } = new URL(req.url);
    const validated = customerQuerySchema.parse({
      type: searchParams.get("type") || "all",
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || "latest",
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    const result = await getCreatorCustomers(session.user.id, validated);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
