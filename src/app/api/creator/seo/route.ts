import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { updateStoreSeo } from "@/services/store.service";
import { updateSeoSchema } from "@/validators/store.validator";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = updateSeoSchema.parse(body);

    const seo = await updateStoreSeo(session.user.id, validated);
    if (!seo) {
      return apiError("Creator profile not found.", 404, "NOT_FOUND");
    }

    return apiSuccess(seo);
  } catch (error) {
    return handleApiError(error);
  }
}
