import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateStoreSeo } from "@/services/store.service";
import { updateSeoSchema } from "@/validators/store.validator";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const parsed = updateSeoSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const updated = await updateStoreSeo(session.user.id, parsed.data);
    if (!updated) {
      return apiError("Creator profile not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ seo: updated.seo });
  } catch (error) {
    return handleApiError(error);
  }
}

