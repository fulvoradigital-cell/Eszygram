import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStoreByUserId } from "@/services/store.service";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const store = await getStoreByUserId(session.user.id);
    if (!store) {
      return apiError("Creator profile not found", 404, "NOT_FOUND");
    }

    return apiSuccess({
      profile: store.profile,
      blocks: store.blocks,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

