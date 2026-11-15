import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import {
  getPayoutAccountByCreatorId,
  getPayoutSummary,
  getPayoutsByCreatorId,
} from "@/services/payout.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const [account, summary, payouts] = await Promise.all([
      getPayoutAccountByCreatorId(session.user.id),
      getPayoutSummary(session.user.id),
      getPayoutsByCreatorId(session.user.id, 50),
    ]);

    return apiSuccess({
      account,
      summary,
      payouts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
