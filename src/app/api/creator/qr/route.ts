import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { getCreatorProfileByUserId } from "@/services/creator.service";
import { generateStoreQrCode } from "@/services/store.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const profile = await getCreatorProfileByUserId(session.user.id);
    if (!profile) {
      return apiError("Profile not found.", 404, "NOT_FOUND");
    }

    const host = req.headers.get("host") || "ezsygram.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const storeUrl = `${protocol}://${host}/${profile.username}`;

    const qrDataUrl = await generateStoreQrCode(storeUrl);

    return apiSuccess({
      storeUrl,
      qrDataUrl,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
