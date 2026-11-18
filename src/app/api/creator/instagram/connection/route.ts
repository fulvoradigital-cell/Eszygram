import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import {
  disconnectInstagramAccount,
  getInstagramConnection,
} from "@/services/instagram-connection.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAuthSession();
    const connection = await getInstagramConnection(session.user.id);
    return apiSuccess(connection);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const session = await requireAuthSession();
    await disconnectInstagramAccount(session.user.id);
    const connection = await getInstagramConnection(session.user.id);
    return apiSuccess(connection);
  } catch (error) {
    return handleApiError(error);
  }
}
