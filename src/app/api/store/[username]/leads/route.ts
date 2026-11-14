import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getCreatorProfileByUsername } from "@/services/creator.service";
import { recordLead } from "@/services/store.service";
import { captureLeadSchema } from "@/validators/store.validator";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { username: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const ip = getClientIp(req.headers);
    const limit = checkRateLimit(`lead:${ip}`, { limit: 15, windowMs: 60 * 1000 });
    if (!limit.success) {
      return apiError(
        `Too many attempts. Please try again in ${limit.resetInSeconds} seconds.`,
        429,
        "RATE_LIMITED"
      );
    }

    const body = await req.json();
    const validated = captureLeadSchema.parse(body);

    const profile = await getCreatorProfileByUsername(params.username);
    if (!profile) {
      return apiError("Creator storefront not found.", 404, "NOT_FOUND");
    }

    await recordLead({
      creatorId: profile.userId.toString(),
      blockId: validated.blockId,
      email: validated.email || undefined,
      whatsapp: validated.whatsapp || undefined,
      name: validated.name || undefined,
    });

    return apiSuccess({
      saved: true,
      message: "Thank you! Your information has been submitted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
