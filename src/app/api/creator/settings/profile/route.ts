import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { updateProfileSettingsSchema } from "@/validators/settings.validator";
import { updateCreatorProfileSettings } from "@/services/creator.service";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const validated = updateProfileSettingsSchema.parse(body);

    const updated = await updateCreatorProfileSettings(session.user.id, validated);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
