import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { fetchCreatorInstagramMedia } from "@/services/instagram-connection.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAuthSession();
    const data = await fetchCreatorInstagramMedia(session.user.id);
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
