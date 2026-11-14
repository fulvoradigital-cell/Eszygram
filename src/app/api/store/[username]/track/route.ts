import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { incrementBlockClicks } from "@/services/block.service";
import { getCreatorProfileByUsername } from "@/services/creator.service";
import { recordStoreEvent } from "@/services/store.service";
import { trackEventSchema } from "@/validators/store.validator";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { username: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`track:${ip}`, { limit: 120, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError("Too many tracking requests.", 429, "RATE_LIMITED");
    }

    const body = await req.json();
    const validated = trackEventSchema.parse(body);

    const profile = await getCreatorProfileByUsername(params.username);
    if (!profile) {
      return apiError("Creator storefront not found.", 404, "NOT_FOUND");
    }

    if (validated.type === "click" && validated.blockId) {
      await incrementBlockClicks(validated.blockId);
    }

    await recordStoreEvent({
      creatorId: profile.userId.toString(),
      type: validated.type,
      blockId: validated.blockId,
      ip,
      referrer: validated.referrer || req.headers.get("referer") || undefined,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    return apiSuccess({ recorded: true });
  } catch (error) {
    return handleApiError(error);
  }
}
