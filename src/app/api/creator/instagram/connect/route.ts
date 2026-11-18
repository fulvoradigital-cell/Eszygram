import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAuthSession } from "@/lib/auth";
import { connectInstagramSchema } from "@/validators/automation.validator";
import {
  buildMetaOAuthUrl,
  connectDemoInstagramAccount,
  isMetaOAuthConfigured,
} from "@/services/instagram-connection.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthSession();
    const body = await req.json().catch(() => ({}));
    const validated = connectInstagramSchema.parse(body);

    if (validated.mode === "oauth" && isMetaOAuthConfigured()) {
      const authUrl = buildMetaOAuthUrl(session.user.id);
      return apiSuccess({
        mode: "oauth",
        authUrl,
      });
    }

    // Demo / Sandbox connection mode when Meta OAuth credentials are not configured
    const connection = await connectDemoInstagramAccount(
      session.user.id,
      validated.username || session.user.name || "creator",
      validated.displayName || session.user.name || undefined
    );

    return apiSuccess({
      mode: "demo",
      connection,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
