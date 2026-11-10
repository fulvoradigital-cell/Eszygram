import { NextRequest } from "next/server";
import { leadCaptureSchema } from "@/validators/store.validator";
import { saveLead } from "@/services/store.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "submit_lead", 10, 60_000);
    if (rateLimit.isRateLimited) {
      return rateLimitResponse(rateLimit.resetInSeconds);
    }

    const body = await req.json();
    const parsed = leadCaptureSchema.safeParse(body);
    if (!parsed.success) {
      return handleApiError(parsed.error);
    }

    const lead = await saveLead(parsed.data);

    return apiSuccess(
      {
        message: "Thank you! Your information has been received.",
        leadId: lead._id.toString(),
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

