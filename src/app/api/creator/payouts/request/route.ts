import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requestPayoutSchema } from "@/validators/payout.validator";
import { requestManualPayout } from "@/services/payout.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const validated = requestPayoutSchema.parse(body);

    const payout = await requestManualPayout(session.user.id, validated.amountInr);
    return apiSuccess(payout);
  } catch (error) {
    return handleApiError(error);
  }
}
