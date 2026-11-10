import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateStoreTheme } from "@/services/store.service";
import { updateThemeSchema } from "@/validators/store.validator";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return apiError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const parsed = updateThemeSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const updated = await updateStoreTheme(session.user.id, parsed.data);
    if (!updated) {
      return apiError("Creator profile not found", 404, "NOT_FOUND");
    }

    return apiSuccess({ theme: updated.theme });
  } catch (error) {
    return handleApiError(error);
  }
}

