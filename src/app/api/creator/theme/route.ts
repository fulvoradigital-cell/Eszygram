import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { updateStoreTheme } from "@/services/store.service";
import { updateThemeSchema } from "@/validators/store.validator";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json();
    const validated = updateThemeSchema.parse(body);

    const theme = await updateStoreTheme(session.user.id, validated);
    if (!theme) {
      return apiError("Creator profile not found.", 404, "NOT_FOUND");
    }

    return apiSuccess(theme);
  } catch (error) {
    return handleApiError(error);
  }
}
