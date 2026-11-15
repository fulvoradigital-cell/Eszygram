import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { updatePayoutAccountSchema } from "@/validators/payout.validator";
import { upsertPayoutAccount } from "@/services/payout.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized access.", 401, "UNAUTHORIZED");
    }

    const body = await req.json();
    const validated = updatePayoutAccountSchema.parse(body);

    const account = await upsertPayoutAccount(session.user.id, validated);
    return apiSuccess(account);
  } catch (error) {
    return handleApiError(error);
  }
}
